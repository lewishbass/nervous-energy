'use client';
import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import PythonIde from '@/components/coding/PythonIde';
import { copyToClipboard } from '@/scripts/clipboard';
import { useState } from 'react';
import { validateVariable } from '../../exercise-components/ExerciseUtils';

export default function Question1() {

  const [validationMessages, setValidationMessages] = useState<Record<string, string>>({});
  const [validationStates, setValidationStates] = useState<Record<string, 'passed' | 'failed' | 'pending' | null>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

  const startCode = (part: string) => {
    setValidationStates(prev => ({...prev, [part]: 'pending'}));
    setValidationMessages(prev => {const newMessages = {...prev};
      delete newMessages[part];
      return newMessages;
    });
  };

  const validateCodeP1 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const passed = validateVariable(vars, 'my_number', 'int', 42);
    setValidationMessages(prev => ({...prev, 'p1': passed.message}));
    setValidationStates(prev => ({...prev, 'p1': passed.passed ? 'passed' : 'failed'}));
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const passed = validateVariable(vars, 'my_string', 'str', 'Hello World');
    setValidationMessages(prev => ({...prev, 'p2': passed.message}));
    setValidationStates(prev => ({...prev, 'p2': passed.passed ? 'passed' : 'failed'}));
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const passed = validateVariable(vars, 'my_bool', 'bool', true);
    setValidationMessages(prev => ({...prev, 'p3': passed.message}));
    setValidationStates(prev => ({...prev, 'p3': passed.passed ? 'passed' : 'failed'}));
  }

 

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      

      <AssignmentOverview 
        title="Question 1"
        description='Assigning values to variables'
        objectives={[
          'Assign integer values to variables',
          'Assign string values to variables',
          'Assign boolean values to variables',
        ]}
      />

      
      <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">Assigning Ints</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Assign the integer value 42 to a variable named <code onClick={() => copyToClipboard("my_number", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">my_number</code>.</p>
        <p className="tc2 mb-2">Notice the variable inspector on the right, click on the variable to see its member functions.</p>

        <div className={`w-full ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p1' && <PythonIde
                initialCode={"# Assign the integer value 42 to a variable named my_number"}
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
          <h2 className="text-xl font-semibold tc1 mr-auto">Assigning Strings</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Assign the string value "Hello World" to a variable named <code onClick={() => copyToClipboard("my_string", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">my_string</code>.</p>
        <p className="tc2 mb-6">Strings are sequences of character enclosed in either single <code onClick={() => copyToClipboard("'", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">'</code> or double <code onClick={() => copyToClipboard('"', "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">"</code> quotes.</p>

        <div className={`w-full ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p2' && <PythonIde
                initialCode={"# Assign the string value \"Hello World\" to a variable named my_string"}
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
          <h2 className="text-xl font-semibold tc1 mr-auto">Assigning Booleans</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Assign the boolean value True to a variable named <code onClick={() => copyToClipboard("my_bool", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">my_bool</code>.</p>
        <p className="tc2 mb-6">In Python, boolean values are capitalized: <code onClick={() => copyToClipboard("True", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">True</code> and <code onClick={() => copyToClipboard("False", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">False</code>.</p>
        <div className={`w-full ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p3' && <PythonIde
          initialCode={"# Assign the boolean value True to a variable named my_bool"}
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


      <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="/classes/python-automation/exercises/simple-coding-practice/q2" />
        </div>
    </div>
  );
}
