'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────
   SVG Layout
────────────────────────────────────────────── */
const SVG_W = 560;
const SVG_H = 400;
const PAD_L = 62;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 50;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;
const SAMPLES = 400;

/* ──────────────────────────────────────────────
   Squirrel population — scaled sigmoid
   f(t) = 1000 / (1 + exp(-0.12*(t - 50)))
   f(0)  ≈ 2.5  |  f(100) ≈ 997
────────────────────────────────────────────── */
const X_MIN = 0;
const X_MAX = 100;
const Y_MIN = 0;
const Y_MAX = 1100;

function squirrelPop(t: number): number {
  return 1000 / (1 + Math.exp(-0.12 * (t - 50)));
}

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

/* ──────────────────────────────────────────────
   Axis helpers
────────────────────────────────────────────── */
const X_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const Y_TICKS = [0, 200, 400, 600, 800, 1000];

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
interface SecantExampleProps {
  className?: string;
  displayMode?: 'scrollable' | 'slideshow';
}

function SecantExample({ className = '', displayMode = 'scrollable' }: SecantExampleProps) {
  /* t-coordinates of the two draggable points */
  const [t0, setT0] = useState(20);
  const [t1, setT1] = useState(70);

  const dragging = useRef<null | 0 | 1>(null);
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

  /* SVG path */
  const pathData = useMemo(() => {
    const step = (X_MAX - X_MIN) / SAMPLES;
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const x = X_MIN + i * step;
      const y = squirrelPop(x);
      const px = toPixX(x);
      const py = toPixY(y);
      d += i === 0 ? `M${px.toFixed(1)},${py.toFixed(1)} ` : `L${px.toFixed(1)},${py.toFixed(1)} `;
    }
    return d;
  }, []);

  /* Derived quantities */
  const y0 = squirrelPop(t0);
  const y1 = squirrelPop(t1);
  const dt = t1 - t0;
  const dy = y1 - y0;
  const slope = Math.abs(dt) > 0.001 ? dy / dt : 0;

  /* Pixel coords */
  const px0 = toPixX(t0);
  const py0 = toPixY(y0);
  const px1 = toPixX(t1);
  const py1 = toPixY(y1);
  const axisY = toPixY(0);

  /* Extend secant line to the plot edges for clarity */
  const secantExtend = 0; // keep it just between the two points

  /* Drag logic */
  const getSVGX = useCallback((clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * SVG_W;
    return clamp(fromPixX(rawX), X_MIN, X_MAX);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current === null) return;
    const t = getSVGX(e.clientX);
    if (dragging.current === 0) setT0(t);
    else setT1(t);
  }, [getSVGX]);

  const onMouseUp = useCallback(() => { dragging.current = null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* Touch drag */
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging.current === null) return;
    const t = getSVGX(e.touches[0].clientX);
    if (dragging.current === 0) setT0(t);
    else setT1(t);
  }, [getSVGX]);

  useEffect(() => {
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onTouchMove, onMouseUp]);

  /* Secant line — extend slightly past points for visual clarity */
  const extend = PLOT_W * 0.04;
  const frac = Math.abs(px1 - px0) > 1 ? (py1 - py0) / (px1 - px0) : 0;
  const sx0 = Math.max(PAD_L, Math.min(px0, px1) - extend);
  const sx1 = Math.min(PAD_L + PLOT_W, Math.max(px0, px1) + extend);
  const sy0 = py0 + frac * (sx0 - px0);
  const sy1 = py0 + frac * (sx1 - px0);

  /* Midpoint of secant for Δ labels */
  const midPx = (px0 + px1) / 2;
  const midPy = (py0 + py1) / 2;

  const leftT  = t0 < t1 ? t0 : t1;
  const rightT = t0 < t1 ? t1 : t0;
  const leftPx  = toPixX(leftT);
  const rightPx = toPixX(rightT);
  const leftY  = squirrelPop(leftT);
  const rightY = squirrelPop(rightT);
  const leftPy  = toPixY(leftY);
  const rightPy = toPixY(rightY);

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '90%', height: 'auto', userSelect: 'none', touchAction: 'none' }}
        className="rounded-xl border border-white/10 bg-[#0f172a]/60 cursor-crosshair"
      >
        <defs>
          <clipPath id="sec-clip">
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

        {/* ── zero x-axis ── */}
        <line x1={PAD_L} y1={axisY} x2={PAD_L + PLOT_W} y2={axisY}
          stroke="rgba(148,163,184,0.30)" strokeWidth="1" />

        {/* ── Δx bracket: vertical dashed lines at each point ── */}
        <line x1={leftPx} y1={leftPy} x2={leftPx} y2={axisY}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4"
          clipPath="url(#sec-clip)" />
        <line x1={rightPx} y1={rightPy} x2={rightPx} y2={axisY}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4"
          clipPath="url(#sec-clip)" />

        {/* ── horizontal dashed line connecting the two y values (shows Δy) ── */}
        <line x1={leftPx} y1={rightPy} x2={rightPx} y2={rightPy}
          stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4"
          clipPath="url(#sec-clip)" />
        <line x1={leftPx} y1={leftPy} x2={leftPx} y2={rightPy}
          stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4"
          clipPath="url(#sec-clip)" />

        {/* Δy label */}
        <text
          x={leftPx - 6}
          y={(leftPy + rightPy) / 2}
          textAnchor="end"
          fill="#10b981"
          fontSize="12"
          fontStyle="italic"
          clipPath="url(#sec-clip)"
        >
          Δpop
        </text>

        {/* Δt label */}
        <text
          x={(leftPx + rightPx) / 2}
          y={axisY + 18}
          textAnchor="middle"
          fill="#f59e0b"
          fontSize="12"
          fontStyle="italic"
          clipPath="url(#sec-clip)"
        >
          Δt
        </text>

        {/* ── secant line ── */}
        {Math.abs(dt) > 0.5 && (
          <line
            x1={sx0} y1={sy0} x2={sx1} y2={sy1}
            stroke="#a78bfa" strokeWidth="2" strokeDasharray="8 4"
            clipPath="url(#sec-clip)"
          />
        )}

        {/* ── population curve ── */}
        <path d={pathData} stroke="#6366f1" strokeWidth="2.5" fill="none"
          clipPath="url(#sec-clip)" strokeLinejoin="round" />

        {/* ── draggable point 0 ── */}
        <circle
          cx={px0} cy={py0} r={8}
          fill="#f59e0b" stroke="#fff" strokeWidth="2"
          clipPath="url(#sec-clip)"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={() => { dragging.current = 0; }}
          onTouchStart={() => { dragging.current = 0; }}
        />

        {/* ── draggable point 1 ── */}
        <circle
          cx={px1} cy={py1} r={8}
          fill="#10b981" stroke="#fff" strokeWidth="2"
          clipPath="url(#sec-clip)"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={() => { dragging.current = 1; }}
          onTouchStart={() => { dragging.current = 1; }}
        />

        {/* ── axis tick labels ── */}
        {X_TICKS.map(x => (
          <text key={`tx${x}`} x={toPixX(x)} y={PAD_T + PLOT_H + 18}
            textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="11">
            {x}
          </text>
        ))}
        {Y_TICKS.map(y => (
          <text key={`ty${y}`} x={PAD_L - 6} y={toPixY(y) + 4}
            textAnchor="end" fill="rgba(148,163,184,0.75)" fontSize="11">
            {y}
          </text>
        ))}

        {/* ── axis labels ── */}
        <text x={PAD_L + PLOT_W / 2} y={SVG_H - 4}
          textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="12">
          Day
        </text>
        <text
          x={14} y={PAD_T + PLOT_H / 2}
          textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="12"
          transform={`rotate(-90, 14, ${PAD_T + PLOT_H / 2})`}
        >
          Population
        </text>

        {/* ── legend ── */}
        <rect x={PAD_L + 8} y={PAD_T + 8} width={170} height={54} rx={6}
          fill="rgba(15,23,42,0.75)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={PAD_L + 20} y1={PAD_T + 22} x2={PAD_L + 40} y2={PAD_T + 22}
          stroke="#6366f1" strokeWidth="2.5" />
        <text x={PAD_L + 46} y={PAD_T + 26} fill="#6366f1" fontSize="12">Squirrel population</text>
        <line x1={PAD_L + 20} y1={PAD_T + 40} x2={PAD_L + 40} y2={PAD_T + 40}
          stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 3" />
        <text x={PAD_L + 46} y={PAD_T + 44} fill="#a78bfa" fontSize="12">Secant (avg. rate)</text>

        {/* ── border ── */}
        <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H}
          fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
      </svg>

      {/* ── Readout ── */}
      <div
        className="flex items-center justify-center gap-x-6 gap-y-1 mt-3 font-mono"
        style={{ fontSize: `${0.9 * uiScale}rem` }}
      >
        <span className='flex items-baseline'>
          <span style={{ color: '#f59e0b' }}>Δt</span>
          <span className="tc2 font-courier ml-2"> = {Math.abs(dt).toFixed(1)} days</span>
        </span>
        <span className='flex items-baseline'>
          <span style={{ color: '#10b981' }}>Δpop</span>
          <span className="tc2 font-courier ml-2"> = {Math.abs(dy).toFixed(1)}</span>
					<span className="tc2 ml-2"> squirrels</span>
        </span>
        <span className='flex items-baseline'>
          <span style={{ color: '#a78bfa' }}>rate</span>
          <span className="tc2 mx-2"> = </span>
          <span style={{ color: '#a78bfa' }} className='font-courier tc2'>{slope.toFixed(1)}</span>
          <span className="tc2 ml-2"> squirrels/day</span>
        </span>
      </div>

      <p className="tc2 opacity-50 mt-2" style={{ fontSize: `${0.75 * uiScale}rem` }}>
        Drag the amber or green dot left / right along the curve
      </p>
    </div>
  );
}

export { SecantExample };
export default SecantExample;
