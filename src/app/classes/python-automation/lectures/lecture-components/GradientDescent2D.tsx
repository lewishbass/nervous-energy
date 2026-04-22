'use client';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

/* ── Predefined equations ── */
const EQUATIONS_2D = [
  {
    label: 'x⁴/4−x²+y²/2',
    fn:  (x: number, y: number) => (x ** 4) / 4 - x * x + (y * y) / 2,
    dfx: (x: number, _y: number) => x ** 3 - 2 * x,
    dfy: (_x: number, y: number) => y,
    minima: [[Math.sqrt(2), 0], [-Math.sqrt(2), 0]] as [number, number][],
  },
  {
    label: 'x²+y²',
    fn:  (x: number, y: number) => x * x + y * y,
    dfx: (x: number, _y: number) => 2 * x,
    dfy: (_x: number, y: number) => 2 * y,
    minima: [[0, 0]] as [number, number][],
  },
  {
    label: '½x²+2y²',
    fn:  (x: number, y: number) => 0.5 * x * x + 2 * y * y,
    dfx: (x: number, _y: number) => x,
    dfy: (_x: number, y: number) => 4 * y,
    minima: [[0, 0]] as [number, number][],
  },
  {
    label: 'sin(πx)cos(πy)+r²/8',
    fn:  (x: number, y: number) => Math.sin(Math.PI * x) * Math.cos(Math.PI * y) + (x * x + y * y) / 8,
    dfx: (x: number, y: number) => Math.PI * Math.cos(Math.PI * x) * Math.cos(Math.PI * y) + x / 4,
    dfy: (x: number, y: number) => -Math.PI * Math.sin(Math.PI * x) * Math.sin(Math.PI * y) + y / 4,
    minima: [] as [number, number][],
  },
];

const X_MIN = -2.3, X_MAX = 2.3;
const Y_MIN = -2.0, Y_MAX = 2.0;
const CW = 480, CH = 380;
const ARROW_COLS = 14 * 3;
const ARROW_ROWS = 11 * 3;

function toPixX(x: number) { return ((x - X_MIN) / (X_MAX - X_MIN)) * CW; }
function toPixY(y: number) { return (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * CH; }
function fromPixX(px: number) { return X_MIN + (px / CW) * (X_MAX - X_MIN); }
function fromPixY(py: number) { return Y_MIN + (1 - py / CH) * (Y_MAX - Y_MIN); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function heatColor(t: number): [number, number, number] {
  const stops: [number, number, number][] = [
    [15,  23,  42],
    [55,  48,  163],
    [99,  102, 241],
    [167, 139, 250],
    [245, 158, 11],
  ];
  const n = stops.length - 1;
  const scaled = clamp(t, 0, 1) * n;
  const i = Math.min(n - 1, Math.floor(scaled));
  const f = scaled - i;
  return stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * f)) as [number, number, number];
}

const INITIAL_PT = { x: 1.9, y: 1.6 };

interface GradientDescent2DProps {
  className?: string;
}

