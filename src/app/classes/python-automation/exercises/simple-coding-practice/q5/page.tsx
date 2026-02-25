'use client';

import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, deRepr, checkRequiredCode, validateError, createSetResult, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
import { useAuth } from '@/context/AuthContext';
import { CodeBlock } from '@/components/CodeBlock';

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

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="AND Operator"  partName="p1"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">The <CopyCode code="and" /> operator takes the value on the left and right and returns True only if both values are True.</p>
          <CodeBlock code={`result = False and True # False`} language="python" className="mb-2" />
          <p className="tc2 mb-2">To succeed you must be in the right place at the right time.</p>
          <p className="tc2 mb-2"> Use the <CopyCode code="and" /> operator to combine the two boolean valuess and store the result in <CopyCode code="success" />.</p>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-2">Change the values of <CopyCode code="right_place" /> and <CopyCode code="right_time" /> to see how the <CopyCode code="and" /> operator behaves.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Use the AND operator\nright_place = True\nright_time = False\nsuccess = "}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1} onCodeStartCallback={() => startCode('p1')}
              cachedCode={submissionStates[`${questionName}_p1`]?.code? submissionStates[`${questionName}_p1`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p1' ? '' : 'hidden'} ${(!validationStates['p1'] || validationStates['p1'] === 'pending') ? 'opacity-0' : validationStates['p1'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p1'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="OR Operator"  partName="p2"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">The <CopyCode code="or" /> operator takes the value on the left and right and returns True if at least one is True. It only returns False if both values are False.</p>
          <CodeBlock code={`result = False or True # True`} language="python" className="mb-2" />
          <p className="tc2 mb-2">To stay dry in the rain you need an umbrella or a jacket, but having both doesn't hurt.</p>
          <p className="tc2 mb-2">Use the <CopyCode code="or" /> operator to combine the boolean variables and store the result in <CopyCode code="is_dry" />.</p>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-2">Change the values of <CopyCode code="has_umbrella" /> and <CopyCode code="has_jacket" /> to see how the <CopyCode code="or" /> operator behaves.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Use the OR operator\nhas_umbrella = True\nhas_jacket = False\nis_dry = "}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2} onCodeStartCallback={() => startCode('p2')}
              cachedCode={submissionStates[`${questionName}_p2`]?.code? submissionStates[`${questionName}_p2`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p2' ? '' : 'hidden'} ${(!validationStates['p2'] || validationStates['p2'] === 'pending') ? 'opacity-0' : validationStates['p2'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p2'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="NOT Operator"  partName="p3"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">The <CopyCode code="not" /> operator takes a single boolean value to the right and returns the opposite. If the input is True, it returns False. If the input is False, it returns True.</p>
          <CodeBlock code={`result = not True # False`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Use the <CopyCode code="not" /> operator to negate <CopyCode code="is_tall" /> and store in <CopyCode code="is_short" />.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Use the NOT operator\nis_tall = True\nis_short = "}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3} onCodeStartCallback={() => startCode('p3')}
              cachedCode={submissionStates[`${questionName}_p3`]?.code? submissionStates[`${questionName}_p3`].code : undefined}
            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p3' ? '' : 'hidden'} ${(!validationStates['p3'] || validationStates['p3'] === 'pending') ? 'opacity-0' : validationStates['p3'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p3'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Combining Boolean Expressions"  partName="p4"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">You can combine multiple boolean operators together to create more complex expressions. Use parentheses to control the order of operations.</p>
          <p className="tc2 mb-2">Combine the boolean using <CopyCode code="(hungry and dinner_time) and not has_leftovers" /> and store in <CopyCode code="need_to_cook" />.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Combine boolean expressions\nhungry = True\ndinner_time = False\nhas_leftovers = True\nneed_to_cook = "}
              initialDocumentName="test.py" initialShowLineNumbers={false} initialIsCompact={true}
              initialVDivider={100} initialHDivider={60} initialPersistentExec={false}
              onCodeEndCallback={validateCodeP4} onCodeStartCallback={() => startCode('p4')}
              cachedCode={submissionStates[`${questionName}_p4`]?.code? submissionStates[`${questionName}_p4`].code : undefined}
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
