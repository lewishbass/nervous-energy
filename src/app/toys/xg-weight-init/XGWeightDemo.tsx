// XGWeightDemo.tsx
// react nodejs typescript, recharts
// demonstrates the variance of activations at different layers based on weight initialization
// has slider for number of layers [1-10]
// each layer has a slider for number of nodes
// button to generate random normalized data of 1000 samples 100 dimensions
// button to init weights with [0, 1/n, normal(0, 0.01), normal(0.05), xavier]
// when weights are initialized, the activations are computed for the dataset and histograms displayed at each layer

'use client';

import React, { useState, useEffect } from 'react';
import '@/styles/sliders.css';
import * as tf from '@tensorflow/tfjs';
import VerticalHistogram from './VerticalHistogram';

// Define weight initialization methods
type InitMethod = 'none' | 'ones' | 'uniform' | 'normal_small' | 'normal_medium' | 'xavier' | 'he';

// Define activation function options
type ActivationFunction = 'linear' | 'relu' | 'sigmoid' | 'tanh';

// Define data size options
type DataSize = 10 | 100 | 1000 | 10000;

// Interface for layer activations statistics
interface LayerStats {
	layerIndex: number;
	mean: number;
	variance: number;
	min: number;
	max: number;
	histogram: number[]; // Array of counts for each histogram bucket
}

