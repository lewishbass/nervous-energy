'use client';

import Link from 'next/link';
import CircleAnimation from '@/components/backgrounds/CircleAnimmation';
import { useEffect } from 'react';
import 'mathjax-full/es5/tex-mml-chtml.js'; // Import MathJax

export default function XGWeightInit() {
  useEffect(() => {
    // Typescript doesn't know about window.MathJax
    // @ts-ignore
    if (typeof window !== 'undefined' && window.MathJax) {
      // Typescript doesn't know about window.MathJax
      // @ts-ignore
      window.MathJax.typeset();
    }
  }, []);// add [] dependency to run only once

  return (
    <div className="relative min-h-screen">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10 invert dark:invert-0">
        <CircleAnimation
          radiusRange={[10, 800]}
          seed={123}
          style={{ opacity: 0.5 }}
        />
      </div>

      {/* Content with slight transparency for background visibility */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2">
        <div className="mb-6">
          <Link
            href="/toys"
            className="inline-flex items-center px-4 py-2 opacity-60 backdrop-blur-sm rounded-lg tc4 hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
            style={{ background: "var(--khg)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Toys
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-6 tc1">XG Weight Initialization</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="tc2 text-lg">
            Explore how different weight initialization techniques affect neural network training.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Introduction</h2>
          <p className="be">
            Weight initialization is a critical aspect of training deep neural networks. The initial values of weights can
            significantly impact whether a network converges during training, how quickly it converges, and the quality of the final model.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Problem</h2>
          <p className="be">
            When training neural networks, we need to initialize weights with values that facilitate gradient flow. 
            Poor initialization can lead to issues like:
            
            <ul className="list-disc pl-6 mt-2">
              <li>Vanishing gradients</li>
              <li>Exploding gradients</li>
              <li>Slow convergence</li>
              <li>Getting stuck in poor local minima</li>
            </ul>
            
            The variance of activations and gradients through a neural network depends on how weights are initialized.
            For a layer with <b className="tc1">n</b> inputs and <b className="tc1">m</b> outputs, we need to choose appropriate weight distributions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Mathematical Foundations</h2>
          <p className="be">
            <p className="mb-4">
              For the Xavier/Glorot initialization, weights are drawn from a distribution with:
            </p>
            <div className="eq">
              {`\\[\\Large
                Var(W) = \\frac{2}{n_{in} + n_{out}}
              \\]`}
            </div>
            
            <p className="mb-4">
              For He initialization, weights are drawn from:
            </p>
            <div className="eq">
              {`\\[\\Large
                Var(W) = \\frac{2}{n_{in}}
              \\]`}
            </div>
            
            <p className="mb-4">
              For a neural network layer with form <b className="tc1">Y = WX + b</b>, the variance of the output is:
            </p>
            <div className="eq">
              {`\\[\\Large
                Var(Y) = n_{in} \\cdot Var(W) \\cdot Var(X)
              \\]`}
            </div>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
          <div className="be">
            <div className="bg2 p-8 rounded-lg shadow-lg mb-8 text-center backdrop-blur-sm bg-opacity-80">
              <p className="mb-4">Experiment with different weight initialization techniques and observe their effects on neural network training:</p>
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <span className="tc3">Interactive visualization will appear here</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Techniques Explored</h2>
          <div className="be">
            <ul className="list-disc pl-6">
              <li><b className="tc1">Xavier/Glorot Initialization</b> - Designed for layers with linear activations</li>
              <li><b className="tc1">He Initialization</b> - Optimized for ReLU activation functions</li>
              <li><b className="tc1">Random Normal/Uniform Initialization</b> - Traditional approaches with various drawbacks</li>
              <li><b className="tc1">Orthogonal Initialization</b> - Preserves gradient norms in linear networks</li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Concepts</h2>
          <ul className="list-disc pl-6 tc2">
            <li>Proper initialization is crucial for efficient deep learning</li>
            <li>Different activation functions benefit from different initialization strategies</li>
            <li>Modern strategies aim to maintain variance across layers</li>
            <li>Good initialization can dramatically reduce training time</li>
          </ul>
          <div className='mb-100'/>
        </div>
      </div>
    </div>
  );
}
