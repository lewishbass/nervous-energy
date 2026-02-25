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
const questionName = 'q2';
const questionParts = ['p1', 'p2', 'p3'];

export default function Question2() {
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
    const req = checkRequiredCode(code, ['+']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const a = validateVariable(vars, 'a', 'int', undefined);
    const b = validateVariable(vars, 'b', 'int', undefined);
    if (!a.passed) { setResult('p1', 'failed', a.message, code); return; }
    if (!b.passed) { setResult('p1', 'failed', b.message, code); return; }

    const aValue = deRepr(vars['a'].value, vars['a'].type);
    const bValue = deRepr(vars['b'].value, vars['b'].type);

    const sum = validateVariable(vars, 'sum', 'int', undefined);
    if (!sum.passed) { setResult('p1', 'failed', sum.message, code); return; }
    if (deRepr(vars['sum'].value, vars['sum'].type) !== aValue + bValue) {
      setResult('p1', 'failed', `Variable "sum" should equal ${aValue + bValue}, got ${deRepr(vars['sum'].value, vars['sum'].type)}.`, code); return;
    }

    const product = validateVariable(vars, 'product', 'int', undefined);
    if (!product.passed) { setResult('p1', 'failed', product.message, code); return; }
    if (deRepr(vars['product'].value, vars['product'].type) !== aValue * bValue) {
      setResult('p1', 'failed', `Variable "product" should equal ${aValue * bValue}, got ${deRepr(vars['product'].value, vars['product'].type)}.`, code); return;
    }

    const difference = validateVariable(vars, 'difference', 'int', undefined);
    if (!difference.passed) { setResult('p1', 'failed', difference.message, code); return; }
    if (deRepr(vars['difference'].value, vars['difference'].type) !== aValue - bValue) {
      setResult('p1', 'failed', `Variable "difference" should equal ${aValue - bValue}, got ${deRepr(vars['difference'].value, vars['difference'].type)}.`, code); return;
    }

    setResult('p1', 'passed', 'All variables are correctly assigned!', code);
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const message = validateVariable(vars, 'message', 'str', undefined);
    if (!message.passed) { setResult('p2', 'failed', message.message, code); return; }
    const number = validateVariable(vars, 'number', 'int', undefined);
    if (!number.passed) { setResult('p2', 'failed', number.message, code); return; }
    if (!code.includes('print(')) { setResult('p2', 'failed', 'Your code must include at least one print() statement.', code); return; }
    setResult('p2', 'passed', 'All variables are correctly assigned and printed!', code);
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['int(', 'str(']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const num_str = validateVariable(vars, 'num_str', 'str', undefined);
    if (!num_str.passed) { setResult('p3', 'failed', num_str.message, code); return; }
    const num_int = validateVariable(vars, 'num_int', 'int', undefined);
    if (!num_int.passed) { setResult('p3', 'failed', num_int.message, code); return; }
    if (deRepr(vars['num_str'].value, 'str') !== String(deRepr(vars['num_int'].value, 'int'))) {
      setResult('p3', 'failed', `'num_int' should be the integer conversion of 'num_str'.`, code); return;
    }
    const age = validateVariable(vars, 'age', 'int', undefined);
    if (!age.passed) { setResult('p3', 'failed', age.message, code); return; }
    const age_str = validateVariable(vars, 'age_str', 'str', undefined);
    if (!age_str.passed) { setResult('p3', 'failed', age_str.message, code); return; }
    if (String(deRepr(vars['age'].value, 'int')) !== deRepr(vars['age_str'].value, 'str')) {
      setResult('p3', 'failed', `'age_str' should be the string conversion of 'age'.`, code); return;
    }
    setResult('p3', 'passed', 'All conversions are correct!', code);
  };

  return (
    <>
      <RandomBackground seed={2} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q2 - Integer Operations"
          description="Perform simple operations on integer variables"
          objectives={[
            'Add, multiply and divide two integer variables',
            'Print numbers to the console',
            'Convert between integers and strings',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Basic Math Operations"  partName="p1"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2">Arithmetic operators take two operands (values) from their left and right sides, and return the results</p>
          <CodeBlock code={`a = 1 + 3 # result 4 is stored in a`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Create two integer variables <CopyCode code="a" /> and <CopyCode code="b" /> with any values.</p>
          <p className="tc2 mb-2">Create a variable <CopyCode code="sum" /> that adds them using <CopyCode code="+" />.</p>
          <p className="tc2 mb-2">Create a variable <CopyCode code="product" /> that multiplies them using <CopyCode code="*" />.</p>
          <p className="tc2 mb-2">Create a variable <CopyCode code="difference" /> that subtracts b from a using <CopyCode code="-" />.</p>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-2">Experiment with different values and see how it effects the results in the right panel.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Create two integers and perform operations\na = 6\nb = 7\nsum = \nproduct = \ndifference = "}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP1}
              onCodeStartCallback={() => startCode('p1')}              cachedCode={submissionStates[`${questionName}_p1`]?.code? submissionStates[`${questionName}_p1`].code : undefined}            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p1' ? '' : 'hidden'} ${(!validationStates['p1'] || validationStates['p1'] === 'pending') ? 'opacity-0' : validationStates['p1'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p1'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Printing to Console"  partName="p2"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}
            validationStates={validationStates}
          />
          <p className="tc3 mb-2">The <CopyCode code="print()" /> function outputs values or variables to the console. You can print multiple values by separating them with commas.</p>
          <CodeBlock code={`name = "Alice"\nage = 30\nprint("Name:", name, "Age:", age)`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Create a string variable <CopyCode code="message" /> with any text value.</p>
          <p className="tc2 mb-2">Create an integer variable <CopyCode code="number" /> with any numeric value.</p>
          <p className="tc2 mb-2">Use the <CopyCode code="print()" /> function to output both variables to the console.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Create variables and print them\nmessage = \nnumber = \n# Use print() to display your variables"}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={70}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP2}
              onCodeStartCallback={() => startCode('p2')}              cachedCode={submissionStates[`${questionName}_p2`]?.code? submissionStates[`${questionName}_p2`].code : undefined}            />}
          </div>
          <div className="mt-4">
            <div className={`p-3 rounded transition-all duration-300 ${selectedQuestion === 'p2' ? '' : 'hidden'} ${(!validationStates['p2'] || validationStates['p2'] === 'pending') ? 'opacity-0' : validationStates['p2'] === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {validationMessages['p2'] || '\u00A0'}
            </div>
          </div>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm" style={{maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px',}}>
          <QuestionHeader  title="Type Conversion"  partName="p3"  questionName={questionName}  selectedQuestion={selectedQuestion}  setSelectedQuestion={setSelectedQuestion}  submissionStates={submissionStates}  validationStates={validationStates}/>
          <p className="tc3 mb-2"><CopyCode code="int()" /> converts anything its given into an integer, <CopyCode code="str()" /> does the same for strings.</p>
          <CodeBlock code={`num_int = int("42") # convert the string "42" to the number 42`} language="python" className="mb-2" />
          <p className="tc2 mb-2">Convert <CopyCode code="num_str" /> to an integer using <CopyCode code="int()" /> and store in <CopyCode code="num_int" />.</p>
          <p className="tc2 mb-2">Convert <CopyCode code="age" /> to a string using <CopyCode code="str()" /> and store in <CopyCode code="age_str" />.</p>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-2">Try setting num_str to a decimal value like "42.5" and see what error occurs.</p>
          <div className={`mt-6 w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Convert between strings and integers\nnum_str = \"42\"\nnum_int = \nage = 25\nage_str = "}
              initialDocumentName="test.py"
              initialShowLineNumbers={false}
              initialIsCompact={true}
              initialVDivider={100}
              initialHDivider={60}
              initialPersistentExec={false}
              onCodeEndCallback={validateCodeP3}
              onCodeStartCallback={() => startCode('p3')}              cachedCode={submissionStates[`${questionName}_p3`]?.code? submissionStates[`${questionName}_p3`].code : undefined}            />}
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
