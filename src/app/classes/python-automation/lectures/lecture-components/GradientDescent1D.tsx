'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ── Predefined equations ── */
const EQUATIONS_1D = [
  {
    label: 'x⁴/4 − x²',
    fn:  (x: number) => (x ** 4) / 4 - x * x,
    dfn: (x: number) => x ** 3 - 2 * x,
  },
  {
    label: '(x²−1)²/6',
    fn:  (x: number) => ((x * x - 1) ** 2) / 6,
    dfn: (x: number) => (2 * x * (x * x - 1)) / 3,
  },
  {
    label: '½sin(2x)+x²/10',
    fn:  (x: number) => 0.5 * Math.sin(2 * x) + (x * x) / 10,
    dfn: (x: number) => Math.cos(2 * x) + x / 5,
  },
  {
    label: 'x²/2',
    fn:  (x: number) => (x * x) / 2,
    dfn: (x: number) => x,
  },
];

/* ── SVG Layout ── */
const SVG_W = 560;
const SVG_H = 320;
const PAD_L = 52;
const PAD_R = 24;
const PAD_T = 20;
const PAD_B = 44;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;
const SAMPLES = 400;

const X_MIN = -2.4, X_MAX = 2.4;
const Y_MIN = -1.2, Y_MAX = 4.0;

