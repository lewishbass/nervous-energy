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
const questionName = 'q3';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question3() {
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
    const req = checkRequiredCode(code, ['+']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const first_name = validateVariable(vars, 'first_name', 'str', undefined);
    if (!first_name.passed) { setResult('p1', 'failed', first_name.message, code); return; }
    const last_name = validateVariable(vars, 'last_name', 'str', undefined);
    if (!last_name.passed) { setResult('p1', 'failed', last_name.message, code); return; }
    const full_name = validateVariable(vars, 'full_name', 'str', undefined);
    if (!full_name.passed) { setResult('p1', 'failed', full_name.message, code); return; }
    const expected = deRepr(vars['first_name'].value, 'str') + ' ' + deRepr(vars['last_name'].value, 'str');
    if (deRepr(vars['full_name'].value, 'str') !== expected) {
      setResult('p1', 'failed', `Variable "full_name" should equal "${expected}", got "${deRepr(vars['full_name'].value, 'str')}".`, code); return;
    }
    setResult('p1', 'passed', 'Strings concatenated correctly!', code);
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['.upper()', '.lower()']);
    if (!req.passed) { setResult('p2', 'failed', req.message, code); return; }
    const message = validateVariable(vars, 'message', 'str', undefined);
    if (!message.passed) { setResult('p2', 'failed', message.message, code); return; }
    const upper_message = validateVariable(vars, 'upper_message', 'str', undefined);
    if (!upper_message.passed) { setResult('p2', 'failed', upper_message.message, code); return; }
    const lower_message = validateVariable(vars, 'lower_message', 'str', undefined);
    if (!lower_message.passed) { setResult('p2', 'failed', lower_message.message, code); return; }
    const msgVal = deRepr(vars['message'].value, 'str') as string;
    if (deRepr(vars['upper_message'].value, 'str') !== msgVal.toUpperCase()) {
      setResult('p2', 'failed', `Variable "upper_message" should be uppercase version of "message".`, code); return;
    }
    if (deRepr(vars['lower_message'].value, 'str') !== msgVal.toLowerCase()) {
      setResult('p2', 'failed', `Variable "lower_message" should be lowercase version of "message".`, code); return;
    }
    setResult('p2', 'passed', 'Case conversion done correctly!', code);
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['.strip()']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const untrimmed = validateVariable(vars, 'untrimmed', 'str', undefined);
    if (!untrimmed.passed) { setResult('p3', 'failed', untrimmed.message, code); return; }
    const trimmed = validateVariable(vars, 'trimmed', 'str', undefined);
    if (!trimmed.passed) { setResult('p3', 'failed', trimmed.message, code); return; }
    if (deRepr(vars['trimmed'].value, 'str') !== (deRepr(vars['untrimmed'].value, 'str') as string).trim()) {
      setResult('p3', 'failed', `Variable "trimmed" should have whitespace removed from "untrimmed".`, code); return;
    }
    setResult('p3', 'passed', 'Whitespace trimmed correctly!', code);
  };

  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, [' in ']);
    if (!req.passed) { setResult('p4', 'failed', req.message, code); return; }
    const sentence = validateVariable(vars, 'sentence', 'str', undefined);
    if (!sentence.passed) { setResult('p4', 'failed', sentence.message, code); return; }
    const has_python = validateVariable(vars, 'has_python', 'bool', undefined);
    if (!has_python.passed) { setResult('p4', 'failed', has_python.message, code); return; }
    const has_java = validateVariable(vars, 'has_java', 'bool', undefined);
    if (!has_java.passed) { setResult('p4', 'failed', has_java.message, code); return; }
    const sentenceVal = (deRepr(vars['sentence'].value, 'str') as string).toLowerCase();
    const expPython = sentenceVal.includes('python');
    const expJava = sentenceVal.includes('java');
    if (deRepr(vars['has_python'].value, 'bool') !== expPython) {
      setResult('p4', 'failed', `Variable "has_python" should be ${expPython}, got ${deRepr(vars['has_python'].value, 'bool')}.`, code); return;
    }
    if (deRepr(vars['has_java'].value, 'bool') !== expJava) {
      setResult('p4', 'failed', `Variable "has_java" should be ${expJava}, got ${deRepr(vars['has_java'].value, 'bool')}.`, code); return;
    }
    setResult('p4', 'passed', 'Substring checks are correct!', code);
  };

  return (
    <>
      <RandomBackground seed={3} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q3 - String Operations"
          description="Perform simple operations with ints, floats, bools and strings. Assign values to variables, manipulate them and print the results."
          objectives={[
            'Concat strings using + operator',
            'Convert to upper and lower case',
            'Trim whitespace from strings',
            'Check for substring presence using in operator',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">String Concatenation</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create two string variables <CopyCode code="first_name" /> and <CopyCode code="last_name" /> with any names.</p>
          <p className="tc2 mb-6">Use the <CopyCode code="+" /> operator to concatenate them with a space in between and store in <CopyCode code="full_name" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Concatenate strings\nfirst_name = \"John\"\nlast_name = \"Doe\"\nfull_name = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Case Conversion</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="message" /> with mixed case text.</p>
          <p className="tc2 mb-2">Use <CopyCode code=".upper()" /> to convert it to uppercase and store in <CopyCode code="upper_message" />.</p>
          <p className="tc2 mb-6">Use <CopyCode code=".lower()" /> to convert it to lowercase and store in <CopyCode code="lower_message" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Convert string case\nmessage = \"Hello World\"\nupper_message = \nlower_message = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Trimming Whitespace</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="untrimmed" /> with leading and trailing whitespace.</p>
          <p className="tc2 mb-6">Use <CopyCode code=".strip()" /> to remove the whitespace and store in <CopyCode code="trimmed" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Trim whitespace from string\nuntrimmed = \"  Hello Python  \"\ntrimmed = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Substring Check</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="sentence" /> with any text.</p>
          <p className="tc2 mb-2">Use the <CopyCode code="in" /> operator to check if "Python" is in the sentence and store in <CopyCode code="has_python" />.</p>
          <p className="tc2 mb-6">Check if "java" is in the sentence and store in <CopyCode code="has_java" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Check for substrings\nsentence = \"I love Python programming\"\nhas_python = \nhas_java = "}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="/classes/python-automation/exercises/simple-coding-practice/q2" nextHref="/classes/python-automation/exercises/simple-coding-practice/q4" />
        </div>
      </div>
    </>
  );
}
