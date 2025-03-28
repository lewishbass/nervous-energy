'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/sliders.css';
import '@/styles/buttons.css';
import * as tf from '@tensorflow/tfjs';
import { label } from 'framer-motion/client';

// Types
type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'linear';
type DistributionPattern = 'xor' | 'circle' | 'spiral' | 'linear';

const BackPropDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Training control states
  const [learningRate, setLearningRate] = useState(0.01);
  const [l2Regularization, setL2Regularization] = useState(0.0001);
  const [running, setRunning] = useState(false);

  const maxLayers = 5; // Max 5 hidden layers
  const maxNodes = 6; // nodes are 2^n, so 2^6 = 64 nodes max
  // Model structure states
  const [layerCount, setLayerCount] = useState(2);
  const [nodesPerLayer, setNodesPerLayer] = useState(Array(maxLayers).fill(1)); // Max layers, default max nodes
  const [activation, setActivation] = useState<ActivationFunction>('relu');

  const maxDataPoints = 1000;
  const maxClasses = 5;
  // Data configuration states
  const [dataPoints, setDataPoints] = useState(100);
  const [classCount, setClassCount] = useState(2);
  const [distribution, setDistribution] = useState<DistributionPattern>('xor');
  const [dataNoise, setDataNoise] = useState(0.1);

  // Data storage states - always maintain maxDataPoints
  const [data, setData] = useState<tf.Tensor2D | null>(null);
  const [noise, setNoise] = useState<tf.Tensor2D | null>(null);
  const [labels, setLabels] = useState<tf.Tensor2D | null>(null);
  const [classLabels, setClassLabels] = useState<tf.Tensor1D | null>(null);

  // Function to generate data based on the selected distribution pattern
  const generateData = () => {
    // Clean up existing tensors to prevent memory leaks
    if (data) data.dispose();
    if (noise) noise.dispose();
    if (labels) labels.dispose();
    if (classLabels) classLabels.dispose();

    const numPoints = maxDataPoints;
    let xData: tf.Tensor2D;
    let yLabels: tf.Tensor2D;
    let noiseData: tf.Tensor2D;
    let yClass: tf.Tensor1D;

    // Generate random noise based on user-defined noise level
    noiseData = tf.randomNormal([numPoints, 2], 0, 1);

    // Generate random data in the range [-1, 1] for both x1 and x2
    xData = tf.randomUniform([numPoints, 2], -1, 1);

    // Generate labels based on the selected distribution pattern
    switch (distribution) {
      case 'xor':
        // XOR pattern: (x1 > 0 XOR x2 > 0)
        yClass = tf.tidy(() => {
          const x1 = tf.slice(xData, [0, 0], [numPoints, 1]);
          const x2 = tf.slice(xData, [0, 1], [numPoints, 1]);

          // XOR logic: class 1 if (x1 > 0 && x2 < 0) || (x1 < 0 && x2 > 0)
          const x1Positive = x1.greater(tf.scalar(0));
          const x2Positive = x2.greater(tf.scalar(0));

          const xorResult = x1Positive.logicalXor(x2Positive);

          if (classCount === 2) {
            return xorResult.cast('float32').cast('int32');
          } else {
            // For more than 2 classes in XOR pattern (distribute among regions)
            const classValues = tf.add(
              tf.mul(x1Positive.cast('int32'), 2),
              x2Positive.cast('int32')
            ).mod(tf.scalar(classCount));

            return classValues.cast('int32');
          }
        });
        break;

      case 'circle':
        // Circle pattern: class based on distance from origin
        yClass = tf.tidy(() => {
          const x1 = tf.slice(xData, [0, 0], [numPoints, 1]);
          const x2 = tf.slice(xData, [0, 1], [numPoints, 1]);

          // Calculate distance from origin
          const distance = x1.square().add(x2.square()).sqrt();

          if (classCount === 2) {
            // Binary classification: inside or outside circle (radius = 0.5)
            return distance.less(tf.scalar(0.5)).cast('float32').cast('int32');
          } else {
            // Multi-class: create concentric rings
            const scaledDistance = distance.mul(tf.scalar(classCount * 0.9));
            return scaledDistance.floor().mod(tf.scalar(classCount)).cast('int32');
          }
        });
        break;

      case 'spiral':
        // Recreate data with spiral pattern
        xData.dispose(); // Clean up the uniform data

        // Create spiral data
        // @ts-expect-error: Tidy function not defined in types
        xData = tf.tidy(() => {
          const t = tf.linspace(0, 1, numPoints);
          const indices = tf.range(0, numPoints);
          const classIndices = indices.mod(tf.scalar(classCount)).cast('int32');

          // Radius increases with t
          const r = t.mul(tf.scalar(0.9)).add(tf.scalar(0.1));

          // Different starting angle for each class
          const theta = t.mul(tf.scalar(3 * Math.PI))
            .add(classIndices.cast('float32').mul(tf.scalar(2 * Math.PI / classCount)));

          const x1 = r.mul(theta.cos());
          const x2 = r.mul(theta.sin());

          return tf.stack([x1.arraySync(), x2.arraySync()], 1);
        });

        // Generate labels for spiral
        yClass = tf.tidy(() => {
          const indices = tf.range(0, numPoints);
          const classIndices = indices.mod(tf.scalar(classCount));
          return classIndices.cast('int32');
        });
        break;

      case 'linear':
        // Linear separator pattern
        yClass = tf.tidy(() => {
          const x1 = tf.slice(xData, [0, 0], [numPoints, 1]);
          const x2 = tf.slice(xData, [0, 1], [numPoints, 1]);

          if (classCount === 2) {
            // Binary classification: x1 + x2 > 0
            return x1.add(x2).greater(tf.scalar(0)).cast('float32').cast('int32');
          } else {
            // Multi-class: divide space into classCount regions based on angle
            const angle = tf.atan2(x2, x1);  // Returns angle in radians
            const normalized = angle.add(tf.scalar(Math.PI)).div(tf.scalar(2 * Math.PI));  // Normalize to [0, 1]
            const classIdx = normalized.mul(tf.scalar(classCount)).floor();
            return classIdx.cast('int32');
          }
        });
        break;

      default:
        // Default to random classes if unknown pattern
        yClass = tf.tidy(() => {
          return tf.randomUniform([numPoints], 0, classCount, 'int32');
        });
    }
    // @ts-expect-error: Tidy function not defined in types
    yLabels = tf.oneHot(yClass, classCount);

    // Add noise to the data if specified
    // const noisyData = tf.add(xData, noiseData);

    // Set the state with the new data
    setData(xData);
    setNoise(noiseData);
    setLabels(yLabels);
    setClassLabels(yClass);

    xData.array().then((dataArr) => {
      yLabels.array().then((labelArr) => {
        console.log("Label Length: ", labelArr[0].length);
        for (let i = 0; i < labelArr[0].length; i++) {
          console.log(labelArr[0][i]);
        }
      });
    });

    console.log("Data generated:", {
      distribution,
      classCount,
      noiseLevel: dataNoise,
      dataShape: xData.shape,
      labelsShape: yLabels.shape
    });


  };

  useEffect(() => {
    generateData();
    console.log("Data generated");
  }, [distribution, classCount]);

  useEffect(() => {
    updateDisplay(data, noise, classLabels, dataNoise);
  }, [data, noise, classLabels, dataNoise, dataPoints]);

  // Clean up tensors on component unmount
  useEffect(() => {
    return () => {
      if (data) data.dispose();
      if (noise) noise.dispose();
      if (labels) labels.dispose();
      if (classLabels) classLabels.dispose();
    };
  }, []);

  const updateDisplay = (data: tf.Tensor2D | null = null, noise: tf.Tensor2D | null = null, labels: tf.Tensor1D | null = null, noiseInt: number | null = null) => {
    // draws datapoints canvas
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (!data || !labels || !noise) return;
    if (!noiseInt) noiseInt = 0;

    tf.add(data, noise.mul(tf.scalar(noiseInt))).array().then((dataArr) => {
      labels.array().then((labelArr) => {
        for (let i = 0; i < dataPoints; i++) {
          const x = (dataArr[i][0] + 1) * 250;
          const y = (1 - dataArr[i][1]) * 250;
          //console.log(label);

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = `hsl(${labelArr[i] * 360 / classCount}, 70%, 50%)`;
          ctx.fill();
        }
      });
    });

  };

  // Placeholder for actual visualization logic
  useEffect(() => {
    updateDisplay();
    return;

    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw placeholder visualization
    ctx.fillStyle = 'rgba(80, 100, 240, 0.6)';
    ctx.fillRect(50, 50, 100, 100);
    
    ctx.fillStyle = 'rgba(240, 80, 100, 0.6)';
    ctx.fillRect(150, 150, 100, 100);
    
    // Draw connections between layers
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(400, 200);
    ctx.stroke();
    
    // Draw text labels
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Input Layer', 100, 40);
    ctx.fillText('Hidden Layer', 350, 140);
    
  }, [canvasRef, learningRate, layerCount, running]);

  const toggleTraining = () => {
    setRunning(!running);
  };

  // Handle changing the number of nodes in a specific layer
  const handleNodeChange = (layerIndex: number, value: number) => {
    const newNodesPerLayer = [...nodesPerLayer];
    newNodesPerLayer[layerIndex] = value;
    setNodesPerLayer(newNodesPerLayer);
  };

  return (
    <div className="p-0 rounded-lg shadow-lg m-0" style={{ userSelect: 'none' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 aspect-square">
        {/* Canvas Section (Top Left) */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 p-2 flex items-center justify-center">
          <canvas 
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Training Controls Section (Top Right) */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Training Controls</h3>

          <div className="space-y-2">
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Learning Rate: {learningRate.toFixed(4)}
              </label>
              <input
                type="range" 
                min="0.0001"
                max="0.1"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                L2 Regularization: {l2Regularization.toFixed(6)}
              </label>
              <input
                type="range"
                min="0"
                max="0.01"
                step="0.0001"
                value={l2Regularization}
                onChange={(e) => setL2Regularization(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={toggleTraining}
              className={`w-full py-2 pb-3 px-4 rounded-md transition-colors overflow-hidden ${running ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
              <div className="relative h-6">
                <div className="absolute inset-0 "
                  style={{ transform: running ? 'translateY(0)' : 'translateY(-100%)', opacity: running ? 1 : 0, transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                  Stop Training
                </div>
                <div className="absolute inset-0 "
                  style={{ transform: running ? 'translateY(100%)' : 'translateY(0)', opacity: running ? 0 : 1, transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                  Start Training
                </div>
              </div>
            </button>
          </div>
          {/* Training Stats moved into the data section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Training Stats:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div>Loss: <span className="font-mono">0.0324</span></div>
              <div>Accuracy: <span className="font-mono">96.8%</span></div>
              <div>Iterations: <span className="font-mono">0</span></div>
              <div>Gradient Norm: <span className="font-mono">0.0021</span></div>
            </div>
          </div>
        </div>

        {/* Model Structure Section (Bottom Left) */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 p-4 ">
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Model Structure</h3>

          <div className="space-y-2">
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Hidden Layers: {layerCount}
              </label>
              <input
                type="range"
                min="1"
                max={maxLayers}
                step="1"
                value={layerCount}
                onChange={(e) => setLayerCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Vertical nodes per layer sliders */}
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Nodes per Layer
              </label>
              <div className="flex justify-around items-end h-40 mt-2">
                {Array.from({ length: layerCount }).map((_, index) => (
                  <div key={`layer-${index}`} className="flex flex-col items-center">
                    <input
                      type="range"
                      min="2"
                      max={maxNodes}
                      step="1"
                      value={nodesPerLayer[index]}
                      onChange={(e) => handleNodeChange(index, parseInt(e.target.value))}
                      className="h-32"
                      // @ts-expect-error custom vertical orient identifier
                      orient="vertical"
                    />
                    <span className="text-xs font-mono mt-2">{2 ** nodesPerLayer[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activation Function Buttons */}
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Activation Function:
              </label>
              <div className="button-group">
                <button
                  onClick={() => setActivation('relu')}
                  className={`control-button ${activation === 'relu' ? 'button-active' : 'button-secondary'}`}
                >
                  ReLU
                </button>
                <button
                  onClick={() => setActivation('sigmoid')}
                  className={`control-button ${activation === 'sigmoid' ? 'button-active' : 'button-secondary'}`}
                >
                  Sigmoid
                </button>
                <button
                  onClick={() => setActivation('tanh')}
                  className={`control-button ${activation === 'tanh' ? 'button-active' : 'button-secondary'}`}
                >
                  Tanh
                </button>
                <button
                  onClick={() => setActivation('linear')}
                  className={`control-button ${activation === 'linear' ? 'button-active' : 'button-secondary'}`}
                >
                  Linear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Configuration Section + Stats (Bottom Right) */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Data Configuration</h3>

          <div className="space-y-2">
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Data Points: {dataPoints}
              </label>
              <input
                type="range"
                min="10"
                max={maxDataPoints}
                step="10" 
                value={dataPoints}
                onChange={(e) => setDataPoints(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Classes: {classCount}
              </label>
              <input
                type="range"
                min="2"
                max={maxClasses}
                step="1"
                value={classCount}
                onChange={(e) => setClassCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-600 dark:text-slate-400'>
                Data Noise: {dataNoise}
              </label>
              <input
                type='range'
                min='0'
                max='0.5'
                step='0.01'
                value={dataNoise}
                onChange={(e) => setDataNoise(parseFloat(e.target.value))}
                className='w-full'
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Distribution Pattern:
              </label>
              <div className="button-group ">
                <button
                  onClick={() => setDistribution('xor')}
                  className={`control-button ${distribution === 'xor' ? 'button-active' : 'button-secondary'}`}
                >
                  XOR
                </button>
                <button
                  onClick={() => setDistribution('circle')}
                  className={`control-button ${distribution === 'circle' ? 'button-active' : 'button-secondary'}`}
                >
                  Circle
                </button>
                <button
                  onClick={() => setDistribution('spiral')}
                  className={`control-button ${distribution === 'spiral' ? 'button-active' : 'button-secondary'}`}
                >
                  Spiral
                </button>
                <button
                  onClick={() => setDistribution('linear')}
                  className={`control-button ${distribution === 'linear' ? 'button-active' : 'button-secondary'}`}
                >
                  Linear
                </button>
              </div>
            </div>
            <button
              onClick={generateData}
              className={`w-full py-2 pb-3 px-4 rounded-md transition-colors overflow-hidden bg-purple-600 hover:bg-purple-700 text-white`}
            >
              <div className="relative h-6">
                <div className="absolute inset-0">
                  Shuffle Data
                </div>
              </div>
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default BackPropDemo;
