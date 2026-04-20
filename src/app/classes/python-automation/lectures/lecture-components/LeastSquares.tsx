'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Point { x: number; y: number; }

interface FeatureDef {
  id: string;
  label: string;      // toggle pill label
  eqLabel: string;    // label in the equation string
  fn: (x: number) => number;
  color: string;
}

/* ─────────────────────────────────────────────
   Feature registry
   (intercept β₀ is always included, not a toggle)
───────────────────────────────────────────── */
const ALL_FEATURES: FeatureDef[] = [
  { id: 'x',     label: 'x',       eqLabel: 'x',        fn: x => x,                          color: '#6366f1' },
  { id: 'x2',    label: 'x²',      eqLabel: 'x²',       fn: x => x * x,                      color: '#f59e0b' },
  { id: 'x3',    label: 'x³',      eqLabel: 'x³',       fn: x => x ** 3,                     color: '#10b981' },
  { id: 'sinx',  label: 'sin x',   eqLabel: 'sin x',    fn: x => Math.sin(x),                color: '#ef4444' },
  { id: 'cosx',  label: 'cos x',   eqLabel: 'cos x',    fn: x => Math.cos(x),                color: '#3b82f6' },
  { id: 'sqrtx', label: '√|x|',    eqLabel: '√|x|',     fn: x => Math.sqrt(Math.abs(x)),     color: '#ec4899' },
  { id: 'lnx',   label: 'ln(x+3)', eqLabel: 'ln(x+3)',  fn: x => Math.log(Math.max(x + 3, 1e-9)), color: '#14b8a6' },
];

/* ─────────────────────────────────────────────
   SVG layout constants
───────────────────────────────────────────── */
const SVG_W   = 560;
const SVG_H   = 380;
const PAD     = { top: 18, right: 18, bottom: 38, left: 44 } as const;
const CW      = SVG_W - PAD.left - PAD.right;
const CH      = SVG_H - PAD.top  - PAD.bottom;
const X_MIN   = -5;
const X_MAX   =  5;
const Y_MIN   = -6;
const Y_MAX   =  6;
const SAMPLES = 320; // regression curve resolution

/* ─────────────────────────────────────────────
   Coordinate transforms
───────────────────────────────────────────── */
const toPixX  = (x: number) => PAD.left + (x - X_MIN) / (X_MAX - X_MIN) * CW;
const toPixY  = (y: number) => PAD.top  + (Y_MAX - y) / (Y_MAX - Y_MIN) * CH;
const toDataX = (px: number) => X_MIN + (px - PAD.left) / CW * (X_MAX - X_MIN);
const toDataY = (py: number) => Y_MAX - (py - PAD.top)  / CH * (Y_MAX - Y_MIN);
const clamp   = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ─────────────────────────────────────────────
   Matrix math (pure JS — no deps)
───────────────────────────────────────────── */
function transpose(A: number[][]): number[][] {
  const rows = A.length, cols = A[0].length;
  return Array.from({ length: cols }, (_, j) =>
    Array.from({ length: rows }, (_, i) => A[i][j])
  );
}

/**
 * Gauss-Jordan elimination with partial pivoting.
 * Solves A·x = b in-place. Returns x or null if singular.
 */
function solve(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivot
    let maxRow = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) maxRow = r;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-10) return null; // singular / underdetermined

    // Scale pivot row to 1
    for (let j = col; j <= n; j++) aug[col][j] /= pivot;

    // Eliminate column in every other row
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const fac = aug[r][col];
      for (let j = col; j <= n; j++) aug[r][j] -= fac * aug[col][j];
    }
  }

  return aug.map(row => row[n]);
}

/**
 * Ordinary Least Squares: β̂ = (XᵀX)⁻¹ Xᵀy
 * Returns null when the system is underdetermined.
 */
