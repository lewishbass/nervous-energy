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
const questionName = 'q7';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question7() {
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

  // P1: Convert integer to binary string using bin()
  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['bin(']);
    if (!req.passed) { setResult('p1', 'failed', req.message, code); return; }
    const number = validateVariable(vars, 'number', 'int', undefined);
    if (!number.passed) { setResult('p1', 'failed', number.message, code); return; }
    const bin_string = validateVariable(vars, 'bin_string', 'str', undefined);
    if (!bin_string.passed) { setResult('p1', 'failed', bin_string.message, code); return; }
    const numVal = deRepr(vars['number'].value, 'int') as number;
    const expected = '0b' + numVal.toString(2);
    const actual = deRepr(vars['bin_string'].value, 'str') as string;
    if (actual !== expected) {
      setResult('p1', 'failed', `Variable "bin_string" should be "${expected}" for number=${numVal}, got "${actual}".`, code); return;
    }
    setResult('p1', 'passed', 'Binary conversion is correct!', code);
  };

  // P2: Check if a string is valid binary (starts with '0b', rest are 0s and 1s)
  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    const bin_string = validateVariable(vars, 'bin_string', 'str', undefined);
    if (!bin_string.passed) { setResult('p2', 'failed', bin_string.message, code); return; }
    const prefix = validateVariable(vars, 'prefix', 'str', undefined);
    if (!prefix.passed) { setResult('p2', 'failed', prefix.message, code); return; }
    const binary_part = validateVariable(vars, 'binary_part', 'str', undefined);
    if (!binary_part.passed) { setResult('p2', 'failed', binary_part.message, code); return; }
    const is_valid_binary = validateVariable(vars, 'is_valid_binary', 'bool', undefined);
    if (!is_valid_binary.passed) { setResult('p2', 'failed', is_valid_binary.message, code); return; }

    const binStr = deRepr(vars['bin_string'].value, 'str') as string;
    const prefixVal = deRepr(vars['prefix'].value, 'str') as string;
    const binaryPartVal = deRepr(vars['binary_part'].value, 'str') as string;
    const isValidVal = deRepr(vars['is_valid_binary'].value, 'bool') as boolean;

    if (prefixVal !== binStr.slice(0, 2)) {
      setResult('p2', 'failed', `Variable "prefix" should be the first 2 characters of "bin_string".`, code); return;
    }
    if (binaryPartVal !== binStr.slice(2)) {
      setResult('p2', 'failed', `Variable "binary_part" should be the characters after the prefix.`, code); return;
    }
    const expectedValid = prefixVal === '0b' && /^[01]+$/.test(binaryPartVal);
    if (isValidVal !== expectedValid) {
      setResult('p2', 'failed', `Variable "is_valid_binary" should be ${expectedValid} for bin_string="${binStr}", got ${isValidVal}.`, code); return;
    }
    setResult('p2', 'passed', 'Binary validation is correct!', code);
  };

  // P3: Convert integer to hex string using hex()
  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    const req = checkRequiredCode(code, ['hex(']);
    if (!req.passed) { setResult('p3', 'failed', req.message, code); return; }
    const number = validateVariable(vars, 'number', 'int', undefined);
    if (!number.passed) { setResult('p3', 'failed', number.message, code); return; }
    const hex_string = validateVariable(vars, 'hex_string', 'str', undefined);
    if (!hex_string.passed) { setResult('p3', 'failed', hex_string.message, code); return; }
    const numVal = deRepr(vars['number'].value, 'int') as number;
    const expected = '0x' + numVal.toString(16);
    const actual = deRepr(vars['hex_string'].value, 'str') as string;
    if (actual !== expected) {
      setResult('p3', 'failed', `Variable "hex_string" should be "${expected}" for number=${numVal}, got "${actual}".`, code); return;
    }
    setResult('p3', 'passed', 'Hexadecimal conversion is correct!', code);
  };

  // P4: Check if a string is valid hex (starts with '0x', rest are 0-9 and a-f)
  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    const hex_string = validateVariable(vars, 'hex_string', 'str', undefined);
    if (!hex_string.passed) { setResult('p4', 'failed', hex_string.message, code); return; }
    const prefix = validateVariable(vars, 'prefix', 'str', undefined);
    if (!prefix.passed) { setResult('p4', 'failed', prefix.message, code); return; }
    const hex_part = validateVariable(vars, 'hex_part', 'str', undefined);
    if (!hex_part.passed) { setResult('p4', 'failed', hex_part.message, code); return; }
    const is_valid_hex = validateVariable(vars, 'is_valid_hex', 'bool', undefined);
    if (!is_valid_hex.passed) { setResult('p4', 'failed', is_valid_hex.message, code); return; }

    const hexStr = deRepr(vars['hex_string'].value, 'str') as string;
    const prefixVal = deRepr(vars['prefix'].value, 'str') as string;
    const hexPartVal = deRepr(vars['hex_part'].value, 'str') as string;
    const isValidVal = deRepr(vars['is_valid_hex'].value, 'bool') as boolean;

    if (prefixVal !== hexStr.slice(0, 2)) {
      setResult('p4', 'failed', `Variable "prefix" should be the first 2 characters of "hex_string".`, code); return;
    }
    if (hexPartVal !== hexStr.slice(2)) {
      setResult('p4', 'failed', `Variable "hex_part" should be the characters after the prefix.`, code); return;
    }
    const expectedValid = prefixVal === '0x' && /^[0-9a-fA-F]+$/.test(hexPartVal);
    if (isValidVal !== expectedValid) {
      setResult('p4', 'failed', `Variable "is_valid_hex" should be ${expectedValid} for hex_string="${hexStr}", got ${isValidVal}.`, code); return;
    }
    setResult('p4', 'passed', 'Hexadecimal validation is correct!', code);
  };

  return (
    <>
      <RandomBackground seed={7} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q7 - Binary and Hexadecimal"
          description="Use Python's built-in functions to convert numbers to different bases and validate their string representations."
          objectives={[
            'Convert a number to a binary string using bin()',
            'Check if a string is a valid binary number',
            'Convert a number to a hexadecimal string using hex()',
            'Check if a string is a valid hexadecimal number',
          ]}
        />

        {/* P1: Binary Conversion */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Binary Conversion</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p1`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create an integer variable <CopyCode code="number" /> with any value.</p>
          <p className="tc2 mb-2">Use the built-in <CopyCode code="bin()" /> function to convert it to a binary string and store in <CopyCode code="bin_string" />.</p>
          <p className="tc2 mb-6">The result will look like <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">'0b1010'</code> — the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0b</code> prefix indicates it is a binary number.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p1' && <PythonIde
              initialCode={"# Convert an integer to a binary string\nnumber = 42\nbin_string = "}
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

        {/* P2: Binary Validation */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Validating a Binary String</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p2`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">A valid binary string starts with <CopyCode code="'0b'" /> followed only by <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0</code>s and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">1</code>s.</p>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="bin_string" /> with any value, then split it:</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="prefix" /> — first 2 characters using <CopyCode code="bin_string[:2]" /></p>
          <p className="tc2 mb-4 ml-4">• <CopyCode code="binary_part" /> — remaining characters using <CopyCode code="bin_string[2:]" /></p>
          <p className="tc2 mb-6">Combine checks using <CopyCode code="and" /> to set <CopyCode code="is_valid_binary" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> only when the prefix is <CopyCode code="'0b'" /> and the rest contains only <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0</code>s and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">1</code>s. Hint: click on a string variable in the visualizer to look through the available methods for something useful.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p2' && <PythonIde
              initialCode={"# Validate a binary string\nbin_string = '0b101010'\nprefix = bin_string[:2]\nbinary_part = bin_string[2:]\nis_valid_binary = "}
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

        {/* P3: Hex Conversion */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Hexadecimal Conversion</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p3`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">Create an integer variable <CopyCode code="number" /> with any value.</p>
          <p className="tc2 mb-2">Use the built-in <CopyCode code="hex()" /> function to convert it to a hexadecimal string and store in <CopyCode code="hex_string" />.</p>
          <p className="tc2 mb-6">The result will look like <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">'0x2a'</code> — the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0x</code> prefix indicates it is a hexadecimal number.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p3' && <PythonIde
              initialCode={"# Convert an integer to a hexadecimal string\nnumber = 42\nhex_string = "}
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

        {/* P4: Hex Validation */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm">
          <div onClick={() => setSelectedQuestion(selectedQuestion === 'p4' ? null : 'p4')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold tc1 mr-auto">Validating a Hexadecimal String</h2>
            <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_p4`] || 'idle')} />
            <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
            <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
          </div>
          <p className="tc2 mb-2">A valid hexadecimal string starts with <CopyCode code="'0x'" /> followed only by digits <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0–9</code> and letters <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">a–f</code> (case insensitive).</p>
          <p className="tc2 mb-2">Create a string variable <CopyCode code="hex_string" /> with any value, then split it:</p>
          <p className="tc2 mb-1 ml-4">• <CopyCode code="prefix" /> — first 2 characters using <CopyCode code="hex_string[:2]" /></p>
          <p className="tc2 mb-4 ml-4">• <CopyCode code="hex_part" /> — remaining characters using <CopyCode code="hex_string[2:]" /></p>
          <p className="tc2 mb-6">Combine checks using <CopyCode code="and" /> to set <CopyCode code="is_valid_hex" /> to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">True</code> only when the prefix is <CopyCode code="'0x'" /> and the rest contains only valid hex characters. Hint: convert to lowercase first with <CopyCode code=".lower()" />, then check each character is in <CopyCode code="'0123456789abcdef'" />.</p>
          <div className={`w-full rounded-lg overflow-hidden ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
            {selectedQuestion === 'p4' && <PythonIde
              initialCode={"# Validate a hexadecimal string\nhex_string = '0x1a3f'\nprefix = hex_string[:2]\nhex_part = hex_string[2:]\nis_valid_hex = "}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="/classes/python-automation/exercises/simple-coding-practice/q6" nextHref="/classes/python-automation/exercises/simple-coding-practice/q8" />
        </div>
      </div>
    </>
  );
}
