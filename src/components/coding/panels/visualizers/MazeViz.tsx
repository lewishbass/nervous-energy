'use client';
import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

/* ---- types ---- */
export type MazeAction = {
	type: 'init' | 'move' | 'turn' | 'reset';
	mazeId: string;
	grid?: string[][];
	rows?: number;
	cols?: number;
	runnerPos?: [number, number];
	runnerFacing?: 'up' | 'down' | 'left' | 'right';
	success?: boolean;
};

export type MazeVizHandle = {
	handleMazeAction: (action: MazeAction) => void;
	reset: () => void;
};

/* ---- colour palette ---- */
const CELL_COLORS: Record<string, string> = {
	w: '#1e1e2e',  // wall – dark
	e: '#45475a',  // empty path
	s: '#a6e3a1',  // start – green
	g: '#f38ba8',  // goal – red/pink
};
const VISITED_COLOR = '#1d4ed8'; // visited path – blue
const RUNNER_COLOR = '#f9e2af'; // gold
const GRID_LINE = '#313244';
const PAD = 4; // pixel padding around grid

/* ---- facing → rotation angle (radians, 0 = right) ---- */
const FACING_ANGLE: Record<string, number> = {
	right: 0,
	up: -Math.PI / 2,
	left: Math.PI,
	down: Math.PI / 2,
};

function getCanvasSize(container: HTMLDivElement) {
	const rect = container.getBoundingClientRect();
	return { W: rect.width, H: rect.height };
}

