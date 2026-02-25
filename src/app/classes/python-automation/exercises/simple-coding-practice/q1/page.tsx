'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import PythonIde from '@/components/coding/PythonIde';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, createSetResult, getQuestionSubmissionStatus, CloudIndicator, sanitizeSubmissionState } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import CopyCode from '../../exercise-components/CopyCode';
import { useAuth } from '@/context/AuthContext';
import { sub } from '@tensorflow/tfjs-core';
import { CodeBlock } from '@/components/CodeBlock';

const className = 'python-automation';
const assignmentName = 'simple-coding-practice';
const questionName = 'q1';
const questionParts = ['p1', 'p2', 'p3'];

export default function Question1() {
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
      //console.log('Fetched submission states:', states);
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
    const passed = validateVariable(vars, 'my_number', 'int', 42);
    setResult('p1', passed.passed ? 'passed' : 'failed', passed.message, code);
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const passed = validateVariable(vars, 'my_string', 'str', 'Hello World');
    setResult('p2', passed.passed ? 'passed' : 'failed', passed.message, code);
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const passed = validateVariable(vars, 'my_bool', 'bool', true);
    setResult('p3', passed.passed ? 'passed' : 'failed', passed.message, code);
  };

  return (
    <>
      <RandomBackground seed={1} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q1 - Assigning values to variables"
          description='Practice basic variable assignment in Python by assigning different types of values to variables.'
          objectives={[
            'Assign integer values to variables',
            'Assign string values to variables',
            'Assign boolean values to variables',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Assigning Ints"  partName="p1"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">The <CopyCode code="=" /> operator takes a value on the right, and assigns it to a variable on the left.</p>
          <CodeBlock code={`variable_name = 5318008`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Use the <CopyCode code="=" /> operator to assign the integer value 42 to a variable named <CopyCode code="my_number" />.</p>
          <p className="tc2 mb-2">Notice the variable inspector on the right, click on the variable to see its member functions.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Assign the integer value 42 to a variable named my_number"}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1}
              onCodeStartCallback={() => startCode('p1')}
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

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px',}}>
          <QuestionHeader title="Assigning Strings" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates}/>
          <p className="tc3 mb-2">Strings are sequences of character enclosed in either single <CopyCode code="'" /> or double <CopyCode code='"' /> quotes.</p>
          <CodeBlock code={`example_variable = "This is a string"`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Assign the string value "Hello World" to a variable named <CopyCode code="my_string" />.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Assign the string value \"Hello World\" to a variable named my_string"}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2}
              onCodeStartCallback={() => startCode('p2')}
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

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Assigning Booleans"  partName="p3"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">In Python, boolean values are capitalized: <CopyCode code="True" /> and <CopyCode code="False" />.</p>
          <CodeBlock code={`is_python_fun = False`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Assign the boolean value True to a variable named <CopyCode code="my_bool" />.</p>
          
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Assign the boolean value True to a variable named my_bool"}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3}
              onCodeStartCallback={() => startCode('p3')}
              cachedCode={submissionStates[`${questionName}_p3`]?.code? submissionStates[`${questionName}_p3`].code : undefined}
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
