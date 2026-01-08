"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CLITodoManager() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-4xl mx-auto mb-20">
        <p className="tc1 text-2xl">Please <span className="font-bold hover:opacity-70 cursor-pointer text-indigo-500 bg-green-300 p-2 px-3 rounded-full transition-all duration-300" onClick={() => router.push('/classes/python-automation/exercises/cli-todo-manager?openAuth=true')}>log in / register</span> to access this assignment.</p>
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
            <h1 className="text-4xl font-bold tc1">Command-Line Todo Manager</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 5: Tooling</p>
          </div>
        </div>
      </div>

      <div className="bg1 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold tc1 mb-4">Assignment Overview</h2>
        <p className="tc2 mb-6">
          Develop a CLI todo list application with argparse that supports adding, completing, listing, 
          and filtering tasks. Package it as an installable tool.
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold tc1 mb-3">Learning Objectives</h3>
          <ul className="tc2 space-y-2 list-disc list-inside">
            <li>Use argparse for command-line argument parsing</li>
            <li>Package Python applications with setuptools</li>
            <li>Create installable CLI tools</li>
            <li>Implement subcommands and options</li>
          </ul>
        </div>

        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="tc3 text-lg">Assignment content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