const MazeViz = forwardRef<MazeVizHandle, object>(
	function MazeViz(_props, ref) {
		/* ---- refs ---- */
		const mazeCanvasRef = useRef<HTMLCanvasElement>(null);
		const runnerCanvasRef = useRef<HTMLCanvasElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);

		/* mutable maze state (no re-renders) */
		const gridRef = useRef<string[][] | null>(null);
		const mazeRowsRef = useRef(0);
		const mazeColsRef = useRef(0);
		const runnerPosRef = useRef<[number, number]>([0, 0]);
		const runnerFacingRef = useRef<string>('right');
		const visitedRef = useRef<Set<string>>(new Set());

		/* ---- draw the static maze grid ---- */
		const drawMaze = useCallback(() => {
			const canvas = mazeCanvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const grid = gridRef.current;
			if (!grid) return;

			const { W, H } = getCanvasSize(container);
			if (W === 0 || H === 0) return;

			const rows = mazeRowsRef.current;
			const cols = mazeColsRef.current;

			const dpr = window.devicePixelRatio || 1;
			canvas.width = W * dpr;
			canvas.height = H * dpr;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, W, H);

			const drawW = W - 2 * PAD;
			const drawH = H - 2 * PAD;
			const cellW = drawW / cols;
			const cellH = drawH / rows;

			/* fill cells */
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const cell = grid[r]?.[c] ?? 'w';
					const isVisited = visitedRef.current.has(`${r},${c}`);
					const fillColor = (isVisited && cell !== 's' && cell !== 'g')
						? VISITED_COLOR
						: (CELL_COLORS[cell] ?? CELL_COLORS.e);
					ctx.fillStyle = fillColor;
					ctx.fillRect(PAD + c * cellW, PAD + r * cellH, cellW, cellH);
				}
			}

			/* grid lines */
			ctx.strokeStyle = GRID_LINE;
			ctx.lineWidth = 0.5;
			for (let r = 0; r <= rows; r++) {
				const y = PAD + r * cellH;
				ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(PAD + drawW, y); ctx.stroke();
			}
			for (let c = 0; c <= cols; c++) {
				const x = PAD + c * cellW;
				ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, PAD + drawH); ctx.stroke();
			}
		}, []);

		/* ---- draw the runner overlay ---- */
		const drawRunner = useCallback(() => {
			const canvas = runnerCanvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;
			if (!gridRef.current) return;

			const { W, H } = getCanvasSize(container);
			if (W === 0 || H === 0) return;

			const rows = mazeRowsRef.current;
			const cols = mazeColsRef.current;

			const dpr = window.devicePixelRatio || 1;
			canvas.width = W * dpr;
			canvas.height = H * dpr;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, W, H);

			const drawW = W - 2 * PAD;
			const drawH = H - 2 * PAD;
			const cellW = drawW / cols;
			const cellH = drawH / rows;

			const [rr, rc] = runnerPosRef.current;
			const cx = PAD + rc * cellW + cellW / 2;
			const cy = PAD + rr * cellH + cellH / 2;
			const size = Math.min(cellW, cellH) * 0.35;

			const angle = FACING_ANGLE[runnerFacingRef.current] ?? 0;

			/* draw triangle pointing in facing direction */
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(angle);

			ctx.fillStyle = RUNNER_COLOR;
			ctx.beginPath();
			ctx.moveTo(size, 0);                        // tip
			ctx.lineTo(-size * 0.6, -size * 0.7);      // bottom-left
			ctx.lineTo(-size * 0.6, size * 0.7);       // bottom-right
			ctx.closePath();
			ctx.fill();

			/* outline */
			ctx.strokeStyle = '#1e1e2e';
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.restore();

			/* small dot at center for clarity */
			ctx.fillStyle = '#1e1e2e';
			ctx.beginPath();
			ctx.arc(cx, cy, 2, 0, Math.PI * 2);
			ctx.fill();
		}, []);

		/* ---- imperative handle ---- */
		useImperativeHandle(ref, () => ({
			handleMazeAction(action: MazeAction) {
				if (action.type === 'init') {
					gridRef.current = action.grid ?? null;
					mazeRowsRef.current = action.rows ?? 0;
					mazeColsRef.current = action.cols ?? 0;
					runnerPosRef.current = action.runnerPos ?? [1, 1];
					runnerFacingRef.current = action.runnerFacing ?? 'right';
					visitedRef.current = new Set();
					const initPos = action.runnerPos ?? [1, 1];
					visitedRef.current.add(`${initPos[0]},${initPos[1]}`);
					drawMaze();
					drawRunner();
				} else if (action.type === 'move') {
					if (action.runnerPos) runnerPosRef.current = action.runnerPos;
					if (action.runnerFacing) runnerFacingRef.current = action.runnerFacing;
					if (action.success && action.runnerPos) {
						visitedRef.current.add(`${action.runnerPos[0]},${action.runnerPos[1]}`);
						drawMaze();
					}
					drawRunner();
				} else if (action.type === 'turn') {
					if (action.runnerFacing) runnerFacingRef.current = action.runnerFacing;
					drawRunner();
				} else if (action.type === 'reset') {
					visitedRef.current = new Set();
					if (action.runnerPos) {
						runnerPosRef.current = action.runnerPos;
						visitedRef.current.add(`${action.runnerPos[0]},${action.runnerPos[1]}`);
					}
					if (action.runnerFacing) runnerFacingRef.current = action.runnerFacing;
					drawMaze();
					drawRunner();
				}
			},

			reset() {
				gridRef.current = null;
				mazeRowsRef.current = 0;
				mazeColsRef.current = 0;
				runnerPosRef.current = [0, 0];
				runnerFacingRef.current = 'right';
				visitedRef.current = new Set();

				const maze = mazeCanvasRef.current;
				if (maze) {
					const ctx = maze.getContext('2d');
					if (ctx) ctx.clearRect(0, 0, maze.width, maze.height);
				}
				const runner = runnerCanvasRef.current;
				if (runner) {
					const ctx = runner.getContext('2d');
					if (ctx) ctx.clearRect(0, 0, runner.width, runner.height);
				}
			},
		}), [drawMaze, drawRunner]);

		/* ---- handle container resize ---- */
		useEffect(() => {
			const el = containerRef.current;
			if (!el) return;
			const observer = new ResizeObserver(() => {
				drawMaze();
				drawRunner();
			});
			observer.observe(el);
			return () => observer.disconnect();
		}, [drawMaze, drawRunner]);

		return (
			<div ref={containerRef} className="w-full h-full relative">
				{/* static maze grid */}
				<canvas
					ref={mazeCanvasRef}
					className="absolute inset-0 w-full h-full invert-100 dark:invert-0"
				/>
				{/* runner overlay */}
				<canvas
					ref={runnerCanvasRef}
					className="absolute inset-0 w-full h-full"
				/>
				{!gridRef.current && (
					<p className="absolute inset-0 flex items-start pt-20 justify-center opacity-40 text-sm select-none pointer-events-none">
						Run code to visualize maze.
					</p>
				)}
			</div>
		);
	}
);

export default MazeViz;