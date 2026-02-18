'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import PythonIde from '@/components/coding/PythonIde';
import { copyToClipboard } from '@/scripts/clipboard';
import { useState } from 'react';
import { validateVariable, deRepr } from '../../exercise-components/ExerciseUtils';

export default function Question3() {
  const [validationMessages, setValidationMessages] = useState<Record<string, string>>({});
  const [validationStates, setValidationStates] = useState<Record<string, 'passed' | 'failed' | 'pending' | null>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

  const startCode = (part: string) => {
    setValidationStates(prev => ({...prev, [part]: 'pending'}));
    setValidationMessages(prev => {
      const newMessages = {...prev};
      delete newMessages[part];
      return newMessages;
    });
  };

  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const first_name = validateVariable(vars, 'first_name', 'str', undefined);
    const last_name = validateVariable(vars, 'last_name', 'str', undefined);
    const full_name = validateVariable(vars, 'full_name', 'str', undefined);
    
    if (!first_name.passed) {
      setValidationMessages(prev => ({...prev, 'p1': first_name.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    if (!last_name.passed) {
      setValidationMessages(prev => ({...prev, 'p1': last_name.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    if (!full_name.passed) {
      setValidationMessages(prev => ({...prev, 'p1': full_name.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    const firstNameValue = deRepr(vars['first_name'].value, vars['first_name'].type);
    const lastNameValue = deRepr(vars['last_name'].value, vars['last_name'].type);
    const fullNameValue = deRepr(vars['full_name'].value, vars['full_name'].type);
    const expectedFullName = firstNameValue + ' ' + lastNameValue;
    
    if (fullNameValue !== expectedFullName) {
      setValidationMessages(prev => ({...prev, 'p1': `Variable "full_name" should equal "${expectedFullName}", got "${fullNameValue}".`}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p1': 'Strings concatenated correctly!'}));
    setValidationStates(prev => ({...prev, 'p1': 'passed'}));
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const message = validateVariable(vars, 'message', 'str', undefined);
    const upper_message = validateVariable(vars, 'upper_message', 'str', undefined);
    const lower_message = validateVariable(vars, 'lower_message', 'str', undefined);
    
    if (!message.passed) {
      setValidationMessages(prev => ({...prev, 'p2': message.message}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    if (!upper_message.passed) {
      setValidationMessages(prev => ({...prev, 'p2': upper_message.message}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    if (!lower_message.passed) {
      setValidationMessages(prev => ({...prev, 'p2': lower_message.message}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    const messageValue = deRepr(vars['message'].value, vars['message'].type);
    const upperMessageValue = deRepr(vars['upper_message'].value, vars['upper_message'].type);
    const lowerMessageValue = deRepr(vars['lower_message'].value, vars['lower_message'].type);
    
    if (upperMessageValue !== messageValue.toUpperCase()) {
      setValidationMessages(prev => ({...prev, 'p2': `Variable "upper_message" should be uppercase version of "message".`}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    if (lowerMessageValue !== messageValue.toLowerCase()) {
      setValidationMessages(prev => ({...prev, 'p2': `Variable "lower_message" should be lowercase version of "message".`}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p2': 'Case conversion done correctly!'}));
    setValidationStates(prev => ({...prev, 'p2': 'passed'}));
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const text = validateVariable(vars, 'untrimmed', 'str', undefined);
    const trimmed = validateVariable(vars, 'trimmed', 'str', undefined);
    
    if (!text.passed) {
      setValidationMessages(prev => ({...prev, 'p3': text.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    if (!trimmed.passed) {
      setValidationMessages(prev => ({...prev, 'p3': trimmed.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    const textValue = deRepr(vars['untrimmed'].value, vars['untrimmed'].type);
    const trimmedValue = deRepr(vars['trimmed'].value, vars['trimmed'].type);
    
    if (trimmedValue !== textValue.trim()) {
      setValidationMessages(prev => ({...prev, 'p3': `Variable "trimmed" should have whitespace removed from "text".`}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p3': 'Whitespace trimmed correctly!'}));
    setValidationStates(prev => ({...prev, 'p3': 'passed'}));
  };

  const validateCodeP4 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const sentence = validateVariable(vars, 'sentence', 'str', undefined);
    const has_python = validateVariable(vars, 'has_python', 'bool', undefined);
    const has_java = validateVariable(vars, 'has_java', 'bool', undefined);
    
    if (!sentence.passed) {
      setValidationMessages(prev => ({...prev, 'p4': sentence.message}));
      setValidationStates(prev => ({...prev, 'p4': 'failed'}));
      return;
    }
    
    if (!has_python.passed) {
      setValidationMessages(prev => ({...prev, 'p4': has_python.message}));
      setValidationStates(prev => ({...prev, 'p4': 'failed'}));
      return;
    }
    
    if (!has_java.passed) {
      setValidationMessages(prev => ({...prev, 'p4': has_java.message}));
      setValidationStates(prev => ({...prev, 'p4': 'failed'}));
      return;
    }
    
    const sentenceValue = deRepr(vars['sentence'].value, vars['sentence'].type);
    const hasPythonValue = deRepr(vars['has_python'].value, vars['has_python'].type);
    const hasJavaValue = deRepr(vars['has_java'].value, vars['has_java'].type);
    
    const expectedHasPython = sentenceValue.toLowerCase().includes('python');
    const expectedHasJava = sentenceValue.toLowerCase().includes('java');
    
    if (hasPythonValue !== expectedHasPython) {
      setValidationMessages(prev => ({...prev, 'p4': `Variable "has_python" should be ${expectedHasPython}, got ${hasPythonValue}.`}));
      setValidationStates(prev => ({...prev, 'p4': 'failed'}));
      return;
    }
    
    if (hasJavaValue !== expectedHasJava) {
      setValidationMessages(prev => ({...prev, 'p4': `Variable "has_java" should be ${expectedHasJava}, got ${hasJavaValue}.`}));
      setValidationStates(prev => ({...prev, 'p4': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p4': 'Substring checks are correct!'}));
    setValidationStates(prev => ({...prev, 'p4': 'passed'}));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      <AssignmentOverview 
        title="String Operations"
        description="Perform simple operations with ints, floats, bools and strings. Assign values to variables, manipulate them and print the results."
        objectives={[
          'Concat strings using + operator',
          'Convert to upper and lower case',
          'Trim whitespace from strings',
          'Check for substring presence using in operator',
        ]}
      />

      <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">String Concatenation</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create two string variables <code onClick={() => copyToClipboard("first_name", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">first_name</code> and <code onClick={() => copyToClipboard("last_name", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">last_name</code> with any names.</p>
        <p className="tc2 mb-6">Use the <code onClick={() => copyToClipboard("+", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">+</code> operator to concatenate them with a space in between and store in <code onClick={() => copyToClipboard("full_name", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">full_name</code>.</p>

        <div className={`w-full ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p1' && <PythonIde
                initialCode={"# Concatenate strings\nfirst_name = \"John\"\nlast_name = \"Doe\"\nfull_name = "}
                initialDocumentName="test.py"
                initialShowLineNumbers={false}
                initialIsCompact={true}
                initialVDivider={100}
                initialHDivider={50}
                initialPersistentExec={false}
                onCodeEndCallback={validateCodeP1}
                onCodeStartCallback={()=>startCode('p1')}
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
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p2' ? null : 'p2')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">Case Conversion</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create a string variable <code onClick={() => copyToClipboard("message", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">message</code> with mixed case text.</p>
        <p className="tc2 mb-2">Use <code onClick={() => copyToClipboard(".upper()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">.upper()</code> to convert it to uppercase and store in <code onClick={() => copyToClipboard("upper_message", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">upper_message</code>.</p>
        <p className="tc2 mb-6">Use <code onClick={() => copyToClipboard(".lower()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">.lower()</code> to convert it to lowercase and store in <code onClick={() => copyToClipboard("lower_message", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">lower_message</code>.</p>

        <div className={`w-full ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p2' && <PythonIde
                initialCode={"# Convert string case\nmessage = \"Hello World\"\nupper_message = \nlower_message = "}
                initialDocumentName="test.py"
                initialShowLineNumbers={false}
                initialIsCompact={true}
                initialVDivider={100}
                initialHDivider={50}
                initialPersistentExec={false}
                onCodeEndCallback={validateCodeP2}
                onCodeStartCallback={()=>startCode('p2')}
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
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p3' ? null : 'p3')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">Trimming Whitespace</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create a string variable <code onClick={() => copyToClipboard("text", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">text</code> with leading and trailing whitespace.</p>
        <p className="tc2 mb-6">Use <code onClick={() => copyToClipboard(".strip()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">.strip()</code> to remove the whitespace and store in <code onClick={() => copyToClipboard("trimmed", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">trimmed</code>.</p>

        <div className={`w-full ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p3' && <PythonIde
                initialCode={"# Trim whitespace from string\nuntrimmed = \"  Hello Python  \"\ntrimmed = "}
                initialDocumentName="test.py"
                initialShowLineNumbers={false}
                initialIsCompact={true}
                initialVDivider={100}
                initialHDivider={50}
                initialPersistentExec={false}
                onCodeEndCallback={validateCodeP3}
                onCodeStartCallback={()=>startCode('p3')}
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
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p4' ? null : 'p4')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">Substring Check</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p4'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p4' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create a string variable <code onClick={() => copyToClipboard("sentence", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">sentence</code> with any text.</p>
        <p className="tc2 mb-2">Use the <code onClick={() => copyToClipboard("in", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">in</code> operator to check if "python" is in the sentence and store in <code onClick={() => copyToClipboard("has_python", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">has_python</code>.</p>
        <p className="tc2 mb-6">Check if "java" is in the sentence and store in <code onClick={() => copyToClipboard("has_java", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">has_java</code>.</p>

        <div className={`w-full ${selectedQuestion === 'p4' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p4' && <PythonIde
                initialCode={"# Check for substrings\nsentence = \"I love Python programming\"\nhas_python = \nhas_java = "}
                initialDocumentName="test.py"
                initialShowLineNumbers={false}
                initialIsCompact={true}
                initialVDivider={100}
                initialHDivider={50}
                initialPersistentExec={false}
                onCodeEndCallback={validateCodeP4}
                onCodeStartCallback={()=>startCode('p4')}
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
  );
}
