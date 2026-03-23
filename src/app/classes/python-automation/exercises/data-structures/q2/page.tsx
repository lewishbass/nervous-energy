'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, Objectives, CodeExample, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateError, validateVariable, deRepr, checkRequiredCode, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'data-structures';
const questionName = 'q2';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question2() {
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

  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    // Verify they printed the population of Chicago
    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p1', 'failed', 'Your code must use print() to print the population of Chicago.', code); return; }

    // Check stdout contains Chicago's population (2700000)
    const outputLines = (stdout || '').trim();
    if (!outputLines.includes('2700000')) {
      setResult('p1', 'failed', `Expected the population of Chicago (2700000) to be printed. Got: "${outputLines}"`, code); return;
    }

    // Check Houston was added with correct population
    const houstonCheck = validateVariable(vars, 'city_populations', 'dict');
    if (!houstonCheck.passed) { setResult('p1', 'failed', houstonCheck.message, code); return; }

    // Use pyodide to check the dictionary values
    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_result = {}
_result['houston'] = city_populations.get('Houston', None)
_result['new_york'] = city_populations.get('New York', None)
_json.dumps(_result)
`);
    const parsed = JSON.parse(verifyResult);

    if (parsed.houston !== 2300000) {
      setResult('p1', 'failed', `Expected Houston to have population 2300000, got ${parsed.houston}.`, code); return;
    }

    if (parsed.new_york !== 8337000 + 1000) {
      setResult('p1', 'failed', `Expected New York population to be ${8337000 + 1000} (original + 1000), got ${parsed.new_york}.`, code); return;
    }

    setResult('p1', 'passed', 'Dictionary updated correctly!', code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const dictCheck = validateVariable(vars, 'state_pop', 'dict');
    if (!dictCheck.passed) { setResult('p2', 'failed', dictCheck.message, code); return; }

    // Use pyodide to verify the dictionary values
    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_result = {}
_result['virginia'] = state_pop.get('Virginia', None)
_result['dc'] = state_pop.get('DC', None)
_result['maryland'] = state_pop.get('Maryland', None)
_result['length'] = len(state_pop)
_json.dumps(_result)
`);
    const parsed = JSON.parse(verifyResult);

    if (parsed.length !== 3) {
      setResult('p2', 'failed', `Expected state_pop to have 3 entries, got ${parsed.length}.`, code); return;
    }

    if (parsed.virginia !== 8600000) {
      setResult('p2', 'failed', `Expected Virginia population to be 8600000, got ${parsed.virginia}.`, code); return;
    }

    if (parsed.dc !== 700000) {
      setResult('p2', 'failed', `Expected DC population to be 700000, got ${parsed.dc}.`, code); return;
    }

    if (parsed.maryland !== 6000000) {
      setResult('p2', 'failed', `Expected Maryland population to be 6000000, got ${parsed.maryland}.`, code); return;
    }

    setResult('p2', 'passed', 'Dictionary created correctly!', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p3', 'failed', 'Your code must use a for loop to iterate over the dictionary.', code); return; }

    // Verify the grades were updated correctly using pyodide
    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_original = {"alice": 88, "bob": 95, "charlie": 72, "diana": 97, "eve": 63, "frank": 100}
_expected = {}
for _k, _v in _original.items():
    _expected[_k] = min(_v + 5, 100)
_actual = dict(student_grades)
_json.dumps({"expected": _expected, "actual": _actual})
`);
    const parsed = JSON.parse(verifyResult);

    for (const [name, expected] of Object.entries(parsed.expected)) {
      if (parsed.actual[name] !== expected) {
        setResult('p3', 'failed', `Expected ${name}'s grade to be ${expected}, got ${parsed.actual[name]}.`, code); return;
      }
    }

    setResult('p3', 'passed', 'All grades updated correctly!', code);
  };

  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p4', 'failed', 'Your code must use a for loop to iterate over the dictionary.', code); return; }

    const hasItems = checkRequiredCode(code, ['.items()']);
    if (!hasItems.passed) { setResult('p4', 'failed', 'Your code must use .items() to iterate over keys and values.', code); return; }

    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p4', 'failed', 'Your code must use print() to output each student\'s grade.', code); return; }

    // Verify the output matches the expected format
    const expectedEntries: Record<string, number> = { alice: 88, bob: 95, charlie: 72, diana: 97, eve: 63, frank: 100 };
    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    if (outputLines.length < Object.keys(expectedEntries).length) {
      setResult('p4', 'failed', `Expected ${Object.keys(expectedEntries).length} lines of output, got ${outputLines.length}.`, code); return;
    }

    for (const [name, grade] of Object.entries(expectedEntries)) {
      const expectedLine = `Student: ${name}, Grade: ${grade}`;
      if (!outputLines.some((line: string) => line === expectedLine)) {
        setResult('p4', 'failed', `Expected output line "${expectedLine}" not found. Make sure the format is exactly: "Student: name, Grade: grade"`, code); return;
      }
    }

    setResult('p4', 'passed', 'All students printed correctly!', code);
  };

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q2 - Dictionaries"
          description="Create, edit, and access dictionaries using keys and values."
          objectives={[
            'Create dictionaries with key-value pairs',
            'Access, add, and update dictionary entries',
            'Iterate over dictionary keys',
            'Iterate over dictionaries using .items()',
          ]}
        />

        {/* P1: Accessing Dictionaries */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Accessing Dictionaries" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={'# print the population of Chicago\n\n# add Houston with population 2.3 million\n\n# add 1000 to the population of New York\n'}
            setupCode={'city_populations = {"New York": 8337000, "Los Angeles": 3979000, "Chicago": 2700000, "Phoenix": 1681000}'}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={60}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>
              Dictionaries are like arrays, but instead of using numbers to access values, they use <b>keys</b>, which can be strings, numbers, or even tuples.
              Dictionary <b>items</b> are accessed using square brackets with the key inside:
              <CodeExample code={`student_grades["alice"] = 90\nstudent_grades["bob"] = 85\nprint(student_grades["alice"])\nprint(student_grades["bob"])`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Given a dictionary of city populations:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Print the population of <CopyCode code='"Chicago"' /></li>
                <li>Add a new city <CopyCode code='"Houston"' /> with a population of 2,300,000</li>
                <li>Add 1000 to the population of <CopyCode code='"New York"' /></li>
              </ul>
            </Objectives>
            <Hints>Access a value with <CopyCode code='city_populations["Chicago"]' /> and set a value with <CopyCode code='city_populations["Houston"] = 2300000' /></Hints>
            <Hints>Add to an existing value with <CopyCode code='city_populations["New York"] += 1000' /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: Creating Dictionaries */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Creating Dictionaries" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={'# create a dictionary mapping these three states to their populations\n# Virginia - 8.6 million\n# DC - 700k\n# Maryland - 6 million\n'}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={100}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>
              An empty dictionary can be created using <b>curly brackets</b>:
              <CodeExample code={`my_dict = {}`} />
              A dictionary with initial key-value pairs can be created using &quot;key: value&quot; separated by commas:
              <CodeExample code={`number_words = {"one": 1, "two": 2, "three": 3, "pi": 3.14, "four": 4}\nprint(number_words["one"] + number_words["two"]) # prints: 3`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Create a dictionary named <CopyCode code="state_pop" /> mapping these three states to their populations:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Virginia &ndash; 8,600,000</li>
                <li>DC &ndash; 700,000</li>
                <li>Maryland &ndash; 6,000,000</li>
              </ul>
            </Objectives>
            <Hints>Create an empty dict <CopyCode code='state_pop = {}' /> and then set each population using <CopyCode code='state_pop["Virginia"] = 8600000' /></Hints>
            <Hints>Or create the dict with all the values at once: <CopyCode code='state_pop = {"Virginia": 8600000, "DC": 700000, "Maryland": 6000000}' /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Iterating Over Dictionaries */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Iterating Over Dictionaries" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={'# give each student a bonus to their grade by adding 5 points to each grade, but make sure they don\'t go over 100\n'}
            setupCode={'student_grades = {"alice": 88, "bob": 95, "charlie": 72, "diana": 97, "eve": 63, "frank": 100}'}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            initialVDivider={100}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>
              When a dict is supplied to a for loop, it iterates over the <b>keys</b>:
              <CodeExample code={`student_grades = {"alice": 90, "bob": 85, "charlie": 92}\nfor student in student_grades:\n    print(f"{student}: {student_grades[student]}")`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Look at the provided dict in the variable editor. Give each student a bonus by adding 5 points to each grade, but make sure they don&apos;t go over 100.</p>
            </Objectives>
            <Hints>Use a for loop to iterate over the keys in the dictionary: <CopyCode code='for name in student_grades:' /></Hints>
            <Hints>Add 5 to each grade using <CopyCode code='student_grades[name] += 5' /></Hints>
            <Hints>Use <CopyCode code='min(student_grades[name], 100)' /> to make sure the grade doesn&apos;t go over 100</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Iterating Over Keys and Items */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Iterating Over Keys and Items" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={'# for each item, print the name of each student and their grade in this exact format\n# "Student: alice, Grade: 90"\n'}
            setupCode={'student_grades = {"alice": 88, "bob": 95, "charlie": 72, "diana": 97, "eve": 63, "frank": 100}'}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            initialVDivider={60}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>
              You can use the <CopyCode code=".items()" /> method to get both keys and values when iterating over a dictionary:
              <CodeExample code={`student_grades = {"alice": 90, "bob": 85, "charlie": 92}\nfor student, grade in student_grades.items():\n    print(f"{student}: {grade}")`} />
            </Mechanics>
            <Objectives>
              <p className="mb-2">Look at the provided dict in the variable editor. For each item, print the name of each student and their grade in this exact format:</p>
              <CodeExample code={`Student: alice, Grade: 90`} />
            </Objectives>
            <Hints>Use a for loop with <CopyCode code='.items()' /> to get both the name and grade: <CopyCode code='for name, grade in student_grades.items():' /></Hints>
            <Hints>Use the <CopyCode code='+' /> operator to combine the variables and formatting strings, e.g. <CopyCode code='print("Student: " + name + ", Grade: " + str(grade))' /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q3" prevHref="q1" />
        </div>
      </div>
    </>
  );
}
