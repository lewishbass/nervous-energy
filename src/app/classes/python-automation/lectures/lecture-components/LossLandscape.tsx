'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ── Fixed dataset (roughly y ≈ 2x, no intercept) ── */
const DATA = [
  { x: 0.5, y: 1.1 },
  { x: 1.2, y: 4.6 },
  { x: 2.0, y: 3.9 },
  { x: 2.8, y: 4.2},
  { x: 3.5, y: 7.0 },
  { x: 4.2, y: 9.4 },
  { x: 5.0, y: 10.2 },
];

/* ── Loss and gradient (slope only, no intercept for 1-D visualization) ── */
function mse(m: number) {
  return DATA.reduce((s, p) => s + (p.y - m * p.x) ** 2, 0) / DATA.length;
}
function dMse(m: number) {
  return DATA.reduce((s, p) => s + -2 * p.x * (p.y - m * p.x), 0) / DATA.length;
}

/* ── SVG layout (shared) ── */
const SVG_W = 440, SVG_H = 280;
const PAD = { t: 18, r: 18, b: 38, l: 46 };
const PW = SVG_W - PAD.l - PAD.r;
const PH = SVG_H - PAD.t - PAD.b;

/* ── Scatter plot bounds ── */
const SX_MIN = 0, SX_MAX = 5.5;
const SY_MIN = 0, SY_MAX = 12;

/* ── Loss curve bounds ── */
const M_MIN = -0.5, M_MAX = 4.5;
const L_MIN = 0, L_MAX = 55;

const SAMPLES = 300;
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

/* Scatter coord transforms */
const sToPixX = (x: number) => PAD.l + ((x - SX_MIN) / (SX_MAX - SX_MIN)) * PW;
const sToPixY = (y: number) => PAD.t + ((SY_MAX - y) / (SY_MAX - SY_MIN)) * PH;

/* Loss coord transforms */
const lToPixX = (m: number) => PAD.l + ((m - M_MIN) / (M_MAX - M_MIN)) * PW;
const lToPixY = (l: number) => PAD.t + ((L_MAX - l) / (L_MAX - L_MIN)) * PH;

const S_X_TICKS = [0, 1, 2, 3, 4, 5];
const S_Y_TICKS = [0, 2, 4, 6, 8, 10, 12];
const M_TICKS   = [0, 1, 2, 3, 4];
const L_TICKS   = [0, 10, 20, 30, 40, 50];

interface LossLandscapeProps {
  className?: string;
}

