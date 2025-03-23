'use client';

import Link from 'next/link';

export default function BackProp() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/toys" className="text-blue-500 hover:underline flex items-center">
          ← Back to Toys
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-6 tc1">Backpropagation Visualizer</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="tc2 text-lg">
          Visualize how neural networks learn through the backpropagation algorithm.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Introduction</h2>
        <p className="tc2">
          Backpropagation is the fundamental algorithm that powers neural network training. This demonstration
          provides an interactive visualization of how gradients flow backward through a network during training.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
        <div className="bg2 p-8 rounded-lg shadow-lg mb-8 text-center">
          <p className="tc2 mb-4">Placeholder for interactive backpropagation visualization</p>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <span className="tc3">Interactive visualization will appear here</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Concepts Explored</h2>
        <ul className="list-disc pl-6 tc2">
          <li>Chain rule of calculus</li>
          <li>Gradient descent optimization</li>
          <li>Error calculation and propagation</li>
          <li>Weight and bias updates</li>
        </ul>
      </div>
    </div>
  );
}
