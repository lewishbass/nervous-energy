'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, CodeExample, Objectives, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateError, createSetResult, getQuestionSubmissionStatus, checkRequiredCode, runTestCases } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q7';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question7() {
  const assignmentPath = '/classes/python-automation/exercises/functions-arrays-loops';
  const questionPath = `${assignmentPath}/${questionName}`;

  const [validationMessages, setValidationMessages] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(questionPath.replace('/', '_') + "_validationMessages");
    return saved ? JSON.parse(saved) : {};
  });
  const [validationStates, setValidationStates] = useState<Record<string, 'passed' | 'failed' | 'pending' | null>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(questionPath.replace('/', '_') + "_validationStates");
    return saved ? JSON.parse(saved) : {};
  });
  const [submissionStates, setSubmissionStates] = useState<Record<string, any>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const { isLoggedIn, username, token } = useAuth();

  const setResult = createSetResult({
    setValidationMessages,
    setValidationStates,
    setSubmissionStates,
    submissionStates,
    isLoggedIn,
    username,
    token,
    className,
    assignmentName,
    questionName
  });

  useEffect(() => {
    if (!isLoggedIn || !username || !token) return;
    const partNames = questionParts.map(part => `${questionName}_${part}`);
    setSubmissionStates(partNames.reduce((acc, part) => ({ ...acc, [part]: 'downloading' }), {}));
    getQuestionSubmissionStatus(username, token, className, assignmentName, partNames).then(states => {
      setSubmissionStates(states);
    }).catch(() => {
      setSubmissionStates(partNames.reduce((acc, part) => ({ ...acc, [part]: null }), {}));
    });
  }, [isLoggedIn, username, token]);

  useEffect(() => {
    localStorage.setItem(questionPath.replace('/', '_') + "_validationStates", JSON.stringify(validationStates));
    localStorage.setItem(questionPath.replace('/', '_') + "_validationMessages", JSON.stringify(validationMessages));
  }, [validationMessages, validationStates]);

  const startCode = (part: string) => {
    setValidationStates(prev => ({ ...prev, [part]: 'pending' }));
    setValidationMessages(prev => { const n = { ...prev }; delete n[part]; return n; });
  };

  // P1: Sum Array
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def sumArray']);
    if (!funcDeclared.passed) { setResult('p1', 'failed', 'Define a function named `sumArray`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p1', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [[1, 2, 3, 4, 5]], expected: 15 },
      { args: [[10]], expected: 10 },
      { args: [[]], expected: 0 },
      { args: [[0, 0, 0]], expected: 0 },
      { args: [[-1, -2, -3]], expected: -6 },
      { args: [[-5, 5]], expected: 0 },
      { args: [[100, 200, 300]], expected: 600 },
      { args: [[1, -1, 2, -2, 3]], expected: 3 },
    ];
    const testResults = await runTestCases(pyodide, 'sumArray', testCases);
    if (!testResults.passed) { setResult('p1', 'failed', testResults.message, code); return; }
    setResult('p1', 'passed', testResults.message, code);
  };

  // P2: Min Array
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def minArray']);
    if (!funcDeclared.passed) { setResult('p2', 'failed', 'Define a function named `minArray`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p2', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [[3, 1, 4, 1, 5]], expected: 1 },
      { args: [[42]], expected: 42 },
      { args: [[-10, -20, -3]], expected: -20 },
      { args: [[5, 5, 5]], expected: 5 },
      { args: [[100, 50, 75, 25]], expected: 25 },
      { args: [[-1, 0, 1]], expected: -1 },
      { args: [[999, 1000, 1]], expected: 1 },
      { args: [[7, 3, 9, 2, 8, 1, 6]], expected: 1 },
    ];
    const testResults = await runTestCases(pyodide, 'minArray', testCases);
    if (!testResults.passed) { setResult('p2', 'failed', testResults.message, code); return; }
    setResult('p2', 'passed', testResults.message, code);
  };

  // P3: Max Array
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def maxArray']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `maxArray`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p3', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [[3, 1, 4, 1, 5]], expected: 5 },
      { args: [[42]], expected: 42 },
      { args: [[-10, -20, -3]], expected: -3 },
      { args: [[5, 5, 5]], expected: 5 },
      { args: [[100, 50, 75, 25]], expected: 100 },
      { args: [[-1, 0, 1]], expected: 1 },
      { args: [[1, 1000, 999]], expected: 1000 },
      { args: [[7, 3, 9, 2, 8, 1, 6]], expected: 9 },
    ];
    const testResults = await runTestCases(pyodide, 'maxArray', testCases);
    if (!testResults.passed) { setResult('p3', 'failed', testResults.message, code); return; }
    setResult('p3', 'passed', testResults.message, code);
  };

  // P4: Fibonacci
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def fibonacci']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Define a function named `fibonacci`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p4', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [0], expected: [] },
      { args: [1], expected: [0] },
      { args: [2], expected: [0, 1] },
      { args: [5], expected: [0, 1, 1, 2, 3] },
      { args: [8], expected: [0, 1, 1, 2, 3, 5, 8, 13] },
      { args: [10], expected: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] },
      { args: [3], expected: [0, 1, 1] },
      { args: [6], expected: [0, 1, 1, 2, 3, 5] },
    ];
    const testResults = await runTestCases(pyodide, 'fibonacci', testCases);
    if (!testResults.passed) { setResult('p4', 'failed', testResults.message, code); return; }
    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={17} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q7 - Sums, Min and Max, Fibonacci"
          description="Implement algorithms to perform array operations."
          objectives={[
            "Use a for loop to calculate the sum of elements in an array.",
            "Find the minimum element in an array.",
            "Find the maximum element in an array.",
            "Generate the Fibonacci sequence up to a given number of terms."
          ]}
        />

        {/* P1: Sum Array */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Sum Array" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# sumArray returns the sum of the elements in the array\ndef sumArray(arr : list):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Objectives>
              <p className="mb-2">Calculate the sum of elements in an array using a for loop:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="sumArray" /> takes the list of numbers <CopyCode code="arr" /> as an argument</li>
                <li>Returns the sum of the elements in the array</li>
              </ul>
            </Objectives>
            <Hints>use <CopyCode code="for a in arr:" /> to iterate through each element in the loop.</Hints>
            <Hints>create a <CopyCode code="total = 0" /> variable, and add each element to total inside the loop.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Min Array */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Min Array" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# minArray returns the minimum element in the array\ndef minArray(arr : list):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Objectives>
              <p className="mb-2">Find the minimum element in a non-empty array using a for loop:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="minArray" /> takes the non-empty list of numbers <CopyCode code="arr" /> as an argument</li>
                <li>Returns the minimum element in the array</li>
              </ul>
            </Objectives>
            <Hints>create a <CopyCode code="min_value" /> variable to track the minimum value so far.</Hints>
            <Hints>initialize <CopyCode code="min_value" /> to the first element in the array with <CopyCode code="min_value = arr[0]" />.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Max Array */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Max Array" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# maxArray returns the maximum element in the array\ndef maxArray(arr : list):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Objectives>
              <p className="mb-2">Find the maximum element in a non-empty array using a for loop:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="maxArray" /> takes the non-empty list of numbers <CopyCode code="arr" /> as an argument</li>
                <li>Returns the maximum element in the array</li>
              </ul>
            </Objectives>
            <Hints>this is very similar to Part 2 — just change the comparison direction.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Fibonacci */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Fibonacci" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={"# fibonacci returns a list containing first n terms of the Fibonacci sequence\ndef fibonacci(n : int):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            initialVDivider={100}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones. The sequence starts with 0, 1 and continues indefinitely: 0, 1, 1, 2, 3, 5, 8...</Mechanics>
            <Objectives>
              <p className="mb-2">Generate the Fibonacci sequence up to a given number of terms:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="fibonacci" /> takes the number of terms <CopyCode code="n" /> as an argument</li>
                <li>Returns a list containing the first <CopyCode code="n" /> terms of the Fibonacci sequence</li>
              </ul>
            </Objectives>
            <Hints>use <CopyCode code="arr[-1]" /> and <CopyCode code="arr[-2]" /> to access the last two elements of the array.</Hints>
            <Hints>start with <CopyCode code="arr = [0, 1]" /> and use a <CopyCode code="for" /> loop to append new Fibonacci numbers with the list&apos;s <CopyCode code=".append()" /> method.</Hints>
            <Hints>handle the edge cases for n=0 and n=1 before the loop with early <CopyCode code="return" /> statements.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q6" nextHref="q8" />
        </div>
      </div>
    </>
  );
}
