'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ──────────────────────────────────────────────
   Function with multiple local minima
────────────────────────────────────────────── */
const fn  = (x: number) => 0.08 * x ** 2 - 1.5 * Math.cos(1.8 * x) - 0.4 * Math.cos(4.5 * x);
const dfn = (x: number) => 0.16 * x + 1.5 * 1.8 * Math.sin(1.8 * x) + 0.4 * 4.5 * Math.sin(4.5 * x);

/* ── SVG layout ── */
const SVG_W = 560, SVG_H = 300;
const PAD = { t: 20, r: 20, b: 40, l: 48 };
const PW = SVG_W - PAD.l - PAD.r;
const PH = SVG_H - PAD.t - PAD.b;

const X_MIN = -6, X_MAX = 6;
const Y_MIN = -2.2, Y_MAX = 3.0;
const SAMPLES = 500;
const X_TICKS = [-6, -4, -2, 0, 2, 4, 6];
const Y_TICKS = [-2, -1, 0, 1, 2, 3];

const toPixX = (x: number) => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
const toPixY = (y: number) => PAD.t + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PH;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function SimulatedAnnealing({ className = '' }: { className?: string }) {
  const INITIAL_X = 5.0;
  const [x, setX]           = useState(INITIAL_X);
  const [eta, setEta]        = useState(0.06);
  const [temp, setTemp]      = useState(0);        // current temperature
  const [initTemp, setInitTemp] = useState(2.0);   // starting temperature
  const [cooling, setCooling]   = useState(0.95);  // cooling rate
  const [history, setHistory]   = useState<{x: number; accepted: boolean}[]>([{ x: INITIAL_X, accepted: true }]);
  const [running, setRunning]   = useState(false);
  const [mode, setMode]         = useState<'gd' | 'sa'>('gd');
  const [stepCount, setStepCount] = useState(0);
  const runRef = useRef(false);
  const tempRef = useRef(0);

  /* Responsive */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(500);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(2.0, Math.max(0.6, containerW / 500));
  const fs = (b: number) => Math.round(b * scale);

  /* Curve path */
  const curvePath = useMemo(() => {
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const cx = X_MIN + (i / SAMPLES) * (X_MAX - X_MIN);
      const cy = clamp(fn(cx), Y_MIN - 0.5, Y_MAX + 0.5);
      const px = toPixX(cx), py = toPixY(cy);
      d += i === 0 ? `M${px.toFixed(1)},${py.toFixed(1)}` : ` L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return d;
  }, []);

  const takeStep = useCallback(() => {
    if (mode === 'gd') {
      setX(prev => {
        const next = clamp(prev - eta * dfn(prev), X_MIN + 0.01, X_MAX - 0.01);
        setHistory(h => [...h.slice(-100), { x: next, accepted: true }]);
        setStepCount(c => c + 1);
        return next;
      });
    } else {
      // Simulated annealing step
      setX(prev => {
        const T = tempRef.current;
        const proposal = clamp(prev + (Math.random() - 0.5) * 2.5 * Math.max(T, 0.01), X_MIN + 0.01, X_MAX - 0.01);
        const delta = fn(proposal) - fn(prev);
        const accepted = delta < 0 || Math.random() < Math.exp(-delta / Math.max(T, 1e-8));
        const next = accepted ? proposal : prev;
        const newT = T * cooling;
        tempRef.current = newT;
        setTemp(newT);
        setHistory(h => [...h.slice(-100), { x: next, accepted }]);
        setStepCount(c => c + 1);
        return next;
      });
    }
  }, [mode, eta, cooling]);

  const reset = useCallback(() => {
    const initX = X_MIN + Math.random() * (X_MAX - X_MIN);
    setX(initX);
    setHistory([{ x: initX, accepted: true }]);
    setRunning(false);
    setStepCount(0);
    runRef.current = false;
    const T = mode === 'sa' ? initTemp : 0;
    tempRef.current = T;
    setTemp(T);
  }, [mode, initTemp]);

  /* When mode changes, reset */
  useEffect(() => { reset(); }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Auto-run */
  useEffect(() => {
    if (!running) { runRef.current = false; return; }
    runRef.current = true;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!runRef.current) return;
      takeStep();
      if (runRef.current) timeout = setTimeout(tick, 120);
    };
    timeout = setTimeout(tick, 120);
    return () => { clearTimeout(timeout); runRef.current = false; };
  }, [running, takeStep]);

  /* Derived */
  const fy = fn(x);
  const grad = dfn(x);
  const px = toPixX(x), py = toPixY(clamp(fy, Y_MIN, Y_MAX));

  /* Tangent endpoints */
  const tHalf = (X_MAX - X_MIN) * 0.10;
  const tx1 = x - tHalf, tx2 = x + tHalf;
  const ty1 = fy + grad * (tx1 - x);
  const ty2 = fy + grad * (tx2 - x);

  /* Next GD step arrow */
  const nextX_gd = clamp(x - eta * grad, X_MIN + 0.01, X_MAX - 0.01);
  const npx = toPixX(nextX_gd), npy = toPixY(clamp(fn(nextX_gd), Y_MIN, Y_MAX));

  /* Temperature bar (for SA mode) */
  const maxBarH = PH * 0.6;
  const barH = mode === 'sa' ? Math.min(maxBarH, (temp / initTemp) * maxBarH) : 0;
  const barX = PAD.l + PW + 6, barY = PAD.t + PH / 2 - maxBarH / 2;

  const lastEntry = history[history.length - 1];

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-3">
        {(['gd', 'sa'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors select-none ${
              mode === m
                ? 'bg-indigo-500/40 border-indigo-400/60 tc1'
                : 'bg-white/5 border-white/15 tc2 hover:bg-white/10'
            }`}>
            {m === 'gd' ? 'Gradient Descent' : 'Simulated Annealing'}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${SVG_W + (mode === 'sa' ? 28 : 0)} ${SVG_H}`}
        style={{ width: '100%', height: 'auto', userSelect: 'none' }}
        className="rounded-xl border border-white/10 bg-[#0f172a]/70">
        <defs>
          <clipPath id="sa-clip">
            <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
          </clipPath>
          <marker id="sa-arrow" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="#10b981" />
          </marker>
        </defs>

        {/* Grid */}
        {X_TICKS.map(tx => (
          <line key={`gx${tx}`} x1={toPixX(tx)} y1={PAD.t} x2={toPixX(tx)} y2={PAD.t + PH}
            stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
        ))}
        {Y_TICKS.map(ty => (
          <line key={`gy${ty}`} x1={PAD.l} y1={toPixY(ty)} x2={PAD.l + PW} y2={toPixY(ty)}
            stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
        ))}

        {/* Axes */}
        <line x1={PAD.l} y1={toPixY(0)} x2={PAD.l + PW} y2={toPixY(0)}
          stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
        <line x1={toPixX(0)} y1={PAD.t} x2={toPixX(0)} y2={PAD.t + PH}
          stroke="rgba(148,163,184,0.35)" strokeWidth="1" />

        {/* Tick labels */}
        {X_TICKS.map(tx => (
          <text key={`xt${tx}`} x={toPixX(tx)} y={PAD.t + PH + 14}
            textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize={fs(10)}>{tx}</text>
        ))}
        {Y_TICKS.filter(ty => ty !== 0).map(ty => (
          <text key={`yt${ty}`} x={PAD.l - 7} y={toPixY(ty) + 4}
            textAnchor="end" fill="rgba(148,163,184,0.65)" fontSize={fs(9)}>{ty}</text>
        ))}
        <text x={PAD.l + PW / 2} y={PAD.t + PH + 32}
          textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize={fs(10)}>x</text>

        {/* History trail */}
        {history.slice(0, -1).map((h, i) => (
          <circle key={i}
            cx={toPixX(h.x)} cy={toPixY(clamp(fn(h.x), Y_MIN, Y_MAX))}
            r={mode === 'sa' && !h.accepted ? 2.5 : 3}
            fill={mode === 'sa'
              ? (h.accepted ? `rgba(99,102,241,${0.15 + 0.6 * (i / history.length)})` : 'rgba(239,68,68,0.25)')
              : `rgba(99,102,241,${0.15 + 0.6 * (i / history.length)})`}
            clipPath="url(#sa-clip)" />
        ))}

        {/* Tangent (GD mode only) */}
        {mode === 'gd' && (
          <line x1={toPixX(tx1)} y1={toPixY(ty1)} x2={toPixX(tx2)} y2={toPixY(ty2)}
            stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3"
            clipPath="url(#sa-clip)" />
        )}

        {/* GD arrow */}
        {mode === 'gd' && Math.abs(nextX_gd - x) > 0.02 && (
          <line x1={px} y1={py} x2={npx} y2={npy}
            stroke="#10b981" strokeWidth="2" strokeDasharray="5 3"
            markerEnd="url(#sa-arrow)" clipPath="url(#sa-clip)" />
        )}

        {/* Function curve */}
        <path d={curvePath} stroke="#6366f1" strokeWidth="2.5" fill="none"
          clipPath="url(#sa-clip)" />

        {/* Current point */}
        <circle cx={px} cy={py} r={7}
          fill={mode === 'sa' && lastEntry && !lastEntry.accepted ? '#ef4444' : '#f59e0b'}
          stroke="#fff" strokeWidth="1.5" clipPath="url(#sa-clip)" />

        {/* Legend */}
        <rect x={PAD.l + 6} y={PAD.t + 6} width={160} height={mode === 'gd' ? 52 : 70} rx={4}
          fill="rgba(15,23,42,0.78)" />
        <line x1={PAD.l + 12} y1={PAD.t + 20} x2={PAD.l + 28} y2={PAD.t + 20}
          stroke="#6366f1" strokeWidth="2.5" />
        <text x={PAD.l + 32} y={PAD.t + 24} fill="rgba(148,163,184,0.9)" fontSize={fs(10)}>f(x) (loss landscape)</text>
        <circle cx={PAD.l + 18} cy={PAD.t + 36} r={5} fill="#f59e0b" stroke="#fff" strokeWidth="1" />
        <text x={PAD.l + 28} y={PAD.t + 40} fill="rgba(148,163,184,0.9)" fontSize={fs(10)}>Current x</text>
        {mode === 'gd' && (
          <>
            <line x1={PAD.l + 12} y1={PAD.t + 52} x2={PAD.l + 28} y2={PAD.t + 52}
              stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
            <text x={PAD.l + 32} y={PAD.t + 56} fill="rgba(148,163,184,0.9)" fontSize={fs(10)}>Tangent</text>
          </>
        )}
        {mode === 'sa' && (
          <>
            <circle cx={PAD.l + 18} cy={PAD.t + 52} r={4} fill="rgba(99,102,241,0.7)" />
            <text x={PAD.l + 28} y={PAD.t + 56} fill="rgba(148,163,184,0.9)" fontSize={fs(10)}>Accepted</text>
            <circle cx={PAD.l + 18} cy={PAD.t + 66} r={4} fill="rgba(239,68,68,0.6)" />
            <text x={PAD.l + 28} y={PAD.t + 70} fill="rgba(148,163,184,0.9)" fontSize={fs(10)}>Rejected</text>
          </>
        )}

        {/* Temperature bar (SA mode) */}
        {mode === 'sa' && (
          <>
            <rect x={barX} y={barY} width={14} height={maxBarH} rx={3}
              fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
            <rect x={barX} y={barY + (maxBarH - barH)} width={14} height={barH} rx={3}
              fill={`rgba(239,68,68,${0.3 + 0.6 * (temp / initTemp)})`} />
            <text x={barX + 7} y={barY - 6} textAnchor="middle"
              fill="rgba(148,163,184,0.7)" fontSize={fs(8)}>T</text>
            <text x={barX + 7} y={barY + maxBarH + 14} textAnchor="middle"
              fill="rgba(148,163,184,0.7)" fontSize={fs(8)}>{temp.toFixed(2)}</text>
          </>
        )}

        {/* Border */}
        <rect x={PAD.l} y={PAD.t} width={PW} height={PH}
          fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
      </svg>

      {/* Readout */}
      <div className={`grid gap-2 mt-3 w-full max-w-lg text-center font-courier ${mode === 'sa' ? 'grid-cols-4' : 'grid-cols-3'}`}
        style={{ fontSize: `${0.78 * scale}rem` }}>
        {[
          { label: 'x',     val: x.toFixed(4) },
          { label: 'f(x)',  val: fn(x).toFixed(4) },
          { label: 'steps', val: String(stepCount) },
          ...(mode === 'sa' ? [{ label: 'temp T', val: temp.toFixed(4) }] : []),
        ].map(({ label, val }) => (
          <div key={label} className="bg-white/5 rounded-lg px-2 py-1.5">
            <div className="opacity-50 text-xs mb-0.5">{label}</div>
            <div className="tc1 truncate">{val}</div>
          </div>
        ))}
      </div>

      {/* SA extra controls */}
      {mode === 'sa' && (
        <div className="flex flex-col gap-2 mt-2 w-full max-w-lg"
          style={{ fontSize: `${0.875 * scale}rem` }}>
          <div className="flex items-center gap-3 w-full">
            <span className="opacity-60 shrink-0 whitespace-nowrap">T₀ (initial temp)</span>
            <input type="range" min={0.2} max={5} step={0.1} value={initTemp}
              onChange={e => setInitTemp(parseFloat(e.target.value))}
              className="flex-1 accent-red-400" />
            <span className="font-courier w-10 text-right opacity-80">{initTemp.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3 w-full">
            <span className="opacity-60 shrink-0 whitespace-nowrap">Cooling rate</span>
            <input type="range" min={0.80} max={0.99} step={0.01} value={cooling}
              onChange={e => setCooling(parseFloat(e.target.value))}
              className="flex-1 accent-orange-400" />
            <span className="font-courier w-10 text-right opacity-80">{cooling.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* GD learning rate */}
      {mode === 'gd' && (
        <div className="flex items-center gap-3 w-full max-w-lg mt-2"
          style={{ fontSize: `${0.875 * scale}rem` }}>
          <span className="opacity-60 shrink-0 whitespace-nowrap">η (learning rate)</span>
          <input type="range" min={0.005} max={0.3} step={0.005} value={eta}
            onChange={e => setEta(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-400" />
          <span className="font-courier w-14 text-right opacity-80">{eta.toFixed(3)}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap justify-center mt-2">
        <button onClick={takeStep}
          className="px-5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 tc1 hover:bg-indigo-500/30 transition-colors select-none">
          Step
        </button>
        <button onClick={() => setRunning(r => !r)}
          className="px-5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 tc1 hover:bg-emerald-500/30 transition-colors select-none">
          {running ? 'Pause' : 'Run'}
        </button>
        <button onClick={reset}
          className="px-5 py-1.5 rounded-lg bg-white/5 border border-white/15 tc2 hover:bg-white/10 transition-colors select-none">
          Reset
        </button>
      </div>
    </div>
  );
}

export { SimulatedAnnealing };
export default SimulatedAnnealing;