function ols(points: Point[], featureIds: string[]): number[] | null {
  const k = 1 + featureIds.length; // intercept + active features
  if (points.length < k) return null;

  // Design matrix X (n × k): first column is all 1s (intercept)
  const X = points.map(pt => [
    1,
    ...featureIds.map(id => ALL_FEATURES.find(f => f.id === id)!.fn(pt.x)),
  ]);

  // XᵀX (k × k)
  const XtX: number[][] = Array.from({ length: k }, (_, i) =>
    Array.from({ length: k }, (_, j) =>
      points.reduce((s, _pt, r) => s + X[r][i] * X[r][j], 0)
    )
  );

  // Xᵀy (k-vector)
  const Xty: number[] = Array.from({ length: k }, (_, i) =>
    points.reduce((s, pt, r) => s + X[r][i] * pt.y, 0)
  );

  return solve(XtX, Xty);
}

function computeR2(y: number[], yHat: number[]): number {
  const n = y.length;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  const ssTot = y.reduce((s, yi) => s + (yi - yMean) ** 2, 0);
  const ssRes = y.reduce((s, yi, i) => s + (yi - yHat[i]) ** 2, 0);
  return ssTot < 1e-10 ? 1 : Math.max(0, 1 - ssRes / ssTot);
}

/* ─────────────────────────────────────────────
   Default points
───────────────────────────────────────────── */
const DEFAULT_POINTS: Point[] = [
  { x: -4.0, y: -3.2 },
  { x: -2.8, y: -1.5 },
  { x: -1.5, y: -0.4 },
  { x: -0.5, y:  0.8 },
  { x:  0.5, y:  1.9 },
  { x:  1.5, y:  2.9 },
  { x:  2.5, y:  4.0 },
  { x:  3.8, y:  5.1 },
];

/* ─────────────────────────────────────────────
   Axis tick values
───────────────────────────────────────────── */
const X_TICKS = Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => X_MIN + i);
const Y_TICKS = [-6, -4, -2, 0, 2, 4, 6];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export interface LeastSquaresProps {
  className?: string;
}

