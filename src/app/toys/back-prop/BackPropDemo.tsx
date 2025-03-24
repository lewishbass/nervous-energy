'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/sliders.css';
import '@/styles/buttons.css';

// Types
type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'linear';
type DistributionPattern = 'xor' | 'circle' | 'spiral' | 'linear';

const BackPropDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Training control states
  const [learningRate, setLearningRate] = useState(0.01);
  const [l2Regularization, setL2Regularization] = useState(0.0001);
  const [running, setRunning] = useState(false);

  // Model structure states
  const [layerCount, setLayerCount] = useState(2);
  const [nodesPerLayer, setNodesPerLayer] = useState(Array(5).fill(8)); // Max 5 layers, default 8 nodes
  const [activation, setActivation] = useState<ActivationFunction>('relu');

  // Data configuration states
  const [dataPoints, setDataPoints] = useState(100);
  const [classCount, setClassCount] = useState(2);
  const [distribution, setDistribution] = useState<DistributionPattern>('xor');

  // Placeholder for actual visualization logic
  useEffect(() => {
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
    <div className="p-0 rounded-lg shadow-lg mb-0" style={{ userSelect: 'none' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 aspect-square">
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

          <div className="space-y-4">
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

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Hidden Layers: {layerCount}
              </label>
              <input
                type="range"
                min="1"
                max="5"
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
                      max="32"
                      step="1"
                      value={nodesPerLayer[index]}
                      onChange={(e) => handleNodeChange(index, parseInt(e.target.value))}
                      className="h-32"
                      // @ts-expect-error custom vertical orient identifier
                      orient="vertical"
                    />
                    <span className="text-xs font-mono mt-2">{nodesPerLayer[index]}</span>
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

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Data Points: {dataPoints}
              </label>
              <input
                type="range"
                min="10"
                max="1000"
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
                max="5"
                step="1"
                value={classCount}
                onChange={(e) => setClassCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Distribution Pattern:
              </label>
              <div className="button-group">
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


          </div>
        </div>
      </div>
    </div>
  );
};

export default BackPropDemo;