const XGWeightDemo: React.FC = () => {
	// State for number of layers
	const [numLayers, setNumLayers] = useState(6);

	// State for nodes per layer - initialize with default values
	const [nodesPerLayer, setNodesPerLayer] = useState(Array(9).fill(11));

	// State for selected initialization method
	const [initMethod, setInitMethod] = useState<InitMethod>('uniform');

	// State for selected activation function
	const [activationFn, setActivationFn] = useState<ActivationFunction>('linear');

	// State for histogram settings
	// const [histogramMin, setHistogramMin] = useState(-2);
	// const [histogramMax, setHistogramMax] = useState(2);
	const [histogramBuckets, setHistogramBuckets] = useState(20);

	// State for data generation
	const [dataSize, setDataSize] = useState<DataSize | null>(null);
	const [dataGenerated, setDataGenerated] = useState(false);
	const [inputData, setInputData] = useState<tf.Tensor | null>(null);

	// State for TensorFlow model and activations
	const [model, setModel] = useState<tf.Sequential | null>(null);
	const [layerActivations, setLayerActivations] = useState<LayerStats[]>([]);
	const [isComputing, setIsComputing] = useState(false);

	useEffect(() => {
		generateData(1000);
	}
		, []);

	const displayBounds = () => {
		let min = -0.1, max = 0.1;
		layerActivations.forEach((layer) => {
			min = Math.min(min, layer.min);
			max = Math.max(max, layer.max);
		});
		return [min, max];
	}

	// Generate random data with normal distribution N(0,1)
	const generateData = async (size: DataSize) => {
		setDataSize(size);
		setDataGenerated(false);

		try {
			// Use TensorFlow to generate random data with normal distribution
			// Shape: [size, 100] - each sample has 100 dimensions
			const data = tf.randomNormal([size, 100]);

			setInputData(data);
			setDataGenerated(true);
			console.log(`Generated ${size} samples of random data with distribution N(0, 1)`);
		} catch (error) {
			console.error("Error generating data:", error);
		}
	};

	// Create a sequential model with the specified layer configuration
	const createModel = async () => {
		console.log("creating model", numLayers)
		if (!dataGenerated || !inputData) {
			console.error("Data must be generated before creating the model");
			return null;
		}

		try {
			// Create a new sequential model
			const newModel = tf.sequential();

			// Input shape for the first layer is determined by the data
			let inputShape = [inputData.shape[1]]; // [100] from the data dimensions

			// Add layers based on the slider configuration
			for (let i = 0; i < numLayers; i++) {
				const outputUnits = 2 ** nodesPerLayer[i]; // Convert slider value to actual node count

				// For the first layer, we need to specify inputShape
				const config = {
					units: outputUnits,
					// Only specify inputShape for the first layer
					...(i === 0 ? { inputShape } : {}),
					// Use the selected activation function
					activation: activationFn,
					// Don't add bias terms for this demonstration
					useBias: false
				};

				// Add the layer to the model
				// @ts-expect-error cound find type import
				const layer = tf.layers.dense(config);
				newModel.add(layer);

				// Update input shape for the next layer
				inputShape = [outputUnits];
			}

			return newModel;
		} catch (error) {
			console.error("Error creating model:", error);
			return null;
		}
	};

	// Initialize weights for the network using the specified method
	const initWeights = async (method: InitMethod) => {
		setInitMethod(method);
		// No longer creating model or computing activations here
	};

	// New function that builds model and initializes weights
	const buildModelWithWeights = async () => {
		console.log("Building model");
		if (!inputData || initMethod === 'none') {
			console.error("Input data not available or initialization method not selected");
			return null;
		}

		try {
			// Create the model based on current configuration
			const newModel = await createModel();
			if (!newModel) {
				return null;
			}

			// Get the layers from the model
			const layers = newModel.layers;

			// Initialize weights for each layer based on the method
			for (let i = 0; i < layers.length; i++) {
				const layer = layers[i];
				const weights = layer.getWeights();

				// Skip if no weights
				if (weights.length === 0) continue;

				// Get original weight tensor shape
				const weightShape = weights[0].shape;
				const inputSize = weightShape[0];
				const outputSize = weightShape[1] ? weightShape[1] : 1;
				//console.log("Layer", i, "input size:", inputSize, "output size:", outputSize);

				// Create new weight tensors based on initialization method
				let newWeights: tf.Tensor;

				switch (initMethod) {
					case 'ones':
						// All ones
						newWeights = tf.ones(weightShape);
						break;

					case 'uniform':
						// Initialize with 1/n (where n is input size)
						const uniformValue = 1 / inputSize;
						newWeights = tf.ones(weightShape).mul(tf.scalar(uniformValue));
						break;

					case 'normal_small':
						// Initialize from normal distribution N(0, 0.01)
						newWeights = tf.randomNormal(weightShape, 0, 0.01);
						break;

					case 'normal_medium':
						// Initialize from normal distribution N(0, 0.05)
						newWeights = tf.randomNormal(weightShape, 0, 0.05);
						break;

					case 'xavier':
						// Xavier/Glorot initialization
						const xavierStdDev = Math.sqrt(2 / (inputSize + outputSize));
						newWeights = tf.randomNormal(weightShape, 0, xavierStdDev);
						break;
					case 'he':
						// He initialization
						const heStdDev = Math.sqrt(2 / inputSize);
						newWeights = tf.randomNormal(weightShape, 0, heStdDev);
						break;
					default:
						// Use default weights
						continue;
				}

				// Set the new weights
				layer.setWeights([newWeights]);
			}

			return newModel;
		} catch (error) {
			console.error("Error building model with weights:", error);
			return null;
		}
	};

	// Updated function to handle the Compute Activations button click
	const handleComputeActivations = async () => {
		console.log("Computing activations...");
		if (!inputData || initMethod === 'none') {
			console.error("Input data not available or initialization method not selected");
			return;
		}

		setIsComputing(true);
		try {

			// dispose of any existing model
			if (model) {
				model.dispose();
			}

			// Build model and initialize weights
			const newModel = await buildModelWithWeights();
			if (!newModel) {
				setIsComputing(false);
				return;
			}

			// Store the model
			setModel(newModel);

			// Compute activations
			await computeActivations(newModel, inputData);
		} catch (error) {
			console.error("Error computing activations:", error);
		} finally {
			setIsComputing(false);
		}
	};

	// Compute activations through the network for the input data
	const computeActivations = async (model: tf.Sequential, inputData: tf.Tensor) => {
		console.log("Computing activations...");
		const stats: LayerStats[] = [];

		try {
			// Execute the model layer by layer and collect activations
			let currentInput = inputData;

			for (let i = 0; i < model.layers.length; i++) {
				// Create a temporary model up to this layer
				const layerOutput = tf.tidy(() => {
					return model.layers[i].apply(currentInput) as tf.Tensor;
				});
				// Calculate statistics on the output (mean, variance, min, max)
				const outputData = await layerOutput.data();
				const outputArray = Array.from(outputData);

				// Basic statistics
				const mean = outputArray.reduce((sum, val) => sum + val, 0) / outputArray.length;
				const variance = outputArray.reduce((sum, val) => sum + (val - mean) ** 2, 0) / outputArray.length;
				let min = outputArray[0] || 0;
				let max = outputArray[0] || 0;
				for (let i = 1; i < outputArray.length; i++) {
					const value = outputArray[i];
					if (value < min) {
						min = value;
					}
					if (value > max) {
						max = value;
					}
				}

				// Compute histogram data
				const bucketSize = (max - min) / histogramBuckets;
				const histogram = Array(histogramBuckets).fill(0);

				for (const val of outputArray) {
					if (val < min || val >= max) continue; // Skip values outside range
					const bucketIndex = Math.floor((val - min) / bucketSize);
					histogram[bucketIndex]++;
				}

				// Normalize histogram counts to percentages
				const totalCount = outputArray.length;
				const normalizedHistogram = histogram.map(count => count / totalCount);
				console.log("Layer", i, "mean:", mean.toFixed(2), "variance:", variance.toFixed(2), "min:", min.toFixed(2), "max:", max.toFixed(2));
				stats.push({
					layerIndex: i,
					mean,
					variance,
					min,
					max,
					histogram: normalizedHistogram
				});
				// Update for next layer (tidy automatically disposes tensors)
				tf.tidy(() => {
					// If not the last layer, use this output as the next input
					if (i < model.layers.length - 1) {
						currentInput = layerOutput;
					}
				});
			}

			setLayerActivations(stats);
			console.log("Stats generated:", stats);
		} catch (error) {
			console.error("Error computing activations:", error);
		}
	};

	// Handle changing the number of nodes in a specific layer
	const handleNodeChange = (layerIndex: number, value: number) => {
		const newNodesPerLayer = [...nodesPerLayer];
		newNodesPerLayer[layerIndex] = value;
		setNodesPerLayer(newNodesPerLayer);
	};

	// Helper for displaying numbers with consistent formatting
	const fixedDisplay = (value: number) => {
		return value.toString();
	}



	// Clean up tensors on unmount
	useEffect(() => {
		return () => {
			// Dispose of any tensors when component unmounts
			if (inputData) {
				inputData.dispose();
			}
		};
	}, [inputData]);

	const clearData = () => {
		if (model) {
			model.dispose();
		}
		setDataSize(null);
		if (inputData) {
			inputData.dispose();
		}
		setModel(null);
		setLayerActivations([]);
		setInputData(null);
		setDataGenerated(false);
	}

	return (
		<div className="space-y-6" style={{ userSelect: 'none' }}>
			{/* Data generation buttons */}
			<div className="mb-6">
				<p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
					Generate Random Data N(0, 1):
				</p>
				<div className="flex flex-wrap gap-2 justify-center">
					<button
						onClick={() => generateData(10)}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${dataSize === 10
							? 'bg-green-600 text-white'
							: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						1e1 Samples
					</button>
					<button
						onClick={() => generateData(100)}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${dataSize === 100
							? 'bg-green-600 text-white'
							: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						1e2 Samples
					</button>
					<button
						onClick={() => generateData(1000)}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${dataSize === 1000
							? 'bg-green-600 text-white'
							: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						1e3 Samples
					</button>
					<button
						onClick={() => generateData(10000)}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${dataSize === 10000
							? 'bg-green-600 text-white'
							: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						1e4 Samples
					</button>
				</div>
			</div>

			{/* Activation function selection */}
			<div className="mb-6">
				<p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
					Activation Function:
				</p>
				<div className="flex flex-wrap gap-2 justify-center">
					<button
						onClick={() => setActivationFn('linear')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activationFn === 'linear'
							? 'bg-purple-600 text-white'
							: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						Linear
					</button>
					<button
						onClick={() => setActivationFn('relu')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activationFn === 'relu'
							? 'bg-purple-600 text-white'
							: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						ReLU
					</button>
					<button
						onClick={() => setActivationFn('sigmoid')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activationFn === 'sigmoid'
							? 'bg-purple-600 text-white'
							: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						Sigmoid
					</button>
					<button
						onClick={() => setActivationFn('tanh')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activationFn === 'tanh'
							? 'bg-purple-600 text-white'
							: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={isComputing}
					>
						Tanh
					</button>
				</div>
			</div>

			{/* Weight initialization buttons */}
			<div className="mb-6">
				<p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
					Weight Initialization Method:
				</p>
				<div className="flex flex-wrap gap-2 justify-center">
					<button
						onClick={() => initWeights('ones')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'ones'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						All Ones
					</button>
					<button
						onClick={() => initWeights('uniform')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'uniform'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						Uniform
					</button>
					<button
						onClick={() => initWeights('normal_small')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'normal_small'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						N(0, 0.01)
					</button>
					<button
						onClick={() => initWeights('normal_medium')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'normal_medium'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						N(0, 0.05)
					</button>
					<button
						onClick={() => initWeights('xavier')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'xavier'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						Xavier / Glorot
					</button>
					<button
						onClick={() => initWeights('he')}
						className={`mx-auto min-w-20 px-3 py-2 rounded-md text-sm font-medium transition-colors ${initMethod === 'he'
							? 'bg-blue-600 text-white'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
							}`}
						disabled={!dataGenerated || isComputing}
					>
						He
					</button>
				</div>
			</div>

			{/* Histogram settings }
			<div className="mb-6">
				<p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
					Histogram Settings:
				</p>
				<div className="grid grid-cols-3 gap-4">
					<div>
						<label className="text-xs text-slate-600 dark:text-slate-300">Min Value: {histogramMin}</label>
						<input
							type="range"
							min="-10"
							max="0"
							step="0.5"
							value={histogramMin}
							onChange={(e) => setHistogramMin(parseFloat(e.target.value))}
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-xs text-slate-600 dark:text-slate-300">Max Value: {histogramMax}</label>
						<input
							type="range"
							min="0"
							max="10"
							step="0.5"
							value={histogramMax}
							onChange={(e) => setHistogramMax(parseFloat(e.target.value))}
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-xs text-slate-600 dark:text-slate-300">Buckets: {histogramBuckets}</label>
						<input
							type="range"
							min="5"
							max="50"
							step="5"
							value={histogramBuckets}
							onChange={(e) => setHistogramBuckets(parseInt(e.target.value))}
							className="w-full"
						/>
					</div>
				</div>
			</div>{/**/}

			{/* Number of layers slider */}
			<div className="mb-6">
				<p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
					Number of Layers: {fixedDisplay(numLayers)}
				</p>
				<div className="flex items-center justify-center">
					<input
						type="range"
						min="1"
						max="9"
						step="1"
						value={numLayers}
						onChange={(e) => setNumLayers(parseInt(e.target.value))}
					/>
				</div>
			</div>

			{/* Nodes per layer sliders - only show for active layers */}
			<div className="flex flex-row gap-3 justify-center">
				{Array.from({ length: numLayers }).map((_, index) => (
					<div className=" flex flex-row items-center mx-auto max-w-[100%]" key={`wholechart-layer-${index}`}>
						<div className="flex flex-col items-center mx-auto h-100" key={`layer-${index}`}>
							<input
								className='h-full'
								type="range"
								min="1"
								max="11"
								step="1"
								value={nodesPerLayer[index]}
								onChange={(e) => handleNodeChange(index, parseInt(e.target.value))}
								// @ts-expect-error custom vertical orient identifier
								orient="vertical"
							/>
							<div className="text-center mt-2 text-sm font-medium max-w-0" style={{ fontFamily: "monospace" }}>
								{fixedDisplay(2 ** nodesPerLayer[index])}
							</div>
						</div>
						<div className="mb-8 max-h-[85%] max-w-20 min-w-15 overflow-hidden h-full">
							{layerActivations.length > index &&
								<VerticalHistogram
									key={`histogram-${index}`}
									histogramData={layerActivations[index].histogram}
									mean={layerActivations[index].mean}
									variance={layerActivations[index].variance}
									min={displayBounds()[0]}
									max={displayBounds()[1]}
									histogramMin={layerActivations[index].min}
									histogramMax={layerActivations[index].max}
									histogramBuckets={histogramBuckets}
								/>
							}
						</div>
					</div>
				))}
			</div>

			{/* Network visualization and activation stats */}



			<div className="text-center mt-4">
				<div className="flex items-center justify-center gap-4">
					<button
						onClick={handleComputeActivations}
						className={`mx-auto px-4 py-2 rounded-md text-sm font-medium transition-colors ${dataGenerated && initMethod !== 'none'
							? 'bg-indigo-600 text-white hover:bg-indigo-700'
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
							}`}
						disabled={!dataGenerated || initMethod === 'none' || isComputing}
					>
						<div className='flex items-center justify-center'>
							Compute Activations
							<svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24" style={{ maxWidth: isComputing ? '30' : '0', opacity: isComputing ? 1 : 0, transition: 'opacity 0.4s, max-width 0.4s' }}>
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
					</button>
					<button
						onClick={() => {
							// Clear the model, activations and data
							clearData();
						}}
						className="mx-auto px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
						disabled={isComputing}
					>
						Clear Data
					</button>
				</div>
				<div className="mt-4">
					<label className="text-sm font-medium mr-2">Histogram Buckets: {histogramBuckets}</label>
					<input
						type="range"
						min="5"
						max="50"
						step="5"
						value={histogramBuckets}
						onChange={(e) => setHistogramBuckets(parseInt(e.target.value))}
						className="inline-block w-1/2"
					/>
				</div>
			</div>
		</div>
	);
};

export default XGWeightDemo;