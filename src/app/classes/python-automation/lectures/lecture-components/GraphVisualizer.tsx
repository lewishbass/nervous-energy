'use client';

import React, { useMemo } from 'react';
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Customized,
} from 'recharts';

/* ── Types ── */

export interface GraphNode {
	id: string;
	label: string;
	x: number;           // 0–100 coordinate space
	y: number;           // 0 = top, 100 = bottom
	highlight?: boolean;
	color?: string;
}

export interface GraphEdge {
	source: string;       // node id
	target: string;       // node id
	weight?: number;
	directed?: boolean;
	label?: string;
	color?: string;
}

export interface GraphData {
	nodes: GraphNode[];
	edges: GraphEdge[];
}

export interface GraphVisualizerProps {
	graph: GraphData;
	width?: number | string;
	height?: number;
	caption?: string;
	className?: string;
	nodeRadius?: number;
	showWeights?: boolean;
	directed?: boolean;
	fontSize?: number;
}

/* ── Constants ── */

const DEFAULT_NODE_COLOR = '#6366f1';
const DEFAULT_EDGE_COLOR = '#94a3b8';
const HIGHLIGHT_COLOR = '#f59e0b';
const DEFAULT_RADIUS = 28;
const DEFAULT_FONT_SIZE = 20;

/* ── Geometry helpers ── */

/** Shorten a line so it stops at node borders instead of node centres. */
function shortenLine(
	x1: number, y1: number, x2: number, y2: number, r: number,
) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.sqrt(dx * dx + dy * dy);
	if (len < 2 * r + 4) return { x1, y1, x2, y2 };
	const ux = dx / len;
	const uy = dy / len;
	return {
		x1: x1 + ux * r,
		y1: y1 + uy * r,
		x2: x2 - ux * r,
		y2: y2 - uy * r,
	};
}

/** SVG polygon points for an arrowhead at the tip of a line. */
function arrowHead(
	x1: number, y1: number, x2: number, y2: number, size = 16,
): string {
	const angle = Math.atan2(y2 - y1, x2 - x1);
	return [
		[x2, y2],
		[x2 - size * Math.cos(angle - Math.PI / 7), y2 - size * Math.sin(angle - Math.PI / 7)],
		[x2 - size * Math.cos(angle + Math.PI / 7), y2 - size * Math.sin(angle + Math.PI / 7)],
	]
		.map((p) => p.join(','))
		.join(' ');
}

/* ── Recharts custom renderers ── */

/**
 * Factory that returns a Recharts Customized component for drawing edges.
 * The returned function receives chart-internal props (axis scales etc.).
 */
function makeEdgesRenderer(
	graph: GraphData,
	nodeRadius: number,
	showWeights: boolean,
	defaultDirected: boolean,
) {
	const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

	return function EdgesRenderer(chartProps: Record<string, any>) {
		const xAxis = chartProps.xAxisMap
			? (Object.values(chartProps.xAxisMap)[0] as any)
			: null;
		const yAxis = chartProps.yAxisMap
			? (Object.values(chartProps.yAxisMap)[0] as any)
			: null;
		if (!xAxis?.scale || !yAxis?.scale) return null;

		const xScale = xAxis.scale as (v: number) => number;
		const yScale = yAxis.scale as (v: number) => number;

		return (
			<g className="graph-edges">
				{graph.edges.map((edge, i) => {
					const src = nodeMap.get(edge.source);
					const tgt = nodeMap.get(edge.target);
					if (!src || !tgt) return null;

					const rawX1 = xScale(src.x);
					const rawY1 = yScale(src.y);
					const rawX2 = xScale(tgt.x);
					const rawY2 = yScale(tgt.y);

					const { x1, y1, x2, y2 } = shortenLine(rawX1, rawY1, rawX2, rawY2, nodeRadius);
					const isDirected = edge.directed ?? defaultDirected;
					const color = edge.color || DEFAULT_EDGE_COLOR;

					return (
						<g key={`e-${i}`}>
							<line
								x1={x1} y1={y1} x2={x2} y2={y2}
								stroke={color}
								strokeWidth={2}
							/>
							{isDirected && (
								<polygon points={arrowHead(x1, y1, x2, y2)} fill={color} />
							)}
							{showWeights && edge.weight != null && (
								<text
									x={(rawX1 + rawX2) / 2}
									y={(rawY1 + rawY2) / 2 - 10}
									textAnchor="middle"
									fill={color}
									fontSize={11}
									fontWeight={600}
								>
									{edge.weight}
								</text>
							)}
							{edge.label && (
								<text
									x={(rawX1 + rawX2) / 2}
									y={(rawY1 + rawY2) / 2 - 10}
									textAnchor="middle"
									fill={color}
									fontSize={11}
									fontWeight={600}
								>
									{edge.label}
								</text>
							)}
						</g>
					);
				})}
			</g>
		);
	};
}

