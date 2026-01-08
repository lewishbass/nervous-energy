"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Unit4Quiz() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-4xl mx-auto mb-20">
        <p className="tc1 text-2xl">Please <span className="font-bold hover:opacity-70 cursor-pointer text-indigo-500 bg-green-300 p-2 px-3 rounded-full transition-all duration-300" onClick={() => router.push('/classes/python-automation/exercises/unit-4-quiz?openAuth=true')}>log in / register</span> to access this quiz.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src="/images/classes/Python-logo-notext.svg"
            alt="Python Logo"
            width={80}
            height={80}
            className="rounded-lg cursor-pointer"
            onClick={() => router.push('/classes/python-automation')}
          />
          <div>
            <h1 className="text-4xl font-bold tc1">Unit 4 Quiz</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 4: Working with Files</p>
          </div>
        </div>
      </div>

      <div className="bg1 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold tc1 mb-4">Quiz Overview</h2>
        <p className="tc2 mb-6">
          Assessment covering file I/O, CSV/JSON handling, pandas basics, and file system operations.
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold tc1 mb-3">Topics Covered</h3>
          <ul className="tc2 space-y-2 list-disc list-inside">
            <li>Reading and writing files with open()</li>
            <li>Working with CSV and JSON formats</li>
            <li>Using pandas for data manipulation</li>
            <li>File system operations with os module</li>
            <li>Context managers and resource management</li>
          </ul>
        </div>

        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="tc3 text-lg">Quiz content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
