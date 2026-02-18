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

export default function Question2() {

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
    const a = validateVariable(vars, 'a', 'int', undefined);
    const b = validateVariable(vars, 'b', 'int', undefined);
    const sum = validateVariable(vars, 'sum', 'int', undefined);
    const product = validateVariable(vars, 'product', 'int', undefined);
    const difference = validateVariable(vars, 'difference', 'int', undefined);
    
    if (!a.passed || !b.passed) {
      setValidationMessages(prev => ({...prev, 'p1': !a.passed ? a.message : b.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    const aValue = deRepr(vars['a'].value, vars['a'].type);
    const bValue = deRepr(vars['b'].value, vars['b'].type);
    const expectedSum = aValue + bValue;
    const expectedProduct = aValue * bValue;
    const expectedDifference = aValue - bValue;
    
    if (!sum.passed) {
      setValidationMessages(prev => ({...prev, 'p1': sum.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    const sumValue = deRepr(vars['sum'].value, vars['sum'].type);
    if (sumValue !== expectedSum) {
      setValidationMessages(prev => ({...prev, 'p1': `Variable "sum" should equal ${expectedSum}, got ${sumValue}.`}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    if (!product.passed) {
      setValidationMessages(prev => ({...prev, 'p1': product.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    const productValue = deRepr(vars['product'].value, vars['product'].type);
    if (productValue !== expectedProduct) {
      setValidationMessages(prev => ({...prev, 'p1': `Variable "product" should equal ${expectedProduct}, got ${productValue}.`}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    if (!difference.passed) {
      setValidationMessages(prev => ({...prev, 'p1': difference.message}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    const differenceValue = deRepr(vars['difference'].value, vars['difference'].type);
    if (differenceValue !== expectedDifference) {
      setValidationMessages(prev => ({...prev, 'p1': `Variable "difference" should equal ${expectedDifference}, got ${differenceValue}.`}));
      setValidationStates(prev => ({...prev, 'p1': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p1': 'All variables are correctly assigned!'}));
    setValidationStates(prev => ({...prev, 'p1': 'passed'}));
  };

  const validateCodeP2 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const message = validateVariable(vars, 'message', 'str', undefined);
    const number = validateVariable(vars, 'number', 'int', undefined);
    
    if (!message.passed) {
      setValidationMessages(prev => ({...prev, 'p2': message.message}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    if (!number.passed) {
      setValidationMessages(prev => ({...prev, 'p2': number.message}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    // Check if code contains print statements
    const hasPrint = code.includes('print(');
    if (!hasPrint) {
      setValidationMessages(prev => ({...prev, 'p2': 'Your code must include at least one print() statement.'}));
      setValidationStates(prev => ({...prev, 'p2': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p2': 'All variables are correctly assigned and printed!'}));
    setValidationStates(prev => ({...prev, 'p2': 'passed'}));
  };

  const validateCodeP3 = (code: string, pyodide: any, error: string | null, vars: Record<string, any>) => {
    const num_str = validateVariable(vars, 'num_str', 'str', undefined);
    const num_int = validateVariable(vars, 'num_int', 'int', undefined);
    const age = validateVariable(vars, 'age', 'int', undefined);
    const age_str = validateVariable(vars, 'age_str', 'str', undefined);
    
    if (!num_str.passed) {
      setValidationMessages(prev => ({...prev, 'p3': num_str.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    if (!num_int.passed) {
      setValidationMessages(prev => ({...prev, 'p3': num_int.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    const numStrValue = deRepr(vars['num_str'].value, vars['num_str'].type);
    const numIntValue = deRepr(vars['num_int'].value, vars['num_int'].type);
    
    // Verify num_int was converted from num_str
    if (numStrValue !== String(numIntValue)) {
      setValidationMessages(prev => ({...prev, 'p3': `'num_int' should be the integer conversion of 'num_str' (${numStrValue} -> ${numIntValue}).`}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    if (!age.passed) {
      setValidationMessages(prev => ({...prev, 'p3': age.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    if (!age_str.passed) {
      setValidationMessages(prev => ({...prev, 'p3': age_str.message}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    const ageValue = deRepr(vars['age'].value, vars['age'].type);
    const ageStrValue = deRepr(vars['age_str'].value, vars['age_str'].type);
    
    // Verify age_str was converted from age
    if (String(ageValue) !== ageStrValue) {
      setValidationMessages(prev => ({...prev, 'p3': `'age_str' should be the string conversion of 'age' (${ageValue} -> ${ageStrValue}).`}));
      setValidationStates(prev => ({...prev, 'p3': 'failed'}));
      return;
    }
    
    setValidationMessages(prev => ({...prev, 'p3': 'All conversions are correct!'}));
    setValidationStates(prev => ({...prev, 'p3': 'passed'}));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      
      <AssignmentOverview 
        title="Int Operations"
        description="Perform simple operations on integer variables"
        objectives={[
          'Add, multiply and divide two integer variables',
          'Print numbers to the console',
          'Convert between integers and strings',
        ]}
      />

      
      <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm">
        <div onClick={()=>setSelectedQuestion(selectedQuestion === 'p1' ? null : 'p1')} className="cursor-pointer flex flex-row items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tc1 mr-auto">Basic Math Operations</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p1'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p1' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create two integer variables <code onClick={() => copyToClipboard("a", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">a</code> and <code onClick={() => copyToClipboard("b", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">b</code> with any values.</p>
        <p className="tc2 mb-2">Create a variable <code onClick={() => copyToClipboard("sum", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">sum</code> that adds them using <code onClick={() => copyToClipboard("+", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">+</code>.</p>
        <p className="tc2 mb-2">Create a variable <code onClick={() => copyToClipboard("product", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">product</code> that multiplies them using <code onClick={() => copyToClipboard("*", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">*</code>.</p>
        <p className="tc2 mb-6">Create a variable <code onClick={() => copyToClipboard("difference", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">difference</code> that subtracts b from a using <code onClick={() => copyToClipboard("-", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">-</code>.</p>

        <div className={`w-full ${selectedQuestion === 'p1' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p1' && <PythonIde
                initialCode={"# Create two integers and perform operations\na = 6\nb = 7\nsum = \nproduct = \ndifference = "}
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
          <h2 className="text-xl font-semibold tc1 mr-auto">Printing to Console</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p2'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p2' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create a string variable <code onClick={() => copyToClipboard("message", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">message</code> with any text value.</p>
        <p className="tc2 mb-2">Create an integer variable <code onClick={() => copyToClipboard("number", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">number</code> with any numeric value.</p>
        <p className="tc2 mb-6">Use the <code onClick={() => copyToClipboard("print()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">print()</code> function to output both variables to the console. It can take multiple parameters separated by commas.50</p>

        <div className={`w-full ${selectedQuestion === 'p2' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p2' && <PythonIde
                initialCode={"# Create variables and print them\nmessage = \nnumber = \n# Use print() to display your variables"}
                initialDocumentName="test.py"
                initialShowLineNumbers={false}
                initialIsCompact={true}
                initialVDivider={70}
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
          <h2 className="text-xl font-semibold tc1 mr-auto">Type Conversion</h2>
          <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates['p3'] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
          <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== 'p3' ? 'rotate-180' : ''}`} />
        </div>
        <p className="tc2 mb-2">Create a string variable <code onClick={() => copyToClipboard("num_str", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">num_str</code> containing a number like "42".</p>
        <p className="tc2 mb-2">Convert it to an integer using <code onClick={() => copyToClipboard("int()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">int()</code> and store in <code onClick={() => copyToClipboard("num_int", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">num_int</code>.</p>
        <p className="tc2 mb-2">Create an integer variable <code onClick={() => copyToClipboard("age", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">age</code> with any numeric value.</p>
        <p className="tc2 mb-6">Convert it to a string using <code onClick={() => copyToClipboard("str()", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">str()</code> and store in <code onClick={() => copyToClipboard("age_str", "Copied to clipboard!")} className="bg-gray-100 dark:bg-gray-800 px-1 rounded select-none cursor-pointer">age_str</code>.</p>
        <div className={`w-full ${selectedQuestion === 'p3' ? 'h-[500px]' : 'h-0'}`}>
        {selectedQuestion === 'p3' && <PythonIde
          initialCode={"# Convert between strings and integers\nnum_str = \"42\"\nnum_int = \nage = 25\nage_str = "}
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
          <NextQuestion assignmentPath={assignmentPath} prevHref="/classes/python-automation/exercises/simple-coding-practice/q1" nextHref="/classes/python-automation/exercises/simple-coding-practice/q3" />
        </div>
    </div>
  );
}
