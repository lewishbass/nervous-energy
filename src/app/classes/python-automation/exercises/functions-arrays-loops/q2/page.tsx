'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, submitQuestionToBackend, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState, checkRequiredCode, runTestCases } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
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

  const setResult = (part: string, state: 'passed' | 'failed', message: string, code: string) => {
    setValidationMessages(prev => ({ ...prev, [part]: message }));
    setValidationStates(prev => ({ ...prev, [part]: state }));
    if (isLoggedIn && username && token) {
      const partKey = `${questionName}_${part}`;
      setSubmissionStates(prev => ({ ...prev, [partKey]: 'uploading' }));
      submitQuestionToBackend(username, token, code, className, assignmentName, partKey, state === 'passed' ? 'passed' : 'failed', message)
        .then(res => {
          setSubmissionStates(prev => ({ ...prev, [partKey]: res.submissionState === 'submitted' ? { resultStatus: state === 'passed' ? 'passed' : 'failed' } : null }));
        }).catch(() => {
          setSubmissionStates(prev => ({ ...prev, [partKey]: null }));
        });
    }
  };

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

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
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

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
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

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px',}}>
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Pass some tests</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc3 mb-2">Test cases are used to verify that a program behaves correctly under specific conditions.</p>
            <p className="tc3 mb-2">Most questions won't explicitly tell you what cases you have to pass, it is up to you to imagine where your program might fail, and make it robust.</p>
          <p className="tc2 mb-2">Create a function <CopyCode code="aRatio"/> that returns the fraction of letters in a string that are 'a'.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Create the function aRatio that returns the fraction of 'a's in a string\n\n\n# It needs to pass these the following test cases:\ntest1 = ( aRatio('banana') == 3/6 )\ntest2 = ( aRatio('blueberry') == 0 )\ntest3 = ( aRatio('') == 0 )\ntest4 = ( aRatio('aaaaa') == 1 )"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1}
              onCodeStartCallback={() => startCode('p1')}
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
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Test a function</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Given the function <CopyCode code='genEmail'/>, finish writing the test cases, so it passes them all.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# DO NOT EDIT: given a domain and username, generates an email address\ndef genEmail(username, domain):\n    return username + '@' + domain\n\n\n# Complete the test cases to verify that genEmail works correctly\ntest1 = ( genEmail('alice', 'example.com') == )\ntest2 = ( genEmail('aaron', 'gmail.com') == )\ntest3 = ( genEmail('bob', 'yahoo.com') == )"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={75} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2}
              onCodeStartCallback={() => startCode('p2')}
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
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Find a bug</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc3 mb-2">When designing test cases, it is important to cover both common cases and edge cases.</p>
          <p className="tc2 mb-2">The function <CopyCode code="getGrade"/> contains a bug. Write a test case that finds this bug and returns false.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[600px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# DO NOT EDIT: converts grade number to\n# A (100- 90)\n# B ( 90- 80)\n# C ( 80- 70)\n# D ( 70- 60)\n# F ( 60- 00)\ndef getGrade(score):\n    if score >= 90:\n        return 'A'\n    elif score >= 80:\n        return 'B'\n    elif score >= 70:\n        return 'C'\n    elif score <= 60:\n        return 'D'\n    else:\n        return 'F'\n\n\n# Write a test case that fails due to the bug in getGrade\ntest1 = ( getGrade("}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true} initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3}
              onCodeStartCallback={() => startCode('p3')}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="q1" nextHref="q3" />
        </div>
      </div>
    </>
  );
}
