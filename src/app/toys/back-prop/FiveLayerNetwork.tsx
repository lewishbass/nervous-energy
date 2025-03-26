'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LayerData {
	name: string;
	nodes: number;
	type: string;
	stride?: number;
	operation?: string;
	x?: number;
	nodes_data?: {
		x: number;
		y: number;
		type: string;
	}[];
}

const FiveLayerNetwork: React.FC = () => {
	const containerRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Clear any previous SVG
		d3.select(containerRef.current).select('svg').remove();

		const width=650;
		const height=400;

		const svg = d3.select(containerRef.current)
					.attr('width', width)
					.attr('height', height)
					.attr('viewBox', `0 0 ${width} ${height}`)
					.attr('style', 'max-width: 100%; height: auto;');

		// Network configuration
		const layers: LayerData[] = [
			{ name: "x", nodes: 4, type: "input" },
			{ name: "c", nodes: 4, type: "conv1d" },
			{ name: "p", nodes: 2, type: "pooling", stride: 2, operation: "avg" },
			{ name: "σ", nodes: 2, type: "softmax" },
			{ name: "L", nodes: 2, type: "loss" }
		];

		// Visual configuration (matching existing style)
		const config = {
			nodeRadius: 20,
			layerSpacing: 150,
			nodeVerticalSpacing: 70,
			layerLabelOffset: 40,
			colors: {
				input: "#6baed6",
				conv1d: "#fd8d3c",
				pooling: "#74c476",
				softmax: "#9e9ac8",
				loss: "#e6550d"
			},
			fontSize: 20,
			nodeFontSize: 20,
			layerLabelFontSize: 22
		};

		// Calculate positions
		layers.forEach((layer, i) => {
			const x = 25 + i * config.layerSpacing;
			layer.x = x;

			// Center the nodes vertically
			const totalHeight = (layer.nodes - 1) * config.nodeVerticalSpacing;
			const startY = (400 - totalHeight) / 2;

			layer.nodes_data = Array(layer.nodes).fill(null).map((_, j) => ({
				x: x,
				y: startY + j * config.nodeVerticalSpacing,
				type: layer.type
			}));
		});

		const sourceLayer = [0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3];
		const targetLayer = [1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4];
		const sourceIndex = [0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 1];
		const targetIndex = [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1];
		// Draw connections between layers
		for (let i = 0; i < sourceLayer.length; i++) {
			// @ts-expect-error its not bro, i checked
			const source = layers[sourceLayer[i]].nodes_data[sourceIndex[i]];
			// @ts-expect-error its not bro, i checked
			const target = layers[targetLayer[i]].nodes_data[targetIndex[i]];
			svg.append("line")
				.attr("x1", source.x)
				.attr("y1", source.y)
				.attr("x2", target.x)
				.attr("y2", target.y)
				.attr("stroke", "#999")
				.attr("stroke-width", 1)
				.attr("stroke-opacity", 0.6);
		}



		// Draw nodes
		layers.forEach(layer => {
			// Add layer label
			svg.append("text")
				// @ts-expect-error ts doesnt know these types
				.attr("x", layer.x)
				.attr("y", 50)
				.attr("text-anchor", "middle")
				.attr("font-family", "Arial")
				.attr("font-size", config.layerLabelFontSize)
				.attr("font-weight", "bold")
				.text(layer.name);

			// Add layer description if needed
			if (layer.type === "pooling") {
				svg.append("text")
					// @ts-expect-error ts doesnt know these types
					.attr("x", layer.x)
					.attr("y", 70)
					.attr("text-anchor", "middle")
					.attr("font-family", "Arial")
					.attr("font-size", config.fontSize)
					.text(`stride ${layer.stride}, ${layer.operation}`);
			}

			// Draw nodes
			layer.nodes_data?.forEach((node, j) => {
				svg.append("circle")
					.attr("cx", node.x)
					.attr("cy", node.y)
					.attr("r", config.nodeRadius)
					.attr("fill", config.colors[node.type as keyof typeof config.colors]);

				// Add node index label if needed
				svg.append("text")
					.attr("x", node.x)
					.attr("y", node.y + 5)
					.attr("text-anchor", "middle")
					.attr("font-family", "Arial")
					.attr("font-size", config.nodeFontSize)
					.attr("fill", "white")
					.text(j + 1);
			});
		});

		// Cleanup on component unmount
		return () => {
			if (containerRef.current) {
				d3.select(containerRef.current).select('svg').remove();
			}
		};
	}, []);

	return (
		<div className="network-graph">
      <svg ref={containerRef}  width="100%" height="400" className="mx-auto"></svg>
    </div>
	);
};

export default FiveLayerNetwork;
