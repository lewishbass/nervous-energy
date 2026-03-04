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
const assignmentName = 'data-structures';

const questionPartMap: Record<string, string[]> = {
  q1: ['p1', 'p2', 'p3'],
  q2: ['p1', 'p2', 'p3', 'p4'],
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

export default function DataStructures() {
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

  const assignmentPath = 'data-structures';

  const questions: { title: string; link: string; description: string; status?: string }[] = [
    { title: 'Q1-Tuples', link: `${assignmentPath}/q1`, description: 'Pack and unpack tuples, use the asterisk operator, and combine tuples with functions.' },
    { title: 'Q2-Dictionaries', link: `${assignmentPath}/q2`, description: 'Create, edit, and access dictionaries using keys and values.' },
    { title: 'Q3-Stacks and Queues', link: `${assignmentPath}/q3`, description: 'Implement and use stack (LIFO) and queue (FIFO) data structures.' },
    { title: 'Q4-Linked Lists', link: `${assignmentPath}/q4`, description: 'Build linked lists and perform traversal, insertion, and deletion operations.' },
    { title: 'Q5-Tree Traversal', link: `${assignmentPath}/q5`, description: 'Construct binary trees and implement in-order, pre-order, and post-order traversal.' },
    { title: 'Q6-Heap Sort', link: `${assignmentPath}/q6`, description: 'Build a heap and use it to sort data efficiently.' },
    { title: 'Q7-Hash Tables', link: `${assignmentPath}/q7`, description: 'Implement a hash table with collision handling and key-value lookups.' },
    { title: 'Q8-Review', link: `${assignmentPath}/q8`, description: 'Apply all data structure concepts learned to solve a multi-part problem.' },
  ].map(q => ({ ...q, status: questionStatuses[q.link.split('/').pop()!] }));

  return (
    <>
    <RandomBackground seed={11} density={0.5} />
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
            <h1 className="text-4xl font-bold tc1">Data Structures</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Unit 3: The Data Structures Toolbox</p>
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
          title="Data Structures"
          description="Explore the essential data structures used in programming, from simple tuples and dictionaries to linked lists, trees, heaps, and hash tables."
            /*objectives={[
            'Pack and unpack tuples and use the asterisk operator',
            'Create and manipulate dictionaries with key-value pairs',
            'Implement stacks and queues using lists',
            'Build and traverse linked lists',
            'Perform tree traversal algorithms',
            'Sort data using a heap and understand heap operations',
            'Implement a hash table with basic collision handling',
          ]}*/
          startHref={`${assignmentPath}/q1`}
          endHref={`${assignmentPath}/overview`}
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
