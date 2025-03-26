'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/sliders.css';
import '@/styles/buttons.css';
import * as tf from '@tensorflow/tfjs';
import Image from 'next/image';

import { ResponsiveContainer, XAxis, YAxis, ComposedChart, Line } from 'recharts';

// TODO
// - fix error when slicing noise
// - get training to actually stop
// - render limits on separate background canvas
// - testing data
// - get on the fly parameter changes to effect model
// - epoch counter




// Types
type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'linear';
type DistributionPattern = 'xor' | 'circle' | 'spiral' | 'linear';
type InitializerType = 'glorotNormal' | 'heNormal' | 'leCunNormal';

type TrainingHistory = {
  loss: number;
  accuracy: number;
  epoch: number;
}

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
  const [weightInitializer, setWeightInitializer] = useState<InitializerType>('heNormal');

  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [refreshModel, setRefreshModel] = useState(true);
  let isTraining = false;
  let isLooping = false;


  const [modelLoss, setModelLoss] = useState<number | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const [modelIterations, setModelIterations] = useState<number | null>(null);

  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>([]);


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

  // Native data for display
  const [classLabels, setClassLabels] = useState<Array<number> | null>(null);
  const [dataDisplay, setDataDisplay] = useState<Array<Array<number>> | null>(null);
  const [noiseDisplay, setNoiseDisplay] = useState<Array<Array<number>> | null>(null);


  /*const shortenHistory = (history: TrainingHistory[], everyn: number) => {
    console.log("everyn:", everyn);
    const shortenedHistory = []
    let lastEpoch = -1000;
    for (let i = 0; i < history.length; i++) {
      if (history[i].epoch - lastEpoch >= everyn) {
        shortenedHistory.push({ ...history[i] });
        lastEpoch = history[i].epoch;
      }
    }
    console.log("Shortened history:", shortenedHistory.length);
    return shortenedHistory;
  };*/

  // Function to generate data based on the selected distribution pattern
  const generateData = () => {

    // Clean up existing tensors to prevent memory leaks
    if (data) data.dispose();
    if (noise) noise.dispose();
    if (labels) labels.dispose();

    const numPoints = maxDataPoints;
    let xData: tf.Tensor2D;
    let yLabels: tf.Tensor2D;
    let noiseData: tf.Tensor2D;
    let yClass: tf.Tensor1D;



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
          const r = t.mul(tf.scalar(0.9)).add(tf.scalar(0.05));

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

    // shuffle the data
    const indices = tf.util.createShuffledIndices(numPoints);
    const indicesTensor = tf.tensor1d(Array.from(indices), 'int32');
    const shuffledData = tf.gather(xData, indicesTensor);
    const shuffledLabels = tf.gather(yClass, indicesTensor);
    indicesTensor.dispose(); // Clean up the tensor to prevent memory leaks
    xData.dispose();
    yClass.dispose();


    // @ts-expect-error: Tidy function not defined in types
    yLabels = tf.oneHot(shuffledLabels, maxClasses);
    // remove extra dimension
    yLabels = yLabels.squeeze();

    // Log the shape of labels for debugging
    console.log("Labels shape:", yLabels.shape);

    // Set the state with the new data
    setData(shuffledData);
    setLabels(yLabels);

    shuffledLabels.array().then((labelArr) => {
      setClassLabels(labelArr);
    });
    shuffledData.array().then((dataArr) => {
      setDataDisplay(dataArr);
    });

    // Generate random noise based on user-defined noise level
    if (!noise || noise.shape[0] !== maxDataPoints || noise.shape[1] !== 2) {
      console.log("Generating new noise data");
      if (noise) noise.dispose();
      noiseData = tf.randomNormal([maxDataPoints, 2], 0, 1);
      setNoise(noiseData);
      noiseData.array().then((noiseArr) => {
        setNoiseDisplay(noiseArr);
      });
    }


    console.log("Data generated:", {
      distribution,
      classCount,
      noiseLevel: dataNoise,
      dataShape: shuffledData.shape,
      labelsShape: yLabels.shape
    });


  };

  useEffect(() => {
    generateData();
    console.log("Data generated");
  }, [distribution, classCount]);

  useEffect(() => {
    updateDisplay(dataDisplay, noiseDisplay, classLabels, dataNoise, dataPoints);
  }, [classLabels, dataDisplay, noiseDisplay, dataNoise, dataPoints]);

  // Clean up tensors on component unmount
  useEffect(() => {
    return () => {
      if (data) data.dispose();
      if (noise) noise.dispose();
      if (labels) labels.dispose();
    };
  }, []);

  const updateDisplay = (data: Array<Array<number>> | null = null, noise: Array<Array<number>> | null = null, labels: Array<number> | null = null, noiseInt: number | null = null, dataPoints: number | null = null) => {
  // draws datapoints canvas
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;


    if (!data || !labels || !noise) return;
    if (!noiseInt) noiseInt = 0;
    if (!dataPoints) dataPoints = data.length;


    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let i = 0; i < dataPoints; i++) {
      const x = (data[i][0] + noise[i][0] * noiseInt + 1) * 250;
      const y = (1 - data[i][1] - noise[i][1] * noiseInt) * 250;
    //console.log(label);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${labels[i] * 360 / classCount}, 70%, 50%)`;
      ctx.fill();
    }

  };

  const toggleTraining = () => {
    // Build model if it doesn't exist or needs refresh
    if (!model) {
      buildModel();
    }
    setRunning(!running);
  };

  // when network parameters are updated, set refreshModel to true
  useEffect(() => {
    setRefreshModel(true);
  }, [layerCount, nodesPerLayer, weightInitializer, activation]);


  // regularization, learning rate
  useEffect(() => {


    if (!model) return;

    model.layers.forEach((layer) => {
      const denseLayer = layer;
      if (!(denseLayer instanceof tf.layers.dense)) return;
      if (denseLayer.kernelRegularizer) {
        denseLayer.kernelRegularizer.dispose();
        denseLayer.kernelRegularizer = tf.regularizers.l2({ l2: l2Regularization });
      }
    });

    // Recompile the model to apply the changes
    model.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    console.log(`Updated model learning rate to ${learningRate}, and regularization to ${l2Regularization}`);
  }, [model, learningRate, l2Regularization]);



  // Handle changing the number of nodes in a specific layer
  const handleNodeChange = (layerIndex: number, value: number) => {
    const newNodesPerLayer = [...nodesPerLayer];
    newNodesPerLayer[layerIndex] = value;
    setNodesPerLayer(newNodesPerLayer);
  };

  //activation function


  const buildModel = () => {
    // reset training history
    setTrainingHistory([]);

    // stop other models training
    setRunning(false);
    isTraining = false;

    // Clean up existing model to prevent memory leaks
    if (model) model.dispose();

    // Create a new sequential model
    const newModel = tf.sequential();

    // Weight initializer
    let kernelInitializer = tf.initializers.glorotNormal({ seed: 42 });
    switch (weightInitializer) {
      case 'heNormal':
        kernelInitializer = tf.initializers.heNormal({ seed: 42 });
        break;
      case 'leCunNormal':
        kernelInitializer = tf.initializers.leCunNormal({ seed: 42 });
        break;
    }

    // Add the input layer
    newModel.add(tf.layers.dense({
      units: nodesPerLayer[0],
      inputShape: [2],
      activation: activation,
      kernelRegularizer: tf.regularizers.l2({ l2: l2Regularization }),
      kernelInitializer: kernelInitializer,
    }));

    // Add the hidden layers
    for (let i = 1; i < layerCount; i++) {
      newModel.add(tf.layers.dense({
        units: nodesPerLayer[i],
        activation: activation,
        kernelRegularizer: tf.regularizers.l2({ l2: l2Regularization }),
      }));
    }

    // Add the output layer
    newModel.add(tf.layers.dense({
      units: maxClasses,
      activation: 'softmax',
      kernelRegularizer: tf.regularizers.l2({ l2: l2Regularization }),
    }));

    // compile the model
    newModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    setModel(newModel);
    setRefreshModel(false);

  };


  const trainModel = async () => {
    if (!model || !data || !labels) return;
    if (isTraining) return;
    try {
      // Create slices of data based on dataPoints setting
      const inputData = tf.tidy(() => data!.slice([0, 0], [dataPoints, 2]));

      // Fix for the labels slicing - get shape first to handle it properly
      const outputLabels = tf.tidy(() => {
        // Check the shape of labels to avoid dimension errors
        const labelShape = labels!.shape;

        if (labelShape.length === 2) {
          // If labels is already 2D with shape [numPoints, classes]
          return labels!.slice([0, 0], [dataPoints, labelShape[1]]);
        } else {
          // If labels has a different shape, reshape or handle accordingly
          console.warn("Labels have unexpected shape:", labelShape);
          // Just use first dataPoints rows and all columns
          return labels!.slice([0, 0], [dataPoints, -1]);
        }
      });

      // Add noise to input data if available
      const noisyInputData = tf.tidy(() => {
        if (noise && dataNoise > 0 && false) {
          console.log("noisyInputData:", dataPoints, noise.shape);
          const noiseSlice = noise.slice([0, 0], [dataPoints, 2]);
          console.log("noiseSlice:", noiseSlice.shape);
          return inputData.add(noiseSlice.mul(tf.scalar(dataNoise)));
        }
        return inputData;
      });

      // Log shapes for debugging

      // Train for one epoch
      const result = await model.fit(noisyInputData, outputLabels, {
        epochs: 1,
        batchSize: 32,
        shuffle: true,
        validationSplit: 0.1
      });

      // Update stats
      const loss = result.history.loss[0] as number;
      const accuracy = result.history.acc[0] as number;

      // Update history and state
      const iterations = trainingHistory.length > 0
        ? trainingHistory[trainingHistory.length - 1].epoch + 1
        : 0;

      setTrainingHistory(prev => [
        ...prev,
        { loss, accuracy, epoch: iterations }
      ]);

      setModelLoss(loss);
      setModelAccuracy(accuracy);
      setModelIterations(iterations);

      // Clean up tensors
      inputData.dispose();
      outputLabels.dispose();
      noisyInputData.dispose();
    } catch (error) {
      console.error("Training error:", error);
      setRunning(false);
      isTraining = false;
    } finally {
      isTraining = false;

    }
  }

  const loop = async () => {
    if (running && model && !isTraining) {
      isTraining = true;
      await trainModel();

      // After model is trained, predict and update visualization
      if (data && model) {
        tf.tidy(() => {
          // Get a grid of points to visualize decision boundaries
          const gridSize = 50;
          const gridPoints = [];
          for (let x = -1; x <= 1; x += 2 / gridSize) {
            for (let y = -1; y <= 1; y += 2 / gridSize) {
              gridPoints.push([x, y]);
            }
          }

          const gridTensor = tf.tensor2d(gridPoints);
          const predictions = model.predict(gridTensor) as tf.Tensor;
          const predictedClasses = predictions.argMax(1);

          // Draw decision boundaries on canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              // Draw background first
              for (let i = 0; i < gridPoints.length; i++) {
                const x = (gridPoints[i][0] + 1) * 250;
                const y = (1 - gridPoints[i][1]) * 250;
                const classIdx = predictedClasses.dataSync()[i];

                ctx.fillStyle = `hsla(${classIdx * 360 / classCount}, 70%, 50%, 0.2)`;
                ctx.fillRect(x - 2, y - 2, 4, 4);
              }

              // Draw data points on top
              //updateDisplay(dataDisplay, noiseDisplay, classLabels, dataNoise, dataPoints);
            }
          }

          gridTensor.dispose();
          predictions.dispose();
          predictedClasses.dispose();
        });
      }
    }

    if (running && isLooping) {
      console.log("requesting animation frame", running, isLooping);
      requestAnimationFrame(loop);
    }
  };
  // Run training loop when running is true
  useEffect(() => {
    if (running) {
      isLooping = true;
      loop();
    } else {
      isLooping = false;
    }
  }, [running]);

  return (
    <div className="p-0 rounded-lg shadow-lg m-0" style={{ userSelect: 'none' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 aspect-square">
        {/* Canvas Section (Top Left) */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 p-2 flex items-center justify-center relative">
          {/* Background image */}
          <div className="aspect-square relative z-10">
            <div className="absolute inset-0 z-0 overflow-hidden invert dark:invert-0">
              <Image
                src="/grid.svg"
                alt="coordinate grid"
                className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-10 dark:opacity-10 select-none pointer-events-none"
                width={100}
                height={100}
                style={{
                  userSelect: "none",
                  transformOrigin: "center center", // Ensure rotation happens from the center
                }}
              />
            </div>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full h-full object-contain relative z-10"
            />
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
            <div>
              <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                Weight Initializer:
              </label>
              <div className="button-group">
                <button
                  onClick={() => setWeightInitializer('glorotNormal')}
                  className={`control-button ${weightInitializer === 'glorotNormal' ? 'button-active' : 'button-secondary'}`}
                >
                  Glorot
                </button>
                <button
                  onClick={() => setWeightInitializer('heNormal')}
                  className={`control-button ${weightInitializer === 'heNormal' ? 'button-active' : 'button-secondary'}`}
                >
                  He
                </button>
                <button
                  onClick={() => setWeightInitializer('leCunNormal')}
                  className={`control-button ${weightInitializer === 'leCunNormal' ? 'button-active' : 'button-secondary'}`}
                >
                  LeCun
                </button>
              </div>
            </div>
          </div>
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
                L2 Regularization: {l2Regularization.toFixed(4)}
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

            <div className="flex flex-col gap-2">
              <button
                onClick={toggleTraining}
                className={`w-full py-2 pb-3 px-4 rounded-md transition-colors overflow-hidden ${running ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                <div className="relative h-6">
                  <div className="absolute inset-0"
                    style={{ transform: running ? 'translateY(0)' : 'translateY(-100%)', opacity: running ? 1 : 0, transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                    Stop Training
                  </div>
                  <div className="absolute inset-0 "
                    style={{ transform: running ? 'translateY(100%)' : 'translateY(0%)', opacity: !running ? 1 : 0, transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                    Start Training
                  </div>
                </div>
              </button>

              <button
                onClick={buildModel}
                className={`w-full py-2 pb-3 px-4 rounded-md transition-colors text-white ${refreshModel ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Reset Model
              </button>
            </div>
          </div>
          {/* Training Stats moved into the data section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Training Stats:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div style={{ color: "var(--khb)" }}>Loss: <span className="font-mono">{modelLoss !== null ? modelLoss.toFixed(4) : '0.0000'}</span></div>
              <div style={{ color: "var(--kho)" }}>Accuracy: <span className="font-mono">{modelAccuracy !== null ? `${(modelAccuracy * 100).toFixed(1)}%` : '0.0%'}</span></div>
              <div>Epoch: <span className="font-mono">{modelIterations !== null ? modelIterations : '0'}</span></div>
            </div>
          </div>

          {/* Loss history chart */}
          {trainingHistory.length > 1 && <ResponsiveContainer height={100} width="100%" >
            <ComposedChart
              data={trainingHistory}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="epoch" hide xAxisId="epoch" />
              <YAxis dataKey="loss" hide />
              <YAxis dataKey="accuracy" hide yAxisId="accuracy" />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="var(--khb)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="Loss"
                xAxisId="epoch"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="var(--kho)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="Accuracy"
                yAxisId="accuracy"
                xAxisId="epoch"
              />
            </ComposedChart>
          </ResponsiveContainer>}


        </div>
      </div>
    </div>
  );
};

export default BackPropDemo;
