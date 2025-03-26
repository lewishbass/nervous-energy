// OneStepDemo.tsx
// react nodejs typescript, recharts
// demonstration of using the one-step learning rate to find the global extreme of a quadratic loss function
// has sliders for a, b, c, w0,    y = aw^2 + bw + c
// uses a recharts chart to show the quadratic function, and derivative at w0

'use client';

import React, { useState } from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
	ReferenceLine, ResponsiveContainer, Legend, ReferenceDot, Label
} from 'recharts';
import '@/styles/sliders.css'; // Import the external slider styles

const OneStepDemo: React.FC = () => {
	// State for parameters
	const [a, setA] = useState(1);
	const [b, setB] = useState(2);
	const [c, setC] = useState(3);
	const [d, setD] = useState(0.1); // New parameter for cubic term
	const [w0, setW0] = useState(4);
	const [includeThird, setIncludeThird] = useState(false); // Toggle for cubic term

	// Calculate the optimal weight
	// For cubic function, we need to solve cubic equation for minimum
	// For simplicity, we'll approximate it numerically when cubic term is present
	const wOptimal = includeThird
		? findMinimumNumerically(a, b, c, d, -20, 20)
		: -b / (2 * a);

	// Calculate derivatives at w0
	const firstDerivativeAtW0 = includeThird
		? 3 * d * w0 * w0 + 2 * a * w0 + b
		: 2 * a * w0 + b;

	const secondDerivativeAtW0 = includeThird
		? 6 * d * w0 + 2 * a
		: 2 * a;

	// Calculate the optimal learning rate
	const optimalLearningRate = 1 / secondDerivativeAtW0;

	// Calculate the w1 after one step with optimal learning rate
	const w1 = w0 - optimalLearningRate * firstDerivativeAtW0;

	// Calculate w1 after one normal learning rate step
	const w1Normal = w0 - 1 * firstDerivativeAtW0;

	// Function to numerically find the minimum of the function
	function findMinimumNumerically(a: number, b: number, c: number, d: number, min: number, max: number) {
		let p = w0;
		for (let i = 0; i < 100; i++) {
			const firstDatp = includeThird
				? 3 * d * p * p + 2 * a * p + b
				: 2 * a * p + b;
			const secondDatp = includeThird
				? 6 * d * p + 2 * a
				: 2 * a;
			p -= firstDatp / secondDatp;
			if (p < min || p > max) break;
		}
		return p;
	}

	// Function to evaluate the polynomial
	function evaluateFunction(w: number, a: number, b: number, c: number, d: number) {
		return includeThird
			? d * w * w * w + a * w * w + b * w + c
			: a * w * w + b * w + c;
	}

	// Generate data points for the chart
	const generateData = () => {
		const data = [];
		const min = -10;
		const max = 10;
		const step = (max - min) / 100;

		for (let w = min; w <= max; w += step) {
			// Function with conditional cubic term
			const y = evaluateFunction(w, a, b, c, d);

			// Tangent line at w0
			const tangent = firstDerivativeAtW0 * (w - w0) + evaluateFunction(w0, a, b, c, d);
			if (!includeThird) {
				data.push({
					w,
					y,
					derivative: tangent
				});
			}
			else {
				const secondTangent = secondDerivativeAtW0 * (w - w0) ** 2 / 2 + tangent;
				data.push({
					w,
					y,
					derivative: tangent,
					secondDerivative: secondTangent
				});
			}
		}
		return data;
	};

	const minusPadding = (sign: boolean) => {
		return (<span style={{ opacity: sign ? 0 : 1 }}>-</span>);
	}
	const fixedDisplay = (value: number) => {
		const av = Math.abs(value);
		return (
			<>
				{minusPadding(value >= 0)}
				{Number.isFinite(value) ? ((av < 10) ? av.toFixed(1) : (av < 100 ? (av.toFixed(0) + '.') : av.toFixed(0))) : '∞'}
			</>
		);
	}

	const data = generateData();

	// Calculate function values at key points
	const y0 = evaluateFunction(w0, a, b, c, d);
	const y1 = evaluateFunction(w1, a, b, c, d);
	const yOptimal = evaluateFunction(wOptimal, a, b, c, d);

	return (
		<div className="space-y-6" style={{ userSelect: 'none' }}>
			<style jsx>{`
				/* Toggle switch styling */
				.switch {
					position: relative;
					display: inline-block;
					width: 60px;
					height: 28px;
				}

				.switch input { 
					opacity: 0;
					width: 0;
					height: 0;
				}

				.slider {
					position: absolute;
					cursor: pointer;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: #ccc;
					transition: .4s;
					border-radius: 34px;
				}

				.slider:before {
					position: absolute;
					content: "";
					height: 20px;
					width: 20px;
					left: 4px;
					bottom: 4px;
					background-color: white;
					transition: .4s;
					border-radius: 50%;
				}

				input:checked + .slider {
					background-color: #8884d8;
				}

				input:checked + .slider:before {
					transform: translateX(32px);
				}
			`}</style>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex items-center">
					<label className="block text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">a:</label>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.025"
						value={a}
						onChange={(e) => setA(parseFloat(e.target.value))}
					/>
					<div className="text-center ml-2 text-sm font-medium" style={{ fontFamily: "monospace" }}>{fixedDisplay(a)}</div>
				</div>
				<div className="flex items-center">
					<label className="block text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">b:</label>
					<input
						type="range"
						min="-2"
						max="2"
						step="0.1"
						value={b}
						onChange={(e) => setB(parseFloat(e.target.value))}
					/>
					<div className="text-center ml-2 text-sm font-medium" style={{ fontFamily: "monospace" }}>{fixedDisplay(b)}</div>
				</div>
				<div className="flex items-center">
					<label className="block text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">c:</label>
					<input
						type="range"
						min="-5"
						max="5"
						step="0.1"
						value={c}
						onChange={(e) => setC(parseFloat(e.target.value))}
					/>
					<div className="text-center ml-2 text-sm font-medium" style={{ fontFamily: "monospace" }}>{fixedDisplay(c)}</div>
				</div>

				<div className="flex items-center">
					<label className="block text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">w₀:</label>
					<input
						type="range"
						min="-10"
						max="10"
						step="0.1"
						value={w0}
						onChange={(e) => setW0(parseFloat(e.target.value))}
					/>
					<div className="text-center ml-2 text-sm font-medium" style={{ fontFamily: "monospace" }}>{fixedDisplay(w0)}</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="flex items-center mb-4">
					<label className="switch mr-3">
						<input
							type="checkbox"
							checked={includeThird}
							onChange={() => setIncludeThird(!includeThird)}
						/>
						<span className="slider"></span>
					</label>
					<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
						Include cubic term (dw³)
					</span>
				</div>
				{includeThird && (
					<div className="flex items-center">
						<label className="block text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">d:</label>
						<input
							type="range"
							min="-0.5"
							max="0.5"
							step="0.0125"
							value={d}
							onChange={(e) => setD(parseFloat(e.target.value))}
						/>
						<div className="text-center ml-2 text-sm font-medium" style={{ fontFamily: "monospace" }}>{fixedDisplay(d)}</div>
					</div>
				)}
			</div>


			<div style={{ fontFamily: 'monospace', fontSize: '0.9em' }} className="grid grid-cols-1 md:grid-cols-2 gap-1">
				<div>
					<p>
						<strong>f(w)</strong>  =
						{includeThird && <>{fixedDisplay(d)}w³ + </>}
						{fixedDisplay(a)}w² + {fixedDisplay(b)}w + {fixedDisplay(c)}
					</p>
					<p>
						<strong>f&apos;(w) </strong> =
						{includeThird && <>{fixedDisplay(3 * d)}w² + </>}
						{fixedDisplay(2 * a)}w + {fixedDisplay(b)}
					</p>
					<p>
						<strong>f&apos;&apos;(w)</strong>  =
						{includeThird && <>{fixedDisplay(6 * d)}w + </>}
						{fixedDisplay(2 * a)}
					</p>
					<p><strong>η</strong>  = 1/f&apos;&apos;(w₀) = {fixedDisplay(optimalLearningRate)}</p>
				</div>
				<div>
					<p><strong>w₀</strong>  = {fixedDisplay(w0)}, <strong>f(w₀)</strong> = {fixedDisplay(y0)}</p>
					<p><strong>f&apos;(w₀)</strong>  = {fixedDisplay(firstDerivativeAtW0)}</p>
					<p><strong>w₁</strong>  = {fixedDisplay(w1)}, <strong>f(w₁)</strong> = {fixedDisplay(y1)}</p>
					<p><strong>w*</strong>  = {fixedDisplay(wOptimal)}, <strong>f(w*)</strong> = {fixedDisplay(yOptimal)}</p>
				</div>
			</div>

			<div style={{ width: '100%', height: 400 }}>
				<ResponsiveContainer>
					<LineChart
						data={data}
						margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
					>
						<CartesianGrid strokeDasharray="4 8" strokeOpacity={0.5} edgeMode={''} />
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

						{/* The second derivative */}
						{includeThird && (
							<Line
								type="monotone"
								dataKey="secondDerivative"
								stroke="#ff7300"
								strokeWidth={2}
								name="Second Tangent"
								dot={false}
								isAnimationActive={false}
							/>
						)}

						{/* Reference for the optimal point */}
						<ReferenceLine x={wOptimal} stroke="red" strokeWidth={2} opacity={0.5}></ReferenceLine>
							<Label value="w*" position="top" style={{ textAnchor: 'middle' }} />

						{/* Reference for the current point w0 */}
						<ReferenceDot x={w0} y={y0} r={6} fill="blue" stroke="none" label={{ value: 'w₀', position: 'top', offset: 10 }} />

						{/* Reference for the next point w1 */}
						<ReferenceDot x={w1} y={y1} r={6} fill="green" stroke="none" label={{ value: 'w₁', position: 'top', offset: 10 }} />

						{/* Reference for the next point w1 with normal learning rate */}
						<ReferenceDot x={w1Normal} y={evaluateFunction(w1Normal, a, b, c, d)} r={6} fill="purple" stroke="none" label={{ value: 'w₁ (η=1)', position: 'top', offset: 10 }} />

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