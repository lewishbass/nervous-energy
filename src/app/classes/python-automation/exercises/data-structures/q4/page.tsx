'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { CodeExample, Mechanics, Objectives, Hints } from '../../exercise-components/QuestionPart';
import { useEffect, useState } from 'react';
import { validateError, checkRequiredCode, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';
import CopyCode from '../../exercise-components/CopyCode';

const className = 'python-automation';
const assignmentName = 'data-structures';
const questionName = 'q4';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question4() {
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

    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p1', 'failed', 'Use print() to display each node value.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p1', 'failed', 'Use a while loop to traverse the linked list.', code); return; }

    const expectedValues = ['3', '1', '4', '2', '67', '8', '1', '7', '9'];
    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    if (outputLines.length < expectedValues.length) {
      setResult('p1', 'failed', `Expected ${expectedValues.length} printed values, got ${outputLines.length}.`, code); return;
    }

    for (let i = 0; i < expectedValues.length; i++) {
      if (!outputLines[i].includes(expectedValues[i])) {
        setResult('p1', 'failed', `Expected "${expectedValues[i]}" at position ${i + 1}, got "${outputLines[i]}".`, code); return;
      }
    }

    setResult('p1', 'passed', 'Linked list traversed correctly!', code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_values = []
_current = root
while _current is not None:
    _values.append(_current.value)
    _current = _current.next
_json.dumps(_values)
`);
    const actualValues = JSON.parse(verifyResult);
    const expectedValues = [3, 1, 2, 67, 8, 1, 7, 9];

    if (actualValues.includes(4)) {
      setResult('p2', 'failed', 'The node with value 4 was not removed from the linked list.', code); return;
    }

    if (actualValues.length !== expectedValues.length) {
      setResult('p2', 'failed', `Expected ${expectedValues.length} nodes after removal, got ${actualValues.length}.`, code); return;
    }

    for (let i = 0; i < expectedValues.length; i++) {
      if (actualValues[i] !== expectedValues[i]) {
        setResult('p2', 'failed', `Expected value ${expectedValues[i]} at position ${i + 1}, got ${actualValues[i]}.`, code); return;
      }
    }

    setResult('p2', 'passed', 'Node with value 4 removed correctly!', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const hasNode = checkRequiredCode(code, ['Node(']);
    if (!hasNode.passed) { setResult('p3', 'failed', 'Use the Node class to create a new node.', code); return; }

    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_values = []
_current = root
while _current is not None:
    _values.append(_current.value)
    _current = _current.next
_json.dumps(_values)
`);
    const actualValues = JSON.parse(verifyResult);
    const expectedValues = [3, 1, 4, 2, 67, 8, 1, 7, 9, 5];

    if (actualValues.length !== expectedValues.length) {
      setResult('p3', 'failed', `Expected ${expectedValues.length} nodes, got ${actualValues.length}.`, code); return;
    }

    if (actualValues[actualValues.length - 1] !== 5) {
      setResult('p3', 'failed', `Expected the last node to have value 5, got ${actualValues[actualValues.length - 1]}.`, code); return;
    }

    for (let i = 0; i < expectedValues.length; i++) {
      if (actualValues[i] !== expectedValues[i]) {
        setResult('p3', 'failed', `Expected value ${expectedValues[i]} at position ${i + 1}, got ${actualValues[i]}.`, code); return;
      }
    }

    setResult('p3', 'passed', 'Node with value 5 inserted at the end correctly!', code);
  };

  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const hasNode = checkRequiredCode(code, ['Node(']);
    if (!hasNode.passed) { setResult('p4', 'failed', 'Use the Node class to create a new node.', code); return; }

    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_values = []
_current = root
while _current is not None:
    _values.append(_current.value)
    _current = _current.next
_json.dumps(_values)
`);
    const actualValues = JSON.parse(verifyResult);
    const expectedValues = [5, 3, 1, 4, 2, 67, 8, 1, 7, 9];

    if (actualValues.length !== expectedValues.length) {
      setResult('p4', 'failed', `Expected ${expectedValues.length} nodes, got ${actualValues.length}.`, code); return;
    }

    if (actualValues[0] !== 5) {
      setResult('p4', 'failed', `Expected the first node to have value 5, got ${actualValues[0]}.`, code); return;
    }

    for (let i = 0; i < expectedValues.length; i++) {
      if (actualValues[i] !== expectedValues[i]) {
        setResult('p4', 'failed', `Expected value ${expectedValues[i]} at position ${i + 1}, got ${actualValues[i]}.`, code); return;
      }
    }

    setResult('p4', 'passed', 'Node with value 5 inserted at the beginning correctly!', code);
  };

  const LINKED_LIST_CODE = `
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"
        
class Node(metaclass=_CustomClass):
    def __init__(self, value):
        self.value = value
        self.next = None
    def __repr__(self):
        return f"Node(value={self.value}, next={type(self.next).__name__})"
`

  const LINKED_LIST_SETUP = LINKED_LIST_CODE + "root = Node(3)\n_tmp=root\nfor _i in [1, 4, 2, 67, 8, 1, 7, 9]:\n    _tmp.next = Node(_i)\n    _tmp = _tmp.next";

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q4 - Linked Lists"
          description="Build linked lists and perform traversal, insertion, and deletion operations."
          objectives={[
            'Traverse a linked list and print its elements',
            'Remove an item from a linked list',
            'Insert a node at the end of the linked list',
            'Insert a node at the beginning of the linked list',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Traverse a linked list and print its elements" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p1'} initialCode={'# traverse and print the provided linked list starting at "root"'} setupCode={LINKED_LIST_SETUP} cachedCode={submissionStates[`${questionName}_p1`]?.code} initialVDivider={100} validationState={validationStates['p1'] || null} validationMessage={validationMessages['p1']} onCodeStart={() => startCode('p1')} onCodeEnd={validateCodeP1}>
            <Mechanics>A linked list is a way of storing lists, where each element is a <b>Node</b><br />
              Each node contains a <b>value</b> and a <b>reference</b><br />
              The <b>value</b> <CopyCode code="node.value" /> contains the data stored in the node.<br />
              The <b>reference</b> <CopyCode code="node.next" /> points to the next node in the list, or <b>None</b> if it is the last node.
              <CodeExample code={`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None`} language="python" />
              Given the <b>root</b> node of a linked list, you can access the next node in the list using
              <CodeExample code={`current_node = root\next_node = current_node.next`} language="python" />
            </Mechanics>
            <Objectives>Traverse the given linked list and print each of the values
              <ul className="list-disc list-inside">
                <li>Start with current_node = root</li>
                <li>Print the value of the current node</li>
                <li>Move to the next node</li>
                <li>Repeat until you reach the end of the list (current_node is None)</li>
              </ul>
            </Objectives>
            <Hints>Move to the next node with <CopyCode code="current_node = current_node.next" /></Hints>
            <Hints>Check if you've reached the end of the list with <CopyCode code="current_node is None" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Remove an item from a linked list" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p2'} initialCode={'# remove the node with value 4'} setupCode={LINKED_LIST_SETUP} cachedCode={submissionStates[`${questionName}_p2`]?.code} initialVDivider={100} validationState={validationStates['p2'] || null} validationMessage={validationMessages['p2']} onCodeStart={() => startCode('p2')} onCodeEnd={validateCodeP2}>
            <Mechanics>An item can be removed from a linked list by updating the node that points to it, skipping over the item you want to remove.
              <CodeExample code={`current_node.next = current_node.next.next`} language="python" />
              Now instead of point to the next node, it points to the node after the next node, effectively removing the next node from the list.
            </Mechanics>
            <Objectives>Remove the node with the number 4 from the linked list.
              <ul className="list-disc list-inside">
                <li>Traverse the list to find the node with the value 4</li>
                <li>Update the previous node's next pointer to skip the node with value 4</li>
              </ul>
            </Objectives>
            <Hints>Instead of checking if the current node is the one to remove, check the value of the next node <CopyCode code={"current_node.next.value == 4"} /></Hints>
            <Hints>Then update the next pointer to skip the node with value 4 <CopyCode code={"current_node.next = current_node.next.next"} /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Insert a node at the end of the linked list" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p3'} initialCode={'# insert a new node with value 5 at the end'} setupCode={LINKED_LIST_SETUP} cachedCode={submissionStates[`${questionName}_p3`]?.code} initialVDivider={100} validationState={validationStates['p3'] || null} validationMessage={validationMessages['p3']} onCodeStart={() => startCode('p3')} onCodeEnd={validateCodeP3}>
            <Mechanics>An item can be inserted at the end of a list by updating the next pointer of the last node to point to the new node.</Mechanics>
            <Objectives>Insert a new node with the value 5 at the end of the linked list.
              <ul className="list-disc list-inside">
                <li>Traverse the list to find the last node</li>
                <li>Update the last node's next pointer to point to the new node</li>
              </ul>
            </Objectives>
            <Hints>Traverse the list until you find a node where <CopyCode code="current_node.next is None" /></Hints>
            <Hints>Then update the next pointer to point to the new node <CopyCode code="current_node.next = Node(5)" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Insert a node at the beginning of the linked list" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p4'} initialCode={'# insert a new node with value 5 at the beginning'} setupCode={LINKED_LIST_SETUP} cachedCode={submissionStates[`${questionName}_p4`]?.code} initialVDivider={100} validationState={validationStates['p4'] || null} validationMessage={validationMessages['p4']} onCodeStart={() => startCode('p4')} onCodeEnd={validateCodeP4}>
            <Mechanics>A new node can be inserted at the beginning of a list by making a new node with the desired value, setting it to point to root, then updating the root to point to the new node.</Mechanics>
            <Objectives>Insert a new node with the value 5 at the beginning of the linked list.
              <ul className="list-disc list-inside">
                <li>Create a new node with the value 5</li>
                <li>Set the new node's next pointer to the current root</li>
                <li>Update the root to point to the new node</li>
              </ul>
            </Objectives>
            <Hints>Set the new node's next pointer to the current root <CopyCode code="new_node.next = root" /></Hints>
            <Hints>Then update the root to point to the new node <CopyCode code="root = new_node" /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q5" prevHref="q3" />
        </div>
      </div>
    </>
  );
}
