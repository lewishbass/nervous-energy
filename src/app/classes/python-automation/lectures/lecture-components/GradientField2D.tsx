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
    minimaLabel: '(±√2, 0)',
  },
  {
    label: 'x²+y²',
    fn:  (x: number, y: number) => x * x + y * y,
    dfx: (x: number, _y: number) => 2 * x,
    dfy: (_x: number, y: number) => 2 * y,
    minima: [[0, 0]] as [number, number][],
    minimaLabel: '(0, 0)',
  },
  {
    label: '½x²+2y²',
    fn:  (x: number, y: number) => 0.5 * x * x + 2 * y * y,
    dfx: (x: number, _y: number) => x,
    dfy: (_x: number, y: number) => 4 * y,
    minima: [[0, 0]] as [number, number][],
    minimaLabel: '(0, 0)',
  },
  {
    label: 'sin(πx)cos(πy)+r²/8',
    fn:  (x: number, y: number) => Math.sin(Math.PI * x) * Math.cos(Math.PI * y) + (x * x + y * y) / 8,
    dfx: (x: number, y: number) => Math.PI * Math.cos(Math.PI * x) * Math.cos(Math.PI * y) + x / 4,
    dfy: (x: number, y: number) => -Math.PI * Math.sin(Math.PI * x) * Math.sin(Math.PI * y) + y / 4,
    minima: [] as [number, number][],
    minimaLabel: 'multiple',
  },
];

/* ── Domain ── */
const X_MIN = -2.3, X_MAX = 2.3;
const Y_MIN = -2.0, Y_MAX = 2.0;

/* ── Canvas ── */
const CW = 480, CH = 380;

