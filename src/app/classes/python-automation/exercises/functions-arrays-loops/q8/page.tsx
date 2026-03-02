'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, CodeExample, Objectives, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, createSetResult, getQuestionSubmissionStatus, checkRequiredCode, runTestCases } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q8';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question8() {
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

  // P1: Find the bug in addFirstThree (same pattern as Q2 P3)
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    // Verify the buggy function is unchanged
    const required = [
      "def addFirstThree(arr):",
      "while i < 3 and i < len(arr)-1:",
      "test1 = ( addFirstThree(testInput) == expectedOutput )",
    ];
    const codeCheck = checkRequiredCode(code, required);
    if (!codeCheck.passed) { setResult('p1', 'failed', codeCheck.message, code); return; }

    // test1 must be False (the buggy function fails the test case)
    const test1Check = validateVariable(vars, 'test1', 'bool', false);
    if (!test1Check.passed) {
      if (vars['test1'] && vars['test1'].value === 'True') {
        setResult('p1', 'failed', 'test1 returned True - your test case doesn\'t expose the bug.', code);
      } else {
        setResult('p1', 'failed', test1Check.message, code);
      }
      return;
    }

    // Verify the test case would pass with the fixed function
    const fixedVerifyResult: string = await pyodide.runPythonAsync(`
import json as _json, re as _re

def _fixedAddFirstThree(arr):
    i = 0
    total = 0
    while i < 3 and i < len(arr):
        total += arr[i]
        i += 1
    return total

_code = ${JSON.stringify(code)}
_match = _re.search(r'testInput\\s*=\\s*(.+)', _code)
_match2 = _re.search(r'expectedOutput\\s*=\\s*(.+)', _code)
_verify = False
if _match and _match2:
    try:
        _test_input = eval(_match.group(1).strip())
        _expected = eval(_match2.group(1).strip())
        _verify = (_fixedAddFirstThree(_test_input) == _expected)
    except:
        _verify = False
_json.dumps({'verify': _verify})
`);

    const fixedParsed = JSON.parse(fixedVerifyResult);
    if (!fixedParsed.verify) {
      setResult('p1', 'failed', 'Your test case should return True for a correct implementation of addFirstThree.', code);
      return;
    }

    setResult('p1', 'passed', 'Great work! Your test case exposes the bug in addFirstThree.', code);
  };

  // P2: numStats with if/else
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def numStats(n):', 'if ', 'else']);
    if (!funcDeclared.passed) { setResult('p2', 'failed', funcDeclared.message, code); return; }

    const testCases = [
      { args: [4], expected: null, expectedStdout: ['even', 'positive', 'integer', 'not a multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['odd', 'negative', 'zero', 'decimal'] },
      { args: [7], expected: null, expectedStdout: ['odd', 'positive', 'integer', 'not a multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['even', 'negative', 'zero', 'decimal'] },
      { args: [-3], expected: null, expectedStdout: ['odd', 'negative', 'integer', 'not a multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['even', 'positive', 'zero', 'decimal'] },
      { args: [0], expected: null, expectedStdout: ['even', 'zero', 'integer', 'multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['odd', 'positive', 'negative', 'decimal'] },
      { args: [10], expected: null, expectedStdout: ['even', 'positive', 'integer', 'multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['odd', 'negative', 'zero', 'decimal'] },
      { args: [-2.5], expected: null, expectedStdout: ['odd', 'negative', 'decimal', 'not a multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['even', 'positive', 'zero', 'integer'] },
      { args: [3.5], expected: null, expectedStdout: ['odd', 'positive', 'decimal', 'not a multiple of 5'], stdoutStrictOrder: true, restrictedStdout: ['even', 'negative', 'zero', 'integer'] },
      { args: [15], expected: null, expectedStdout: ['odd', 'positive', 'integer', 'multiple of 5'], stdoutStrictOrder: true },
    ];
    const testResults = await runTestCases(pyodide, 'numStats', testCases);
    if (!testResults.passed) { setResult('p2', 'failed', testResults.message, code); return; }
    setResult('p2', 'passed', testResults.message, code);
  };

  // P3: weightedSum with enumerate
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def weightedSum']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `weightedSum`.', code); return; }

    const hasEnumerate = checkRequiredCode(code, ['enumerate']);
    if (!hasEnumerate.passed) { setResult('p3', 'failed', 'Use `enumerate` inside your function.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p3', 'failed', 'Use a `for` loop inside your function.', code); return; }

    const testCases = [
      { args: [[1, 2, 3]], expected: 0*1 + 1*2 + 2*3 },       // 8
      { args: [[5, 10, 15]], expected: 0*5 + 1*10 + 2*15 },   // 40
      { args: [[]], expected: 0 },
      { args: [[7]], expected: 0 },
      { args: [[1, 1, 1, 1, 1]], expected: 0+1+2+3+4 },       // 10
      { args: [[0, 0, 0]], expected: 0 },
      { args: [[-1, 2, -3]], expected: 0*-1 + 1*2 + 2*-3 },   // -4
      { args: [[10, 20]], expected: 0*10 + 1*20 },             // 20
    ];
    const testResults = await runTestCases(pyodide, 'weightedSum', testCases);
    if (!testResults.passed) { setResult('p3', 'failed', testResults.message, code); return; }
    setResult('p3', 'passed', testResults.message, code);
  };

  // P4: fibbGTT with while loop
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def fibbGTT']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Define a function named `fibbGTT`.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p4', 'failed', 'Use a `while` loop inside your function.', code); return; }

    // fib: 0,1,1,2,3,5,8,13,21,34,55,89,144,...
    const testCases = [
      { args: [0], expected: 1 },
      { args: [1], expected: 2 },
      { args: [4], expected: 5 },
      { args: [5], expected: 8 },
      { args: [10], expected: 13 },
      { args: [20], expected: 21 },
      { args: [50], expected: 55 },
      { args: [100], expected: 144 },
    ];
    const testResults = await runTestCases(pyodide, 'fibbGTT', testCases);
    if (!testResults.passed) { setResult('p4', 'failed', testResults.message, code); return; }
    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={18} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q8 - Review"
          description="Create arrays, loop over the elements, and apply all concepts learned."
          objectives={[
            "Test cases",
            "If statements",
            "For loops",
            "While loops"
          ]}
        />

        {/* P1: Test Cases - Find the bug */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Find the bug" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# DO NOT EDIT: returns the sum of the first 3 elements in an array\ndef addFirstThree(arr):\n    i = 0\n    total = 0\n    while i < 3 and i < len(arr)-1:\n        total += arr[i]\n        i += 1\n    return total\n\n# Write a test case that fails due to the bug in addFirstThree\ntestInput = [1, 2, 3, 4] # change this input to trigger the bug\nexpectedOutput = 6 # change this to the correct output for the test input\ntest1 = ( addFirstThree(testInput) == expectedOutput )"}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>Test cases check a function&apos;s output against its expected output to verify correctness.
              <br/><CopyCode code="functionName(args) == expectedOutput" /> 
              <CodeExample code={`def add(a, b):\n    return a + b\n# test cases\ntest1 = ( add(2, 3) == 5 )\ntest2 = ( add(-1, 1) == 0 )\ntest3 = ( add(0, 0) == 0 )`} />
            </Mechanics>
            <Objectives>The function <CopyCode code="addFirstThree" /> contains a bug. Write a test case that finds this bug and returns false.
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Change <CopyCode code="testInput" /> to an input that triggers the bug</li>
                <li>Change <CopyCode code="expectedOutput" /> to the <b>correct</b> output for that input</li>
              </ul>
            </Objectives>
            <Hints>Find which input triggers the bug, and write a test case using that input and its <b>CORRECT</b> output.</Hints>
            <Hints>The function exits too early on arrays that are only 3 elements long.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: If Statements - numStats */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Number Stats" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# numStats prints if a number is even/odd, positive/negative/zero, integer/decimal, and a multiple of 5 or not\ndef numStats(n):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics><CopyCode code="if" /> statements execute a block of code if a condition is true. <CopyCode code="else" /> statements execute if the previous if statement is false.
              <CodeExample code={`if n % 2 == 0:\n    print("even")\nelse:\n    print("odd")`} />
            </Mechanics>
            <Objectives>Create the function <CopyCode code="numStats" /> that prints whether a number is even/odd, positive/negative/zero, an integer/decimal, and a multiple of 5 or not.
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function <CopyCode code="numStats" /> takes in a number <CopyCode code="n" /></li>
                <li>Print <CopyCode code={`"even"`} /> if n is even, otherwise print <CopyCode code={`"odd"`} /></li>
                <li>Print <CopyCode code={`"positive"`} /> if n is positive, <CopyCode code={`"negative"`} /> if n is negative, and <CopyCode code={`"zero"`} /> if n is 0</li>
                <li>Print <CopyCode code={`"integer"`} /> if n is an integer, and <CopyCode code={`"decimal"`} /> if n is a decimal</li>
                <li>Print <CopyCode code={`"multiple of 5"`} /> if n is a multiple of 5, otherwise print <CopyCode code={`"not a multiple of 5"`} /></li>
              </ul>
            </Objectives>
            <Hints>Use <CopyCode code="n % 2 == 0" /> to check even, <CopyCode code="n % 5 == 0" /> to check multiples of 5.</Hints>
            <Hints>Use <CopyCode code="n == int(n)" /> to check if a number is an integer.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: For Loops - weightedSum */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Weighted Sum" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# weightedSum returns the sum of each element multiplied by its index\ndef weightedSum(arr):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>For loops execute a block of code for each element in a collection.
              <CodeExample code={`for i in range(5):\n    print(i)\n# 0, 1, 2, 3, 4`} />
              The <CopyCode code="enumerate" /> function can be used to get both the index and element while looping:
              <CodeExample code={`for index, element in enumerate(["zero", "one", "two"]):\n    print(index, element)\n# 0 zero\n# 1 one\n# 2 two`} />
            </Mechanics>
            <Objectives>Create a function <CopyCode code="weightedSum" /> that sums the elements in an array, multiplied by their index:
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function <CopyCode code="weightedSum" /> takes in an array of numbers <CopyCode code="arr" /></li>
                <li>Loop through the array using <CopyCode code="enumerate" /> to get both index and element</li>
                <li>Return the sum of each element multiplied by its index</li>
              </ul>
            </Objectives>
            <Hints>Create a <CopyCode code="total = 0" /> variable, and add <CopyCode code="index * element" /> to it in each iteration.</Hints>
            <Hints>Use <CopyCode code="for index, element in enumerate(arr):" /> to loop with both index and value.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: While Loops - fibbGTT */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Fibonacci Greater Than" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={"# fibbGTT returns the first Fibonacci number greater than n\ndef fibbGTT(n):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            initialVDivider={100}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>While loops execute until a condition is false.
              <CodeExample code={`while laptop.batteryLevel > 0:\n    laptop.compute()\nlaptop.shutdown() # shuts down when battery is dead`} />
            </Mechanics>
            <Objectives>Create a function <CopyCode code="fibbGTT" /> that returns the first Fibonacci number greater than a given number n:
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function <CopyCode code="fibbGTT" /> takes in a number <CopyCode code="n" /></li>
                <li>Use a while loop to generate Fibonacci numbers until you find one greater than <CopyCode code="n" /></li>
                <li>Return the first Fibonacci number greater than <CopyCode code="n" /></li>
              </ul>
            </Objectives>
            <Hints>Start with <CopyCode code="a, b = 0, 1" /> and use <CopyCode code="a, b = b, a + b" /> to generate the next Fibonacci number.</Hints>
            <Hints>Use <CopyCode code="while b <= n:" /> to keep generating until b exceeds n, then return <CopyCode code="b" />.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q7" nextHref='overview' />
        </div>
      </div>
    </>
  );
}
