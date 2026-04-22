'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────
   Props
────────────────────────────────────────────── */
interface LimitExampleProps {
  /** Function to plot — should have a removable discontinuity at limitPoint */
  fn?: (x: number) => number;
  /** x-value where the limit is evaluated */
  limitPoint?: number;
  /** The limit value L */
  limitValue?: number;
  /** Human-readable label shown in the legend */
  fnLabel?: string;
  className?: string;
}

/* ──────────────────────────────────────────────
   SVG Layout
────────────────────────────────────────────── */
const SVG_SIZE = 500;
const PAD = 52;
const PLOT = SVG_SIZE - 2 * PAD;   // 396
const SAMPLES = 600;

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
function niceStep(halfRange: number): number {
  const raw = halfRange / 3;
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / exp;
  if (frac < 1.5) return exp;
  if (frac < 3.5) return 2 * exp;
  if (frac < 7.5) return 5 * exp;
  return 10 * exp;
}

function fmt(v: number): string {
  if (Math.abs(v) < 1e-9) return '0';
  if (Math.abs(v) >= 100) return v.toFixed(0);
  if (Math.abs(v) >= 10)  return v.toFixed(1);
  if (Math.abs(v) >= 1)   return v.toFixed(2);
  return v.toFixed(3);
}

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
function LimitExample({
  fn = (x: number) => Math.abs(x) < 1e-10 ? NaN : Math.sin(x) / x,
  limitPoint = 0,
  limitValue = 1,
  fnLabel = 'sin(x) / x',
  className = '',
}: LimitExampleProps) {
  const [zoom, setZoom]       = useState(1);     // 1 → halfRange = 4
  const [epsilon, setEpsilon] = useState(0.30);

  /* ── Responsive scaling for HTML controls ── */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(500);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Scale HTML controls relative to a 500 px base; cap so it doesn’t get absurd
  const uiScale = Math.min(2.0, Math.max(0.8, containerW / 500));
  const halfRange = 4 / zoom;
  const xMin = limitPoint - halfRange;
  const xMax = limitPoint + halfRange;
  const yCenter = limitValue;
  const yMin = yCenter - halfRange;
  const yMax = yCenter + halfRange;

  /* ── coordinate transforms ── */
  const toPixX = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * PLOT;
  const toPixY = (y: number) => PAD + ((yMax - y) / (yMax - yMin)) * PLOT;

  /* ── numerically find the largest valid δ ── */
  const delta = useMemo(() => {
    const maxDelta = halfRange * 0.98;
    let lo = 0, hi = maxDelta;
    for (let iter = 0; iter < 60; iter++) {
      const mid = (lo + hi) / 2;
      let valid = true;
      for (let j = 1; j <= 200; j++) {
        const t = j / 200;
        for (const x of [limitPoint - mid * t, limitPoint + mid * t]) {
          const y = fn(x);
          if (isFinite(y) && Math.abs(y - limitValue) >= epsilon) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
      }
      if (valid) lo = mid; else hi = mid;
    }
    return lo;
  }, [fn, limitPoint, limitValue, epsilon, halfRange]);

  /* ── SVG path for the function ── */
  const pathData = useMemo(() => {
    const step = (xMax - xMin) / SAMPLES;
    const holeGap = Math.max(step * 3, halfRange * 0.02);
    let d = '';
    let penDown = false;
    for (let i = 0; i <= SAMPLES; i++) {
      const x = xMin + i * step;
      if (Math.abs(x - limitPoint) < holeGap) { penDown = false; continue; }
      const y = fn(x);
      if (!isFinite(y) || y < yMin - halfRange || y > yMax + halfRange) { penDown = false; continue; }
      const px = toPixX(x);
      const py = toPixY(Math.max(yMin - 0.5, Math.min(yMax + 0.5, y)));
      d += penDown ? `L${px.toFixed(1)},${py.toFixed(1)} ` : `M${px.toFixed(1)},${py.toFixed(1)} `;
      penDown = true;
    }
    return d;
  }, [fn, xMin, xMax, yMin, yMax, halfRange, limitPoint, zoom]);

  /* ── axis ticks ── */
  const xStep = niceStep(halfRange);
  const yStep = niceStep(halfRange);

  const xTicks = useMemo(() => {
    const start = Math.ceil(xMin / xStep) * xStep;
    const result: number[] = [];
    for (let x = start; x <= xMax + 1e-9; x += xStep)
      result.push(parseFloat(x.toPrecision(6)));
    return result;
  }, [xMin, xMax, xStep]);

  const yTicks = useMemo(() => {
    const start = Math.ceil(yMin / yStep) * yStep;
    const result: number[] = [];
    for (let y = start; y <= yMax + 1e-9; y += yStep)
      result.push(parseFloat(y.toPrecision(6)));
    return result;
  }, [yMin, yMax, yStep]);

  /* ── key pixel coords ── */
  const axisY  = toPixY(0);
  const axisX  = toPixX(0);
  const holeX  = toPixX(limitPoint);
  const holeY  = toPixY(limitValue);
  const epY1   = toPixY(limitValue + epsilon);
  const epY2   = toPixY(limitValue - epsilon);
  const delX1  = toPixX(limitPoint - delta);
  const delX2  = toPixX(limitPoint + delta);

  const inBounds = (v: number, lo: number, hi: number) => v >= lo && v <= hi;

  /* ── wheel zoom ── */
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.15, Math.min(30, prev * (e.deltaY < 0 ? 1.25 : 0.8))));
  }, []);

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{ width: '80%', height: 'auto', userSelect: 'none' }}
        onWheel={handleWheel}
        className="rounded-xl border border-white/10 bg-[#0f172a]/60 cursor-crosshair"
      >
        <defs>
          <clipPath id="lim-clip">
            <rect x={PAD} y={PAD} width={PLOT} height={PLOT} />
          </clipPath>
        </defs>

        {/* ── epsilon band ── */}
        {inBounds(epY1, PAD, PAD + PLOT) || inBounds(epY2, PAD, PAD + PLOT) ? (
          <rect
            x={PAD} y={Math.max(PAD, epY1)}
            width={PLOT} height={Math.min(PAD + PLOT, epY2) - Math.max(PAD, epY1)}
            fill="rgba(245,158,11,0.10)"
          />
        ) : null}

        {/* ── delta band ── */}
        {delta > 0 && (
          <rect
            x={Math.max(PAD, delX1)} y={PAD}
            width={Math.min(PAD + PLOT, delX2) - Math.max(PAD, delX1)} height={PLOT}
            fill="rgba(99,102,241,0.10)"
          />
        )}

        {/* ── grid ── */}
        {xTicks.map(x => (
          <line key={`gx${x}`}
            x1={toPixX(x)} y1={PAD} x2={toPixX(x)} y2={PAD + PLOT}
            stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}
        {yTicks.map(y => (
          <line key={`gy${y}`}
            x1={PAD} y1={toPixY(y)} x2={PAD + PLOT} y2={toPixY(y)}
            stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}

        {/* ── zero axes ── */}
        {inBounds(axisY, PAD, PAD + PLOT) && (
          <line x1={PAD} y1={axisY} x2={PAD + PLOT} y2={axisY}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
        )}
        {inBounds(axisX, PAD, PAD + PLOT) && (
          <line x1={axisX} y1={PAD} x2={axisX} y2={PAD + PLOT}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
        )}

        {/* ── epsilon dashed lines ── */}
        <line x1={PAD} y1={epY1} x2={PAD + PLOT} y2={epY1}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="7 4"
          clipPath="url(#lim-clip)" />
        <line x1={PAD} y1={epY2} x2={PAD + PLOT} y2={epY2}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="7 4"
          clipPath="url(#lim-clip)" />

        {/* ── delta dashed lines ── */}
        {delta > 0 && <>
          <line x1={delX1} y1={PAD} x2={delX1} y2={PAD + PLOT}
            stroke="#6366f1" strokeWidth="1.5" strokeDasharray="7 4"
            clipPath="url(#lim-clip)" />
          <line x1={delX2} y1={PAD} x2={delX2} y2={PAD + PLOT}
            stroke="#6366f1" strokeWidth="1.5" strokeDasharray="7 4"
            clipPath="url(#lim-clip)" />
        </>}

        {/* ── function curve ── */}
        <path d={pathData} stroke="#10b981" strokeWidth="2.5" fill="none"
          clipPath="url(#lim-clip)" strokeLinejoin="round" />

        {/* ── open circle at limit point (hole) ── */}
        <circle cx={holeX} cy={holeY} r={6} fill="#0f172a" stroke="#10b981" strokeWidth="2"
          clipPath="url(#lim-clip)" />

        {/* ── axis tick labels ── */}
        {xTicks.map(x => (
          <text key={`tx${x}`} x={toPixX(x)} y={PAD + PLOT + 18}
            textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="11">
            {fmt(x)}
          </text>
        ))}
        {yTicks.map(y => (
          <text key={`ty${y}`} x={PAD - 6} y={toPixY(y) + 4}
            textAnchor="end" fill="rgba(148,163,184,0.75)" fontSize="11">
            {fmt(y)}
          </text>
        ))}

        {/* ── epsilon labels ── */}
        {inBounds(epY1, PAD, PAD + PLOT) && (
          <text x={PAD + PLOT - 5} y={epY1 - 5} textAnchor="end"
            fill="#f59e0b" fontSize="12" fontStyle="italic">L + ε</text>
        )}
        {inBounds(epY2, PAD, PAD + PLOT) && (
          <text x={PAD + PLOT - 5} y={epY2 + 15} textAnchor="end"
            fill="#f59e0b" fontSize="12" fontStyle="italic">L − ε</text>
        )}

        {/* ── delta label ── */}
        {delta > 1e-6 && inBounds((delX1 + delX2) / 2, PAD, PAD + PLOT) && (
          <text x={(delX1 + delX2) / 2} y={PAD - 8} textAnchor="middle"
            fill="#6366f1" fontSize="12" fontStyle="italic">2δ</text>
        )}

        {/* ── legend ── */}
        <rect x={PAD + 6} y={PAD + 6} width={130} height={20} rx={4}
          fill="rgba(15,23,42,0.7)" />
        <circle cx={PAD + 18} cy={PAD + 16} r={5} fill="none" stroke="#10b981" strokeWidth="2" />
        <text x={PAD + 28} y={PAD + 20} fill="#10b981" fontSize="12">{fnLabel}</text>

        {/* ── border ── */}
        <rect x={PAD} y={PAD} width={PLOT} height={PLOT}
          fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
      </svg>

      {/* ── epsilon slider ── */}
      <div
        className="flex flex-col items-center gap-2 mt-3 w-4/5"
        style={{ fontSize: `${0.875 * uiScale}rem`, maxWidth: uiScale > 1.3 ? 'none' : '28rem' }}
      >
        <div className="flex items-center gap-3 w-full">
          <span className="tc2 italic w-3" style={{ minWidth: `${1.2 * uiScale}rem` }}>ε</span>
          <input
            type="range" min={0.01} max={0.99} step={0.01} value={epsilon}
            onChange={e => setEpsilon(Number(e.target.value))}
            className="flex-1 accent-amber-400"
            style={{ height: `${1 * uiScale}rem` }}
          />
          <span className="text-amber-400 font-mono text-right" style={{ minWidth: `${2.5 * uiScale}rem` }}>
            {epsilon.toFixed(2)}
          </span>
        </div>

        {/* ── readout ── */}
        <div className="flex font-mono" style={{ gap: `${2 * uiScale}rem` }}>
          <span>
            <span className="text-amber-400">ε</span>
            <span className="tc2"> = {epsilon.toFixed(3)}</span>
          </span>
          <span>
            <span className="text-indigo-400">δ</span>
            <span className="tc2"> = {delta > 1e-9 ? delta.toFixed(4) : '—'}</span>
          </span>
        </div>

        <p className="tc2 opacity-50" style={{ fontSize: `${0.75 * uiScale}rem`, marginTop: `${0.25 * uiScale}rem` }}>
          Scroll to zoom · centered on the limit point
        </p>
      </div>
    </div>
  );
}

export { LimitExample };
export default LimitExample;
