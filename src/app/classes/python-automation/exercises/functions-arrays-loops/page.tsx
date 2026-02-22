"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AssignmentOverview from '../exercise-components/AssignmentOverview';
import { useEffect, useState } from 'react';
import { getQuestionSubmissionStatus } from '../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import BackToAssignment from '../exercise-components/BackToAssignment';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';

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

export default function FunctionsArraysLoops() {
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

  const assignmentPath = '/classes/python-automation/exercises/functions-arrays-loops';

  const questions: { title: string; link: string; description: string; status?: string }[] = [
    { title: 'Q1-Intro To Functions', link: `${assignmentPath}/q1`, description: 'Define simple functions with parameters, return values, and call them.' },
    { title: 'Q2-Test Cases', link: `${assignmentPath}/q2`, description: 'Write functions and test cases, verify function behavior and correctness.' },
    { title: 'Q3-Making and Editing Arrays', link: `${assignmentPath}/q3`, description: 'Initialize arrays with values, modify elements, retrieve values.' },
    { title: 'Q4-For Loops', link: `${assignmentPath}/q4`, description: 'Iterate over a fixed range using for loops, control loop flow.' },
    { title: 'Q5-Iterating Over Arrays', link: `${assignmentPath}/q5`, description: 'Use for loops to traverse array elements.' },
    { title: 'Q6-While Loops', link: `${assignmentPath}/q6`, description: 'Use while loops for condition-based iteration.' },
    { title: 'Q7-Sums, Min and Max, Fourier', link: `${assignmentPath}/q7`, description: 'Implement algorithms to perform array operations..' },
    { title: 'Q8-Review', link: `${assignmentPath}/q8`, description: 'Create arrays, loop over the elements, and apply all concepts learned.' },
  ].map(q => ({ ...q, status: questionStatuses[q.link] }));

  return (
    <>
    <RandomBackground seed={2} density={0.5} />
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
            <h1 className="text-4xl font-bold tc1">Functions, Arrays & Loops</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 1: Core Programming Concepts</p>
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
          title="Functions, Arrays & Loops"
          description="Master the fundamental building blocks of programming by learning to write reusable functions, organize data in arrays, and control program flow with loops."
          objectives={[
            'Define and call functions with parameters and return values',
            'Create and manipulate arrays and access elements by index',
            'Use for loops to iterate over fixed ranges and arrays',
            'Use while loops for condition-based iteration',
            'Combine functions, arrays, and loops to solve problems',
          ]}
          startHref={`${assignmentPath}/q1`}
          questionList={questions}
          className="mb-8"
        />
      </div>
      <div className="p-4 px-8">
        <BackToAssignment assignmentPath={"../?tab=exercises"} textOverride="Back to Assignments"/>
      </div>
    </div>
    </>
  );
}
