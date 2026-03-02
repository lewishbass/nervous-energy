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

  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
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

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
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

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
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

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Define and Call" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# Create a function named increment\n\n\n# Call your function and store the result in a variable"}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>
              A function is a re-usable block of code that takes variables and returns results. Use the <CopyCode code="def"/> keyword to name your function. The input parameters are listed in parentheses after the function name. The <CopyCode code="return"/> keyword is used to return a value from a function. The indented block after the line with <CopyCode code="def"/> statement ending with a colon <CopyCode code=":"/> tells Python what is in the function.
            <CodeExample code={`def double(a): # function named double that takes one parameter a
		output = a * 2 # multiply a by 2 and store in variable output
		return output # return the value of output
b = double(5) # passes 5 to our function, and stores the returned value in b`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Define a function named <CopyCode code="increment"/> that takes one parameter and returns that parameter plus 1.</p>
              <p className="mb-2">Then call your function and store the results in a variable.</p>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Test Cases" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# Create a function named foobar\n\n\n# foobar should pass the following test cases\ntest1 = ( foobar(1) == 4 )\ntest2 = ( foobar(2) == 2 )\ntest3 = ( foobar(3) == 0 )"}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>
              Test cases are a way to verify that your function works correctly. They check how it performs on different inputs, and checks the output against expected values. Tests focus on edge cases, where weird values might break your function. This is how your programs are graded in this class and the real world.
            </Mechanics>
            <Objectives>
              Implement the function <CopyCode code="foobar"/> that passes the provided test cases.
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Multiple Parameters" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# Create a swap function\n\n\n# Test your swap function"}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>
              Functions can take and return multiple values. After the <CopyCode code="def"/> keyword, inside the parentheses you can list multiple parameters separated by commas. List multiple variables after the <CopyCode code="return"/> keyword separated by commas, and catch the output in multiple variables.
            <CodeExample code={`def math_ops(a, b): # this function requires both a and b to work
  sum = a + b
  diff = a - b
  return sum, diff

result_sum, result_diff = math_ops(5, 3) # call the function, and catch both outputs`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Create a function named <CopyCode code="swap"/> that takes two parameters and returns them in reverse order.</p>
              <p className="mb-2">e.g. <CopyCode code="swap(1, 2)"/> should return <CopyCode code="2, 1"/>.</p>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q2" prevHref={undefined} />
        </div>
      </div>
    </>
  );
}
