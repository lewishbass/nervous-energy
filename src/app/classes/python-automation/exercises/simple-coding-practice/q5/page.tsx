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
const questionName = 'q5';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question5() {
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

  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' and ']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const a = validateVariable(vars, 'right_place', 'bool', undefined);
    if (!a.passed) { setResult('p1', 'failed', a.message, code); return; }
    const b = validateVariable(vars, 'right_time', 'bool', undefined);
    if (!b.passed) { setResult('p1', 'failed', b.message, code); return; }
    const result = validateVariable(vars, 'success', 'bool', undefined);
    if (!result.passed) { setResult('p1', 'failed', result.message, code); return; }
    const aVal = deRepr(vars['right_place'].value, 'bool') as boolean;
    const bVal = deRepr(vars['right_time'].value, 'bool') as boolean;
    const resultVal = deRepr(vars['success'].value, 'bool') as boolean;
    if (resultVal !== (aVal && bVal)) { setResult('p1', 'failed', `Variable "success" should be ${aVal && bVal}, got ${resultVal}.`, code); return; }
    setResult('p1', 'passed', 'AND operation is correct!', code);
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' or ']);
    if (!req.passed) { setResult('p2', 'failed', req.message, code); return; }
    const a = validateVariable(vars, 'has_umbrella', 'bool', undefined);
    if (!a.passed) { setResult('p2', 'failed', a.message, code); return; }
    const b = validateVariable(vars, 'has_jacket', 'bool', undefined);
    if (!b.passed) { setResult('p2', 'failed', b.message, code); return; }
    const result = validateVariable(vars, 'is_dry', 'bool', undefined);
    if (!result.passed) { setResult('p2', 'failed', result.message, code); return; }
    const aVal = deRepr(vars['has_umbrella'].value, 'bool') as boolean;
    const bVal = deRepr(vars['has_jacket'].value, 'bool') as boolean;
    const resultVal = deRepr(vars['is_dry'].value, 'bool') as boolean;
    if (resultVal !== (aVal || bVal)) { setResult('p2', 'failed', `Variable "is_dry" should be ${aVal || bVal}, got ${resultVal}.`, code); return; }
    setResult('p2', 'passed', 'OR operation is correct!', code);
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['not ']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const a = validateVariable(vars, 'is_tall', 'bool', undefined);
    if (!a.passed) { setResult('p3', 'failed', a.message, code); return; }
    const result = validateVariable(vars, 'is_short', 'bool', undefined);
    if (!result.passed) { setResult('p3', 'failed', result.message, code); return; }
    const aVal = deRepr(vars['is_tall'].value, 'bool') as boolean;
    const resultVal = deRepr(vars['is_short'].value, 'bool') as boolean;
    if (resultVal !== !aVal) { setResult('p3', 'failed', `Variable "is_short" should be ${!aVal}, got ${resultVal}.`, code); return; }
    setResult('p3', 'passed', 'NOT operation is correct!', code);
  };

  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' and ', 'not ']);
    if (!req.passed) { setResult('p4', 'failed', req.message, code); return; }
    const a = validateVariable(vars, 'hungry', 'bool', undefined);
    if (!a.passed) { setResult('p4', 'failed', a.message, code); return; }
    const b = validateVariable(vars, 'dinner_time', 'bool', undefined);
    if (!b.passed) { setResult('p4', 'failed', b.message, code); return; }
    const c = validateVariable(vars, 'has_leftovers', 'bool', undefined);
    if (!c.passed) { setResult('p4', 'failed', c.message, code); return; }
    const result = validateVariable(vars, 'need_to_cook', 'bool', undefined);
    if (!result.passed) { setResult('p4', 'failed', result.message, code); return; }
    const aVal = deRepr(vars['hungry'].value, 'bool') as boolean;
    const bVal = deRepr(vars['dinner_time'].value, 'bool') as boolean;
    const cVal = deRepr(vars['has_leftovers'].value, 'bool') as boolean;
    const resultVal = deRepr(vars['need_to_cook'].value, 'bool') as boolean;
    const expected = (aVal && bVal) && !cVal;
    if (resultVal !== expected) { setResult('p4', 'failed', `Variable "need_to_cook" should be ${expected}, got ${resultVal}.`, code); return; }
    setResult('p4', 'passed', 'Combined boolean expression is correct!', code);
  };

  return (
    <>
      <RandomBackground seed={5} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q5 - Boolean Operations"
          description="Use Python's boolean operators to combine and negate boolean values."
          objectives={[
            'AND operator',
            'OR operator',
            'NOT operator',
            'Combining boolean expressions',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">AND Operator</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">To succeed you must be in the right place at the right time.</p>
          <p className="tc2 mb-2">Create two boolean variables <CopyCode code="right_place" /> and <CopyCode code="right_time" /> with any values.</p>
          <p className="tc2 mb-6"> Use the <CopyCode code="and" /> operator to combine them and store in <CopyCode code="success" />. The result is <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> only when both values are <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code>.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Use the AND operator\nright_place = True\nright_time = False\nsuccess = "}
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

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">OR Operator</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">To stay dry in the rain you need an umbrella or a jacket, but having both doesn't hurt.</p>
          <p className="tc2 mb-2">Create two boolean variables <CopyCode code="has_umbrella" /> and <CopyCode code="has_jacket" /> with any values.</p>
          <p className="tc2 mb-6">Use the <CopyCode code="or" /> operator to combine them and store in <CopyCode code="is_dry" />. The result is <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> when at least one value is <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code>.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Use the OR operator\nhas_umbrella = True\nhas_jacket = False\nis_dry = "}
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

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">NOT Operator</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a boolean variable <CopyCode code="is_tall" /> with any value.</p>
          <p className="tc2 mb-6">Use the <CopyCode code="not" /> operator to negate it and store in <CopyCode code="is_short" />. The result is always the opposite of the input.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Use the NOT operator\nis_tall = True\nis_short = "}
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

        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p4' ? null : 'p4')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Combining Boolean Expressions</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create three boolean variables <CopyCode code="hungry" />, <CopyCode code="dinner_time" />, and <CopyCode code="has_leftovers" /> with any values.</p>
          <p className="tc2 mb-2">Combine them using <CopyCode code="(hungry and dinner_time) and not has_leftovers" /> and store in <CopyCode code="need_to_cook" />.</p>
          <p className="tc2 mb-6">Use parentheses to control the order of operations, just like in math.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Combine boolean expressions\nhungry = True\ndinner_time = False\nhas_leftovers = True\nneed_to_cook = "}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="q4" nextHref="q6" />
        </div>
      </div>
    </>
  );
}