function toPixX(x: number) { return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W; }
function toPixY(y: number) { return PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

const X_TICKS = [-2, -1, 0, 1, 2];
const Y_TICKS = [-1, 0, 1, 2, 3, 4];

interface GradientDescent1DProps {
  className?: string;
  displayMode?: 'scrollable' | 'slideshow';
}

function GradientDescent1D({ className = '', displayMode = 'scrollable' }: GradientDescent1DProps) {
  const INITIAL_X = 2.1;
  const [eqIdx, setEqIdx]     = useState(0);
  const eq = EQUATIONS_1D[eqIdx];
  const [x, setX]         = useState(INITIAL_X);
  const [eta, setEta]     = useState(0.08);
  const [history, setHistory] = useState<number[]>([INITIAL_X]);
  const [running, setRunning] = useState(false);
  const runRef = useRef(false);

  const handleEqChange = useCallback((idx: number) => {
    setEqIdx(idx);
    setX(INITIAL_X);
    setHistory([INITIAL_X]);
    setRunning(false);
    runRef.current = false;
  }, []);

  /* Responsive scaling */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(500);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(2.0, Math.max(0.65, containerW / 500));
  const fs = (b: number) => Math.round(b * scale);

  /* Curve path */
  const curvePath = useMemo(() => {
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const cx = X_MIN + (i / SAMPLES) * (X_MAX - X_MIN);
      const cy = clamp(eq.fn(cx), Y_MIN - 0.5, Y_MAX + 0.5);
      const px = toPixX(cx), py = toPixY(cy);
      d += i === 0 ? `M${px.toFixed(1)},${py.toFixed(1)}` : ` L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return d;
  }, [eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const takeStep = useCallback(() => {
    setX(prev => {
      const grad = eq.dfn(prev);
      const next = clamp(prev - eta * grad, X_MIN + 0.02, X_MAX - 0.02);
      setHistory(h => [...h.slice(-80), next]);
      return next;
    });
  }, [eta, eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    // randomize initial x over range of plot
    const initialX = X_MIN + Math.random() * (X_MAX - X_MIN);
    setX(initialX);
    setHistory([initialX]);
    setRunning(false);
    runRef.current = false;
  }, []);

  /* Auto-run */
  useEffect(() => {
    if (!running) { runRef.current = false; return; }
    runRef.current = true;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!runRef.current) return;
      setX(prev => {
        const grad = eq.dfn(prev);
        if (Math.abs(grad) < 1e-5) { setRunning(false); runRef.current = false; return prev; }
        const next = clamp(prev - eta * grad, X_MIN + 0.02, X_MAX - 0.02);
        setHistory(h => [...h.slice(-80), next]);
        return next;
      });
      if (runRef.current) timeout = setTimeout(tick, 110);
    };
    timeout = setTimeout(tick, 110);
    return () => { clearTimeout(timeout); runRef.current = false; };
  }, [running, eta, eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Derived values */
  const fy   = eq.fn(x);
  const grad = eq.dfn(x);
  const nextX = clamp(x - eta * grad, X_MIN + 0.02, X_MAX - 0.02);
  const nextY = eq.fn(nextX);

  /* Tangent line endpoints */
  const tHalf = (X_MAX - X_MIN) * 0.12;
  const tx1 = x - tHalf, tx2 = x + tHalf;
  const ty1 = fy + grad * (tx1 - x), ty2 = fy + grad * (tx2 - x);

  const px  = toPixX(x),     py  = toPixY(fy);
  const npx = toPixX(nextX), npy = toPixY(nextY);
  const axisY = toPixY(0),   axisX = toPixX(0);

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '100%', height: 'auto', userSelect: 'none' }}
        className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a]/70"
      >
        <defs>
          <clipPath id="gd1-clip">
            <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H} />
          </clipPath>
          <marker id="gd1-arrow" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="#10b981" />
          </marker>
        </defs>

        {/* Grid */}
        {X_TICKS.map(tx => (
          <line key={`gx${tx}`} x1={toPixX(tx)} y1={PAD_T} x2={toPixX(tx)} y2={PAD_T + PLOT_H}
            stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
        ))}
        {Y_TICKS.map(ty => (
          <line key={`gy${ty}`} x1={PAD_L} y1={toPixY(ty)} x2={PAD_L + PLOT_W} y2={toPixY(ty)}
            stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
        ))}

        {/* Axes */}
        {axisY >= PAD_T && axisY <= PAD_T + PLOT_H && (
          <line x1={PAD_L} y1={axisY} x2={PAD_L + PLOT_W} y2={axisY}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
        )}
        {axisX >= PAD_L && axisX <= PAD_L + PLOT_W && (
          <line x1={axisX} y1={PAD_T} x2={axisX} y2={PAD_T + PLOT_H}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
        )}

        {/* Tick labels */}
        {X_TICKS.map(tx => (
          <text key={`xt${tx}`} x={toPixX(tx)} y={PAD_T + PLOT_H + 16}
            textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize={fs(11)}>{tx}</text>
        ))}
        {Y_TICKS.filter(ty => ty !== 0).map(ty => (
          <text key={`yt${ty}`} x={PAD_L - 7} y={toPixY(ty) + 4}
            textAnchor="end" fill="rgba(148,163,184,0.65)" fontSize={fs(10)}>{ty}</text>
        ))}

        {/* History dots */}
        {history.slice(0, -1).map((hx, i) => (
          <circle key={i} cx={toPixX(hx)} cy={toPixY(clamp(eq.fn(hx), Y_MIN, Y_MAX))}
            r={3.5} fill={`rgba(99,102,241,${0.2 + 0.5 * (i / history.length)})`}
            clipPath="url(#gd1-clip)" />
        ))}

        {/* Tangent line */}
        <line
          x1={toPixX(tx1)} y1={toPixY(ty1)}
          x2={toPixX(tx2)} y2={toPixY(ty2)}
          stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3"
          clipPath="url(#gd1-clip)"
        />

        {/* Arrow to next point */}
        {Math.abs(nextX - x) > 0.02 && (
          <line
            x1={px} y1={py} x2={npx} y2={npy}
            stroke="#10b981" strokeWidth="2.2" strokeDasharray="5 3"
            markerEnd="url(#gd1-arrow)"
            clipPath="url(#gd1-clip)"
          />
        )}

        {/* Curve */}
        <path d={curvePath} stroke="#6366f1" strokeWidth="2.5" fill="none"
          clipPath="url(#gd1-clip)" />

        {/* Next point (preview) */}
        {Math.abs(nextX - x) > 0.02 && (
          <circle cx={npx} cy={npy} r={5.5} fill="none" stroke="#10b981" strokeWidth="2"
            clipPath="url(#gd1-clip)" />
        )}

        {/* Current point */}
        <circle cx={px} cy={py} r={7} fill="#f59e0b" stroke="#fff" strokeWidth="1.5"
          clipPath="url(#gd1-clip)" />

        {/* Legend */}
        <rect x={PAD_L + 6} y={PAD_T + 6} width={210} height={66} rx={5}
          className="fill-white/90 dark:fill-[#0f172a]/78" />
        <line x1={PAD_L + 16} y1={PAD_T + 20} x2={PAD_L + 34} y2={PAD_T + 20}
          stroke="#6366f1" strokeWidth="2.5" />
        <text x={PAD_L + 39} y={PAD_T + 24} className="fill-slate-600 dark:fill-slate-400/90 tc5" fontSize={fs(11)}>f(x) = {eq.label}</text>
        <line x1={PAD_L + 16} y1={PAD_T + 38} x2={PAD_L + 34} y2={PAD_T + 38}
          stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
        <text x={PAD_L + 39} y={PAD_T + 42} className="fill-slate-600 dark:fill-slate-400/90 tc5" fontSize={fs(11)}>Tangent at x₀</text>
        <line x1={PAD_L + 16} y1={PAD_T + 56} x2={PAD_L + 34} y2={PAD_T + 56}
          stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
        <text x={PAD_L + 39} y={PAD_T + 60} className="fill-slate-600 dark:fill-slate-400/90 tc5" fontSize={fs(11)}>Gradient step x₁</text>

        {/* Border */}
        <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H}
          fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
      </svg>

      {/* Readout */}
      <div className="grid grid-cols-4 gap-2 mt-3 w-full max-w-lg text-center font-courier"
        style={{ fontSize: `${0.78 * scale}rem` }}>
        {[
          { label: 'x',     val: x.toFixed(5) },
          { label: 'f(x)',  val: eq.fn(x).toFixed(5) },
          { label: "f′(x)", val: eq.dfn(x).toFixed(5) },
          { label: 'steps', val: String(history.length - 1) },
        ].map(({ label, val }) => (
          <div key={label} className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1.5">
            <div className="opacity-50 text-xs mb-0.5">{label}</div>
            <div className="tc1 truncate">{val}</div>
          </div>
        ))}
      </div>

      {/* Equation selector */}
      <div className="flex gap-1.5 flex-wrap justify-center mt-3 w-full max-w-lg">
        {EQUATIONS_1D.map((eqOpt, i) => (
          <button key={i} onClick={() => handleEqChange(i)}
            className={`px-3 py-1 rounded-lg border text-xs font-courier transition-colors select-none ${
              eqIdx === i
                ? 'bg-indigo-500/40 border-indigo-400/60 tc1'
                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/15 tc2 hover:bg-black/10 dark:hover:bg-white/10'
            }`}>
            {eqOpt.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2.5 mt-2 w-full max-w-lg"
        style={{ fontSize: `${0.875 * scale}rem` }}>
        <div className="flex items-center gap-3 w-full">
          <span className="opacity-60 shrink-0 whitespace-nowrap">η (learning rate)</span>
          <input type="range" min={0.005} max={0.36} step={0.005} value={eta}
            onChange={e => setEta(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-400" />
          <span className="font-courier w-14 text-right opacity-80">{eta.toFixed(3)}</span>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={takeStep}
            className="px-5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 tc1 hover:bg-indigo-500/30 transition-colors select-none">
            Step
          </button>
          <button onClick={() => setRunning(r => !r)}
            className="px-5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 tc1 hover:bg-emerald-500/30 transition-colors select-none">
            {running ? 'Pause' : 'Run'}
          </button>
          <button onClick={reset}
            className="px-5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 tc2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors select-none">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export { GradientDescent1D };
export default GradientDescent1D;
