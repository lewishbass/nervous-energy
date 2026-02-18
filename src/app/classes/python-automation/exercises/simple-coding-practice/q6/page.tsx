import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';

export default function Question6() {
  const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tc1">Question 6 — Placeholder</h1>
        <p className="tc2 mt-2">Simple Coding Practice · Unit 0</p>
      </div>

      <AssignmentOverview 
        title="Simple Coding Practice"
        description="Perform simple operations with ints, floats, bools and strings. Assign values to variables, manipulate them and print the results."
        objectives={[
          'Practice using variables and data types (int, float, string)',
          'Use arithmetic and comparison operators',
          'Use print() for displaying output',
          'Format strings for readable output',
        ]}
        startHref={`${assignmentPath}/q1`}
      />

      <div className="bg1 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold tc1 mb-4">Placeholder</h2>
        <p className="tc2 mb-6">This page is a placeholder for Question 6. Instructions and starter code will be added here.</p>

        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto"># TODO: add prompt, tests and starter files</pre>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="/classes/python-automation/exercises/simple-coding-practice/q5" nextHref="/classes/python-automation/exercises/simple-coding-practice/q7" />
        </div>
      </div>
    </div>
  );
}
