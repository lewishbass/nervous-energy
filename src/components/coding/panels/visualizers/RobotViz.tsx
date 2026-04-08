'use client';
import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { FaArrowRight } from 'react-icons/fa6';

/* ---- types ---- */
type Point = { x: number; y: number };

export type RobotAction = {
	action: 'spawn' | 'move' | 'turn';
	robotId: string;
	robotName: string;
	pos?: [number, number];
	angle?: number;
	from?: [number, number];
	to?: [number, number];
	oldAngle?: number;
};

export type RobotVizHandle = {
	handleRobotAction: (action: RobotAction) => void;
	reset: () => void;
};

/* ---- palette ---- */
const ROBOT_COLORS = [
	'#3b82f6', // blue
	'#a855f7', // purple
	'#10b981', // emerald
	'#f97316', // orange
	'#ec4899', // pink
	'#06b6d4', // cyan
];

/* ---- fixed world bounds ---- */
const WORLD_MIN_X = -5;
const WORLD_MAX_X = 5;
const WORLD_MIN_Y = -5;
const WORLD_MAX_Y = 5;
const RANGE_X = WORLD_MAX_X - WORLD_MIN_X;
const RANGE_Y = WORLD_MAX_Y - WORLD_MIN_Y;
const PAD = 40;

/* ---- coordinate transforms ---- */
function toX(x: number, W: number) {
	return PAD + ((x - WORLD_MIN_X) / RANGE_X) * (W - 2 * PAD);
}
function toY(y: number, H: number) {
	return H - PAD - ((y - WORLD_MIN_Y) / RANGE_Y) * (H - 2 * PAD);
}

function getCanvasSize(container: HTMLDivElement) {
	const rect = container.getBoundingClientRect();
	return { W: rect.width, H: rect.height };
}