/** Factory for the custom Scatter shape that renders each node. */
function makeNodeShape(nodeRadius: number, fontSize: number) {
	return function NodeShape(props: unknown): React.ReactElement {
		const { cx, cy, payload } = props as Record<string, any>;
		if (cx == null || cy == null) return <g />;

		const fill = payload.highlight
			? HIGHLIGHT_COLOR
			: payload.color || DEFAULT_NODE_COLOR;

		const label = String(payload.label);
		const adjustedSize =
			label.length > 3
				? fontSize * 0.7
				: label.length > 2
					? fontSize * 0.85
					: fontSize;

		return (
			<g>
				<circle
					cx={cx}
					cy={cy}
					r={nodeRadius}
					fill={fill}
					stroke="rgba(255,255,255,0.9)"
					strokeWidth={2}
					style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
				/>
				<text
					x={cx}
					y={cy}
					textAnchor="middle"
					dominantBaseline="central"
					fill="#fff"
					fontSize={adjustedSize}
					fontWeight={700}
					style={{ pointerEvents: 'none', userSelect: 'none' }}
				>
					{label}
				</text>
			</g>
		);
	};
}

/* ── Main component ── */

function GraphVisualizer({
	graph,
	width = '100%',
	height = 300,
	caption,
	className = '',
	nodeRadius = DEFAULT_RADIUS,
	showWeights = false,
	directed = false,
	fontSize = DEFAULT_FONT_SIZE,
}: GraphVisualizerProps) {
	const EdgesRenderer = useMemo(
		() => makeEdgesRenderer(graph, nodeRadius, showWeights, directed),
		[graph, nodeRadius, showWeights, directed],
	);

	const NodeShape = useMemo(
		() => makeNodeShape(nodeRadius, fontSize),
		[nodeRadius, fontSize],
	);

	if (!graph.nodes.length) return null;

	return (
		<div className={className + ` invert-100 dark:invert-0`} style={{ userSelect: 'none' }}>
			<ResponsiveContainer width={width} height={height}>
				<ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
					<XAxis
						type="number"
						dataKey="x"
						domain={[0, 100]}
						hide
						allowDataOverflow
					/>
					<YAxis
						type="number"
						dataKey="y"
						domain={[0, 110]}
						reversed
						hide
						allowDataOverflow
					/>
					<Customized component={EdgesRenderer} />
					<Scatter
						data={graph.nodes}
						shape={NodeShape}
						isAnimationActive={false}
					/>
				</ScatterChart>
			</ResponsiveContainer>
			{caption && <p className="lecture-caption">{caption}</p>}
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════════════
	 Graph builder helpers – generate GraphData for common structures
	 ═══════════════════════════════════════════════════════════════════ */

/** Straight-line linked list.  The head node is highlighted. */
export function linkedListGraph(
	values: (string | number)[],
	directed = true,
): GraphData {
	const n = values.length;
	if (n === 0) return { nodes: [], edges: [] };

	const pad = 8;
	const usable = 100 - 2 * pad;
	const step = n > 1 ? usable / (n - 1) : 0;

	const nodes: GraphNode[] = values.map((v, i) => ({
		id: `n${i}`,
		label: String(v),
		x: pad + i * step,
		y: 50,
		highlight: i === 0,
	}));

	const edges: GraphEdge[] = [];
	for (let i = 0; i < n - 1; i++) {
		edges.push({ source: `n${i}`, target: `n${i + 1}`, directed });
	}

	return { nodes, edges };
}

/**
 * Binary search tree built by successive insertion.
 * X-positions assigned via in-order traversal so the tree looks right.
 */
export function binaryTreeGraph(values: number[]): GraphData {
	if (values.length === 0) return { nodes: [], edges: [] };

	type TNode = {
		value: number;
		left?: TNode;
		right?: TNode;
		id?: string;
		x?: number;
		y?: number;
	};

	function insert(root: TNode | undefined, v: number): TNode {
		if (!root) return { value: v };
		if (v < root.value) root.left = insert(root.left, v);
		else root.right = insert(root.right, v);
		return root;
	}

	let root: TNode | undefined;
	for (const v of values) root = insert(root, v);

	function treeDepth(node: TNode | undefined): number {
		if (!node) return 0;
		return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
	}

	const maxD = treeDepth(root);
	const pad = 16;
	const usableX = 100 - 2 * pad;
	const usableY = 80;
	const nodes: GraphNode[] = [];
	const edges: GraphEdge[] = [];
	let counter = 0;

	function layout(node: TNode | undefined, depth: number) {
		if (!node) return;
		layout(node.left, depth + 1);
		node.id = `n${counter}`;
		const xFrac = values.length > 1 ? counter / (values.length - 1) : 0.5;
		node.x = pad + xFrac * usableX;
		node.y = pad + (depth / Math.max(maxD - 1, 1)) * usableY;
		nodes.push({ id: node.id, label: String(node.value), x: node.x, y: node.y });
		counter++;
		layout(node.right, depth + 1);
	}
	layout(root, 0);

	function addEdges(node: TNode | undefined) {
		if (!node) return;
		if (node.left) {
			edges.push({ source: node.id!, target: node.left.id!, directed: true });
			addEdges(node.left);
		}
		if (node.right) {
			edges.push({ source: node.id!, target: node.right.id!, directed: true });
			addEdges(node.right);
		}
	}
	addEdges(root);

	return { nodes, edges };
}

/** Max- or min-heap laid out as a complete binary tree.  Root is highlighted. */
export function heapGraph(
	values: number[],
	type: 'max' | 'min' = 'max',
): GraphData {
	if (values.length === 0) return { nodes: [], edges: [] };

	const heap = [...values];

	function swap(a: number, b: number) {
		[heap[a], heap[b]] = [heap[b], heap[a]];
	}

	function siftDown(i: number, n: number) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			let t = i;
			const l = 2 * i + 1;
			const r = 2 * i + 2;
			if (type === 'max') {
				if (l < n && heap[l] > heap[t]) t = l;
				if (r < n && heap[r] > heap[t]) t = r;
			} else {
				if (l < n && heap[l] < heap[t]) t = l;
				if (r < n && heap[r] < heap[t]) t = r;
			}
			if (t === i) break;
			swap(i, t);
			i = t;
		}
	}

	for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);

	const n = heap.length;
	const totalLevels = Math.ceil(Math.log2(n + 1));
	const pad = 15;
	const usableY = 80;
	const nodes: GraphNode[] = [];
	const edges: GraphEdge[] = [];

	for (let i = 0; i < n; i++) {
		const level = Math.floor(Math.log2(i + 1));
		const posInLevel = i - (Math.pow(2, level) - 1);
		const maxInLevel = Math.pow(2, level);

		const x = pad + ((2 * posInLevel + 1) / (2 * maxInLevel)) * (100 - 2 * pad);
		const y = pad + (level / Math.max(totalLevels - 1, 1)) * usableY;

		nodes.push({
			id: `n${i}`,
			label: String(heap[i]),
			x,
			y,
			highlight: i === 0,
		});

		if (i > 0) {
			const parent = Math.floor((i - 1) / 2);
			edges.push({ source: `n${parent}`, target: `n${i}`, directed: true });
		}
	}

	return { nodes, edges };
}

export { GraphVisualizer };
export default GraphVisualizer;

