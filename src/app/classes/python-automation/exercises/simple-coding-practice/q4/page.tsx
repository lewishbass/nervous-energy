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
const questionName = 'q4';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question4() {
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
    const req = checkRequiredCode(code, ['len(']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const text = validateVariable(vars, 'text', 'str', undefined);
    if (!text.passed) { setResult('p1', 'failed', text.message, code); return; }
    const char_count = validateVariable(vars, 'char_count', 'int', undefined);
    if (!char_count.passed) { setResult('p1', 'failed', char_count.message, code); return; }
    const textVal = deRepr(vars['text'].value, 'str') as string;
    if (deRepr(vars['char_count'].value, 'int') !== textVal.length) {
      setResult('p1', 'failed', `Variable "char_count" should be ${textVal.length}, got ${deRepr(vars['char_count'].value, 'int')}.`, code); return;
    }
    setResult('p1', 'passed', 'Character count is correct!', code);
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['.count(']);
    if (!req.passed) { setResult('p2', 'failed', req.message, code); return; }
    const text = validateVariable(vars, 'text', 'str', undefined);
    if (!text.passed) { setResult('p2', 'failed', text.message, code); return; }
    const target_char = validateVariable(vars, 'target_char', 'str', undefined);
    if (!target_char.passed) { setResult('p2', 'failed', target_char.message, code); return; }
    const char_occurrences = validateVariable(vars, 'char_occurrences', 'int', undefined);
    if (!char_occurrences.passed) { setResult('p2', 'failed', char_occurrences.message, code); return; }
    const textVal = deRepr(vars['text'].value, 'str') as string;
    const targetVal = deRepr(vars['target_char'].value, 'str') as string;
    const expected = textVal.split(targetVal).length - 1;
    if (deRepr(vars['char_occurrences'].value, 'int') !== expected) {
      setResult('p2', 'failed', `Variable "char_occurrences" should be ${expected}, got ${deRepr(vars['char_occurrences'].value, 'int')}.`, code); return;
    }
    setResult('p2', 'passed', 'Character occurrence count is correct!', code);
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['.count(']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const text = validateVariable(vars, 'text', 'str', undefined);
    if (!text.passed) { setResult('p3', 'failed', text.message, code); return; }
    const vowel_count = validateVariable(vars, 'vowel_count', 'int', undefined);
    if (!vowel_count.passed) { setResult('p3', 'failed', vowel_count.message, code); return; }
    const textVal = deRepr(vars['text'].value, 'str') as string;
    const expected = (textVal.match(/[aeiouAEIOU]/g) || []).length;
    if (deRepr(vars['vowel_count'].value, 'int') !== expected) {
      setResult('p3', 'failed', `Variable "vowel_count" should be ${expected}, got ${deRepr(vars['vowel_count'].value, 'int')}.`, code); return;
    }
    setResult('p3', 'passed', 'Vowel count is correct!', code);
  };

  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const text = validateVariable(vars, 'text', 'str', undefined);
    if (!text.passed) { setResult('p4', 'failed', text.message, code); return; }
    const vowel_fraction = validateVariable(vars, 'vowel_fraction', 'float', undefined);
    if (!vowel_fraction.passed) { setResult('p4', 'failed', vowel_fraction.message, code); return; }
    const textVal = deRepr(vars['text'].value, 'str') as string;
    const vowels = (textVal.match(/[aeiouAEIOU]/g) || []).length;
    const expected = vowels / textVal.length;
    if (Math.abs((deRepr(vars['vowel_fraction'].value, 'float') as number) - expected) > 1e-6) {
      setResult('p4', 'failed', `Variable "vowel_fraction" should be ~${expected.toFixed(4)}, got ${deRepr(vars['vowel_fraction'].value, 'float')}.`, code); return;
    }
    setResult('p4', 'passed', 'Vowel fraction is correct!', code);
  };

  return (
    <>
      <RandomBackground seed={4} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q4 - Combining String Operations"
          description="Combine multiple string operations to perform more complex tasks."
          objectives={[
            'Count the number of characters in a string',
            'Count the occurrences of a specific character in a string',
            'Count the number of vowels in a string',
            'Calculate the fraction of vowels in a string',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Character Count</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="text" /> with any value.</p>
          <p className="tc2 mb-6">Use the <CopyCode code="len()" /> function to count its characters and store in <CopyCode code="char_count" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Count the number of characters in a string\ntext = \"Hello, World!\"\nchar_count = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Character Occurrences</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="text" /> and a single-character string <CopyCode code="target_char" />.</p>
          <p className="tc2 mb-6">Use <CopyCode code=".count()" /> to count how many times <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">target_char</code> appears in <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">text</code> and store in <CopyCode code="char_occurrences" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Count occurrences of a character\ntext = \"banana\"\ntarget_char = \"a\"\nchar_occurrences = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Counting Vowels</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="text" /> with any value.</p>
          <p className="tc2 mb-2">Count the total number of vowels (a, e, i, o, u — upper and lower case) and store in <CopyCode code="vowel_count" />.</p>
          <p className="tc2 mb-6">Hint: use <CopyCode code=".count()" /> for each vowel and add them together, or convert to lowercase first.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Count the vowels in a string\ntext = \"Hello, World!\"\nvowel_count = "}
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
            <h2 className="text-xl font-semibold tc1 mr-auto">Vowel Fraction</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="text" /> with any value.</p>
          <p className="tc2 mb-2">Calculate the fraction of characters that are vowels (vowel count divided by total character count) and store in <CopyCode code="vowel_fraction" /> as a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">float</code>.</p>
          <p className="tc2 mb-6">Hint: use <CopyCode code="len()" /> and combine what you learned in the previous parts.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Calculate the fraction of vowels\ntext = \"Hello, World!\"\nvowel_fraction = "}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="q3" nextHref="q5" />
        </div>
      </div>
    </>
  );
}
