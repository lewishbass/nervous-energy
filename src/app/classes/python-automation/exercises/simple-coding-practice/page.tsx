"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AssignmentOverview from '../exercise-components/AssignmentOverview';

export default function SimpleCodingPractice() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

  const questions: { title: string; link: string; description: string }[] = [
    { title: 'Question 1', link: 'q1', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 2', link: 'q2', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 3', link: 'q3', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 4', link: 'q4', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 5', link: 'q5', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 6', link: 'q6', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 7', link: 'q7', description: 'Perform simple operations with ints, floats, bools and strings.' },
    { title: 'Question 8', link: 'q8', description: 'Perform simple operations with ints, floats, bools and strings.' },
  ];

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
            <h1 className="text-4xl font-bold tc1">Simple Coding Practice</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 0: Foundations of Programming</p>
          </div>
        </div>
      </div>

      <div className="mb-6 tc2">
        <span className="text-lg font-bold text-red-400 dark:text-red-600">Important</span> :
        This exercise uses a <span className="tc1 font-semibold">Browser Based Python IDE/Runtime</span>.
        It represents a simplified version of python and may be missing some features.
      </div>

      <div className="bg1 rounded-lg p-8 pt-4 shadow-sm border border-gray-200 dark:border-gray-800">
        <AssignmentOverview 
          title="Simple Coding Practice"
          description="Perform simple operations with ints, floats, bools and strings. Assign values to variables, manipulate them and print the results."
          objectives={[
            'Practice using variables and data types (int, float, string)',
            'Use arithmetic and comparison operators',
            'Use print() for displaying output',
            'Format strings for readable output',
          ]}
          startHref={`${assignmentPath}/q1`}
          questionList={questions}
          className="mb-8"
        />
      </div>
    </div>
  );
}
