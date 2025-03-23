'use client';

import Link from 'next/link';

export default function VideoClassification() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/toys" className="text-blue-500 hover:underline flex items-center">
          ← Back to Toys
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-6 tc1">Video Classification</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="tc2 text-lg">
          Experience real-time video classification using pre-trained deep learning models.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Introduction</h2>
        <p className="tc2">
          Video classification combines frame-by-frame analysis with temporal features to understand the content of videos.
          This demonstration showcases how modern ML systems can recognize actions and objects in video streams.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
        <div className="bg2 p-8 rounded-lg shadow-lg mb-8 text-center">
          <p className="tc2 mb-4">Placeholder for video classification demonstration</p>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <span className="tc3">Video classification tool will appear here</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Features</h2>
        <ul className="list-disc pl-6 tc2">
          <li>Real-time classification</li>
          <li>Multiple model options</li>
          <li>Upload your own videos</li>
          <li>Classification confidence scores</li>
        </ul>
      </div>
    </div>
  );
}
