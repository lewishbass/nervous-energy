'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, CodeExample, Objectives, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateVariable, validateError, createSetResult, getQuestionSubmissionStatus, checkRequiredCode, deRepr } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q3';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question3() {
  const assignmentPath = '/classes/python-automation/exercises/functions-arrays-loops';
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

  // P1: Create three arrays with different data types
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const intArr = validateVariable(vars, 'int_array', 'list');
    if (!intArr.passed) { setResult('p1', 'failed', intArr.message, code); return; }

    const floatArr = validateVariable(vars, 'float_array', 'list');
    if (!floatArr.passed) { setResult('p1', 'failed', floatArr.message, code); return; }

    const strArr = validateVariable(vars, 'string_array', 'list');
    if (!strArr.passed) { setResult('p1', 'failed', strArr.message, code); return; }

    // Verify element types and minimum length via pyodide
    const typeCheck: string = await pyodide.runPythonAsync(`
import json as _json
_results = {}
_results['int_len'] = len(int_array)
_results['int_ok'] = len(int_array) >= 3 and all(isinstance(x, int) for x in int_array)
_results['float_len'] = len(float_array)
_results['float_ok'] = len(float_array) >= 3 and all(isinstance(x, float) for x in float_array)
_results['str_len'] = len(string_array)
_results['str_ok'] = len(string_array) >= 3 and all(isinstance(x, str) for x in string_array)
_json.dumps(_results)
`);
    const parsed = JSON.parse(typeCheck);
    if (!parsed.int_ok) {
      setResult('p1', 'failed', parsed.int_len < 3
        ? '`int_array` must contain at least 3 elements.'
        : '`int_array` must only contain integers (e.g. 1, 2, 3).', code);
      return;
    }
    if (!parsed.float_ok) {
      setResult('p1', 'failed', parsed.float_len < 3
        ? '`float_array` must contain at least 3 elements.'
        : '`float_array` must only contain floats (e.g. 1.0, 2.5, 3.7).', code);
      return;
    }
    if (!parsed.str_ok) {
      setResult('p1', 'failed', parsed.str_len < 3
        ? '`string_array` must contain at least 3 elements.'
        : '`string_array` must only contain strings (e.g. "hello", "world").', code);
      return;
    }

    setResult('p1', 'passed', 'All three arrays created with correct data types!', code);
  };

  // P2: Modify an existing array
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const intArr = validateVariable(vars, 'int_array', 'list');
    if (!intArr.passed) { setResult('p2', 'failed', intArr.message, code); return; }

    const reqIndex = checkRequiredCode(code, ['int_array[1]']);
    if (!reqIndex.passed) { setResult('p2', 'failed', 'Set the second element using index notation: `int_array[1] = 10`', code); return; }

    const reqMethods = checkRequiredCode(code, ['.append(', '.reverse(', '.extend(']);
    if (!reqMethods.passed) {
      const method = ['.append(', '.reverse(', '.extend('].find(m => !code.includes(m))!;
      const hints: Record<string, string> = {
        '.append(': 'Use `.append()` to add 8 to the end of the array.',
        '.reverse(': 'Use `.reverse()` to reverse the array.',
        '.extend(': 'Use `.extend()` to add [1, 2, 3] to the array.',
      };
      setResult('p2', 'failed', hints[method], code);
      return;
    }

    // Verify final array state via pyodide
    const stateCheck: string = await pyodide.runPythonAsync(`
import json as _json
_results = {}
_results['ends_with_extend'] = int_array[-3:] == [1, 2, 3]
_results['has_10'] = 10 in int_array
_results['has_8'] = 8 in int_array
_results['repr'] = repr(int_array)
_json.dumps(_results)
`);
    const parsed = JSON.parse(stateCheck);
    if (!parsed.has_10) { setResult('p2', 'failed', `The array should contain 10 after setting the second element. Got: ${parsed.repr}`, code); return; }
    if (!parsed.has_8) { setResult('p2', 'failed', `The array should contain 8 after appending. Got: ${parsed.repr}`, code); return; }
    if (!parsed.ends_with_extend) { setResult('p2', 'failed', `The array should end with [1, 2, 3] after extending. Got: ${parsed.repr}`, code); return; }

    setResult('p2', 'passed', 'Array modifications are correct!', code);
  };

  // P3: Retrieve values from the array
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const reqPop = checkRequiredCode(code, ['.pop(']);
    if (!reqPop.passed) { setResult('p3', 'failed', 'Make sure to use `.pop()` to remove and return the last item.', code); return; }

    const thirdEl = validateVariable(vars, 'third_element', 'int');
    if (!thirdEl.passed) { setResult('p3', 'failed', 'Variable `third_element` not found. Retrieve the third element using `int_array[2]`.', code); return; }

    const firstFive = validateVariable(vars, 'first_five', 'list');
    if (!firstFive.passed) { setResult('p3', 'failed', firstFive.message, code); return; }

    const poppedItem = validateVariable(vars, 'popped_item', 'int');
    if (!poppedItem.passed) { setResult('p3', 'failed', 'Variable `popped_item` not found. Use `.pop()` to remove the last item.', code); return; }

    // Verify values via pyodide
    const stateCheck: string = await pyodide.runPythonAsync(`
import json as _json
_results = {}
_orig = [8, 10, 7, 3, 5, 9, 1, 2, 3]
_results['third_element_correct'] = (third_element == _orig[2])
_results['third_element_val'] = repr(third_element)
_results['first_five_len'] = len(first_five)
_results['first_five_correct'] = (first_five == _orig[:5])
_results['popped_item_correct'] = (popped_item == _orig[-1])
_results['popped_item_val'] = repr(popped_item)
_results['array_len_after_pop'] = len(int_array)
_json.dumps(_results)
`);
    const parsed = JSON.parse(stateCheck);

    if (!parsed.third_element_correct) {
      setResult('p3', 'failed', `\`third_element\` should be 7 (index 2), but got ${parsed.third_element_val}.`, code);
      return;
    }
    if (parsed.first_five_len !== 5) {
      setResult('p3', 'failed', `\`first_five\` should contain exactly 5 elements, but has ${parsed.first_five_len}. Use slicing: \`int_array[:5]\``, code);
      return;
    }
    if (!parsed.first_five_correct) {
      setResult('p3', 'failed', '`first_five` should be [8, 10, 7, 3, 5]. Make sure to slice before popping.', code);
      return;
    }
    if (!parsed.popped_item_correct) {
      setResult('p3', 'failed', `\`popped_item\` should be 3 (the last element), but got ${parsed.popped_item_val}.`, code);
      return;
    }
    if (parsed.array_len_after_pop !== 8) {
      setResult('p3', 'failed', 'After popping, the array should have 8 elements remaining.', code);
      return;
    }

    setResult('p3', 'passed', 'Values retrieved correctly!', code);
  };

  // P4: Use a for loop to print each element
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    if (outputLines.length === 0) {
      setResult('p4', 'failed', 'No output detected. Make sure your `print()` is inside the `for` loop.', code);
      return;
    }

    const intArrayVar = vars['int_array'];
    const arrayVals: string[] = intArrayVar
      ? (deRepr(intArrayVar.value, intArrayVar.type) as any[]).map((v: any) => String(v))
      : [];

    const missing = arrayVals.filter((v: string) => !outputLines.some((line: string) => line.includes(v)));
    if (missing.length > 0) {
      setResult('p4', 'failed', `Missing elements in output: ${missing.join(', ')}. Make sure to print each element of \`int_array\`.`, code);
      return;
    }

    setResult('p4', 'passed', 'All elements printed correctly!', code);
  };

  return (
    <>
      <RandomBackground seed={13} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q3 - Making and Editing Arrays"
          description="Initialize arrays with values, modify elements, retrieve values."
          objectives={[
            'Initialize an array',
            'Modify array elements',
            'Retrieve values from an array',
            'Use loops to iterate over arrays'
          ]}
        />

        {/* P1: Create Arrays */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Create Arrays" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# Create an integer array with at least 3 integers\nint_array = \n\n# Create a float array with at least 3 floats\nfloat_array = \n\n# Create a string array with at least 3 strings\nstring_array = "}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>
              An array (called a <CopyCode code="list"/> in Python) is an ordered collection of values. Create a list using square brackets <CopyCode code="[]"/> with values separated by commas.
            <CodeExample code={`my_numbers = [1, 2, 3, 4, 5]\nmy_words = ["hello", "world"]`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Create three arrays, each with at least 3 elements:</p>
              <ul className="list-disc list-inside mb-6">
                <li><CopyCode code="int_array" /> - containing integers</li>
                <li><CopyCode code="float_array" /> - containing floats (e.g. <CopyCode code="1.5, 2.0" />)</li>
                <li><CopyCode code="string_array" /> - containing strings</li>
              </ul>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Modify Arrays */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Modify Arrays" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# Start with an integer array\nint_array = [3, 5, 7, 9]\n\n# Set the second element to 10\n\n\n# Append 8 to the end\n\n\n# Reverse the array\n\n\n# Extend the array with [1, 2, 3]\n"}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>
              Lists can be modified after creation. You can change elements, add new ones, reverse the order, and more.
            
            <CodeExample code={`nums = [1, 2, 3]\nnums[0] = 99       # set first element to 99 → [99, 2, 3]\nnums.append(4)     # add 4 to the end → [99, 2, 3, 4]\nnums.reverse()     # reverse in place → [4, 3, 2, 99]\nnums.extend([7,8]) # add multiple items → [4, 3, 2, 99, 7, 8]`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Starting from your <CopyCode code="int_array"/>, perform the following operations in order:</p>
              <ol className="list-decimal list-inside mb-6 space-y-1">
                <li>Set the second element to <CopyCode code="10"/></li>
                <li>Append <CopyCode code="8"/> to the end</li>
                <li>Reverse the array</li>
                <li>Extend the array with <CopyCode code="[1, 2, 3]"/></li>
              </ol>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Retrieve Values */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Retrieve Values" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# Start with this array\nint_array = [8, 10, 7, 3, 5, 9, 1, 2, 3]\n\n# Retrieve the third element into third_element\nthird_element = \n\n# Retrieve the first 5 elements using a slice into first_five\nfirst_five = \n\n# Pop the last item into popped_item\npopped_item = "}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>
              You can access elements by index, slice a sub-list, or remove items with <CopyCode code=".pop()"/>.
            <CodeExample code={`nums = [10, 20, 30, 40, 50, 60]\nelement = nums[2]       # get third element → 30\nfirst_three = nums[:3]  # slice first 3 → [10, 20, 30]\nlast = nums.pop()       # remove & return last → 60`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Using the provided <CopyCode code="int_array"/>:</p>
              <ol className="list-decimal list-inside mb-6 space-y-1">
                <li>Retrieve the third element into <CopyCode code="third_element"/></li>
                <li>Retrieve the first 5 elements using a slice into <CopyCode code="first_five"/></li>
                <li>Pop the last item into <CopyCode code="popped_item"/></li>
              </ol>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Loop Over Array */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Loop Over an Array" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={"# Here is your array\nint_array = [8, 10, 7, 3, 5, 9]\n\n# Use a for loop to print each element\n"}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            initialVDivider={60}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>
              A <CopyCode code="for"/> loop lets you visit each element in a list one at a time.
            <CodeExample code={`fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)  # prints each fruit on its own line`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Use a <CopyCode code="for"/> loop to print every element in <CopyCode code="int_array"/>.</p>
            </Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q2" nextHref="q4" />
        </div>
      </div>
    </>
  );
}
