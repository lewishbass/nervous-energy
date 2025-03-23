// OneStepDemo.tsx
// react nodejs typescript, recharts
// demonstration of using the one-step learning rate to find the global extreme of a quadratic loss function
// has sliders for a, b, c, w0,    y = aw^2 + bw + c
// uses a recharts chart to show the quadratic function, and derivative at w0

'use client';

import React, { useState, useEffect } from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
	ReferenceLine, ResponsiveContainer, Legend, ReferenceDot, Label
} from 'recharts';

const OneStepDemo: React.FC = () => {
	// State for parameters
	const [a, setA] = useState(1);
	const [b, setB] = useState(2);
	const [c, setC] = useState(3);
	const [w0, setW0] = useState(4);

	// Calculate the optimal weight (minimum of the quadratic function)
	const wOptimal = -b / (2 * a);

	// Calculate the optimal learning rate
	const secondDerivative = 2 * a;
	const optimalLearningRate = 1 / secondDerivative;

	// Calculate first derivative at w0
	const firstDerivativeAtW0 = 2 * a * w0 + b;

	// Calculate the w1 after one step with optimal learning rate
	const w1 = w0 - optimalLearningRate * firstDerivativeAtW0;

	// Generate data points for the chart
	const generateData = () => {
		const data = [];
		const min = -10;//Math.min(wOptimal, w0, w1) - 2;
		const max = 10;//Math.max(wOptimal, w0, w1) + 2;
		const step = (max - min) / 100;

		for (let w = min; w <= max; w += step) {
			// Quadratic function: y = a * w * w + b * w + c
			const y = a * w * w + b * w + c;

			// First derivative: dy/dw = 2 * a * w + b
			const derivative = (2 * a * w0 + b) * (w - w0) + (a * w0 * w0 + b * w0 + c);

			data.push({
				w,
				y,
				derivative
			});
		}
		return data;
	};

	const minusPadding = (sign: boolean) => {
		return (<span style={{ opacity: sign ? 0 : 1 }}>-</span>);
	}
	const fixedDisplay = (value: number) => {
		return (
			<>
				{minusPadding(value >= 0)}
				{Number.isFinite(value) ? ((Math.abs(value) < 10) ? Math.abs(value).toFixed(1) : Math.abs(value).toFixed(0)) : '∞'}
			</>
		);
	}

	const data = generateData();

	// Calculate the value of the quadratic function at w0
	const y0 = a * w0 * w0 + b * w0 + c;

	// Calculate the value of the quadratic function at w1
	const y1 = a * w1 * w1 + b * w1 + c;

	// Calculate the value of the quadratic function at wOptimal
	const yOptimal = a * wOptimal * wOptimal + b * wOptimal + c;

	return (
		<div className="space-y-6" style={{ userSelect: 'none' }}>
			<style jsx>{`
				/* Custom styling for range inputs */
				input[type=range] {
					-webkit-appearance: none;
					appearance: none;
					background: transparent;
					cursor: pointer;
					width: 100%;
					margin: 8px 0;
				}

				/* Track styling */
				input[type=range]::-webkit-slider-runnable-track {
					height: 16px;
					background: #e0e0e0;
					border-radius: 8px;
					padding-left:2px;
					padding-right:2px;
				}

				input[type=range]::-moz-range-track {
					height: 16px;
					background: #e0e0e0;
					border-radius: 8px;
					padding-left:2px;
					padding-right:2px;
				}

				/* Thumb styling */
				input[type=range]::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					margin-top: 01px;
					background-color: #8884d8;
					height: 14px;
					width: 14px;
					border-radius: 50%;
					border: none;
					box-shadow: 0 1px 3px rgba(0,0,0,0.1);
					transition: background-color 0.2s, transform 0.2s;
				}

				input[type=range]::-moz-range-thumb {
					background-color: #8884d8;
					height: 14px;
					width: 14px;
					border-radius: 50%;
					border: none;
					box-shadow: 0 1px 3px rgba(0,0,0,0.1);
					transition: background-color 0.2s, transform 0.2s;
				}

				/* Focus and hover effects */
				input[type=range]:focus {
					outline: none;
				}

				input[type=range]:hover::-webkit-slider-thumb,
				input[type=range]:focus::-webkit-slider-thumb {
					background-color: #6c67c7;
					transform: scale(1.1);
				}

				input[type=range]:hover::-moz-range-thumb,
				input[type=range]:focus::-moz-range-thumb {
					background-color: #6c67c7;
					transform: scale(1.1);
				}
			`}</style>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="">
					<label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">a (coefficient of w²)</label>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						value={a}
						onChange={(e) => setA(parseFloat(e.target.value))}
					/>
					<div className="text-center mt-1 text-sm font-medium" style={{fontFamily:"monospace"}}>{fixedDisplay(a)}</div>
				</div>
				<div className="">
					<label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">b (coefficient of w)</label>
					<input
						type="range"
						min="-2"
						max="2"
						step="0.1"
						value={b}
						onChange={(e) => setB(parseFloat(e.target.value))}
					/>
					<div className="text-center mt-1 text-sm font-medium" style={{fontFamily:"monospace"}}>{fixedDisplay(b)}</div>
				</div>
				<div className="">
					<label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">c (constant)</label>
					<input
						type="range"
						min="-5"
						max="5"
						step="0.1"
						value={c}
						onChange={(e) => setC(parseFloat(e.target.value))}
					/>
					<div className="text-center mt-1 text-sm font-medium" style={{fontFamily:"monospace"}}>{fixedDisplay(c)}</div>
				</div>
				<div className="">
					<label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">w₀ (initial weight)</label>
					<input
						type="range"
						min="-10"
						max="10"
						step="0.1"
						value={w0}
						onChange={(e) => setW0(parseFloat(e.target.value))}
					/>
					<div className="text-center mt-1 text-sm font-medium" style={{fontFamily:"monospace"}}>{fixedDisplay(w0)}</div>
				</div>
			</div>

			<div style={{ fontFamily: 'monospace', fontSize: '0.9em' }} className="grid grid-cols-1 md:grid-cols-2 gap-1">
				<div>
					<p><strong>Function:</strong> f(w) = {fixedDisplay(a)}w² + {fixedDisplay(b)}w + {fixedDisplay(c)}</p>
					<p><strong>Derivative:</strong> f'(w) = {fixedDisplay(2 * a)}w + {fixedDisplay(b)}</p>
					<p><strong>Second Derivative:</strong> f''(w) = {fixedDisplay(2 * a)}</p>
					<p><strong>Optimal Rate:</strong> η = 1/f''(w) = {fixedDisplay(optimalLearningRate)}</p>
				</div>
				<div>
					<p><strong>Current Point:</strong> w₀ = {fixedDisplay(w0)}, f(w₀) = {fixedDisplay(y0)}</p>
					<p><strong>Gradient at w₀:</strong> f'(w₀) = {fixedDisplay(firstDerivativeAtW0)}</p>
					<p><strong>After One Step:</strong> w₁ = {fixedDisplay(w1)}, f(w₁) = {fixedDisplay(y1)}</p>
					<p><strong>Optimal Point:</strong> w* = {fixedDisplay(wOptimal)}, f(w*) = {fixedDisplay(yOptimal)}</p>
				</div>
			</div>

			<div style={{ width: '100%', height: 400 }}>
				<ResponsiveContainer>
					<LineChart
						data={data}
						margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
					>
						<CartesianGrid strokeDasharray="4 8" strokeOpacity={0.5} edgeMode={''}/>
						<XAxis
							dataKey="w"
							domain={[-10, 10]}
							type="number"
							allowDataOverflow={true}
						/>
						<YAxis
							dataKey="y"
							domain={[-50, 50]}
							type="number"
							allowDataOverflow={true}
						/>
						<Tooltip
							formatter={(value, name) => [typeof value === 'number' ? value.toFixed(2) : value, name === 'y' ? 'f(w)' : 'f\'(w)']}
							labelFormatter={(label) => `w = ${parseFloat(label).toFixed(2)}`}
						/>
						<Legend />

						{/* The quadratic function */}
						<Line
							type="monotone"
							dataKey="y"
							stroke="#8884d8"
							strokeWidth={2}
							name="Loss"
							dot={false}
							isAnimationActive={false}
						/>

						{/* The derivative */}
						<Line
							type="monotone"
							dataKey="derivative"
							stroke="#82ca9d"
							strokeWidth={2}
							name="Tangent"
							dot={false}
							isAnimationActive={false}
						/>

						{/* Reference for the optimal point */}
						<ReferenceLine x={wOptimal} stroke="red" strokeWidth={2} opacity={0.5}></ReferenceLine>
							<Label value="w*" position="top" style={{ textAnchor: 'middle' }} />

						{/* Reference for the current point w0 */}
						<ReferenceDot x={w0} y={y0} r={6} fill="blue" stroke="none" />

						{/* Reference for the new point w1 after one step */}
						<ReferenceDot x={w1} y={y1} r={6} fill="green" stroke="none" />

						{/* X-axis at y=0 */}
						<ReferenceLine y={0} stroke="gray" strokeWidth={2}/>

						{/* Y-axis at x=0 */}
						<ReferenceLine x={0} stroke="gray" strokeWidth={2} />

					</LineChart>
				</ResponsiveContainer>
			</div>

			
		</div>
	);
};

export default OneStepDemo;