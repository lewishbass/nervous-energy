'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, Objectives, CodeExample, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateError, validateVariable, deRepr, checkRequiredCode, runTestCases, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'data-structures';
const questionName = 'q1';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question1() {
  const assignmentPath = '/classes/python-automation/exercises/data-structures';
  const questionPath = `${assignmentPath}/${questionName}`;

  const [validationMessages, setValidationMessages] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(questionPath.replace('/', '_') + '_validationMessages');
    return saved ? JSON.parse(saved) : {};
  });
  const [validationStates, setValidationStates] = useState<Record<string, 'passed' | 'failed' | 'pending' | null>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(questionPath.replace('/', '_') + '_validationStates');
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
    questionName,
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
    localStorage.setItem(questionPath.replace('/', '_') + '_validationStates', JSON.stringify(validationStates));
    localStorage.setItem(questionPath.replace('/', '_') + '_validationMessages', JSON.stringify(validationMessages));
  }, [validationMessages, validationStates]);

  const startCode = (part: string) => {
    setValidationStates(prev => ({ ...prev, [part]: 'pending' }));
    setValidationMessages(prev => { const n = { ...prev }; delete n[part]; return n; });
  };

  // P1: Creating Tuples
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const tupleCheck = validateVariable(vars, 'my_tuple', 'tuple');
    if (!tupleCheck.passed) { setResult('p1', 'failed', tupleCheck.message, code); return; }

    const elements = deRepr(vars['my_tuple'].value, 'tuple');
    if (!Array.isArray(elements) || elements.length !== 3) {
      setResult('p1', 'failed', `my_tuple should have 3 elements, got ${Array.isArray(elements) ? elements.length : 0}.`, code); return;
    }
    if (typeof elements[0] !== 'number' || !Number.isInteger(elements[0])) {
      setResult('p1', 'failed', 'First element should be an integer.', code); return;
    }
    if (typeof elements[1] !== 'string') {
      setResult('p1', 'failed', 'Second element should be a string.', code); return;
    }
    if (!Array.isArray(elements[2])) {
      setResult('p1', 'failed', 'Third element should be a list.', code); return;
    }
    setResult('p1', 'passed', 'Tuple created correctly!', code);
  };

  // P2: Unpacking Tuples
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const numValues = new Set([42, 3.14, 7]);
    const strValues = new Set(['hello', 'world', 'python']);
    const setupNames = new Set(['num_tuples', 'str_tuples']);
    const foundNum = new Set<number>();
    const foundStr = new Set<string>();

    for (const [name, info] of Object.entries(vars)) {
      if (name.startsWith('_') || setupNames.has(name)) continue;
      const val = deRepr(info.value, info.type);
      if (typeof val === 'number' && numValues.has(val)) foundNum.add(val);
      if (typeof val === 'string' && strValues.has(val)) foundStr.add(val);
    }

    if (foundNum.size < 3) {
      const missing = [...numValues].filter(v => !foundNum.has(v));
      setResult('p2', 'failed', `Missing unpacked values from num_tuples: ${missing.join(', ')}`, code); return;
    }
    if (foundStr.size < 3) {
      const missing = [...strValues].filter(v => !foundStr.has(v));
      setResult('p2', 'failed', `Missing unpacked values from str_tuples: ${missing.join(', ')}`, code); return;
    }
    setResult('p2', 'passed', 'All tuples unpacked successfully!', code);
  };

  // P3: Function Returns
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    let n_found = 0;
    const setupNames = new Set(['projectile_coords', 'v', 'angle']);
    let foundX = false;
    let foundY = false;

    for (const [name, info] of Object.entries(vars)) {
      if (name.startsWith('_') || setupNames.has(name)) continue;
      if (info.type === 'float' || info.type === 'int') {
        const val = deRepr(info.value, info.type);
        if (typeof val === 'number') {
          n_found++;
        }
      }
    }
    if (n_found < 2) {
      setResult('p3', 'failed', 'Expected two numeric variables for the unpacked coordinates.', code); return;
    }
    setResult('p3', 'passed', 'Coordinates unpacked correctly!', code);
  };

  // P4: *args swap
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def swap(*args):']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Do not modify the function signature `def swap(*args):`.', code); return; }

    const testCases = [
      { args: [1, 2], expected: [2, 1] },
      { args: ['a', 'b'], expected: ['b', 'a'] },
      { args: [0, 0], expected: [0, 0] },
      { args: [-1, 1], expected: [1, -1] },
      { args: ['hello', 'world'], expected: ['world', 'hello'] },
      { args: [3.14, 2.71], expected: [2.71, 3.14] },
      { args: [100, -100], expected: [-100, 100] },
    ];
    const testResults = await runTestCases(pyodide, 'swap', testCases);
    if (!testResults.passed) { setResult('p4', 'failed', testResults.message, code); return; }
    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q1 - Tuples"
          description="Pack and unpack tuples, use the asterisk operator, and combine tuples with functions."
          objectives={[
            'Create tuples with mixed types',
            'Unpack tuples into separate variables',
            'Use tuples to return multiple values from functions',
            'Use *args to accept variable arguments in functions',
          ]}
        />

        {/* P1: Creating Tuples */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Creating Tuples" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={'# Create a tuple with an integer, a string and a list\nmy_tuple = '}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>
              Python tuples are groups of variables. When constructing a tuple, they are surrounded by parentheses and each variable is separated by a comma:
              <CodeExample code={`a = (1, 2, 3)`} />
              You can also create a tuple without parentheses, just by separating variables with commas:
              <CodeExample code={`a = 1, 2, 3`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Create a tuple called <CopyCode code="my_tuple" /> with 3 elements:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>An integer (e.g. <CopyCode code="42" />)</li>
                <li>A string (e.g. <CopyCode code='"hello"' />)</li>
                <li>A list (e.g. <CopyCode code="[1, 2, 3]" />)</li>
              </ul>
            </Objectives>
            <Hints>A tuple can contain any types of elements, including other collections like lists.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Unpacking Tuples */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Unpacking Tuples" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={'# Unpack the tuples in the variable visualizer into separate variables\n'}
            setupCode={'num_tuples = (42, 3.14, 7)\nstr_tuples = ("hello", "world", "python")'}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>
              Python allows you to unpack tuples into separate variables by placing them on the left side of an assignment statement:
              <CodeExample code={`my_tuple = (1, 2, 3)\na, b, c = my_tuple`} />
              This assigns 1 to <CopyCode code="a" />, 2 to <CopyCode code="b" />, and 3 to <CopyCode code="c" />.
            </Mechanics>
            <Objectives>
              <p className="mb-2">Unpack the two provided tuples into separate variables:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Unpack <CopyCode code="num_tuples" /> into three separate number variables</li>
                <li>Unpack <CopyCode code="str_tuples" /> into three separate string variables</li>
              </ul>
            </Objectives>
            <Hints>The provided variables can be viewed in the variable editor on the right.</Hints>
            <Hints>Put the tuple on the right side of the assignment and the variables you want to unpack into on the left, separated by commas: <CopyCode code="a, b, c = my_tuple" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Function Returns */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Function Returns" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={'# Call the projectile_coords function and unpack the result into separate x and y variables\nv = 10\nangle = 45\n'}
            setupCode={'def projectile_coords(v: float, angle: float):\n    import math\n    x = v * math.cos(math.radians(angle))\n    y = v * math.sin(math.radians(angle))\n    return x, y'}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>
              Tuples can be used to return multiple values from a single function. The function returns multiple values separated by commas (as a tuple), and they are unpacked into separate variables on the left side of the assignment:
              <CodeExample code={`def get_user_info():\n    name = "Alice"\n    age = 30\n    return name, age\n\nuser_name, user_age = get_user_info()`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">The supplied function <CopyCode code="projectile_coords" /> returns the x and y coordinates of a projectile given its velocity and angle as a tuple:</p>
              <CodeExample code={`def projectile_coords(v: float, angle: float):\n    x = v * math.cos(math.radians(angle))\n    y = v * math.sin(math.radians(angle))\n    return x, y`} />
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Call <CopyCode code="projectile_coords" /> with the provided <CopyCode code="v" /> and <CopyCode code="angle" /> variables</li>
                <li>Use tuple unpacking to store the results in separate x and y variables</li>
              </ul>
            </Objectives>
            <Hints>Call the function and unpack the result in one line, like <CopyCode code="x, y = projectile_coords(v, angle)" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: *args */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="*args" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={'# Implement the swap function that takes in two values and returns them in reversed order using *args\ndef swap(*args):\n    # your code here\n    '}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            initialVDivider={100}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>
              Values passed to a function are stored in the <CopyCode code="*args" /> variable as a tuple, which can be accessed by index within the function:
              <CodeExample code={`def add_two_vars(*args):\n    total = 0\n    total += args[0]  # access the first argument\n    total += args[1]  # access the second argument\n    return total\n\nadd_two_vars(3, 5)  # returns 8`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Complete the <CopyCode code="swap" /> function that returns the two input values in reversed order:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>The function receives two values via <CopyCode code="*args" /></li>
                <li>Return the two values in reversed order as a tuple</li>
              </ul>
            </Objectives>
            <Hints>Access the arguments using <CopyCode code="args[0]" /> and <CopyCode code="args[1]" />.</Hints>
            <Hints>Return the values in reversed order: <CopyCode code="return args[1], args[0]" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q2" prevHref={undefined} />
        </div>
      </div>
    </>
  );
}
