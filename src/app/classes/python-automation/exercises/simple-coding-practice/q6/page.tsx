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
const questionName = 'q6';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question6() {
  
  

  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';
  const questionPath = `${assignmentPath}/${questionName}`;

  const [validationMessages, setValidationMessages] = useState<Record<string, string>>(() =>{
    // load validation  messages from local storage to persist across page navigation
    if (typeof window === 'undefined') return {};
    const savedMessages = localStorage.getItem(questionPath.replace('/', '_') + "_validationMessages");
    return savedMessages ? JSON.parse(savedMessages) : {};
  });
  const [validationStates, setValidationStates] = useState<Record<string, 'passed' | 'failed' | 'pending' | null>>(() =>{
    if (typeof window === 'undefined') return {};
    // load validation states from local storage to persist across page navigation
    const savedStates = localStorage.getItem(questionPath.replace('/', '_') + "_validationStates");
    return savedStates ? JSON.parse(savedStates) : {};
  });
  const [submissionStates, setSubmissionStates] = useState<Record<string, any>>({});
  // gray idle or null
  // yellow loading
  // red wrong answer
  // green right answer
  
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const { isLoggedIn, username, token } = useAuth();

  /**
   * Sets the validation message and state for a part, and submits the result to the backend.
   */
  const setResult = (
    part: string,
    state: 'passed' | 'failed',
    message: string,
    code: string
  ) => {
    setValidationMessages(prev => ({ ...prev, [part]: message }));
    setValidationStates(prev => ({ ...prev, [part]: state }));
    if (isLoggedIn && username && token) {
      const partKey = `${questionName}_${part}`;
      setSubmissionStates(prev => ({ ...prev, [partKey]: 'uploading' }));
      submitQuestionToBackend(
        username, token, code, className, assignmentName, partKey,
        state === 'passed' ? 'passed' : 'failed', message
      ).then(res => {
        setSubmissionStates(prev => ({ ...prev, [partKey]: res.submissionState === 'submitted' ? { resultStatus: state === 'passed' ? 'passed' : 'failed' } : null }));
      }).catch(() => {
        setSubmissionStates(prev => ({ ...prev, [partKey]: null }));
      });
    }
  };

  // loads submission states from the backend
  useEffect(() =>{
    if(!isLoggedIn || !username || !token) return;
    const partNames = questionParts.map(part => `${questionName}_${part}`);
    
    // set submission states to loading
    setSubmissionStates(partNames.reduce((acc, part) => ({ ...acc, [part]: 'downloading' }), {}));
    
    getQuestionSubmissionStatus(username, token, className, assignmentName, partNames).then(states => {
      setSubmissionStates(states);
    }).catch(error => {
      console.error('Error loading submission status:', error)
      // set states to idle
      setSubmissionStates(partNames.reduce((acc, part) => ({ ...acc, [part]: null }), {}));
    });
  }, [isLoggedIn, username, token])


  useEffect(() => {
    // save validation states and messages to local storage to persist across page navigation
    localStorage.setItem(questionPath.replace('/', '_') + "_validationStates", JSON.stringify(validationStates));
    localStorage.setItem(questionPath.replace('/', '_') + "_validationMessages", JSON.stringify(validationMessages));

  }, [validationMessages, validationStates]);

  const startCode = (part: string) => {
    setValidationStates(prev => ({ ...prev, [part]: 'pending' }));
    setValidationMessages(prev => { const n = { ...prev }; delete n[part]; return n; });
  };

  // P1: is_am = time < 12, is_pm = time >= 12
  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const req = checkRequiredCode(code, ['<']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const time = validateVariable(vars, 'time', 'int', undefined);
    const is_am = validateVariable(vars, 'is_am', 'bool', undefined);
    const is_pm = validateVariable(vars, 'is_pm', 'bool', undefined);

    if (!time.passed) { setResult('p1', 'failed', time.message, code); return; }
    if (!is_am.passed) { setResult('p1', 'failed', is_am.message, code); return; }
    if (!is_pm.passed) { setResult('p1', 'failed', is_pm.message, code); return; }

    const timeVal = deRepr(vars['time'].value, 'int') as number;
    const isAmVal = deRepr(vars['is_am'].value, 'bool') as boolean;
    const isPmVal = deRepr(vars['is_pm'].value, 'bool') as boolean;
    const expectedAm = timeVal < 12;
    const expectedPm = timeVal >= 12;

    if (isAmVal !== expectedAm) { setResult('p1', 'failed', `Variable "is_am" should be ${expectedAm} for time=${timeVal}, got ${isAmVal}.`, code); return; }
    if (isPmVal !== expectedPm) { setResult('p1', 'failed', `Variable "is_pm" should be ${expectedPm} for time=${timeVal}, got ${isPmVal}.`, code); return; }

    setResult('p1', 'passed', 'AM/PM comparison is correct!', code);
  };

  // P2: salary brackets
  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' and ']);
    if (!req.passed) { setResult('p2', 'failed', req.message, code); return; }
    const salary = validateVariable(vars, 'salary', 'int', undefined);
    const in_low = validateVariable(vars, 'in_low_bracket', 'bool', undefined);
    const in_mid = validateVariable(vars, 'in_medium_bracket', 'bool', undefined);
    const in_high = validateVariable(vars, 'in_high_bracket', 'bool', undefined);

    if (!salary.passed) { setResult('p2', 'failed', salary.message, code); return; }
    if (!in_low.passed) { setResult('p2', 'failed', in_low.message, code); return; }
    if (!in_mid.passed) { setResult('p2', 'failed', in_mid.message, code); return; }
    if (!in_high.passed) { setResult('p2', 'failed', in_high.message, code); return; }

    const s = deRepr(vars['salary'].value, 'int') as number;
    const lowVal = deRepr(vars['in_low_bracket'].value, 'bool') as boolean;
    const midVal = deRepr(vars['in_medium_bracket'].value, 'bool') as boolean;
    const highVal = deRepr(vars['in_high_bracket'].value, 'bool') as boolean;

    const expLow = s >= 0 && s < 100000;
    const expMid = s >= 100000 && s < 250000;
    const expHigh = s >= 250000;

    if (lowVal !== expLow) { setResult('p2', 'failed', `"in_low_bracket" should be ${expLow} for salary=${s}, got ${lowVal}.`, code); return; }
    if (midVal !== expMid) { setResult('p2', 'failed', `"in_medium_bracket" should be ${expMid} for salary=${s}, got ${midVal}.`, code); return; }
    if (highVal !== expHigh) { setResult('p2', 'failed', `"in_high_bracket" should be ${expHigh} for salary=${s}, got ${highVal}.`, code); return; }

    setResult('p2', 'passed', 'Salary bracket comparisons are correct!', code);
  };

  // P3: alphabetical comparison
  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['<']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const name1 = validateVariable(vars, 'name1', 'str', undefined);
    const name2 = validateVariable(vars, 'name2', 'str', undefined);
    const name3 = validateVariable(vars, 'name3', 'str', undefined);
    const new_name = validateVariable(vars, 'new_name', 'str', undefined);
    const between12 = validateVariable(vars, 'between_name1_and_name2', 'bool', undefined);
    const between23 = validateVariable(vars, 'between_name2_and_name3', 'bool', undefined);

    for (const v of [name1, name2, name3, new_name, between12, between23]) {
      if (!v.passed) { setResult('p3', 'failed', v.message, code); return; }
    }

    const n1 = deRepr(vars['name1'].value, 'str') as string;
    const n2 = deRepr(vars['name2'].value, 'str') as string;
    const n3 = deRepr(vars['name3'].value, 'str') as string;
    const nn = deRepr(vars['new_name'].value, 'str') as string;
    const b12Val = deRepr(vars['between_name1_and_name2'].value, 'bool') as boolean;
    const b23Val = deRepr(vars['between_name2_and_name3'].value, 'bool') as boolean;

    const expB12 = nn > n1 && nn < n2;
    const expB23 = nn > n2 && nn < n3;

    if (b12Val !== expB12) { setResult('p3', 'failed', `"between_name1_and_name2" should be ${expB12} for new_name="${nn}", got ${b12Val}.`, code); return; }
    if (b23Val !== expB23) { setResult('p3', 'failed', `"between_name2_and_name3" should be ${expB23} for new_name="${nn}", got ${b23Val}.`, code); return; }

    setResult('p3', 'passed', 'Alphabetical comparisons are correct!', code);
  };

  // P4: equality and inequality
  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['==', '!=']);
    if (!req.passed) { setResult('p4', 'failed', req.message, code); return; }
    const due = validateVariable(vars, 'due', 'float', undefined);
    const paid = validateVariable(vars, 'paid', 'float', undefined);
    const is_paid = validateVariable(vars, 'is_paid_in_full', 'bool', undefined);
    const is_under = validateVariable(vars, 'is_underpaid', 'bool', undefined);
    const is_over = validateVariable(vars, 'is_overpaid', 'bool', undefined);
    const needs_change = validateVariable(vars, 'needs_change', 'bool', undefined);

    for (const v of [due, paid, is_paid, is_under, is_over, needs_change]) {
      if (!v.passed) { setResult('p4', 'failed', v.message, code); return; }
    }

    const dueVal = deRepr(vars['due'].value, 'float') as number;
    const paidVal = deRepr(vars['paid'].value, 'float') as number;
    const isPaidVal = deRepr(vars['is_paid_in_full'].value, 'bool') as boolean;
    const isUnderVal = deRepr(vars['is_underpaid'].value, 'bool') as boolean;
    const isOverVal = deRepr(vars['is_overpaid'].value, 'bool') as boolean;
    const needsChangeVal = deRepr(vars['needs_change'].value, 'bool') as boolean;

    const expPaid = Math.abs(paidVal - dueVal) < 1e-9;
    const expUnder = paidVal < dueVal;
    const expOver = paidVal > dueVal;
    const expNeeds = paidVal !== dueVal;

    if (isPaidVal !== expPaid) { setResult('p4', 'failed', `"is_paid_in_full" should be ${expPaid}, got ${isPaidVal}.`, code); return; }
    if (isUnderVal !== expUnder) { setResult('p4', 'failed', `"is_underpaid" should be ${expUnder}, got ${isUnderVal}.`, code); return; }
    if (isOverVal !== expOver) { setResult('p4', 'failed', `"is_overpaid" should be ${expOver}, got ${isOverVal}.`, code); return; }
    if (needsChangeVal !== expNeeds) { setResult('p4', 'failed', `"needs_change" should be ${expNeeds}, got ${needsChangeVal}.`, code); return; }

    setResult('p4', 'passed', 'Equality and inequality comparisons are correct!', code);
  };

  return (
    <>
      <RandomBackground seed={6} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">

        <AssignmentOverview
          title="Q6 - Numerical Comparisons"
          description="Use comparison operators to compare numbers and determine truth values."
          objectives={[
            'Comparing numbers',
            'Double comparison',
            'Comparing strings',
            'Equals and not equals',
          ]}
        />

        {/* P1: Comparing Numbers */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Comparing Numbers</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Use the <CopyCode code="&lt;" /> operator to set <CopyCode code="is_am" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> when <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">time</code> is before noon.</p>
          <p className="tc2 mb-6">Use <CopyCode code=">=" /> to set <CopyCode code="is_pm" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> when <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">time</code> is noon or later.</p>

          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Compare time to determine AM or PM\ntime = 14\nis_am = \nis_pm = "}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
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

        {/* P2: Double Comparison */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Double Comparison</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Use <CopyCode code="and" /> to combine <CopyCode code="<" /> and <CopyCode code="<=" /> comparisons and determine the tax bracket membership:</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="in_low_bracket" /> — $0 to $99,999</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="in_medium_bracket" /> — $100,000 to $249,999</p>
          <p className="tc2 mb-6 ml-4">• <CopyCode code="in_high_bracket" /> — $250,000 and above</p>

          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Assign salary bracket membership\nsalary = 75000\n# $0 - $100,000 not including $100,000\nin_low_bracket = \n# $100,000 - $250,000 not including $250,000\nin_medium_bracket = \n# $250,000 and above\nin_high_bracket = "}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
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

        {/* P3: Comparing Strings */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Comparing Strings</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">The comparison operators (<CopyCode code="&gt;="/> <CopyCode code="&lt;" />...) compare strings alphabetically, like their order in a dictionary.</p>
          <p className="tc2 mb-2">We are arranging our students alphabetically, and want to know where the new student fits in.</p>
          <p className="tc2 mb-2">Set <CopyCode code="between_name1_and_name2" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if <CopyCode code="new_name" /> comes after <CopyCode code="name1" /> and before <CopyCode code="name2" /></p>
          <p className="tc2 mb-6">Set <CopyCode code="between_name2_and_name3" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if <CopyCode code="new_name" /> comes after <CopyCode code="name2" /> and before <CopyCode code="name3" /></p>

          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={'# Compare strings alphabetically\nname1 = "Alice"\nname2 = "Bob"\nname3 = "David"\n\nnew_name = "Charlie"\n\nbetween_name1_and_name2 = \nbetween_name2_and_name3 = '}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
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
        <div className="h-4"></div>

        {/* P4: Equals and Not Equals */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p4' ? null : 'p4')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Equals and Not Equals</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">When handling cash in a transaction, we need to know if the payment is correct.</p>
          <p className="tc2 mb-2">Use <CopyCode code="<"/>, <CopyCode code=">"/>, <CopyCode code="==" /> and <CopyCode code="!=" /> to assign:</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="is_paid_in_full" /> — <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if paid equals due</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="is_underpaid" /> — <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if paid is less than due</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="is_overpaid" /> — <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if paid is more than due</p>
          <p className="tc2 mb-6 ml-4">• <CopyCode code="needs_change" /> — <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> if paid does not equal due</p>

          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Use <, >, == and != to compare values\ndue = 102.21\npaid = 101.99\n\nis_paid_in_full = \nis_underpaid = \nis_overpaid = \nneeds_change = "}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP4}
              onCodeStartCallback={() => startCode('p4')}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="/classes/python-automation/exercises/simple-coding-practice/q5" nextHref="/classes/python-automation/exercises/simple-coding-practice/q7" />
        </div>
      </div>
    </>
  );
}
