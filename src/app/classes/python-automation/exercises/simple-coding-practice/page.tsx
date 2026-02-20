"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AssignmentOverview from '../exercise-components/AssignmentOverview';
import { useEffect, useState } from 'react';
import { getQuestionSubmissionStatus } from '../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';

const className = 'python-automation';
const assignmentName = 'simple-coding-practice';

const questionPartMap: Record<string, string[]> = {
  q1: ['p1', 'p2', 'p3'],
  q2: ['p1', 'p2', 'p3'],
  q3: ['p1', 'p2', 'p3', 'p4'],
  q4: ['p1', 'p2', 'p3', 'p4'],
  q5: ['p1', 'p2', 'p3', 'p4'],
  q6: ['p1', 'p2', 'p3', 'p4'],
  q7: ['p1', 'p2', 'p3', 'p4'],
  q8: ['p1', 'p2', 'p3', 'p4'],
};

function computeQuestionStatus(qName: string, states: Record<string, any>): string {
  const parts = questionPartMap[qName] || [];
  const partStates = parts.map(p => states[`${qName}_${p}`]);
  const submitted = partStates.filter(s => s && s.resultStatus);
  if (submitted.length === 0) return 'not-started';
  const allPassed = submitted.length === parts.length && submitted.every(s => s.resultStatus === 'passed');
  if (allPassed) return 'completed';
  const anyFailed = submitted.some(s => s.resultStatus === 'failed');
  if (anyFailed) return 'incorrect';
  return 'in-progress';
}

export default function SimpleCodingPractice() {
  const router = useRouter();
  const { isLoggedIn, username, token } = useAuth();
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoggedIn || !username || !token) return;
    const allPartNames = Object.entries(questionPartMap).flatMap(([q, parts]) =>
      parts.map(p => `${q}_${p}`)
    );
    getQuestionSubmissionStatus(username, token, className, assignmentName, allPartNames).then(states => {
      const statuses: Record<string, string> = {};
      for (const q of Object.keys(questionPartMap)) {
        statuses[q] = computeQuestionStatus(q, states);
      }
      setQuestionStatuses(statuses);
    });
  }, [isLoggedIn, username, token]);

  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

  const questions: { title: string; link: string; description: string; status?: string }[] = [
    { title: 'Q1-Variable Assignment', link: 'q1', description: 'Assign integer, string, and boolean values to variables.' },
    { title: 'Q2-Integer Operations', link: 'q2', description: 'Perform arithmetic operations, print to console, and convert between types.' },
    { title: 'Q3-String Operations', link: 'q3', description: 'Concatenate strings, convert case, trim whitespace, and check substrings.' },
    { title: 'Q4-Combining String Operations', link: 'q4', description: 'Count characters, vowels, and calculate string fractions.' },
    { title: 'Q5-Boolean Operations', link: 'q5', description: 'Use AND, OR, and NOT operators to combine and negate boolean values.' },
    { title: 'Q6-Numerical Comparisons', link: 'q6', description: 'Use comparison operators to compare numbers, strings, and check equality.' },
    { title: 'Q7-Binary and Hexadecimal', link: 'q7', description: 'Convert numbers to binary and hexadecimal strings, and validate their formats.' },
    { title: 'Q8', link: 'q8', description: 'Perform simple operations with ints, floats, bools and strings.' },
  ].map(q => ({ ...q, status: questionStatuses[q.link] }));

  return (
    <>
    <RandomBackground seed={1} density={0.5} />
    <div className="p-6 max-w-4xl mx-auto mb-20 min-h-screen">
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
          <div className="backdrop-blur-sm rounded-lg">
            <h1 className="text-4xl font-bold tc1">Simple Coding Practice</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 0: Foundations of Programming</p>
          </div>
        </div>
      </div>

      <div className="mb-6 tc2 rounded-lg backdrop-blur-sm">
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
    </>
  );
}
