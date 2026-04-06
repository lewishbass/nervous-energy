'use client';
import React, { useMemo } from 'react';

/* ── Types ── */

export interface TreeNodeData {
	value: number | string;
	left?: TreeNodeData;
	right?: TreeNodeData;
	/** Highlight this node (e.g. search target) */
	highlight?: boolean;
	/** Override fill colour for this node */
	color?: string;
}

export interface TreeVisualizerProps {
	root: TreeNodeData;
	width?: number | string;
	height?: number;
	caption?: string;
	className?: string;
	/** SVG radius of each node circle (default 22) */
	nodeRadius?: number;
	/** Font size inside nodes (default 14) */
	fontSize?: number;
	/** Horizontal spacing multiplier (default 48) */
	hSpacing?: number;
	/** Vertical spacing between levels (default 60) */
	vSpacing?: number;
}

/* ── Constants ── */

const DEFAULT_NODE_COLOR = '#6366f1';
const HIGHLIGHT_COLOR = '#f59e0b';
const EDGE_COLOR = '#94a3b8';
const DEFAULT_RADIUS = 22;
const DEFAULT_FONT = 14;

/* ── Layout algorithm ── */

interface LayoutNode {
	node: TreeNodeData;
	x: number; // in-order rank (0-based)
	y: number; // depth
}

/** Assigns in-order rank (x) and depth (y) to every node in the tree. */
function layoutTree(root: TreeNodeData): LayoutNode[] {
	const result: LayoutNode[] = [];
	let counter = 0;

	function visit(n: TreeNodeData, depth: number): void {
		if (n.left) visit(n.left, depth + 1);
		result.push({ node: n, x: counter++, y: depth });
		if (n.right) visit(n.right, depth + 1);
	}

	visit(root, 0);
	return result;
}

/* ── Main component ── */

export default function TreeVisualizer({
	root,
	width = '100%',
	height = 220,
	caption,
	className = '',
	nodeRadius = DEFAULT_RADIUS,
	fontSize = DEFAULT_FONT,
	hSpacing = 56,
	vSpacing = 60,
}: TreeVisualizerProps) {
	const layout = useMemo(() => layoutTree(root), [root]);

	// Map value → position for edge drawing
	const posMap = useMemo(() => {
		const m = new Map<TreeNodeData, { px: number; py: number }>();
		const padding = nodeRadius + 4;
		for (const ln of layout) {
			m.set(ln.node, {
				px: ln.x * hSpacing + padding,
				py: ln.y * vSpacing + padding,
			});
		}
		return m;
	}, [layout, hSpacing, vSpacing, nodeRadius]);

	const maxX = Math.max(...layout.map((l) => l.x));
	const maxY = Math.max(...layout.map((l) => l.y));
	const padding = nodeRadius + 4;
	const svgWidth = maxX * hSpacing + padding * 2;
	const svgHeight = maxY * vSpacing + padding * 2;

	/** Collect all edges by traversing the tree. */
	const edges = useMemo(() => {
		const result: { x1: number; y1: number; x2: number; y2: number }[] = [];

		function walk(n: TreeNodeData): void {
			const pos = posMap.get(n);
			if (!pos) return;
			for (const child of [n.left, n.right]) {
				if (!child) continue;
				const cpos = posMap.get(child);
				if (!cpos) continue;
				// Shorten line so it ends at circle borders
				const dx = cpos.px - pos.px;
				const dy = cpos.py - pos.py;
				const len = Math.sqrt(dx * dx + dy * dy);
				const ux = dx / len;
				const uy = dy / len;
				result.push({
					x1: pos.px + ux * nodeRadius,
					y1: pos.py + uy * nodeRadius,
					x2: cpos.px - ux * nodeRadius,
					y2: cpos.py - uy * nodeRadius,
				});
				walk(child);
			}
		}

		walk(root);
		return result;
	}, [root, posMap, nodeRadius]);

	return (
		<div
			className={`flex flex-col items-center my-3 invert-100 dark:invert-0 ${className}`}
			style={{ userSelect: 'none' }}
		>
			<svg
				viewBox={`0 0 ${svgWidth} ${svgHeight}`}
				width={width}
				height={height}
				style={{ overflow: 'visible' }}
			>
				{/* edges */}
				<g>
					{edges.map((e, i) => (
						<line
							key={i}
							x1={e.x1}
							y1={e.y1}
							x2={e.x2}
							y2={e.y2}
							stroke={EDGE_COLOR}
							strokeWidth={2}
						/>
					))}
				</g>

				{/* nodes */}
				<g>
					{layout.map((ln, i) => {
						const pos = posMap.get(ln.node)!;
						const fill = ln.node.highlight
							? HIGHLIGHT_COLOR
							: ln.node.color ?? DEFAULT_NODE_COLOR;
						const label = String(ln.node.value);
						const adjustedFont =
							label.length > 3
								? fontSize * 0.7
								: label.length > 2
									? fontSize * 0.85
									: fontSize;

						return (
							<g key={i}>
								<circle
									cx={pos.px}
									cy={pos.py}
									r={nodeRadius}
									fill={fill}
									stroke="rgba(255,255,255,0.9)"
									strokeWidth={2}
									style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
								/>
								<text
									x={pos.px}
									y={pos.py}
									textAnchor="middle"
									dominantBaseline="central"
									fill="#fff"
									fontSize={adjustedFont}
									fontWeight={700}
									style={{ pointerEvents: 'none' }}
								>
									{label}
								</text>
							</g>
						);
					})}
				</g>
			</svg>

			{caption && (
				<p className="text-xs text-center mt-1 opacity-60">{caption}</p>
			)}
		</div>
	);
}