function toPixX(x: number) { return ((x - X_MIN) / (X_MAX - X_MIN)) * CW; }
function toPixY(y: number) { return (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * CH; }
function fromPixX(px: number) { return X_MIN + (px / CW) * (X_MAX - X_MIN); }
function fromPixY(py: number) { return Y_MIN + (1 - py / CH) * (Y_MAX - Y_MIN); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

/* ── Heat color: dark-slate → indigo → violet → amber ── */
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

const ARROW_COLS = 14*3;
const ARROW_ROWS = 11*3;

interface GradientField2DProps {
  className?: string;
}

function GradientField2D({ className = '' }: GradientField2DProps) {
  const [pt, setPt] = useState({ x: -0.6, y: 1.3 });
  const dragging = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eqIdx, setEqIdx] = useState(0);
  const eq = EQUATIONS_2D[eqIdx];

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

  /* Draw heatmap once */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* Compute value range */
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
        imageData.data[idx]     = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [eqIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Build grid gradient arrows */
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

  /* Interaction */
  const getSVGCoords = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * CW;
    const py = ((e.clientY - rect.top) / rect.height) * CH;
    return {
      x: clamp(fromPixX(px), X_MIN + 0.01, X_MAX - 0.01),
      y: clamp(fromPixY(py), Y_MIN + 0.01, Y_MAX - 0.01),
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    dragging.current = true;
    setPt(getSVGCoords(e));
  }, [getSVGCoords]);
  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    setPt(getSVGCoords(e));
  }, [getSVGCoords]);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  /* Values at point */
  const gx  = eq.dfx(pt.x, pt.y);
  const gy  = eq.dfy(pt.x, pt.y);
  const mag = Math.sqrt(gx * gx + gy * gy);
  const arrowLen = Math.min(52, 16 + 22 * Math.log1p(mag));
  const normGx = mag > 1e-8 ? gx / mag : 0;
  const normGy = mag > 1e-8 ? gy / mag : 0;

  const ppx  = toPixX(pt.x), ppy = toPixY(pt.y);
  const arx2 = ppx + normGx * arrowLen;
  const ary2 = ppy - normGy * arrowLen; /* SVG y-axis is flipped */

  return (
    <div ref={outerRef} className={`flex flex-col items-center w-full my-4 ${className}`}>
      <div className="relative w-full" style={{ maxWidth: CW }}>
        {/* Heatmap */}
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="rounded-xl w-full h-auto block"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* SVG overlay */}
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="absolute inset-0 w-full h-full cursor-crosshair rounded-xl"
          style={{ userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <defs>
            <marker id="gf-grid-arrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0, 5 2, 0 4" fill="rgba(255,255,255,0.15)" />
            </marker>
            <marker id="gf-big-arrow" markerWidth="9" markerHeight="7" refX="3" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Grid gradient arrows (steepest ascent) */}
          {arrowComponents}

          {/* Big gradient arrow at draggable point */}
          {mag > 1e-4 && (
            <line
              x1={ppx} y1={ppy} x2={arx2} y2={ary2}
              stroke="#f59e0b" strokeWidth="2.8"
              markerEnd="url(#gf-big-arrow)"
            />
          )}

          {/* Draggable point */}
          <circle cx={ppx} cy={ppy} r={8} fill="#f59e0b" stroke="#fff" strokeWidth="2"
            style={{ cursor: 'grab' }} />

          {/* Axis labels */}
          <text x={CW - 10} y={toPixY(0) + 4} textAnchor="end"
            fill="rgba(255,255,255,0.45)" fontSize={fs(11)}>x</text>
          <text x={toPixX(0) + 5} y={13}
            fill="rgba(255,255,255,0.45)" fontSize={fs(11)}>y</text>

          {/* Minima markers */}
          {eq.minima.map(([mx, my], i) => (
            <g key={i}>
              <circle cx={toPixX(mx)} cy={toPixY(my)} r={4.5}
                fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 2" />
            </g>
          ))}
        </svg>
      </div>

      {/* Equation selector */}
      <div className="flex gap-1.5 flex-wrap justify-center mt-3 w-full max-w-lg">
        {EQUATIONS_2D.map((eqOpt, i) => (
          <button key={i} onClick={() => setEqIdx(i)}
            className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors select-none ${
              eqIdx === i
                ? 'bg-indigo-500/40 border-indigo-400/60 tc1'
                : 'bg-white/5 border-white/15 tc2 hover:bg-white/10'
            }`}>
            {eqOpt.label}
          </button>
        ))}
      </div>

      {/* Info display */}
      <div className="grid grid-cols-2 gap-2 mt-3 w-full max-w-lg font-mono text-center"
        style={{ fontSize: `${0.78 * scale}rem` }}>
        <div className="bg-white/5 rounded-lg px-3 py-2 col-span-2 text-left">
          <span className="opacity-40 text-xs mr-1">f(x, y) =</span>
          <span className="tc2">{eq.label}</span>
          <span className="opacity-40 text-xs mx-2">|</span>
          <span className="opacity-40 text-xs mr-1">minima at</span>
          <span className="tc2">{eq.minimaLabel}</span>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="opacity-50 text-xs mb-0.5">Point (x, y)</div>
          <div className="tc1">({pt.x.toFixed(4)},&nbsp;{pt.y.toFixed(4)})</div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="opacity-50 text-xs mb-0.5">f(x, y)</div>
          <div className="tc1">{eq.fn(pt.x, pt.y).toFixed(5)}</div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="opacity-50 text-xs mb-0.5">∂f/∂x</div>
          <div className="tc1">{gx.toFixed(5)}</div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="opacity-50 text-xs mb-0.5">∂f/∂y</div>
          <div className="tc1">{gy.toFixed(5)}</div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2 col-span-2">
          <div className="opacity-50 text-xs mb-0.5">∇f = [∂f/∂x, ∂f/∂y]</div>
          <div className="tc1">
            [{gx.toFixed(4)},&nbsp;{gy.toFixed(4)}]
            <span className="opacity-40 mx-2">|</span>
            |∇f| = {mag.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}

export { GradientField2D };
export default GradientField2D;
