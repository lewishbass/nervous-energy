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
import { CodeBlock } from '@/components/CodeBlock';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q2';
const questionParts = ['p1', 'p2', 'p3'];

export default function Question2() {
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
    
    const test1 = validateVariable(vars, 'test1', 'bool', true);
    const test2 = validateVariable(vars, 'test2', 'bool', true);
    const test3 = validateVariable(vars, 'test3', 'bool', true);
    const test4 = validateVariable(vars, 'test4', 'bool', true);
    if (!test1.passed) { setResult('p1', 'failed', test1.message, code); return; }
    if (!test2.passed) { setResult('p1', 'failed', test2.message, code); return; }
    if (!test3.passed) { setResult('p1', 'failed', test3.message, code); return; }
    if (!test4.passed) { setResult('p1', 'failed', test4.message, code); return; }

    const tests = [
      {args:['banana'], expected: 3/6},
      {args:['blueberry'], expected: 0},
      {args:[''], expected: 0},
      {args:['aaaaa'], expected: 1},
    ]
    const testResults = await runTestCases(pyodide, 'aRatio', tests);
    if (testResults.passed) {
      setResult('p1', 'passed', testResults.message, code);
    } else {
      setResult('p1', 'failed', testResults.message, code);
    }
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    
    const required = [
      "def genEmail(username, domain):",
      "return username + '@' + domain",
      "test1 = ( genEmail(",
      "test2 = ( genEmail(",
      "test3 = ( genEmail(",
    ];
    
    const codeCheck = checkRequiredCode(code, required);
    if (!codeCheck.passed) { setResult('p2', 'failed', codeCheck.message, code); return; }
    
    const test1 = validateVariable(vars, 'test1', 'bool', true);
    const test2 = validateVariable(vars, 'test2', 'bool', true);
    const test3 = validateVariable(vars, 'test3', 'bool', true);
    if (!test1.passed) { setResult('p2', 'failed', test1.message, code); return; }
    if (!test2.passed) { setResult('p2', 'failed', test2.message, code); return; }
    if (!test3.passed) { setResult('p2', 'failed', test3.message, code); return; }

    setResult('p2', 'passed', 'All test cases passed!', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const required = [
      "def getGrade(score):",
      "if score >= 90:",
      "elif score >= 80:",
      "elif score >= 70:",
      "elif score <= 60:",
      "test1 = ( getGrade(",
    ];
    const codeCheck = checkRequiredCode(code, required);
    if (!codeCheck.passed) { setResult('p3', 'failed', codeCheck.message, code); return; }

    // test1 must exist, be a bool, and be False (i.e. it catches the bug)
    const test1Check = validateVariable(vars, 'test1', 'bool', false);
    if (!test1Check.passed) {
      if (vars['test1'] && vars['test1'].value === 'True') {
        setResult('p3', 'failed', 'test1 returned True, your test case doesn\'t expose the bug.', code);
      } else {
        setResult('p3', 'failed', test1Check.message, code);
      }
      return;
    }

    // Extract the argument used in test1 so we can verify it passes a fixed getGrade
    // Run the same score against a corrected getGrade and confirm test1's comparison returns True
    const fixedVerifyResult: string = await pyodide.runPythonAsync(`
import json as _json

def _fixedGetGrade(score):
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    elif score >= 70:
        return 'C'
    elif score >= 60:
        return 'D'
    else:
        return 'F'

# Re-evaluate test1's expression with the fixed function substituted in
# We do this by finding the score and expected grade used in the original test1
import re as _re
_code = ${JSON.stringify(code)}
_match = _re.search(r'test1\\s*=\\s*\\(\\s*getGrade\\(([^)]+)\\)\\s*==\\s*([^)]+)\\)', _code)
_verify = False
if _match:
    _score_str = _match.group(1).strip()
    _expected_str = _match.group(2).strip()
    try:
        _score_val = eval(_score_str)
        _expected_val = eval(_expected_str)
        _verify = (_fixedGetGrade(_score_val) == _expected_val)
    except:
        _verify = False
_json.dumps({'verify': _verify})
`);

    const fixedParsed = JSON.parse(fixedVerifyResult);
    if (!fixedParsed.verify) {
      setResult('p3', 'failed', 'Your test case should return True for a correct implementation of getGrade.', code);
      return;
    }

    setResult('p3', 'passed', 'Great work! Your test case exposes the bug in getGrade.', code);
  };

  return (
    <>
      <RandomBackground seed={12} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q2 - Test Cases"
          description="Write functions and test cases, verify function behavior and correctness."
          objectives={[
            'Write a function that passes specific test cases',
            'Write tests to validate a function',
            'Write tests to catch a bug in a function',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Pass some tests" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# Create the function aRatio that returns the fraction of 'a's in a string\ndef aRatio(text : str):\n    # your code here\n\n# It needs to pass these the following test cases:\ntest1 = ( aRatio('banana') == 3/6 )\ntest2 = ( aRatio('blueberry') == 0 )\ntest3 = ( aRatio('') == 0 )\ntest4 = ( aRatio('aaaaa') == 1 )"}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>Test cases are used to verify that a program behaves correctly under specific conditions. Most questions won&apos;t explicitly tell you what cases you have to pass, it is up to you to imagine where your program might fail, and make it robust.
              <br/> They compare the result of a function <CopyCode code="aRatio('banana')"/> to the expected result <CopyCode code="3/6"/>. If the function returns a different value, the test case fails and returns False.
            </Mechanics>
            <Objectives>Create a function <CopyCode code="aRatio"/> that returns the fraction of letters in a string that are &apos;a&apos;.
            <ul className="list-disc list-inside mb-2 space-y-1">
              <li>Function named <CopyCode code="aRatio" /> takes in a string <CopyCode code="text" /></li>
              <li>Return the count of <CopyCode code={`"a"`} /> elements divided by the total length of the string</li>
            </ul>
            </Objectives>
            <Hints>Use the strings <CopyCode code=".count('a')"/> method to get the count of 'a's </Hints>
            <Hints>Use <CopyCode code="len()"/> get the total number of characters in the string.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Write some tests" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# DO NOT EDIT: given a domain and username, generates an email address\ndef genEmail(username, domain):\n    return username + '@' + domain\n\n\n# Complete the test cases to verify that genEmail works correctly\ntest1 = ( genEmail('alice', 'example.com') == )\ntest2 = ( genEmail('aaron', 'gmail.com') == )\ntest3 = ( genEmail('bob', 'yahoo.com') == )"}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            initialHDivider={75}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>Each test case uses the comparison operator <CopyCode code="=="/> to compare the actual result of the function call with the expected value.
            <CodeExample  code={`genEmail('john', 'aol.com') == 'john@aol.com'`}/>
            </Mechanics>
            <Objectives>The function <CopyCode code="genEmail"/>, already works. Finish each test case expression by adding the expected result of the function call.</Objectives>
            <Hints>The expected result of <CopyCode code="genEmail('alice', 'example.com')"/> is <CopyCode code="'alice@example.com'"/>, so its test case is <CopyCode code="test1 = ( genEmail('alice', 'example.com') == 'alice@example.com' )"/>.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Find a bug" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# DO NOT EDIT: converts grade number to\n# A (100- 90)\n# B ( 90- 80)\n# C ( 80- 70)\n# D ( 70- 60)\n# F ( 60- 00)\ndef getGrade(score):\n    if score >= 90:\n        return 'A'\n    elif score >= 80:\n        return 'B'\n    elif score >= 70:\n        return 'C'\n    elif score <= 60:\n        return 'D'\n    else:\n        return 'F'\n\n\n# Write a test case that fails due to the bug in getGrade\ntest1 = ( getGrade("}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>When designing test cases, it is important to cover both common cases and edge cases.</Mechanics>
            <Objectives>The function <CopyCode code="getGrade"/> contains a bug. Write a test case that finds this bug and returns false.</Objectives>
            <Hints>Find which input triggers the bug, and write a test case using that input and its <b>CORRECT</b> output.</Hints>
            <Hints>The function returns 'D' for any score less than 60, but it should return 'F'`.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q1" nextHref="q3" />
        </div>
      </div>
    </>
  );
}
