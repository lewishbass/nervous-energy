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
const questionName = 'q1';
const questionParts = ['p1', 'p2', 'p3'];

export default function Question1() {
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

  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }
    const funcDeclared  = checkRequiredCode(code, ['def increment']);
    if (!funcDeclared.passed) { setResult('p1', 'failed', funcDeclared.message, code); return; }
    
    const testCases = [
      { args: [0], expected: 1 },
      { args: [5], expected: 6 },
      { args: [-1], expected: 0 },
    ];
    const funcValidation = await runTestCases(pyodide, 'increment', testCases);

    if (!funcValidation.passed) {
      setResult('p1', 'failed', funcValidation.message, code);
      return;
    }

    //slice starting at after function declared
    let codeSliced = code.split('\n')
    for(let i = 0; i < codeSliced.length; i++) {
      if (codeSliced[i].includes('def increment')) {
        codeSliced = codeSliced.slice(i + 1);
        break;
      }
    }

    
    const functionCalled = checkRequiredCode(codeSliced.join('\n'), ['increment(']);
    if (!functionCalled.passed) {
      setResult('p1', 'failed', 'Make sure to call your function after defining it! ', code);
      return;
    }

    setResult('p1', 'passed', funcValidation.message, code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const validateVar1 = validateVariable(vars, 'test1', 'bool', true);
    const validateVar2 = validateVariable(vars, 'test2', 'bool', true);
    const validateVar3 = validateVariable(vars, 'test3', 'bool', true);
    if (!validateVar1.passed) { setResult('p2', 'failed', validateVar1.message, code); return; }
    if (!validateVar2.passed) { setResult('p2', 'failed', validateVar2.message, code); return; }
    if (!validateVar3.passed) { setResult('p2', 'failed', validateVar3.message, code); return; }


    const testCases = [
      { args: [1], expected: 4 },
      { args: [2], expected: 2 },
      { args: [3], expected: 0 },
    ];
    const funcValidation = await runTestCases(pyodide, 'foobar', testCases);
    if (!funcValidation.passed) {
      setResult('p2', 'failed', funcValidation.message, code);
      return;
    }
    setResult('p2', 'passed', funcValidation.message, code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    // test swap(a, b) returns b, a
    const testCases = [
      { args: [1, 2], expected: [2, 1] },
      { args: ['hello', 'world'], expected: ['world', 'hello'] },
      { args: [true, false], expected: [false, true] },
    ]
    const validateFunc = await runTestCases(pyodide, 'swap', testCases);
    if (!validateFunc.passed) {
      setResult('p3', 'failed', validateFunc.message, code);
      return;
    }
    setResult('p3', 'passed', validateFunc.message, code);
  };

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q1 - Intro To Functions"
          description="Define simple functions with parameters, return values, and call them."
          objectives={[
						'Define and call a simple function',
						'Use test cases to verify function correctness',
						'Take and return multiple parameters'
					]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px',}}>
          <QuestionHeader title="Define and Call" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">A function is a re-usable block of code that takes variables and returns results.</p>
					<p className="tc3 mb-2">Use the <CopyCode code="def"/> keyword to name your function.</p>
					<p className="tc3 mb-2">The input parameters are listed in parentheses after the function name.</p>
					<p className="tc3 mb-2">The <CopyCode code="return"/> keyword is used to return a value from a function.</p>
          <p className="mb-2 text-fuchsia-600 dark:text-fuchsia-400">The indented block after the line with <CopyCode code="def"/> statement ending with a colon <CopyCode code=":"/> tells Python what is in the function.</p>
					<CodeBlock compact code={`def double(a): # function named double that takes one parameter a
		output = a * 2 # multiply a by 2 and store in variable output
		return output # return the value of output
b = double(5) # passes 5 to our function, and stores the returned value in b`} language="python" className="my-4" />
          <p className="tc2 mb-2">Define a function named <CopyCode code="increment"/> that takes one parameter and returns that parameter plus 1.</p>
          <p className="tc2 mb-6">Then call your function and store the results in a variable.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Create a function named increment\n\n\n# Call your function and store the result in a variable"}
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

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px',}}>
          <QuestionHeader title="Test Cases" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Test cases are a way to verify that your function works correctly. They check how it performs on different inputs, and checks the output against expected values.</p>
          <p className="tc3 mb-2">Tests focus on edge cases, where weird values might break your function.</p>
          <p className="tc3 mb-2">This is how your programs are graded in this class and the real world.</p>
          <p className="tc2 mb-2">Implement the function <CopyCode code="foobar"/> that passes the provided test cases.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Create a function named foobar\n\n\n# foobar should pass the following test cases\ntest1 = ( foobar(1) == 4 )\ntest2 = ( foobar(2) == 2 )\ntest3 = ( foobar(3) == 0 )"}
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

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px',}}>
          <QuestionHeader title="Multiple Parameters" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <p className="tc3 mb-2">Functions can take and return multiple values.</p>
          <p className="tc3 mb-2">After the <CopyCode code="def"/> keyword, inside the parentheses you can list multiple parameters separated by commas. </p>
          <p className="tc3 mb-2">List multiple variables after the <CopyCode code="return"/> keyword separated by commas, and catch the output in multiple variables.</p>
          <CodeBlock compact code={`def math_ops(a, b): # this function requires both a and b to work
  sum = a + b
  diff = a - b
  return sum, diff

result_sum, result_diff = math_ops(5, 3) # call the function, and catch both outputs`} language="python" className="my-4" />
          <p className="tc2 mb-2">Create a function named <CopyCode code="swap"/> that takes two parameters and returns them in reverse order.</p>
          <p className="tc2 mb-6">e.g. <CopyCode code="swap(1, 2)"/> should return <CopyCode code="2, 1"/>.</p>

          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Create a swap function\n\n\n# Test your swap function"}
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

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q2" prevHref={undefined} />
        </div>
      </div>
    </>
  );
}
