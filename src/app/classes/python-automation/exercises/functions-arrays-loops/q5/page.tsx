'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, createSetResult, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState, checkRequiredCode, runTestCases, deRepr } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
import { useAuth } from '@/context/AuthContext';
import { CodeBlock } from '@/components/CodeBlock';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q5';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question5() {
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

  // P1: Iterate over a range, array and string
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p1', 'failed', 'Use a `for` loop to iterate.', code); return; }

    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p1', 'failed', 'Use `print()` to output each element.', code); return; }

    // Parse for loops, classify iterable types, and verify loop var is printed
    const codeLines = code.split('\n');
    const iterableTypes = new Set<string>();
    let forCount = 0;

    for (let lineIdx = 0; lineIdx < codeLines.length; lineIdx++) {
      const trimmed = codeLines[lineIdx].trim();
      if (trimmed.startsWith('#')) continue;
      const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):\s*$/);
      if (!forMatch) continue;
      forCount++;
      const loopVar = forMatch[1];
      const iterableExpr = forMatch[2].trim();

      // Check that the loop variable appears in a print() call in the lines following this for
      let loopVarPrinted = false;
      for (let j = lineIdx + 1; j < codeLines.length; j++) {
        const innerTrimmed = codeLines[j].trim();
        if (innerTrimmed.startsWith('#')) continue;
        // Stop scanning if we hit a non-indented line (outside the for block) that isn't blank
        if (innerTrimmed.length > 0 && codeLines[j].length > 0 && codeLines[j][0] !== ' ' && codeLines[j][0] !== '\t') break;
        // Check for print(<loopVar>) pattern - loop var anywhere inside print(...)
        const printMatch = innerTrimmed.match(/print\(([^)]*)\)/);
        if (printMatch && printMatch[1].includes(loopVar)) {
          loopVarPrinted = true;
          break;
        }
      }

      if (!loopVarPrinted) {
        setResult('p1', 'failed', `Your for loop variable "${loopVar}" is not being printed. Add \`print(${loopVar})\` inside the loop.`, code);
        return;
      }

      // Classify iterable type
      if (iterableExpr.startsWith('range(')) {
        iterableTypes.add('range');
      } else if (iterableExpr.startsWith('[')) {
        iterableTypes.add('list');
      } else if (iterableExpr.startsWith('"') || iterableExpr.startsWith("'")) {
        iterableTypes.add('string');
      } else {
        // Try to resolve the variable name from vars
        const varName = iterableExpr.split('(')[0].split('[')[0].split('.')[0].trim();
        if (vars[varName]) {
          const varType = vars[varName].type;
          if (varType === 'str') iterableTypes.add('string');
          else if (varType === 'list') iterableTypes.add('list');
          else if (varType === 'range') iterableTypes.add('range');
        }
      }
    }

    if (forCount < 3) {
      setResult('p1', 'failed', `Found ${forCount} for loop(s). You need 3 for loops: one for an array, one for a string, and one for a range.`, code);
      return;
    }

    const missing: string[] = [];
    if (!iterableTypes.has('list')) missing.push('array/list');
    if (!iterableTypes.has('string')) missing.push('string');
    if (!iterableTypes.has('range')) missing.push('range');

    if (missing.length > 0) {
      setResult('p1', 'failed', `Missing for loop(s) over: ${missing.join(', ')}. Make sure you iterate over all three types.`, code);
      return;
    }

    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    if (outputLines.length < 3) {
      setResult('p1', 'failed', 'Not enough output detected. Make sure each for loop prints its elements.', code);
      return;
    }

    setResult('p1', 'passed', 'All three for loops are printing correctly!', code);
  };

  // P2: Use break to stop a for loop when a condition is met
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def duckGame']);
    if (!funcDeclared.passed) { setResult('p2', 'failed', 'Define a function named `duckGame`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p2', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const hasBreak = checkRequiredCode(code, ['break']);
    if (!hasBreak.passed) { setResult('p2', 'failed', 'Use a `break` statement to stop the loop.', code); return; }

    const hasIf = checkRequiredCode(code, ['if ']);
    if (!hasIf.passed) { setResult('p2', 'failed', 'Use an `if` statement to check the condition before breaking.', code); return; }

    const testCases = [
      { args: [["duck", "duck", "duck", "goose", "duck", "duck"]], expected: ["duck", "duck", "duck", "goose"] },
      { args: [["goose", "duck"]], expected: ["goose"] },
      { args: [["duck", "duck", "goose"]], expected: ["duck", "duck", "goose"] },
      { args: [["duck", "duck", "duck"]], expected: ["duck", "duck", "duck"] },
      { args: [["goose"]], expected: ["goose"] },
    ];
    const testResults = await runTestCases(pyodide, 'duckGame', testCases);
    if (!testResults.passed) {
      setResult('p2', 'failed', testResults.message, code);
      return;
    }

    setResult('p2', 'passed', testResults.message, code);
  };

  // P3: Count the number of times a specific element appears in an array
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def countDucks']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `countDucks`.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p3', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [["duck", "duck", "goose", "duck"]], expected: 3 },
      { args: [["goose", "goose", "goose"]], expected: 0 },
      { args: [["duck"]], expected: 1 },
      { args: [[]], expected: 0 },
      { args: [["duck", "duck", "duck", "duck", "duck"]], expected: 5 },
    ];
    const testResults = await runTestCases(pyodide, 'countDucks', testCases);
    if (!testResults.passed) {
      setResult('p3', 'failed', testResults.message, code);
      return;
    }

    setResult('p3', 'passed', testResults.message, code);
  };

  // P4: Skip iterations using continue
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def clip']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Define a function named `clip`.', code); return; }

    const hasContinue = checkRequiredCode(code, ['continue']);
    if (!hasContinue.passed) { setResult('p4', 'failed', 'Use a `continue` statement in your loop.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p4', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [[1, 5, 3, 8, 2], 4], expected: [4, 5, 4, 8, 4] },
      { args: [[10, 20, 30], 15], expected: [15, 20, 30] },
      { args: [[1, 2, 3], 0], expected: [1, 2, 3] },
      { args: [[0, 0, 0], 5], expected: [5, 5, 5] },
      { args: [[], 10], expected: [] },
    ];
    const testResults = await runTestCases(pyodide, 'clip', testCases);
    if (!testResults.passed) {
      setResult('p4', 'failed', testResults.message, code);
      return;
    }

    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={15} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q5 - For Loops"
          description="Use for loops to traverse array elements."
          objectives={[
            "Iterate over a range, array and string printing each element",
            "Use break to stop a for loop when a condition is met",
            "Count the number of times a specific element appears in an array",
            "Skip some iterations of a loop using continue",
          ]}
        />

        {/* P1: Iterate over range, array, and string */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="For Loops" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Strings, arrays and ranges all automatically feed <CopyCode code="for" /> loops their elements one at a time.</p>
          <CodeBlock compact code={`for c in "ymca":
    print(c, end='-')  # prints y-m-c-a-`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create 3 <CopyCode code="for" /> loops, each printing every element in:</p>
          <ul className="list-disc list-inside tc2 mb-6 space-y-1">
            <li>An array (e.g. <CopyCode code='[10, 20, 30]' />)</li>
            <li>A string (e.g. <CopyCode code='"hello"' />)</li>
            <li>A range (e.g. <CopyCode code='range(5)' />)</li>
          </ul>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Print each element in an array\nmy_array = [10, 20, 30]\n\n\n# Print each character in a string\nmy_string = \"hello\"\n\n\n# Print each number in a range\n\n"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={60} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1}
              onCodeStartCallback={() => startCode('p1')}
              cachedCode={submissionStates[`${questionName}_p1`]?.code ? submissionStates[`${questionName}_p1`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p1' ? '' : 'hidden'} ${(!validationStates['p1'] || validationStates['p1'] === 'pending') ? 'opacity-0' : validationStates['p1'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p1'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Break */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="Break" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2"><CopyCode code="break" /> statements immediately terminate a loop, skipping the rest of the block and any remaining iterations.</p>
          <CodeBlock compact code={`a = [1, 2, 3, 4, 5]
for num in a:
    if num == 4:
        break
    print(num)
# 1, 2, 3`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function <CopyCode code="duckGame" /> that takes an array and returns all elements up to and including <CopyCode code={`"goose"`} />:</p>
          <ul className="list-disc list-inside tc2 mb-6 space-y-1">
            <li>Function named <CopyCode code="duckGame" /> takes in a variable <CopyCode code="a" /></li>
            <li>Use a <CopyCode code="for" /> loop to iterate over the array</li>
            <li>Add each element to a result list</li>
            <li>If the element is <CopyCode code={`"goose"`} />, <CopyCode code="break" /> out of the loop</li>
            <li>Return the result list</li>
          </ul>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={'# duckGame returns all elements up to and including "goose"\ndef duckGame(a):\n     #your code here'}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={60} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2}
              onCodeStartCallback={() => startCode('p2')}
              cachedCode={submissionStates[`${questionName}_p2`]?.code ? submissionStates[`${questionName}_p2`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p2' ? '' : 'hidden'} ${(!validationStates['p2'] || validationStates['p2'] === 'pending') ? 'opacity-0' : validationStates['p2'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p2'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Count Ducks */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="Count Ducks" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">How many ducks are in your row?</p>
          <p className="tc2 mb-2">Create a function <CopyCode code="countDucks" /> that returns the number of times the string <CopyCode code={`"duck"`} /> appears in an array:</p>
          <ul className="list-disc list-inside tc2 mb-2 space-y-1">
            <li>Function named <CopyCode code="countDucks" /> takes in a variable <CopyCode code="row" /></li>
            <li>Use a <CopyCode code="for" /> loop to iterate over <CopyCode code="row" /></li>
            <li>Return the count of <CopyCode code={`"duck"`} /> elements</li>
          </ul>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-6">Hint: create a counter variable, and increment it using <CopyCode code="count += 1" /></p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={'# countDucks returns the number of times "duck" appears in an array\ndef countDucks(row):\n    # your code here\n'}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3}
              onCodeStartCallback={() => startCode('p3')}
              cachedCode={submissionStates[`${questionName}_p3`]?.code ? submissionStates[`${questionName}_p3`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p3' ? '' : 'hidden'} ${(!validationStates['p3'] || validationStates['p3'] === 'pending') ? 'opacity-0' : validationStates['p3'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p3'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Continue */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="Continue" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">When <CopyCode code="continue" /> statements are called, they skip the rest of the current block, but continue with the next iteration of the loop.</p>
          <CodeBlock compact code={`for p in pokemon:
    if p.type() != "fire":
        continue
    p.name("just a lil guy")
    p.addToBackpack()`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function called <CopyCode code="clip" /> that takes an array of numbers and a <CopyCode code="min_val" />:</p>
          <ul className="list-disc list-inside tc2 mb-2 space-y-1">
            <li>Function named <CopyCode code="clip" /> takes in <CopyCode code="numbers" /> and <CopyCode code="min_val" /></li>
            <li>Loop through the array by index using <CopyCode code="range(len(numbers))" /></li>
            <li>If a number is greater than or equal to <CopyCode code="min_val" />, skip it using <CopyCode code="continue" /></li>
            <li>Otherwise, set that element to <CopyCode code="min_val" /></li>
            <li>Return the modified array</li>
          </ul>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-6">Hint: use <CopyCode code="for i in range(len(numbers)):" /> to loop by index so you can modify elements in place.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={'# clip raises any number below min_val up to min_val, using continue to skip the rest\ndef clip(numbers, min_val):\n    # your code here\n'}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP4}
              onCodeStartCallback={() => startCode('p4')}
              cachedCode={submissionStates[`${questionName}_p4`]?.code ? submissionStates[`${questionName}_p4`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p4' ? '' : 'hidden'} ${(!validationStates['p4'] || validationStates['p4'] === 'pending') ? 'opacity-0' : validationStates['p4'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p4'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q4" nextHref="q6" />
        </div>
      </div>
    </>
  );
}