function LossLandscape({ className = '' }: LossLandscapeProps) {
  const INITIAL_M = 3.5;
  const [m, setM]         = useState(INITIAL_M);
  const [eta, setEta]     = useState(0.04);
  const [history, setHistory] = useState<number[]>([INITIAL_M]);
  const [running, setRunning] = useState(false);
  const runRef = useRef(false);

  /* Responsive scaling */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(900);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1.8, Math.max(0.55, containerW / 900));
  const fs = (b: number) => Math.round(b * scale);

  /* Step */
  const takeStep = useCallback(() => {
    setM(prev => {
      const grad = dMse(prev);
      const next = clamp(prev - eta * grad, M_MIN + 0.01, M_MAX - 0.01);
      setHistory(h => [...h.slice(-80), next]);
      return next;
    });
  }, [eta]);

  const reset = useCallback(() => {
    const init = M_MIN + Math.random() * (M_MAX - M_MIN);
    setM(init);
    setHistory([init]);
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
      setM(prev => {
        const grad = dMse(prev);
        if (Math.abs(grad) < 1e-5) { setRunning(false); runRef.current = false; return prev; }
        const next = clamp(prev - eta * grad, M_MIN + 0.01, M_MAX - 0.01);
        setHistory(h => [...h.slice(-80), next]);
        return next;
      });
      if (runRef.current) timeout = setTimeout(tick, 100);
    };
    timeout = setTimeout(tick, 100);
    return () => { clearTimeout(timeout); runRef.current = false; };
  }, [running, eta]);

  /* Loss curve path */
  const lossCurvePath = useMemo(() => {
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const mi = M_MIN + (i / SAMPLES) * (M_MAX - M_MIN);
      const li = clamp(mse(mi), L_MIN - 2, L_MAX + 2);
      const px = lToPixX(mi), py = lToPixY(li);
      d += i === 0 ? `M${px.toFixed(1)},${py.toFixed(1)}` : ` L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return d;
  }, []);

  /* Regression line path */
  const regPath = (() => {
    const x0 = SX_MIN, x1 = SX_MAX;
    return `M${sToPixX(x0).toFixed(1)},${sToPixY(m * x0).toFixed(1)} L${sToPixX(x1).toFixed(1)},${sToPixY(m * x1).toFixed(1)}`;
  })();

  /* Current loss */
  const curLoss = mse(m);
  const px_m = lToPixX(m);
  const py_l = lToPixY(clamp(curLoss, L_MIN, L_MAX));

  const nextM = clamp(m - eta * dMse(m), M_MIN + 0.01, M_MAX - 0.01);
  const npx_m = lToPixX(nextM);
  const npy_l = lToPixY(clamp(mse(nextM), L_MIN, L_MAX));

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <div className="flex flex-wrap justify-center gap-3 w-full">

        {/* ── Left: Scatter + regression line ── */}
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '47%', minWidth: 240, height: 'auto', userSelect: 'none' }}
          className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a]/70">
          <defs>
            <clipPath id="ll-scatter-clip">
              <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
            </clipPath>
          </defs>

          {/* Grid */}
          {S_X_TICKS.map(tx => (
            <line key={`sgx${tx}`} x1={sToPixX(tx)} y1={PAD.t} x2={sToPixX(tx)} y2={PAD.t + PH}
              stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}
          {S_Y_TICKS.map(ty => (
            <line key={`sgy${ty}`} x1={PAD.l} y1={sToPixY(ty)} x2={PAD.l + PW} y2={sToPixY(ty)}
              stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={PAD.l} y1={sToPixY(0)} x2={PAD.l + PW} y2={sToPixY(0)}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
          <line x1={sToPixX(0)} y1={PAD.t} x2={sToPixX(0)} y2={PAD.t + PH}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />

          {/* Tick labels */}
          {S_X_TICKS.map(tx => (
            <text key={`sxt${tx}`} x={sToPixX(tx)} y={PAD.t + PH + 14}
              textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize={fs(10)}>{tx}</text>
          ))}
          {S_Y_TICKS.filter(ty => ty !== 0).map(ty => (
            <text key={`syt${ty}`} x={PAD.l - 7} y={sToPixY(ty) + 4}
              textAnchor="end" fill="rgba(148,163,184,0.65)" fontSize={fs(9)}>{ty}</text>
          ))}
          <text x={PAD.l + PW / 2} y={PAD.t + PH + 32}
            textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize={fs(10)}>x</text>
          <text x={14} y={PAD.t + PH / 2}
            textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize={fs(10)}
            transform={`rotate(-90, 14, ${PAD.t + PH / 2})`}>y</text>

          {/* Residuals */}
          {DATA.map((p, i) => {
            const px = sToPixX(p.x), py_data = sToPixY(p.y);
            const py_pred = sToPixY(clamp(m * p.x, SY_MIN - 2, SY_MAX + 2));
            return (
              <line key={`res${i}`} x1={px} y1={py_data} x2={px} y2={py_pred}
                stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2"
                clipPath="url(#ll-scatter-clip)" />
            );
          })}

          {/* Regression line */}
          <path d={regPath} stroke="#6366f1" strokeWidth="2.2" fill="none"
            clipPath="url(#ll-scatter-clip)" />

          {/* Data points */}
          {DATA.map((p, i) => (
            <circle key={`dp${i}`} cx={sToPixX(p.x)} cy={sToPixY(p.y)}
              r={5} fill="#10b981" stroke="#fff" strokeWidth="1.2"
              clipPath="url(#ll-scatter-clip)" />
          ))}

          {/* Legend */}
          <rect x={PAD.l + 6} y={PAD.t + 6} width={150} height={52} rx={4}
            className="fill-white/90 dark:fill-[#0f172a]/78" />
          <circle cx={PAD.l + 17} cy={PAD.t + 20} r={5} fill="#10b981" stroke="#fff" strokeWidth="1" />
          <text x={PAD.l + 26} y={PAD.t + 24} className="fill-slate-600 dark:fill-slate-400/90" fontSize={fs(10)}>Data</text>
          <line x1={PAD.l + 12} y1={PAD.t + 38} x2={PAD.l + 26} y2={PAD.t + 38}
            stroke="#6366f1" strokeWidth="2.2" />
          <text x={PAD.l + 30} y={PAD.t + 42} className="fill-slate-600 dark:fill-slate-400/90" fontSize={fs(10)}>ŷ = {m.toFixed(2)}x</text>
          <line x1={PAD.l + 12} y1={PAD.t + 54} x2={PAD.l + 26} y2={PAD.t + 54}
            stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
          <text x={PAD.l + 30} y={PAD.t + 58} className="fill-slate-600 dark:fill-slate-400/90" fontSize={fs(10)}>Residuals</text>

          {/* Border */}
          <rect x={PAD.l} y={PAD.t} width={PW} height={PH}
            fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        </svg>

        {/* ── Right: Loss curve ── */}
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '47%', minWidth: 240, height: 'auto', userSelect: 'none' }}
          className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a]/70">
          <defs>
            <clipPath id="ll-loss-clip">
              <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
            </clipPath>
            <marker id="ll-arrow" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 7 3, 0 6" fill="#10b981" />
            </marker>
          </defs>

          {/* Grid */}
          {M_TICKS.map(tx => (
            <line key={`lgx${tx}`} x1={lToPixX(tx)} y1={PAD.t} x2={lToPixX(tx)} y2={PAD.t + PH}
              stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}
          {L_TICKS.map(ty => (
            <line key={`lgy${ty}`} x1={PAD.l} y1={lToPixY(ty)} x2={PAD.l + PW} y2={lToPixY(ty)}
              stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
            stroke="rgba(148,163,184,0.35)" strokeWidth="1" />

          {/* Tick labels */}
          {M_TICKS.map(tx => (
            <text key={`mxt${tx}`} x={lToPixX(tx)} y={PAD.t + PH + 14}
              textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize={fs(10)}>{tx}</text>
          ))}
          {L_TICKS.filter((_, i) => i > 0).map(ty => (
            <text key={`lyt${ty}`} x={PAD.l - 7} y={lToPixY(ty) + 4}
              textAnchor="end" fill="rgba(148,163,184,0.65)" fontSize={fs(9)}>{ty}</text>
          ))}
          <text x={PAD.l + PW / 2} y={PAD.t + PH + 32}
            textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize={fs(10)}>slope m</text>
          <text x={14} y={PAD.t + PH / 2}
            textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize={fs(10)}
            transform={`rotate(-90, 14, ${PAD.t + PH / 2})`}>MSE Loss</text>

          {/* History trail */}
          {history.slice(0, -1).map((hm, i) => (
            <circle key={i} cx={lToPixX(hm)} cy={lToPixY(clamp(mse(hm), L_MIN, L_MAX))}
              r={3} fill={`rgba(99,102,241,${0.2 + 0.6 * (i / history.length)})`}
              clipPath="url(#ll-loss-clip)" />
          ))}

          {/* Loss curve */}
          <path d={lossCurvePath} stroke="#f59e0b" strokeWidth="2.5" fill="none"
            clipPath="url(#ll-loss-clip)" />

          {/* Arrow to next step */}
          {Math.abs(nextM - m) > 0.01 && (
            <line x1={px_m} y1={py_l} x2={npx_m} y2={npy_l}
              stroke="#10b981" strokeWidth="2" strokeDasharray="5 3"
              markerEnd="url(#ll-arrow)" clipPath="url(#ll-loss-clip)" />
          )}

          {/* Current point */}
          <circle cx={px_m} cy={py_l} r={7} fill="#6366f1" stroke="#fff" strokeWidth="1.5"
            clipPath="url(#ll-loss-clip)" />

          {/* Minimum marker */}
          <line x1={lToPixX(2.007)} y1={PAD.t} x2={lToPixX(2.007)} y2={PAD.t + PH}
            stroke="rgba(16,185,129,0.35)" strokeWidth="1" strokeDasharray="5 4"
            clipPath="url(#ll-loss-clip)" />
          <text x={lToPixX(2.007) + 4} y={PAD.t + 14}
            fill="rgba(16,185,129,0.7)" fontSize={fs(9)}>min</text>

          {/* Legend */}
          <rect x={PAD.l + 6} y={PAD.t + 6} width={130} height={38} rx={4}
            className="fill-white/90 dark:fill-[#0f172a]/78" />
          <line x1={PAD.l + 12} y1={PAD.t + 20} x2={PAD.l + 26} y2={PAD.t + 20}
            stroke="#f59e0b" strokeWidth="2.5" />
          <text x={PAD.l + 30} y={PAD.t + 24} className="fill-slate-600 dark:fill-slate-400/90" fontSize={fs(10)}>Loss(m)</text>
          <circle cx={PAD.l + 17} cy={PAD.t + 36} r={5} fill="#6366f1" stroke="#fff" strokeWidth="1" />
          <text x={PAD.l + 30} y={PAD.t + 40} className="fill-slate-600 dark:fill-slate-400/90" fontSize={fs(10)}>Current m</text>

          {/* Border */}
          <rect x={PAD.l} y={PAD.t} width={PW} height={PH}
            fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        </svg>
      </div>

      {/* Readout */}
      <div className="grid grid-cols-3 gap-2 mt-3 w-full max-w-lg text-center font-courier"
        style={{ fontSize: `${0.78 * scale}rem` }}>
        {[
          { label: 'm (slope)', val: m.toFixed(4) },
          { label: 'MSE Loss',  val: curLoss.toFixed(4) },
          { label: 'steps',     val: String(history.length - 1) },
        ].map(({ label, val }) => (
          <div key={label} className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1.5">
            <div className="opacity-50 text-xs mb-0.5">{label}</div>
            <div className="tc1 truncate">{val}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2.5 mt-2 w-full max-w-lg"
        style={{ fontSize: `${0.875 * scale}rem` }}>
        <div className="flex items-center gap-3 w-full">
          <span className="opacity-60 shrink-0 whitespace-nowrap">η (learning rate)</span>
          <input type="range" min={0.002} max={0.12} step={0.002} value={eta}
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

export { LossLandscape };
export default LossLandscape;
