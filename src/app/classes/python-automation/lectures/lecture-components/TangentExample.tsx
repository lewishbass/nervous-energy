'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────
   SVG Layout
────────────────────────────────────────────── */
const SVG_W = 560;
const SVG_H = 380;
const PAD_L = 56;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 50;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;
const SAMPLES = 50;

/* ──────────────────────────────────────────────
   Default function: f(x) = x³ − 3x
────────────────────────────────────────────── */
const DEFAULT_FN = (x: number) => x * x * x - 3 * x;
const DEFAULT_FN_LABEL = 'f(x) = x³ − 3x';
const X_MIN = -2.5;
const X_MAX = 2.5;
const Y_MIN = -4;
const Y_MAX = 4;

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
function toPixX(x: number) {
  return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}
function toPixY(y: number) {
  return PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;
}
function fromPixX(px: number) {
  return X_MIN + ((px - PAD_L) / PLOT_W) * (X_MAX - X_MIN);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Numerical derivative via central differences */
function derivative(fn: (x: number) => number, x: number, h = 1e-6): number {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

const X_TICKS = [-2, -1, 0, 1, 2];
const Y_TICKS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
interface TangentExampleProps {
  fn?: (x: number) => number;
  fnLabel?: string;
  className?: string;
  displayMode?: 'scrollable' | 'slideshow';
}

function TangentExample({
  fn = DEFAULT_FN,
  fnLabel = DEFAULT_FN_LABEL,
  className = '',
  displayMode = 'scrollable',
}: TangentExampleProps) {
  /* Base point (draggable) and Δx (slider) */
  const [baseX, setBaseX] = useState(0.8);
  const [logDx, setLogDx] = useState(0); // 0 → dx=1.0, -3 → dx≈0.001

  const dx = Math.pow(10, logDx);   // maps slider [−3, 0] → [0.001, 1.0]
  const x1 = baseX;
  const x2 = clamp(baseX + dx, X_MIN, X_MAX);
  const y1 = fn(x1);
  const y2 = fn(x2);
  const secantSlope = Math.abs(x2 - x1) > 1e-10 ? (y2 - y1) / (x2 - x1) : derivative(fn, x1);
  const tangentSlope = derivative(fn, x1);

  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  /* Responsive scaling */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(560);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const uiScale = Math.min(2.0, Math.max(0.75, containerW / 500));

  /* SVG curve path */
  const pathData = useMemo(() => {
    const step = (X_MAX - X_MIN) / SAMPLES;
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const x = X_MIN + i * step;
      const y = fn(x);
      if (!isFinite(y) || y < Y_MIN - 1 || y > Y_MAX + 1) { d += ''; continue; }
      const px = toPixX(x);
      const py = toPixY(clamp(y, Y_MIN - 0.5, Y_MAX + 0.5));
      d += d === '' ? `M${px.toFixed(2)},${py.toFixed(2)} ` : `L${px.toFixed(2)},${py.toFixed(2)} `;
    }
    return d;
  }, [fn]);

  /* Tangent line — extend across visible domain */
  const tangentLine = useMemo(() => {
    const extend = (X_MAX - X_MIN) * 0.7;
    const txMin = clamp(x1 - extend, X_MIN, X_MAX);
    const txMax = clamp(x1 + extend, X_MIN, X_MAX);
    const tyMin = y1 + tangentSlope * (txMin - x1);
    const tyMax = y1 + tangentSlope * (txMax - x1);
    return {
      x1: toPixX(txMin), y1: toPixY(tyMin),
      x2: toPixX(txMax), y2: toPixY(tyMax),
    };
  }, [x1, y1, tangentSlope]);

  /* Secant line */
  const secantLine = useMemo(() => {
    const extend = (X_MAX - X_MIN) * 0.35;
    const sxMin = clamp(Math.min(x1, x2) - extend, X_MIN, X_MAX);
    const sxMax = clamp(Math.max(x1, x2) + extend, X_MIN, X_MAX);
    const syMin = y1 + secantSlope * (sxMin - x1);
    const syMax = y1 + secantSlope * (sxMax - x1);
    return {
      x1: toPixX(sxMin), y1: toPixY(syMin),
      x2: toPixX(sxMax), y2: toPixY(syMax),
    };
  }, [x1, x2, y1, secantSlope]);

  /* Pixel coords of the two points */
  const px1 = toPixX(x1);
  const py1 = toPixY(clamp(y1, Y_MIN, Y_MAX));
  const px2 = toPixX(x2);
  const py2 = toPixY(clamp(y2, Y_MIN, Y_MAX));

  /* Drag logic */
  const getSVGX = useCallback((clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return baseX;
    const rect = svg.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * SVG_W;
    return clamp(fromPixX(rawX), X_MIN, X_MAX - dx - 0.01);
  }, [dx, baseX]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    setBaseX(getSVGX(e.clientX));
  }, [getSVGX]);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    setBaseX(getSVGX(e.touches[0].clientX));
  }, [getSVGX]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  const axisY = toPixY(0);
  const axisX = toPixX(0);

  /* Convergence indicator: how close is secant slope to tangent slope */
  const pctClose = Math.abs(tangentSlope) > 1e-6
    ? Math.max(0, 1 - Math.abs(secantSlope - tangentSlope) / Math.abs(tangentSlope))
    : 1 - Math.min(1, Math.abs(secantSlope - tangentSlope));

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '90%', height: 'auto', userSelect: 'none', touchAction: 'none' }}
        className="rounded-xl border border-white/10 bg-[#0f172a]/60 cursor-crosshair"
      >
        <defs>
          <clipPath id="tan-clip">
            <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>

        {/* ── grid ── */}
        {X_TICKS.map(x => (
          <line key={`gx${x}`}
            x1={toPixX(x)} y1={PAD_T} x2={toPixX(x)} y2={PAD_T + PLOT_H}
            stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}
        {Y_TICKS.map(y => (
          <line key={`gy${y}`}
            x1={PAD_L} y1={toPixY(y)} x2={PAD_L + PLOT_W} y2={toPixY(y)}
            stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}

        {/* ── zero axes ── */}
        {axisY >= PAD_T && axisY <= PAD_T + PLOT_H && (
          <line x1={PAD_L} y1={axisY} x2={PAD_L + PLOT_W} y2={axisY}
            stroke="rgba(148,163,184,0.30)" strokeWidth="1" />
        )}
        {axisX >= PAD_L && axisX <= PAD_L + PLOT_W && (
          <line x1={axisX} y1={PAD_T} x2={axisX} y2={PAD_T + PLOT_H}
            stroke="rgba(148,163,184,0.30)" strokeWidth="1" />
        )}

        {/* ── tangent line ── */}
        <line
          x1={tangentLine.x1} y1={tangentLine.y1}
          x2={tangentLine.x2} y2={tangentLine.y2}
          stroke="#10b981" strokeWidth="2"
          clipPath="url(#tan-clip)"
        />

        {/* ── secant line ── */}
        {dx > 1e-4 && (
          <line
            x1={secantLine.x1} y1={secantLine.y1}
            x2={secantLine.x2} y2={secantLine.y2}
            stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 4"
            clipPath="url(#tan-clip)"
          />
        )}

        {/* ── vertical dashed line from x2 to curve (shows Δx visually) ── */}
        {dx > 0.02 && Math.abs(px2 - px1) > 4 && (
          <>
            <line x1={px2} y1={py1} x2={px2} y2={py2}
              stroke="rgba(245,158,11,0.45)" strokeWidth="1.2" strokeDasharray="4 3"
              clipPath="url(#tan-clip)" />
            <line x1={px1} y1={py1} x2={px2} y2={py1}
              stroke="rgba(245,158,11,0.45)" strokeWidth="1.2" strokeDasharray="4 3"
              clipPath="url(#tan-clip)" />
          </>
        )}

        {/* ── function curve ── */}
        <path d={pathData} stroke="#6366f1" strokeWidth="2.5" fill="none"
          clipPath="url(#tan-clip)" strokeLinejoin="round" />

        {/* ── x2 point (secondary, fades as dx → 0) ── */}
        {dx > 0.01 && (
          <circle cx={px2} cy={py2} r={6}
            fill="#f59e0b" stroke="#fff" strokeWidth="1.5"
            clipPath="url(#tan-clip)"
            opacity={Math.min(1, dx * 2)}
          />
        )}

        {/* ── base point (draggable) ── */}
        <circle cx={px1} cy={py1} r={8}
          fill="#6366f1" stroke="#fff" strokeWidth="2"
          clipPath="url(#tan-clip)"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={() => { dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
        />

        {/* ── axis tick labels ── */}
        {X_TICKS.map(x => (
          <text key={`tx${x}`} x={toPixX(x)} y={PAD_T + PLOT_H + 18}
            textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="11">{x}</text>
        ))}
        {Y_TICKS.filter((_, i) => i % 2 === 0).map(y => (
          <text key={`ty${y}`} x={PAD_L - 6} y={toPixY(y) + 4}
            textAnchor="end" fill="rgba(148,163,184,0.75)" fontSize="11">{y}</text>
        ))}

        {/* ── axis labels ── */}
        <text x={PAD_L + PLOT_W / 2} y={SVG_H - 4}
          textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="12">x</text>
        <text x={14} y={PAD_T + PLOT_H / 2}
          textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="12"
          transform={`rotate(-90, 14, ${PAD_T + PLOT_H / 2})`}>f(x)</text>

        {/* ── legend ── */}
        <rect x={PAD_L + 8} y={PAD_T + 8} width={178} height={74} rx={6}
          fill="rgba(15,23,42,0.78)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={PAD_L + 18} y1={PAD_T + 22} x2={PAD_L + 40} y2={PAD_T + 22}
          stroke="#6366f1" strokeWidth="2.5" />
        <text x={PAD_L + 46} y={PAD_T + 26} fill="#6366f1" fontSize="12">{fnLabel}</text>
        <line x1={PAD_L + 18} y1={PAD_T + 42} x2={PAD_L + 40} y2={PAD_T + 42}
          stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
        <text x={PAD_L + 46} y={PAD_T + 46} fill="#f59e0b" fontSize="12">Secant line</text>
        <line x1={PAD_L + 18} y1={PAD_T + 62} x2={PAD_L + 40} y2={PAD_T + 62}
          stroke="#10b981" strokeWidth="2" />
        <text x={PAD_L + 46} y={PAD_T + 66} fill="#10b981" fontSize="12">Tangent line</text>

        {/* ── border ── */}
        <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H}
          fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
      </svg>

      {/* ── Δx slider ── */}
      <div className="flex flex-col items-center gap-2 mt-3 w-4/5"
        style={{ fontSize: `${0.875 * uiScale}rem` }}>
        <div className="flex items-center gap-3 w-full">
          <span className="tc2 italic" style={{ minWidth: `${2 * uiScale}rem` }}>Δx</span>
          <input
            type="range" min={-3} max={0} step={0.01} value={logDx}
            onChange={e => setLogDx(Number(e.target.value))}
            className="flex-1 accent-amber-400"
            style={{ height: `${1 * uiScale}rem` }}
          />
          <span className="text-amber-400 font-mono text-right" style={{ minWidth: `${3 * uiScale}rem` }}>
            {dx < 0.01 ? dx.toExponential(1) : dx.toFixed(3)}
          </span>
        </div>

        {/* ── readout ── */}
        <div className="flex font-mono flex-wrap justify-center" style={{ gap: `${1.5 * uiScale}rem` }}>
          <span>
            <span style={{ color: '#6366f1' }}>x₀</span>
            <span className="tc2"> = {x1.toFixed(3)}</span>
          </span>
          <span>
            <span style={{ color: '#f59e0b' }}>secant</span>
            <span className="tc2"> = {secantSlope.toFixed(4)}</span>
          </span>
          <span>
            <span style={{ color: '#10b981' }}>f′(x₀)</span>
            <span className="tc2"> = {tangentSlope.toFixed(4)}</span>
          </span>
        </div>

        {/* convergence bar */}
        <div className="w-full flex items-center gap-2 mt-1">
          <span className="tc2 opacity-60" style={{ fontSize: `${0.75 * uiScale}rem`, whiteSpace: 'nowrap' }}>
            secant → tangent
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pctClose * 100}%`,
                background: `hsl(${pctClose * 145}, 70%, 55%)`,
              }}
            />
          </div>
          <span className="font-mono text-right" style={{ fontSize: `${0.75 * uiScale}rem`, color: `hsl(${pctClose * 145}, 70%, 60%)`, minWidth: `${2.5 * uiScale}rem` }}>
            {(pctClose * 100).toFixed(0)}%
          </span>
        </div>

        <p className="tc2 opacity-50" style={{ fontSize: `${0.72 * uiScale}rem` }}>
          Drag the indigo dot to move the base point · slide Δx toward 0 to see the limit
        </p>
      </div>
    </div>
  );
}

export { TangentExample };
export default TangentExample;