function GradientDescent2D({ className = '' }: GradientDescent2DProps) {
  const [path, setPath]     = useState<{ x: number; y: number }[]>([{ ...INITIAL_PT }]);
  const [eta, setEta]       = useState(0.12);
  const [running, setRunning] = useState(false);
  const runRef  = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eqIdx, setEqIdx] = useState(0);
  const eq = EQUATIONS_2D[eqIdx];

  const handleEqChange = useCallback((idx: number) => {
    setEqIdx(idx);
    setPath([{ ...INITIAL_PT }]);
    setRunning(false);
    runRef.current = false;
  }, []);

  /* Responsive */
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(500);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(2.0, Math.max(0.6, containerW / 500));
  const fs = (b: number) => Math.round(b * scale);

  /* Gradient field arrows */
  const arrows = useMemo(() => {
    const result: { x: number; y: number; gx: number; gy: number; len: number }[] = [];
    for (let row = 0; row < ARROW_ROWS; row++) {
      for (let col = 0; col < ARROW_COLS; col++) {
        const ax = X_MIN + (col + 0.5) / ARROW_COLS * (X_MAX - X_MIN);
        const ay = Y_MIN + (row + 0.5) / ARROW_ROWS * (Y_MAX - Y_MIN);
        const gx = eq.dfx(ax, ay), gy = eq.dfy(ax, ay);
        const mag = Math.sqrt(gx * gx + gy * gy);
        if (mag < 1e-8) continue;
        const len = Math.min(20, 1 + 12 * Math.log1p(mag));
        result.push({ x: ax, y: ay, gx: gx / mag, gy: gy / mag, len });
      }
    }
    return result;
  }, [eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrowComponents = useMemo(() => arrows.map((a, i) => {
    const ax1 = toPixX(a.x), ay1 = toPixY(a.y);
    const ax2 = ax1 + a.gx * a.len;
    const ay2 = ay1 - a.gy * a.len;
    return (
      <line key={i}
        x1={ax1} y1={ay1} x2={ax2} y2={ay2}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.75"
      />
    );
  }), [arrows]);

  /* Draw heatmap once */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let vMin = Infinity, vMax = -Infinity;
    for (let py = 0; py < CH; py += 4)
      for (let px = 0; px < CW; px += 4) {
        const v = eq.fn(fromPixX(px), fromPixY(py));
        if (v < vMin) vMin = v;
        if (v > vMax) vMax = v;
      }
    const imageData = ctx.createImageData(CW, CH);
    for (let py = 0; py < CH; py++) {
      for (let px = 0; px < CW; px++) {
        const v = eq.fn(fromPixX(px + 0.5), fromPixY(py + 0.5));
        const t = (v - vMin) / (vMax - vMin);
        const [r, g, b] = heatColor(t);
        const idx = (py * CW + px) * 4;
        imageData.data[idx] = r; imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b; imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const takeStep = useCallback(() => {
    setPath(prev => {
      const last = prev[prev.length - 1];
      const nx = clamp(last.x - eta * eq.dfx(last.x, last.y), X_MIN + 0.02, X_MAX - 0.02);
      const ny = clamp(last.y - eta * eq.dfy(last.x, last.y), Y_MIN + 0.02, Y_MAX - 0.02);
      return [...prev.slice(-100), { x: nx, y: ny }];
    });
  }, [eta, eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
		// randomize initial point over range of plot
		const initialPt = {
			x: X_MIN + Math.random() * (X_MAX - X_MIN),
			y: Y_MIN + Math.random() * (Y_MAX - Y_MIN),
		};
    setPath([initialPt]);
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
      setPath(prev => {
        const last = prev[prev.length - 1];
        const gx = eq.dfx(last.x, last.y), gy = eq.dfy(last.x, last.y);
        if (Math.sqrt(gx * gx + gy * gy) < 1e-5) {
          setRunning(false); runRef.current = false; return prev;
        }
        const nx = clamp(last.x - eta * gx, X_MIN + 0.02, X_MAX - 0.02);
        const ny = clamp(last.y - eta * gy, Y_MIN + 0.02, Y_MAX - 0.02);
        return [...prev.slice(-100), { x: nx, y: ny }];
      });
      if (runRef.current) timeout = setTimeout(tick, 100);
    };
    timeout = setTimeout(tick, 100);
    return () => { clearTimeout(timeout); runRef.current = false; };
  }, [running, eta, eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Click to reposition start */
  const onClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (path.length > 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * CW;
    const py = ((e.clientY - rect.top) / rect.height) * CH;
    const nx = clamp(fromPixX(px), X_MIN + 0.02, X_MAX - 0.02);
    const ny = clamp(fromPixY(py), Y_MIN + 0.02, Y_MAX - 0.02);
    setPath([{ x: nx, y: ny }]);
    setRunning(false);
    runRef.current = false;
  }, [path.length]);

  const current = path[path.length - 1];
  const gx = eq.dfx(current.x, current.y);
  const gy = eq.dfy(current.x, current.y);
  const gradMag = Math.sqrt(gx * gx + gy * gy);

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <div className="relative w-full" style={{ maxWidth: CW }}>
        <canvas ref={canvasRef} width={CW} height={CH}
          className="rounded-xl w-full h-auto block"
          style={{ imageRendering: 'pixelated' }} />

        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="absolute inset-0 w-full h-full rounded-xl"
          style={{ userSelect: 'none', cursor: path.length === 1 ? 'crosshair' : 'default' }}
          onClick={onClick}
        >
          <defs>
            <marker id="gd2-grid-arrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0, 5 2, 0 4" fill="rgba(255,255,255,0.15)" />
            </marker>
          </defs>

          {/* Grid gradient arrows */}
          {arrowComponents}

          {/* Descent path */}
          {path.length > 1 && (
            <polyline
              points={path.map(p => `${toPixX(p.x).toFixed(1)},${toPixY(p.y).toFixed(1)}`).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinejoin="round" opacity="0.85"
            />
          )}

          {/* Path dots with fade-in opacity */}
          {path.slice(0, -1).map((p, i) => (
            <circle key={i}
              cx={toPixX(p.x)} cy={toPixY(p.y)}
              r={3.5}
              fill="#10b981"
              opacity={0.2 + 0.6 * ((i + 1) / path.length)}
            />
          ))}

          {/* Minima markers */}
          {eq.minima.map(([mx, my], i) => (
            <g key={i}>
              <circle cx={toPixX(mx)} cy={toPixY(my)} r={5}
                fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 2" />
            </g>
          ))}

          {/* Current point */}
          <circle cx={toPixX(current.x)} cy={toPixY(current.y)} r={8}
            fill="#10b981" stroke="#fff" strokeWidth="2.2" />

          {/* Axis labels */}
          <text x={CW - 10} y={toPixY(0) + 4} textAnchor="end"
            fill="rgba(255,255,255,0.4)" fontSize={fs(11)}>x</text>
          <text x={toPixX(0) + 5} y={13}
            fill="rgba(255,255,255,0.4)" fontSize={fs(11)}>y</text>
        </svg>
      </div>

      {/* Equation selector */}
      <div className="flex gap-1.5 flex-wrap justify-center mt-3 w-full max-w-lg">
        {EQUATIONS_2D.map((eqOpt, i) => (
          <button key={i} onClick={() => handleEqChange(i)}
            className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors select-none ${
              eqIdx === i
                ? 'bg-emerald-500/40 border-emerald-400/60 tc1'
                : 'bg-white/5 border-white/15 tc2 hover:bg-white/10'
            }`}>
            {eqOpt.label}
          </button>
        ))}
      </div>

      {/* Readout */}
      <div className="grid grid-cols-4 gap-2 mt-3 w-full max-w-lg font-mono text-center"
        style={{ fontSize: `${0.78 * scale}rem` }}>
        {[
          { label: 'x',       val: current.x.toFixed(4) },
          { label: 'y',       val: current.y.toFixed(4) },
          { label: 'f(x,y)',  val: eq.fn(current.x, current.y).toFixed(4) },
          { label: 'steps',   val: String(path.length - 1) },
        ].map(({ label, val }) => (
          <div key={label} className="bg-white/5 rounded-lg px-2 py-1.5">
            <div className="opacity-50 text-xs mb-0.5">{label}</div>
            <div className="tc1 truncate">{val}</div>
          </div>
        ))}
        <div className="bg-white/5 rounded-lg px-2 py-1.5 col-span-2">
          <div className="opacity-50 text-xs mb-0.5">∇f = [∂f/∂x, ∂f/∂y]</div>
          <div className="tc1">[{gx.toFixed(4)},&nbsp;{gy.toFixed(4)}]</div>
        </div>
        <div className="bg-white/5 rounded-lg px-2 py-1.5 col-span-2">
          <div className="opacity-50 text-xs mb-0.5">|∇f|</div>
          <div className="tc1">{gradMag.toFixed(5)}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2.5 mt-2 w-full max-w-lg"
        style={{ fontSize: `${0.875 * scale}rem` }}>
        <div className="flex items-center gap-3 w-full">
          <span className="opacity-60 shrink-0 whitespace-nowrap">η (learning rate)</span>
          <input type="range" min={0.01} max={1} step={0.01} value={eta}
            onChange={e => setEta(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-400" />
          <span className="font-mono w-12 text-right opacity-80">{eta.toFixed(2)}</span>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={takeStep}
            className="px-5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 tc1 hover:bg-emerald-500/30 transition-colors select-none">
            Step
          </button>
          <button onClick={() => setRunning(r => !r)}
            className="px-5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 tc1 hover:bg-indigo-500/30 transition-colors select-none">
            {running ? 'Pause' : 'Run'}
          </button>
          <button onClick={reset}
            className="px-5 py-1.5 rounded-lg bg-white/5 border border-white/15 tc2 hover:bg-white/10 transition-colors select-none">
            Reset
          </button>
        </div>
        <p className="opacity-35 text-xs">Click the map to reposition the start point (before stepping)</p>
      </div>
    </div>
  );
}

export { GradientDescent2D };
export default GradientDescent2D;