const RobotViz = forwardRef<RobotVizHandle, object>(
	function RobotViz(_props, ref) {
		/* ---- refs ---- */
		const pathsCanvasRef = useRef<HTMLCanvasElement>(null);
		const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);

		/* robot tracking (mutable refs, no re-renders) */
		const robotColorMapRef = useRef<Record<string, number>>({});
		const nextColorRef = useRef(0);
		const robotStateRef = useRef<Record<string, { pos: Point; angle: number; name: string }>>({});
		const robotFirstDrawnRef = useRef<Set<string>>(new Set());
		const actionHistoryRef = useRef<RobotAction[]>([]);
		const hasAnyRobotRef = useRef(false);
		const showArrowsRef = useRef(true);

		/* state only for placeholder text */
		const [hasRobots, setHasRobots] = useState(false);
		const [showArrows, setShowArrows] = useState(true);

		/* ---- draw the static grid/axes on the paths canvas ---- */
		const drawGrid = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 0.5;
			const tickCount = 10;
			for (let i = 1; i < tickCount; i++) {
				const vx = WORLD_MIN_X + (RANGE_X * i) / tickCount;
				const cx = toX(vx, W);
				ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke();
				const vy = WORLD_MIN_Y + (RANGE_Y * i) / tickCount;
				const cy = toY(vy, H);
				ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
			}

			/* axes at world 0 */
			ctx.strokeStyle = '#888';
			ctx.lineWidth = 1.5;
			const y0 = toY(0, H);
			ctx.beginPath(); ctx.moveTo(PAD, y0); ctx.lineTo(W - PAD, y0); ctx.stroke();
			const x0 = toX(0, W);
			ctx.beginPath(); ctx.moveTo(x0, PAD); ctx.lineTo(x0, H - PAD); ctx.stroke();

			/* tick labels */
			ctx.fillStyle = '#888';
			ctx.font = '10px monospace';
			ctx.textAlign = 'center';
			for (let i = 0; i <= tickCount; i += 2) {
				const val = WORLD_MIN_X + (RANGE_X * i) / tickCount;
				ctx.fillText(val.toFixed(0), toX(val, W), H - PAD + 14);
			}
			ctx.textAlign = 'right';
			for (let i = 0; i <= tickCount; i += 2) {
				const val = WORLD_MIN_Y + (RANGE_Y * i) / tickCount;
				ctx.fillText(val.toFixed(0), PAD - 5, toY(val, H) + 3);
			}
		}, []);

		/* ---- redraw overlay canvas (robot positions + heading + legend) ---- */
		const drawOverlay = useCallback(() => {
			const canvas = overlayCanvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const { W, H } = getCanvasSize(container);
			if (W === 0 || H === 0) return;

			const dpr = window.devicePixelRatio || 1;
			canvas.width = W * dpr;
			canvas.height = H * dpr;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, W, H);

			const states = robotStateRef.current;
			for (const [, state] of Object.entries(states)) {
				const colorIdx = robotColorMapRef.current[state.name] ?? 0;
				const color = ROBOT_COLORS[colorIdx % ROBOT_COLORS.length];
				const cx = toX(state.pos.x, W);
				const cy = toY(state.pos.y, H);

				/* heading line */
				const headingLen = 18;
				const hx = cx + Math.cos(state.angle) * headingLen;
				const hy = cy - Math.sin(state.angle) * headingLen;
				ctx.strokeStyle = '#fff';
				ctx.lineWidth = 2.5;
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(hx, hy);
				ctx.stroke();

				/* arrowhead on heading line */
				const headArrowLen = 8;
				const headArrowWidth = 4;
				const headArrowOffset = 6;
				const ax = hx + headArrowOffset * Math.cos(state.angle);
				const ay = hy - headArrowOffset * Math.sin(state.angle);

				ctx.fillStyle = '#fff';
				ctx.beginPath();
				ctx.moveTo(ax, ay);
				ctx.lineTo(ax - headArrowLen * Math.cos(state.angle) + headArrowWidth * Math.sin(state.angle), ay + headArrowLen * Math.sin(state.angle) + headArrowWidth * Math.cos(state.angle));
				ctx.lineTo(ax - headArrowLen * Math.cos(state.angle) - headArrowWidth * Math.sin(state.angle), ay + headArrowLen * Math.sin(state.angle) - headArrowWidth * Math.cos(state.angle));
				ctx.closePath();
				ctx.fill();

				/* position dot */
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(cx, cy, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.strokeStyle = '#fff';
				ctx.lineWidth = 1.5;
				ctx.stroke();
			}

			/* legend */
			const robotNames = Object.values(states).map(s => s.name);
			if (robotNames.length > 0) {
				ctx.textAlign = 'left';
				ctx.font = '11px monospace';
				robotNames.forEach((name, i) => {
					const colorIdx = robotColorMapRef.current[name] ?? 0;
					const color = ROBOT_COLORS[colorIdx % ROBOT_COLORS.length];
					ctx.fillStyle = color;
					ctx.fillRect(PAD + 5, PAD + 5 + i * 18, 12, 12);
					ctx.fillStyle = '#aaa';
					ctx.fillText(name, PAD + 21, PAD + 15 + i * 18);
				});
			}
		}, []);

		/* ---- draw a single move line segment incrementally on the paths canvas ---- */
		const drawMoveLine = useCallback((from: Point, to: Point, color: string, isFirstSegment: boolean) => {
			const canvas = pathsCanvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const { W, H } = getCanvasSize(container);
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const dpr = window.devicePixelRatio || 1;
			ctx.save();
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			/* line */
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(toX(from.x, W), toY(from.y, H));
			ctx.lineTo(toX(to.x, W), toY(to.y, H));
			ctx.stroke();

			/* arrowhead */
			if (showArrowsRef.current) {
				const ax = toX(to.x, W) - toX(from.x, W);
				const ay = toY(to.y, H) - toY(from.y, H);
				const len = Math.sqrt(ax * ax + ay * ay);
				if (len > 8) {
					const ux = ax / len, uy = ay / len;
					const headLen = 7;
					const tx = toX(to.x, W), ty = toY(to.y, H);
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.moveTo(tx, ty);
					ctx.lineTo(tx - headLen * ux + 3 * uy, ty - headLen * uy - 3 * ux);
					ctx.lineTo(tx - headLen * ux - 3 * uy, ty - headLen * uy + 3 * ux);
					ctx.closePath();
					ctx.fill();
				}
			}

			/* start dot (first segment of a robot) */
			if (isFirstSegment) {
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(toX(from.x, W), toY(from.y, H), 4, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();
		}, []);

		/* ---- full repaint of paths canvas (grid + replayed history) ---- */
		const redrawPathsCanvas = useCallback(() => {
			const canvas = pathsCanvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const { W, H } = getCanvasSize(container);
			if (W === 0 || H === 0) return;

			const dpr = window.devicePixelRatio || 1;
			canvas.width = W * dpr;
			canvas.height = H * dpr;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, W, H);

			drawGrid(ctx, W, H);

			/* replay all move actions from history */
			const firstDrawn = new Set<string>();
			for (const action of actionHistoryRef.current) {
				if (action.action !== 'move') continue;
				const colorIdx = robotColorMapRef.current[action.robotName] ?? 0;
				const color = ROBOT_COLORS[colorIdx % ROBOT_COLORS.length];
				const from: Point = { x: action.from![0], y: action.from![1] };
				const to: Point = { x: action.to![0], y: action.to![1] };
				const isFirst = !firstDrawn.has(action.robotId);
				if (isFirst) firstDrawn.add(action.robotId);

				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(toX(from.x, W), toY(from.y, H));
				ctx.lineTo(toX(to.x, W), toY(to.y, H));
				ctx.stroke();

				if (showArrowsRef.current) {
					const ax = toX(to.x, W) - toX(from.x, W);
					const ay = toY(to.y, H) - toY(from.y, H);
					const len = Math.sqrt(ax * ax + ay * ay);
					if (len > 8) {
						const ux = ax / len, uy = ay / len;
						const headLen = 7;
						const tx = toX(to.x, W), ty = toY(to.y, H);
						ctx.fillStyle = color;
						ctx.beginPath();
						ctx.moveTo(tx, ty);
						ctx.lineTo(tx - headLen * ux + 3 * uy, ty - headLen * uy - 3 * ux);
						ctx.lineTo(tx - headLen * ux - 3 * uy, ty - headLen * uy + 3 * ux);
						ctx.closePath();
						ctx.fill();
					}
				}

				if (isFirst) {
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.arc(toX(from.x, W), toY(from.y, H), 4, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}, [drawGrid]);

		/* ---- imperative handle exposed to parent ---- */
		useImperativeHandle(ref, () => ({
			handleRobotAction(action: RobotAction) {
				actionHistoryRef.current.push(action);

				/* ensure colour mapping */
				if (!(action.robotName in robotColorMapRef.current)) {
					robotColorMapRef.current[action.robotName] = nextColorRef.current++;
				}
				const colorIdx = robotColorMapRef.current[action.robotName];
				const color = ROBOT_COLORS[colorIdx % ROBOT_COLORS.length];

				if (action.action === 'spawn') {
					const pos: Point = { x: action.pos?.[0] ?? 0, y: action.pos?.[1] ?? 0 };
					robotStateRef.current[action.robotId] = {
						pos,
						angle: action.angle ?? 0,
						name: action.robotName,
					};
					if (!hasAnyRobotRef.current) {
						hasAnyRobotRef.current = true;
						setHasRobots(true);
					}
					drawOverlay();
				} else if (action.action === 'move') {
					const from: Point = { x: action.from![0], y: action.from![1] };
					const to: Point = { x: action.to![0], y: action.to![1] };
					const isFirst = !robotFirstDrawnRef.current.has(action.robotId);
					if (isFirst) robotFirstDrawnRef.current.add(action.robotId);

					drawMoveLine(from, to, color, isFirst);

					robotStateRef.current[action.robotId] = {
						pos: to,
						angle: action.angle ?? robotStateRef.current[action.robotId]?.angle ?? 0,
						name: action.robotName,
					};
					drawOverlay();
				} else if (action.action === 'turn') {
					const pos = robotStateRef.current[action.robotId]?.pos
						?? { x: action.pos?.[0] ?? 0, y: action.pos?.[1] ?? 0 };
					robotStateRef.current[action.robotId] = {
						pos,
						angle: action.angle ?? 0,
						name: action.robotName,
					};
					drawOverlay();
				}
			},

			reset() {
				robotColorMapRef.current = {};
				nextColorRef.current = 0;
				robotStateRef.current = {};
				robotFirstDrawnRef.current = new Set();
				actionHistoryRef.current = [];
				hasAnyRobotRef.current = false;
				setHasRobots(false);
				redrawPathsCanvas();
				const overlay = overlayCanvasRef.current;
				if (overlay) {
					const ctx = overlay.getContext('2d');
					if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
				}
			},
		}), [drawMoveLine, drawOverlay, redrawPathsCanvas]);

		/* ---- initial grid draw ---- */
		useEffect(() => {
			redrawPathsCanvas();
		}, [redrawPathsCanvas]);

		/* ---- handle container resize: full repaint ---- */
		useEffect(() => {
			const el = containerRef.current;
			if (!el) return;
			const observer = new ResizeObserver(() => {
				redrawPathsCanvas();
				drawOverlay();
			});
			observer.observe(el);
			return () => observer.disconnect();
		}, [redrawPathsCanvas, drawOverlay]);

		return (
			<div ref={containerRef} className="w-full h-full relative">
				<canvas
					ref={pathsCanvasRef}
					className="absolute inset-0 w-full h-full"
				/>
				<canvas
					ref={overlayCanvasRef}
					className="absolute inset-0 w-full h-full"
				/>
				<button
					onClick={() => {
						showArrowsRef.current = !showArrowsRef.current;
						setShowArrows(showArrowsRef.current);
						redrawPathsCanvas();
					}}
					className={`absolute cursor-pointer select-none top-2 py-2 right-2 z-10 px-1.5 py-0.5 text-xs font-mono rounded border transition-all ${
						showArrows
							? 'bg-gray-700/80 border-gray-500 text-gray-200 hover:bg-gray-600/90'
							: 'bg-gray-900/60 border-gray-600/50 text-gray-500 hover:bg-gray-700/70'
					}`}
					title={showArrows ? 'Hide arrows' : 'Show arrows'}
				>
					<FaArrowRight className={`w-3 h-3 transition-transform ${showArrows ? 'rotate-0' : '-rotate-90'}`} />
				</button>
				{!hasRobots && (
					<p className="absolute inset-0 flex items-start pt-20 justify-center opacity-40 text-sm select-none pointer-events-none">
						Run code to visualize robot movement.
					</p>
				)}
			</div>
		);
	}
);

export default RobotViz;