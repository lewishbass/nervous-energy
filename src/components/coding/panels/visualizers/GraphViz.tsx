

// graphy type object that is automatically detected and communicates deltas and type


import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

export type GraphAction = {
	type: 'init' | 'add_points' | 'remove_points' | 'set_points' | 'add_draw' | 'remove_draw' | 'set_draw' | 'set_axis';

	// init action params
	data?: any; // map of series keys to arrays if int/string
	draws?: any; // params including type, series keys (e.g. {x: 'series1', y: 'series2'}), styling
	axis?: any; // array of dict{name, range[min, max]}

	// points action params
	series?: string;
	points?: any[]; // array of int/string 
	indices?: number[]; // optional indices for setting points
	pointType?: string; // optional point type int/str
	
	// draw
	drawId?: string; // for modifying existing draws
	drawType?: string; // e.g. line, scatter, bar
	drawParams?: any; // e.g. color, width, style

	// axis
	index?: number; // axis index for modifying existing axis
	name?: string;
	range?: [number, number];

};


export type GraphVizHandle = {
	handleGraphAction: (action: GraphAction) => void;
	reset: () => void;
};


/* ---- internal state shapes ---- */
type DrawConfig = { type: string; params: Record<string, unknown> };
type AxisConfig = { name: string; range?: [number, number] };

/* ---- palette (catppuccin mocha accent colours) ---- */
const DRAW_COLORS = [
	'#89b4fa', // blue
	'#fab387', // peach
	'#a6e3a1', // green
	'#cba6f7', // mauve
	'#f38ba8', // red
	'#89dceb', // sky
	'#f9e2af', // yellow
	'#94e2d5', // teal
];

/* ---- layout constants ---- */
const PAD_L = 54;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 46;
const TICK_COUNT = 5;

function getCanvasSize(el: HTMLElement) {
	const r = el.getBoundingClientRect();
	return { W: r.width, H: r.height };
}

function niceRange(min: number, max: number): [number, number] {
	if (min === max) return [min - 1, max + 1];
	const pad = (max - min) * 0.08;
	return [min - pad, max + pad];
}

function fmtTick(v: number): string {
	if (v === 0) return '0';
	if (Math.abs(v) >= 1e5 || (Math.abs(v) < 0.01)) return v.toExponential(1);
	return parseFloat(v.toPrecision(4)).toString();
}

/* ================================================================ */

