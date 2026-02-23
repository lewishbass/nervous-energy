'use client';

import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, deRepr, checkRequiredCode, validateError, submitQuestionToBackend, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'simple-coding-practice';
const questionName = 'q8';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question8() {
  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';
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

  // P1: At least 4 ints, 4 floats, 4 bools, 4 strings and print them
  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }
    if (!code.includes('print(')) { setResult('p1', 'failed', 'Your code must use print()', code); return; }

    const counts: Record<string, number> = { int: 0, float: 0, bool: 0, str: 0 };
    for (const v of Object.values(vars)) {
      if (v.type in counts) counts[v.type]++;
    }

    for (const [type, count] of Object.entries(counts)) {
      if (count < 4) {
        setResult('p1', 'failed', `You need at least 4 ${type} variables, found ${count}.`, code); return;
      }
    }

    setResult('p1', 'passed', 'All 16 variables initialized and printed correctly!', code);
  };

  // P2: Arithmetic on ints/floats, string operations
  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const reqArith = checkRequiredCode(code, ['*', '/', '+', '-', '%']);
    if (!reqArith.passed) { setResult('p2', 'failed', reqArith.message, code); return; }
    const reqStr = checkRequiredCode(code, ['.upper()', '.lower()', '.strip()', 'len(']);
    if (!reqStr.passed) { setResult('p2', 'failed', reqStr.message, code); return; }

    setResult('p2', 'passed', 'All arithmetic and string operations are present!', code);
  };

  // P3: Boolean logic - and, or, not
  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' and ', ' or ', 'not ']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    setResult('p3', 'passed', 'All boolean operations are correct!', code);
  };

  // P4: Comparisons with > < >= <= == !=
  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['>', '<', '>=', '<=', '==', '!=']);
    if (!req.passed) { setResult('p4', 'failed', req.message, code); return; }

    setResult('p4', 'passed', 'All comparisons are correct!', code);
  };

  return (
    <>
      <RandomBackground seed={8} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q8 - Review"
          description="Perform simple operations with ints, floats, bools and strings. Assign values to variables, manipulate them and print the results."
          objectives={[
            'Initializing variables with different data types',
            'Integer and string manipulation',
            'Boolean logic and operations',
            'Comparisons',
          ]}
        />

        {/* P1: Initializing variables */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Initializing Variables</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Initialize at least 4 integer variables with any values.</p>
          <p className="tc2 mb-2">Initialize at least 4 float variables with any values.</p>
          <p className="tc2 mb-2">Initialize at least 4 boolean variables with any values.</p>
          <p className="tc2 mb-6">Initialize at least 4 string variables with any values. Use <CopyCode code="print()" /> to display all of them.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Initialize 4 Ints\n\n\n# Initialize 4 floats\n\n\n# Initialize 4 bools\n\n\n# Initialize 4 strings\n\n\n# Print some variables"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1} onCodeStartCallback={() => startCode('p1')}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p1' ? '' : 'hidden'} ${(!validationStates['p1'] || validationStates['p1'] === 'pending') ? 'opacity-0' : validationStates['p1'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p1'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Arithmetic and string operations */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Integer and String Manipulation</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Perform arithmetic on some numbers using <CopyCode code="*" />, <CopyCode code="/" />, <CopyCode code="+" />, <CopyCode code="-" />, and <CopyCode code="%" />.</p>
          <p className="tc2 mb-2">Create a string variable and apply:<CopyCode code=".upper()" />, <CopyCode code=".lower()" />, <CopyCode code=".strip()" /> and <CopyCode code="len()" /></p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Arithmetic operations\n\n\n# String operations\n\n\n"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2} onCodeStartCallback={() => startCode('p2')}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p2' ? '' : 'hidden'} ${(!validationStates['p2'] || validationStates['p2'] === 'pending') ? 'opacity-0' : validationStates['p2'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p2'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Boolean logic */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Boolean Logic</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Use the boolean operators :<CopyCode code="and" />, <CopyCode code="or" /> and<CopyCode code="not" /></p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Use boolean operators: and, or, not\n\n\n"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3} onCodeStartCallback={() => startCode('p3')}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p3' ? '' : 'hidden'} ${(!validationStates['p3'] || validationStates['p3'] === 'pending') ? 'opacity-0' : validationStates['p3'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p3'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Comparisons */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p4' ? null : 'p4')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Comparisons</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create some variables and use all six comparison operators somewhere in your code:</p>
          <div className="flex flex-row items-center justify-center gap-4 mb-4">
          <CopyCode code=">" />
          <CopyCode code="<" />
          <CopyCode code=">=" />
          <CopyCode code="<=" />
          <CopyCode code="==" />
          <CopyCode code="!=" />
          </div>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Use all six comparison operators\n\n\n"}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP4} onCodeStartCallback={() => startCode('p4')}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="q7" />
        </div>
      </div>
    </>
  );
}
