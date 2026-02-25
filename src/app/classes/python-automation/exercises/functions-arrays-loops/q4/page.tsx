'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, createSetResult, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState, checkRequiredCode, runTestCases } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
import { useAuth } from '@/context/AuthContext';
import { CodeBlock } from '@/components/CodeBlock';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q4';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question4() {
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

  // P1: If/else - whatToWear prints "shorts" if temp > 45 else "pants"
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def whatToWear']);
    if (!funcDeclared.passed) { setResult('p1', 'failed', 'Define a function named `whatToWear`.', code); return; }

    const hasIf = checkRequiredCode(code, ['if ']);
    if (!hasIf.passed) { setResult('p1', 'failed', 'Use an `if` statement in your function.', code); return; }

    const hasElse = checkRequiredCode(code, ['else:']);
    if (!hasElse.passed) { setResult('p1', 'failed', 'Use an `else` statement in your function.', code); return; }

    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p1', 'failed', 'Use `print()` to output the result.', code); return; }

    const testCases = [
      { args: [80], expected: null, expectedStdout: ['shorts'] },
      { args: [46], expected: null, expectedStdout: ['shorts'] },
      { args: [45], expected: null, expectedStdout: ['pants'] },
      { args: [30], expected: null, expectedStdout: ['pants'] },
      { args: [0], expected: null, expectedStdout: ['pants'] },
    ];
    const testResults = await runTestCases(pyodide, 'whatToWear', testCases);
    if (!testResults.passed) {
      setResult('p1', 'failed', testResults.message, code);
      return;
    }

    setResult('p1', 'passed', testResults.message, code);
  };

  // P2: If statement to modify a variable - doubleOrHalf
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def doubleOrHalf']);
    if (!funcDeclared.passed) { setResult('p2', 'failed', 'Define a function named `doubleOrHalf`.', code); return; }

    const hasIf = checkRequiredCode(code, ['if ']);
    if (!hasIf.passed) { setResult('p2', 'failed', 'Use an `if` statement in your function.', code); return; }

    const testCases = [
      { args: [10, 'double'], expected: 20 },
      { args: [10, 'half'], expected: 5 },
      { args: [7, 'double'], expected: 14 },
      { args: [100, 'half'], expected: 50 },
      { args: [0, 'double'], expected: 0 },
    ];
    const testResults = await runTestCases(pyodide, 'doubleOrHalf', testCases);
    if (!testResults.passed) {
      setResult('p2', 'failed', testResults.message, code);
      return;
    }

    setResult('p2', 'passed', testResults.message, code);
  };

  // P3: If/elif/else - categorizeNumber
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def categorizeNumber']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `categorizeNumber`.', code); return; }

    const hasElif = checkRequiredCode(code, ['elif ']);
    if (!hasElif.passed) { setResult('p3', 'failed', 'Use an `elif` statement in your function.', code); return; }

    const testCases = [
      { args: [-5], expected: 'negative' },
      { args: [-1], expected: 'negative' },
      { args: [0], expected: 'zero' },
      { args: [1], expected: 'positive' },
      { args: [100], expected: 'positive' },
    ];
    const testResults = await runTestCases(pyodide, 'categorizeNumber', testCases);
    if (!testResults.passed) {
      setResult('p3', 'failed', testResults.message, code);
      return;
    }

    setResult('p3', 'passed', testResults.message, code);
  };

  // P4: Inline if - smallerNumber
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def smallerNumber']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Define a function named `smallerNumber`.', code); return; }

    // Check for inline if: find a line (not a comment) that contains both " if " and " else " on the same line
    const codeLines = code.split('\n');
    let hasInlineIf = false;
    for (const line of codeLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) continue;
      if (trimmed.includes(' if ') && trimmed.includes(' else ') && !trimmed.startsWith('if ') && !trimmed.startsWith('elif ')) {
        hasInlineIf = true;
        break;
      }
    }
    if (!hasInlineIf) {
      setResult('p4', 'failed', 'Use an inline if statement: `value_if_true if condition else value_if_false`', code);
      return;
    }

    const testCases = [
      { args: [3, 7], expected: 3 },
      { args: [10, 2], expected: 2 },
      { args: [5, 5], expected: 5 },
      { args: [-1, 0], expected: -1 },
      { args: [100, -100], expected: -100 },
    ];
    const testResults = await runTestCases(pyodide, 'smallerNumber', testCases);
    if (!testResults.passed) {
      setResult('p4', 'failed', testResults.message, code);
      return;
    }

    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={2} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q4 - If Statements"
          description="Switch between two different code paths using if statements."
          objectives={[
            "Print different messages based on variable values using if statements",
            "Use an if statement to edit a variable based on a condition",
            "Use an if, elif, else structure to handle multiple conditions",
            "Use an inline if statement to assign a value based on a condition",
          ]}
        />

        {/* P1: If / Else */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="If / Else" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">If statements take a boolean value, and execute the following block of code only if it is true.</p>
          <p className="tc3 mb-2">When followed by an <CopyCode code="else" /> statement, the block of code following the else will be executed if the condition is false.</p>
          <CodeBlock compact code={`oxygen_level = 15
if oxygen_level > 19.5 and oxygen_level < 23.5:
    print("Air is safe")
else:
    print("Time to fix your air supply!")`} language="python" className="my-4" />
          <p className="tc2 mb-2">Use an <CopyCode code="if" /> and <CopyCode code="else" /> statement to create a function that advises the user to wear pants or shorts:</p>
          <ul className="list-disc list-inside tc2 mb-6 space-y-1">
            <li>Function named <CopyCode code="whatToWear" /> takes in a variable <CopyCode code="temp" /></li>
            <li>If <CopyCode code="temp" /> is greater than 45, print <CopyCode code={`"shorts"`} /></li>
            <li>Otherwise, print <CopyCode code={`"pants"`} /></li>
          </ul>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# whatToWear prints \"shorts\" if temp > 45 else \"pants\"\ndef whatToWear(temp):\n    # your code here\n"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
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

        {/* P2: Modifying Variables with If */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="Modifying Variables with If" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Code executed inside the if block can modify variables.</p>
          <CodeBlock compact code={`if oxygen_level < 19.5:
    oxygen_level += 0.1  # PUMP IN SOME MORE AIR`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function that doubles or halves the input variable and returns it:</p>
          <ul className="list-disc list-inside tc2 mb-6 space-y-1">
            <li>Function named <CopyCode code="doubleOrHalf" /> takes in a variable <CopyCode code="value" /> and a string <CopyCode code="action" /></li>
            <li>If <CopyCode code="action" /> is <CopyCode code={`"double"`} />, double the value</li>
            <li>If <CopyCode code="action" /> is <CopyCode code={`"half"`} />, halve the value</li>
            <li>Return the result</li>
          </ul>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={'# doubleOrHalf doubles or halves the value based on the action string "double" or "half"\ndef doubleOrHalf(value, action):\n    # your code here\n'}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
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

        {/* P3: If / Elif / Else */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="If / Elif / Else" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Sometimes we want to branch into more than just 2 paths. <CopyCode code="elif" /> statements act like else, executing when a previous if is false, but also check their own conditions, and activate following else statements on false.</p>
          <CodeBlock compact code={`if atmospheres < 0.47:
    spaceship.warn("Low pressure detected, pumping in air")
elif atmospheres > 2.0:
    spaceship.warn("Critical pressure detected, emergency venting!")
else:
    spaceship.warn("pressure is normal")`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function that categorizes a number as <CopyCode code={`"negative"`} />, <CopyCode code={`"zero"`} />, or <CopyCode code={`"positive"`} />:</p>
          <ul className="list-disc list-inside tc2 mb-2 space-y-1">
            <li>Function named <CopyCode code="categorizeNumber" /> takes in a variable <CopyCode code="num" /></li>
            <li>If <CopyCode code="num" /> {'<'} 0, return <CopyCode code={`"negative"`} /></li>
            <li>If <CopyCode code="num" /> {'>'} 0, return <CopyCode code={`"positive"`} /></li>
            <li>Otherwise, return <CopyCode code={`"zero"`} /></li>
          </ul>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-6">Hint: you can put return statements inside if blocks, they will exit the function immediately.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# categorizeNumber returns \"negative\", \"zero\", or \"positive\"\ndef categorizeNumber(num):\n    # your code here\n"}
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

        {/* P4: Inline If */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px', }}>
          <QuestionHeader title="Inline If" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Inline if statements use the pattern <CopyCode code="value_if_true if condition else value_if_false" /> to assign a value based on a condition in a single line of code.</p>
          <CodeBlock compact code={`air_locks = "sealed" if in_space else "open"`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function that uses an inline if statement to return the smaller of two numbers:</p>
          <ul className="list-disc list-inside tc2 mb-6 space-y-1">
            <li>Function named <CopyCode code="smallerNumber" /> takes in variables <CopyCode code="a" /> and <CopyCode code="b" /></li>
            <li>Returns the smaller number using an inline if statement</li>
          </ul>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# smallerNumber returns the smaller of a and b using an inline if\ndef smallerNumber(a, b):\n    # use an inline if statement\n"}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="q3" nextHref="q5" />
        </div>
      </div>
    </>
  );
}