const GraphViz = forwardRef<GraphVizHandle, object>(
	function GraphViz(_props, ref) {
		const canvasRef    = useRef<HTMLCanvasElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);

		/* ---- all graph state lives in refs (no re-render needed) ---- */
		const dataRef      = useRef<Record<string, (number | string)[]>>({});
		const drawsRef     = useRef<Record<string, DrawConfig>>({});
		const axisRef      = useRef<AxisConfig[]>([{ name: 'x' }, { name: 'y' }]);
		const colorIdxRef  = useRef(0);
		const colorMapRef  = useRef<Record<string, string>>({});

		/* assign a stable color to each draw id */
		function getColor(drawId: string, explicit?: unknown): string {
			if (typeof explicit === 'string' && explicit) return explicit;
			if (!colorMapRef.current[drawId]) {
				colorMapRef.current[drawId] = DRAW_COLORS[colorIdxRef.current % DRAW_COLORS.length];
				colorIdxRef.current++;
			}
			return colorMapRef.current[drawId];
		}

		/* ---- main canvas redraw ---- */
		const redraw = useCallback(() => {
			const canvas    = canvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const { W, H } = getCanvasSize(container);
			if (W === 0 || H === 0) return;

			const dpr = window.devicePixelRatio || 1;
			canvas.width        = W * dpr;
			canvas.height       = H * dpr;
			canvas.style.width  = `${W}px`;
			canvas.style.height = `${H}px`;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.scale(dpr, dpr);

			const data         = dataRef.current;
			const draws        = drawsRef.current;
			const axes         = axisRef.current;
			const drawEntries  = Object.entries(draws);

			/* background */
			ctx.fillStyle = '#1e1e2e';
			ctx.fillRect(0, 0, W, H);

			const plotW = W - PAD_L - PAD_R;
			const plotH = H - PAD_T - PAD_B;
			if (plotW <= 10 || plotH <= 10) return;

			/* --- collect all values for auto-ranging --- */
			const allX: number[] = [];
			const allY: number[] = [];
			drawEntries.forEach(([, draw]) => {
				(data[draw.params.y as string] ?? []).forEach(v => typeof v === 'number' && allY.push(v));
				(data[draw.params.x as string] ?? []).forEach(v => typeof v === 'number' && allX.push(v));
			});
			if (allX.length === 0) {
				let maxLen = 0;
				drawEntries.forEach(([, d]) => {
					maxLen = Math.max(maxLen, (data[d.params.y as string] ?? []).length);
				});
				for (let i = 0; i < maxLen; i++) allX.push(i);
			}

			const xCfg = axes[0] ?? { name: 'x' };
			const yCfg = axes[1] ?? { name: 'y' };
			const [xMin, xMax] = xCfg.range ?? (allX.length ? niceRange(Math.min(...allX), Math.max(...allX)) : [0, 1]);
			const [yMin, yMax] = yCfg.range ?? (allY.length ? niceRange(Math.min(...allY), Math.max(...allY)) : [0, 1]);
			const xRange = xMax - xMin || 1;
			const yRange = yMax - yMin || 1;

			const toCanvasX = (v: number) => PAD_L + ((v - xMin) / xRange) * plotW;
			const toCanvasY = (v: number) => PAD_T + plotH - ((v - yMin) / yRange) * plotH;

			/* --- grid lines + tick labels --- */
			for (let i = 0; i <= TICK_COUNT; i++) {
				const vy = yMin + (i / TICK_COUNT) * yRange;
				const cy = toCanvasY(vy);
				ctx.strokeStyle = '#313244';
				ctx.lineWidth   = 0.5;
				ctx.beginPath(); ctx.moveTo(PAD_L, cy); ctx.lineTo(PAD_L + plotW, cy); ctx.stroke();
				ctx.fillStyle   = '#6c7086';
				ctx.font        = '10px monospace';
				ctx.textAlign   = 'right';
				ctx.fillText(fmtTick(vy), PAD_L - 6, cy + 3.5);

				const vx = xMin + (i / TICK_COUNT) * xRange;
				const cx = toCanvasX(vx);
				ctx.beginPath(); ctx.moveTo(cx, PAD_T); ctx.lineTo(cx, PAD_T + plotH); ctx.stroke();
				ctx.fillStyle   = '#6c7086';
				ctx.textAlign   = 'center';
				ctx.fillText(fmtTick(vx), cx, PAD_T + plotH + 14);
			}

			/* --- plot border --- */
			ctx.strokeStyle = '#585b70';
			ctx.lineWidth   = 1.5;
			ctx.strokeRect(PAD_L, PAD_T, plotW, plotH);

			/* --- axis name labels --- */
			ctx.fillStyle  = '#cdd6f4';
			ctx.font       = '11px sans-serif';
			ctx.textAlign  = 'center';
			ctx.fillText(xCfg.name, PAD_L + plotW / 2, H - 6);
			ctx.save();
			ctx.translate(13, PAD_T + plotH / 2);
			ctx.rotate(-Math.PI / 2);
			ctx.fillText(yCfg.name, 0, 0);
			ctx.restore();

			/* --- draw each series --- */
			const legendItems: { color: string; label: string }[] = [];

			drawEntries.forEach(([drawId, draw]) => {
				const color = getColor(drawId, draw.params.color);
				const yKey  = draw.params.y as string;
				const xKey  = draw.params.x as string;

				const rawY = data[yKey] ?? [];
				const rawX = xKey ? (data[xKey] ?? []) : rawY.map((_, i) => i);

				/* filter to aligned numeric pairs */
				const pairs: [number, number][] = [];
				const len = Math.min(rawX.length, rawY.length);
				for (let i = 0; i < len; i++) {
					const xv = rawX[i], yv = rawY[i];
					if (typeof xv === 'number' && typeof yv === 'number') pairs.push([xv, yv]);
				}

				const label = (draw.params.label as string) ?? drawId;
				legendItems.push({ color, label });
				if (pairs.length === 0) return;

				const lineWidth = typeof draw.params.width === 'number' ? draw.params.width : 2;

				if (draw.type === 'line') {
					ctx.strokeStyle = color;
					ctx.lineWidth   = lineWidth;
					ctx.lineJoin    = 'round';
					ctx.beginPath();
					pairs.forEach(([xv, yv], i) => {
						const cx = toCanvasX(xv), cy = toCanvasY(yv);
						i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
					});
					ctx.stroke();
					/* dot at each data point */
					ctx.fillStyle = color;
					pairs.forEach(([xv, yv]) => {
						ctx.beginPath();
						ctx.arc(toCanvasX(xv), toCanvasY(yv), lineWidth + 1, 0, Math.PI * 2);
						ctx.fill();
					});

				} else if (draw.type === 'scatter') {
					const r = typeof draw.params.radius === 'number' ? draw.params.radius : 4;
					ctx.fillStyle = color;
					pairs.forEach(([xv, yv]) => {
						ctx.beginPath();
						ctx.arc(toCanvasX(xv), toCanvasY(yv), r, 0, Math.PI * 2);
						ctx.fill();
					});

				} else if (draw.type === 'bar') {
					const zeroY = toCanvasY(Math.max(yMin, 0));
					const barW  = Math.max(2, (plotW / Math.max(pairs.length, 1)) * 0.7);
					ctx.fillStyle   = color + 'bb';
					ctx.strokeStyle = color;
					ctx.lineWidth   = 1;
					pairs.forEach(([xv, yv]) => {
						const cx = toCanvasX(xv);
						const cy = toCanvasY(yv);
						ctx.fillRect(cx - barW / 2, cy, barW, zeroY - cy);
						ctx.strokeRect(cx - barW / 2, cy, barW, zeroY - cy);
					});
				}
			});

			/* --- legend --- */
			if (legendItems.length > 0) {
				const itemH   = 16;
				const boxX    = PAD_L + plotW - 8;
				let   legendY = PAD_T + 10;
				legendItems.forEach(({ color, label }) => {
					ctx.fillStyle = color;
					ctx.fillRect(boxX - 58, legendY - 1, 10, 10);
					ctx.fillStyle = '#cdd6f4';
					ctx.font      = '10px sans-serif';
					ctx.textAlign = 'left';
					ctx.fillText(label, boxX - 44, legendY + 8);
					legendY += itemH;
				});
			}

			/* placeholder text when nothing is configured */
			if (drawEntries.length === 0) {
				ctx.fillStyle = 'rgba(205,214,244,0.25)';
				ctx.font      = '13px sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText('No draws configured.', PAD_L + plotW / 2, PAD_T + plotH / 2);
			}
		}, []); // reads only from stable refs

		/* ---- resize observer ---- */
		useEffect(() => {
			const container = containerRef.current;
			if (!container) return;
			const ro = new ResizeObserver(() => redraw());
			ro.observe(container);
			redraw();
			return () => ro.disconnect();
		}, [redraw]);

		/* ---- imperative handle ---- */
		useImperativeHandle(ref, () => ({
			handleGraphAction(action: GraphAction) {
				const data  = dataRef.current;
				const draws = drawsRef.current;
				const axes  = axisRef.current;

				switch (action.type) {
					case 'init': {
						dataRef.current  = action.data  ? { ...action.data }  : {};
						drawsRef.current = {};
						axisRef.current  = action.axis  ? [...action.axis]    : [{ name: 'x' }, { name: 'y' }];
						colorIdxRef.current = 0;
						colorMapRef.current = {};
						if (action.draws) {
							Object.entries(action.draws).forEach(([id, d]: [string, any]) => {
								drawsRef.current[id] = { type: d.type ?? 'line', params: d.params ?? {} };
							});
						}
						break;
					}
					case 'add_points': {
						if (!action.series) break;
						data[action.series] = [...(data[action.series] ?? []), ...(action.points ?? [])];
						break;
					}
					case 'remove_points': {
						if (!action.series) break;
						delete data[action.series];
						break;
					}
					case 'set_points': {
						if (!action.series) break;
						if (!action.indices) {
							data[action.series] = [...(action.points ?? [])];
						} else {
							const arr = [...(data[action.series] ?? [])];
							action.indices.forEach((idx, i) => { arr[idx] = (action.points ?? [])[i]; });
							data[action.series] = arr;
						}
						break;
					}
					case 'add_draw': {
						if (!action.drawId) break;
						draws[action.drawId] = { type: action.drawType ?? 'line', params: action.drawParams ?? {} };
						break;
					}
					case 'remove_draw': {
						if (!action.drawId) break;
						delete draws[action.drawId];
						break;
					}
					case 'set_draw': {
						if (!action.drawId) break;
						const existing = draws[action.drawId] ?? { type: 'line', params: {} };
						draws[action.drawId] = {
							type:   action.drawType ?? existing.type,
							params: { ...existing.params, ...(action.drawParams ?? {}) },
						};
						break;
					}
					case 'set_axis': {
						if (action.index == null) break;
						while (axes.length <= action.index) axes.push({ name: '' });
						if (action.name  != null) axes[action.index].name  = action.name;
						if (action.range != null) axes[action.index].range = action.range;
						break;
					}
				}
				redraw();
			},

			reset() {
				dataRef.current     = {};
				drawsRef.current    = {};
				axisRef.current     = [{ name: 'x' }, { name: 'y' }];
				colorIdxRef.current = 0;
				colorMapRef.current = {};
				redraw();
			},
		}), [redraw]);

		return (
			<div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: '#1e1e2e', position: 'relative' }}>
				<canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
			</div>
		);
	}
);

export default GraphViz;