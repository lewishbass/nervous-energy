'use client';

import React, { useState, useEffect, useRef } from 'react';

const BackPropDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [learningRate, setLearningRate] = useState(0.1);
  const [epochs, setEpochs] = useState(100);
  const [running, setRunning] = useState(false);

  // Placeholder for actual visualization logic
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw placeholder visualization
    ctx.fillStyle = 'rgba(80, 100, 240, 0.6)';
    ctx.fillRect(50, 50, 200, 100);
    
    ctx.fillStyle = 'rgba(240, 80, 100, 0.6)';
    ctx.fillRect(300, 150, 200, 100);
    
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
    
  }, [canvasRef, learningRate, epochs, running]);

  const startTraining = () => {
    setRunning(true);
    // Implement actual training logic here
    setTimeout(() => setRunning(false), 3000);
  };

  return (
    <div className="p-0 rounded-lg shadow-lg mb-0">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <canvas 
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full h-64 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700"
          />
        </div>
        
        <div className="w-full sm:w-64 space-y-4">
          <div>
            <label className="block mb-2 tc2">Learning Rate</label>
            <input 
              type="range" 
              min="0.001" 
              max="0.5" 
              step="0.001" 
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-right tc3">{learningRate.toFixed(3)}</div>
          </div>
          
          <div>
            <label className="block mb-2 tc2">Epochs</label>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10" 
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-right tc3">{epochs}</div>
          </div>
          
          <button
            onClick={startTraining}
            disabled={running}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
          >
            {running ? 'Training...' : 'Start Training'}
          </button>
        </div>
      </div>
      
      <div className="mt-6 tc2">
        <h3 className="font-semibold mb-2">Stats:</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>Loss: <span className="font-mono">0.0324</span></div>
          <div>Accuracy: <span className="font-mono">96.8%</span></div>
          <div>Iterations: <span className="font-mono">0/{epochs}</span></div>
          <div>Gradient Norm: <span className="font-mono">0.0021</span></div>
        </div>
      </div>
    </div>
  );
};

export default BackPropDemo;