export function LeastSquares({ className = '' }: LeastSquaresProps) {

  /* ── State ── */
  const [points, setPoints]           = useState<Point[]>(DEFAULT_POINTS);
  const [activeFeatures, setActive]   = useState<Set<string>>(new Set(['x']));
  const [dragging, setDragging]       = useState<number | null>(null);
  const [showResiduals, setResiduals] = useState(true);

  const svgRef      = useRef<SVGSVGElement>(null);
  const dragOrigin  = useRef<{ svgX: number; svgY: number; ptX: number; ptY: number } | null>(null);

  /* ── Derived: ordered feature id list ── */
  const featureIds = useMemo(
    () => ALL_FEATURES.filter(f => activeFeatures.has(f.id)).map(f => f.id),
    [activeFeatures]
  );

  /* ── OLS coefficients ── */
  const beta = useMemo(() => ols(points, featureIds), [points, featureIds]);

  /* ── Prediction function ── */
  const predict = useCallback((x: number): number => {
    if (!beta) return 0;
    return beta[0] + featureIds.reduce((s, id, i) => {
      return s + beta[i + 1] * ALL_FEATURES.find(f => f.id === id)!.fn(x);
    }, 0);
  }, [beta, featureIds]);

  /* ── Per-point predicted values ── */
  const yHat = useMemo(() => points.map(pt => predict(pt.x)), [points, predict]);

  /* ── R² ── */
  const r2 = useMemo(() => {
    if (!beta || points.length < 2) return null;
    return computeR2(points.map(p => p.y), yHat);
  }, [beta, points, yHat]);

  /* ── Design matrix preview (first 7 rows) ── */
  const PREVIEW_ROWS = 7;
  const designPreview = useMemo(() => {
    const colHeaders = ['1', ...featureIds.map(id => ALL_FEATURES.find(f => f.id === id)!.label)];
    const rows = points.slice(0, PREVIEW_ROWS).map((pt, ri) => ({
      rowNum: ri + 1,
      cells: [
        '1',
        ...featureIds.map(id => {
          const v = ALL_FEATURES.find(f => f.id === id)!.fn(pt.x);
          return isFinite(v) ? v.toFixed(2) : '—';
        }),
      ],
      y: pt.y.toFixed(2),
    }));
    return { colHeaders, rows, truncated: points.length > PREVIEW_ROWS, total: points.length };
  }, [points, featureIds]);

  /* ── Equation string ── */
  const equationStr = useMemo(() => {
    if (!beta) {
      const need = featureIds.length + 2;
      return `ŷ = ?   (need ≥ ${need} points)`;
    }
    const labels = ['', ...featureIds.map(id => ALL_FEATURES.find(f => f.id === id)!.eqLabel)];
    return 'ŷ = ' + beta.map((b, i) => {
      const absB = Math.abs(b) < 5e-4 ? 0 : b;
      const sign = i === 0 ? '' : absB >= 0 ? ' + ' : ' − ';
      const abs  = Math.abs(absB).toFixed(3);
      const lbl  = labels[i] ? ` ${labels[i]}` : '';
      return `${sign}${abs}${lbl}`;
    }).join('');
  }, [beta, featureIds]);

  /* ── Regression curve SVG path ── */
  const curvePath = useMemo(() => {
    if (!beta) return '';
    const step = (X_MAX - X_MIN) / (SAMPLES - 1);
    const parts: string[] = [];
    for (let i = 0; i < SAMPLES; i++) {
      const x = X_MIN + i * step;
      const y = predict(x);
      if (!isFinite(y)) { parts.push(''); continue; }
      const px = toPixX(x);
      const py = toPixY(clamp(y, Y_MIN - 1, Y_MAX + 1));
      parts.push(`${parts.length === 0 || parts[parts.length - 1] === '' ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return parts.join(' ');
  }, [beta, predict]);

  /* ── SVG → data coordinate helper ── */
  const getSVGCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      svgX: (e.clientX - rect.left)  / rect.width  * SVG_W,
      svgY: (e.clientY - rect.top)   / rect.height * SVG_H,
    };
  }, []);

  /* ── Pointer down on a data point ── */
  const onPointDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const c = getSVGCoords(e);
    if (!c) return;
    dragOrigin.current = { ...c, ptX: points[idx].x, ptY: points[idx].y };
    setDragging(idx);
  }, [getSVGCoords, points]);

  /* ── Mouse move over SVG ── */
  const onSVGMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging === null || !dragOrigin.current) return;
    const c = getSVGCoords(e);
    if (!c) return;
    const origin = dragOrigin.current;
    const newDataX = clamp(origin.ptX + (c.svgX - origin.svgX) / CW * (X_MAX - X_MIN), X_MIN, X_MAX);
    const newDataY = clamp(origin.ptY - (c.svgY - origin.svgY) / CH * (Y_MAX - Y_MIN), Y_MIN, Y_MAX);
    setPoints(prev => prev.map((p, i) => i === dragging ? { x: newDataX, y: newDataY } : p));
  }, [dragging, getSVGCoords]);

  /* ── Mouse up ── */
  const stopDrag = useCallback(() => {
    setDragging(null);
    dragOrigin.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', stopDrag);
    return () => window.removeEventListener('mouseup', stopDrag);
  }, [stopDrag]);

  /* ── Click on background → add point ── */
  const onSVGClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging !== null) return;
    const c = getSVGCoords(e);
    if (!c) return;
    if (c.svgX < PAD.left || c.svgX > SVG_W - PAD.right ||
        c.svgY < PAD.top  || c.svgY > SVG_H - PAD.bottom) return;
    setPoints(prev => [...prev, {
      x: parseFloat(clamp(toDataX(c.svgX), X_MIN, X_MAX).toFixed(2)),
      y: parseFloat(clamp(toDataY(c.svgY), Y_MIN, Y_MAX).toFixed(2)),
    }]);
  }, [dragging, getSVGCoords]);

  /* ── Right-click point → remove ── */
  const onPointCtx = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    setPoints(prev => prev.filter((_, i) => i !== idx));
  }, []);

  /* ── Toggle feature ── */
  const toggleFeature = (id: string) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ── Reset ── */
  const reset = () => {
    setPoints(DEFAULT_POINTS);
    setActive(new Set(['x']));
  };

  /* ── R² color ── */
  const r2Color = r2 === null ? '#94a3b8'
    : r2 > 0.95 ? '#10b981'
    : r2 > 0.80 ? '#f59e0b'
    : '#ef4444';

  const r2Label = r2 === null ? '—'
    : r2 > 0.95 ? 'Excellent fit'
    : r2 > 0.80 ? 'Good fit'
    : r2 > 0.60 ? 'Moderate fit'
    : 'Poor fit';

  /* ────────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────────── */
  return (
    <div className={`w-full rounded-xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm overflow-hidden ${className}`}>

      {/* ── Top toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-700/40 bg-slate-800/40">
        {/* Section label */}
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1">Features</span>

        {/* Intercept pill — always on */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-500/40 text-slate-300 bg-slate-700/40 select-none">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          1
        </span>

        {/* Feature toggle pills */}
        {ALL_FEATURES.map(f => {
          const on = activeFeatures.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleFeature(f.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none
                ${on
                  ? 'border-current bg-current/10'
                  : 'border-slate-600/40 text-slate-400 bg-slate-800/40 hover:border-slate-500/60 hover:text-slate-300'
                }`}
              style={on ? { color: f.color, borderColor: f.color } : {}}
            >
              <span
                className="w-2 h-2 rounded-full transition-colors duration-150"
                style={{ background: on ? f.color : '#475569' }}
              />
              {f.label}
            </button>
          );
        })}

        {/* Residual toggle */}
        <button
          onClick={() => setResiduals(v => !v)}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none
            ${showResiduals
              ? 'border-red-500/60 text-red-400 bg-red-500/10'
              : 'border-slate-600/40 text-slate-400 bg-slate-800/40 hover:border-slate-500/60'
            }`}
        >
          residuals
        </button>

        {/* Reset button */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600/40 text-slate-400 bg-slate-800/40 hover:border-slate-500 hover:text-slate-300 transition-all duration-150 cursor-pointer"
        >
          reset
        </button>
      </div>

      {/* ── Hint bar ── */}
      <div className="px-4 py-1.5 text-[0.7rem] text-slate-500 border-b border-slate-700/30 bg-slate-900/30 select-none">
        Click on the chart to add a point &nbsp;·&nbsp; drag points to move &nbsp;·&nbsp; right-click to remove
      </div>

      {/* ── Body: chart + info panel ── */}
      <div className="flex flex-col lg:flex-row gap-0">

        {/* Chart */}
        <div className="flex-1 min-w-0 p-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className={`w-full rounded-lg ${dragging !== null ? 'cursor-grabbing' : 'cursor-crosshair'}`}
            style={{ background: 'rgba(15,23,42,0.6)', userSelect: 'none' }}
            onMouseMove={onSVGMove}
            onMouseUp={stopDrag}
            onClick={onSVGClick}
          >
            {/* ── Defs ── */}
            <defs>
              <clipPath id="lsq-clip">
                <rect x={PAD.left} y={PAD.top} width={CW} height={CH} />
              </clipPath>
            </defs>

            {/* ── Grid ── */}
            {X_TICKS.map(t => (
              <line key={`gx${t}`}
                x1={toPixX(t)} y1={PAD.top} x2={toPixX(t)} y2={SVG_H - PAD.bottom}
                stroke="rgba(148,163,184,0.08)" strokeWidth={1} />
            ))}
            {Y_TICKS.map(t => (
              <line key={`gy${t}`}
                x1={PAD.left} y1={toPixY(t)} x2={SVG_W - PAD.right} y2={toPixY(t)}
                stroke="rgba(148,163,184,0.08)" strokeWidth={1} />
            ))}

            {/* ── Zero axes ── */}
            <line x1={PAD.left} y1={toPixY(0)} x2={SVG_W - PAD.right} y2={toPixY(0)}
              stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} />
            <line x1={toPixX(0)} y1={PAD.top}  x2={toPixX(0)} y2={SVG_H - PAD.bottom}
              stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} />

            {/* ── Chart border ── */}
            <rect x={PAD.left} y={PAD.top} width={CW} height={CH}
              fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth={1} />

            {/* ── X-axis ticks + labels ── */}
            {X_TICKS.map(t => (
              <g key={`xt${t}`}>
                <line x1={toPixX(t)} y1={SVG_H - PAD.bottom}
                      x2={toPixX(t)} y2={SVG_H - PAD.bottom + 5}
                  stroke="rgba(148,163,184,0.4)" strokeWidth={1} />
                {t !== 0 && (
                  <text x={toPixX(t)} y={SVG_H - PAD.bottom + 17}
                    textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize={11}>{t}</text>
                )}
              </g>
            ))}

            {/* ── Y-axis ticks + labels ── */}
            {Y_TICKS.map(t => (
              <g key={`yt${t}`}>
                <line x1={PAD.left - 5} y1={toPixY(t)} x2={PAD.left} y2={toPixY(t)}
                  stroke="rgba(148,163,184,0.4)" strokeWidth={1} />
                {t !== 0 && (
                  <text x={PAD.left - 9} y={toPixY(t) + 4}
                    textAnchor="end" fill="rgba(148,163,184,0.65)" fontSize={11}>{t}</text>
                )}
              </g>
            ))}

            {/* ── Residual lines ── */}
            {showResiduals && beta && points.map((pt, i) => {
              if (pt.x < X_MIN || pt.x > X_MAX || pt.y < Y_MIN || pt.y > Y_MAX) return null;
              const pyFit  = toPixY(clamp(yHat[i], Y_MIN, Y_MAX));
              const pyData = toPixY(pt.y);
              if (Math.abs(pyFit - pyData) < 2) return null;
              return (
                <line key={`res${i}`}
                  x1={toPixX(pt.x)} y1={pyData}
                  x2={toPixX(pt.x)} y2={pyFit}
                  stroke="rgba(239,68,68,0.40)" strokeWidth={1.5} strokeDasharray="3 2"
                  clipPath="url(#lsq-clip)" />
              );
            })}

            {/* ── Regression curve ── */}
            {curvePath && (
              <path d={curvePath}
                fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round"
                clipPath="url(#lsq-clip)" />
            )}

            {/* ── Data points ── */}
            {points.map((pt, i) => {
              if (pt.x < X_MIN || pt.x > X_MAX || pt.y < Y_MIN || pt.y > Y_MAX) return null;
              const px = toPixX(pt.x);
              const py = toPixY(pt.y);
              return (
                <g key={i}>
                  {/* outer glow ring when dragging */}
                  {dragging === i && (
                    <circle cx={px} cy={py} r={11} fill="none"
                      stroke="#f59e0b" strokeWidth={1.5} opacity={0.5} />
                  )}
                  <circle
                    cx={px} cy={py} r={7}
                    fill="#f59e0b"
                    stroke={dragging === i ? '#fff' : 'rgba(15,23,42,0.8)'}
                    strokeWidth={dragging === i ? 2 : 1.5}
                    style={{ cursor: dragging === i ? 'grabbing' : 'grab' }}
                    onMouseDown={e => onPointDown(e, i)}
                    onContextMenu={e => onPointCtx(e, i)}
                  />
                </g>
              );
            })}

            {/* ── Legend ── */}
            <g>
              <rect x={SVG_W - PAD.right - 148} y={PAD.top + 4} width={144} height={beta ? 42 : 24}
                rx={6} fill="rgba(15,23,42,0.75)" stroke="rgba(148,163,184,0.2)" strokeWidth={1} />
              <circle cx={SVG_W - PAD.right - 134} cy={PAD.top + 16} r={5} fill="#f59e0b" />
              <text x={SVG_W - PAD.right - 124} y={PAD.top + 20}
                fill="rgba(203,213,225,0.85)" fontSize={11}>data points</text>
              {beta && <>
                <line x1={SVG_W - PAD.right - 139} y1={PAD.top + 34}
                      x2={SVG_W - PAD.right - 124} y2={PAD.top + 34}
                  stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" />
                <text x={SVG_W - PAD.right - 120} y={PAD.top + 38}
                  fill="rgba(203,213,225,0.85)" fontSize={11}>best fit</text>
              </>}
            </g>
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div className="lg:w-72 xl:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/40 flex flex-col gap-0 divide-y divide-slate-700/40 text-sm">

          {/* Equation */}
          <div className="p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Best-fit equation</p>
            <p className="font-mono text-slate-200 text-sm leading-relaxed break-all">{equationStr}</p>
          </div>

          {/* R² */}
          <div className="p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-2">Goodness of fit</p>
            {r2 !== null ? (
              <>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-slate-400 text-xs">R²</span>
                  <span className="font-mono font-bold text-lg" style={{ color: r2Color }}>
                    {r2.toFixed(4)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${r2 * 100}%`, background: r2Color }}
                  />
                </div>
                <p className="text-xs" style={{ color: r2Color }}>{r2Label}</p>
              </>
            ) : (
              <p className="text-slate-500 text-xs italic">
                Need ≥ {featureIds.length + 2} points for {featureIds.length + 1} parameter{featureIds.length !== 0 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Coefficients */}
          {beta && (
            <div className="p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-2">Coefficients β̂</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700/40">
                    <th className="text-left font-medium pb-1">Feature</th>
                    <th className="text-right font-medium pb-1">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  <tr>
                    <td className="py-1 text-slate-400">β₀ (intercept)</td>
                    <td className="py-1 text-right font-mono text-slate-200">{beta[0].toFixed(4)}</td>
                  </tr>
                  {featureIds.map((id, i) => {
                    const f = ALL_FEATURES.find(f => f.id === id)!;
                    return (
                      <tr key={id}>
                        <td className="py-1" style={{ color: f.color }}>
                          β{i + 1} · {f.label}
                        </td>
                        <td className="py-1 text-right font-mono text-slate-200">
                          {beta[i + 1].toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Design matrix preview */}
          <div className="p-4 flex-1 min-h-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Design matrix X &nbsp;
              <span className="normal-case font-normal text-slate-600">
                ({designPreview.total} × {1 + featureIds.length})
              </span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700/40">
                    <th className="text-left font-medium pb-1 pr-2 text-slate-600">#</th>
                    {designPreview.colHeaders.map((h, ci) => (
                      <th key={ci} className="text-right font-medium pb-1 px-1"
                        style={{ color: ci === 0 ? '#94a3b8' : ALL_FEATURES.find(f => f.label === h)?.color ?? '#94a3b8' }}>
                        {h}
                      </th>
                    ))}
                    <th className="text-right font-medium pb-1 pl-2 text-slate-500">y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {designPreview.rows.map(({ rowNum, cells, y }) => (
                    <tr key={rowNum} className="hover:bg-slate-800/30">
                      <td className="py-0.5 pr-2 text-slate-600">{rowNum}</td>
                      {cells.map((cell, ci) => (
                        <td key={ci} className="py-0.5 px-1 text-right text-slate-300">{cell}</td>
                      ))}
                      <td className="py-0.5 pl-2 text-right text-slate-500">{y}</td>
                    </tr>
                  ))}
                  {designPreview.truncated && (
                    <tr>
                      <td colSpan={2 + featureIds.length + 1}
                        className="py-1 text-center text-slate-600 tracking-widest">⋮</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LeastSquares;
