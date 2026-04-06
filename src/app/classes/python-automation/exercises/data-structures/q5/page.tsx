'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, Objectives, CodeExample, Hints } from '../../exercise-components/QuestionPart';
import { useEffect, useState } from 'react';
import { validateError, checkRequiredCode, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';
import TreeVisualizer, { type TreeNodeData } from '@/app/classes/python-automation/lectures/lecture-components/TreeVisuzlizer';
import GraphVisualizer, { linkedListGraph } from '@/app/classes/python-automation/lectures/lecture-components/GraphVisualizer';
import CopyCode from '../../exercise-components/CopyCode';

const bstExample: TreeNodeData = {
  value: 20,
  left: {
    value: 10,
    left: { value: 5 },
    right: { value: 16, highlight: true },
  },
  right: {
    value: 30,
    left: { value: 25 },
    right: { value: 35 },
  },
};

const className = 'python-automation';
const assignmentName = 'data-structures';
const questionName = 'q5';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question5() {
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

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p1', 'failed', 'Use a while loop to traverse the tree.', code); return; }

    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    if (outputLines.length === 0) {
      setResult('p1', 'failed', 'No output detected. Make sure to print each node value as you traverse.', code); return;
    }

    // Expected search path for 16: root(20) → left(10) → right(16)
    const pathValues = ['20', '10', '16'];
    let pathIdx = 0;
    for (const line of outputLines) {
      if (pathIdx < pathValues.length && line.includes(pathValues[pathIdx])) pathIdx++;
    }
    if (pathIdx < pathValues.length) {
      setResult('p1', 'failed', `Expected values along the search path: ${pathValues.join(' → ')}. Make sure you are printing each node you visit.`, code); return;
    }

    // Ensure no off-path nodes were visited (5, 25, 30, 36)
    const offPath = ['5', '25', '30', '36'];
    for (const val of offPath) {
      if (outputLines.some((l: string) => l === val)) {
        setResult('p1', 'failed', `Node ${val} is not on the path to 16. Check your comparison: go left when current > target, right when current < target.`, code); return;
      }
    }

    setResult('p1', 'passed', 'BST search completed correctly! Path: 20 → 10 → 16', code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const hasNode = checkRequiredCode(code, ['Node(']);
    if (!hasNode.passed) { setResult('p2', 'failed', 'Use the Node class to create a new node to insert.', code); return; }

    // Verify in-order traversal after inserting 16 into _init_tree([20,10,30,5,16,25,36])
    // Duplicate 16 goes right of existing 16 → in-order: [5, 10, 16, 16, 20, 25, 36]
    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
def _inorder(node):
    if node is None:
        return []
    return _inorder(node.left) + [node.value] + _inorder(node.right)
_json.dumps(_inorder(root))
`);
    const inOrder: number[] = JSON.parse(verifyResult);
    const expected = [5, 10, 16, 20, 25, 30, 36];

    if (inOrder.length !== expected.length) {
      const hint = inOrder.length < expected.length
        ? 'Make sure to attach the new node to the tree.'
        : 'Only insert one node.';
      setResult('p2', 'failed', `Expected ${expected} nodes after insertion, got ${inOrder}. ${hint}`, code); return;
    }

    for (let i = 0; i < expected.length; i++) {
      if (inOrder[i] !== expected[i]) {
        setResult('p2', 'failed', `Incorrect tree structure. Expected in-order: [${expected.join(', ')}], got [${inOrder.join(', ')}].`, code); return;
      }
    }

    setResult('p2', 'passed', 'Node with value 16 inserted at the correct position!', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def printTree']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Do not remove the `def printTree` function definition.', code); return; }

    const hasRecursion = checkRequiredCode(code, ['printTree(']);
    if (!hasRecursion.passed) { setResult('p3', 'failed', 'Your printTree function must call itself recursively.', code); return; }

    // In-order traversal of _init_tree([20,10,30,5,16,25,36]) → sorted: [5, 10, 16, 20, 25, 30, 36]
    const expected = ['5', '10', '16', '20', '25', '30', '36'];
    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    if (outputLines.length < expected.length) {
      setResult('p3', 'failed', `Expected ${expected.length} values printed, got ${outputLines.length}. Make sure to call printTree(root) and print every node.`, code); return;
    }

    for (let i = 0; i < expected.length; i++) {
      if (!outputLines[i].includes(expected[i])) {
        setResult('p3', 'failed', `Expected ${expected[i]} at position ${i + 1}, got "${outputLines[i]}". Values must be printed in sorted (in-order: left → root → right) order.`, code); return;
      }
    }

    setResult('p3', 'passed', `In-order traversal correct! Values in sorted order: ${expected.join(', ')}`, code);
  };

  

  const TREE_CODE = `
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"
        
class Node(metaclass=_CustomClass):
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
    def __repr__(self):
        return f"Node(value={self.value}, left={type(self.left).__name__}, right={type(self.right).__name__})"
`
  const INIT_TREE_CODE = `
def _init_tree(values):
  root = Node(values[0])
  for value in values[1:]:
      current_node = root
      while True:
          if value < current_node.value:
              if current_node.left is None:
                  current_node.left = Node(value)
                  break
              else:
                  current_node = current_node.left
          else:
              if current_node.right is None:
                  current_node.right = Node(value)
                  break
              else:
                  current_node = current_node.right
  return root
  `;

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q5 - Tree Traversal"
          description="Construct binary trees and implement in-order, pre-order, and post-order traversal."
          objectives={[
            'Find a node in a binary tree',
            'Add a leaf node to a binary tree',
            'Implement in-order traversal',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Find a value" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p1'} setupCode={TREE_CODE + INIT_TREE_CODE + "\nroot = _init_tree([20, 10, 30, 5, 16, 25, 36])"} initialCode={'# search for the number 16, printing each node value along the way'} cachedCode={submissionStates[`${questionName}_p1`]?.code} initialVDivider={100} validationState={validationStates['p1'] || null} validationMessage={validationMessages['p1']} onCodeStart={() => startCode('p1')} onCodeEnd={validateCodeP1}>
            <Mechanics>A <span className="font-bold">Binary Tree</span> is a data structure consisting of structured nodes.<br />Each node has a <span className="font-bold">value</span>, <span className="font-bold">left child</span>, and <span className="font-bold">right child</span>.<br />The <span className="font-bold">left child</span> is another node who's value is always less than its parent.<br />The <span className="font-bold">right child</span> is another node who's value is always greater than its parent.
              <CodeExample code={'class TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None'} language="python" />
              By building layers of nodes, we can store sets of values in a structured manner, guaranteeing that for any node, all values in its left subtree are smaller and all values in its right subtree are larger.
              <TreeVisualizer root={bstExample} height={180} caption="Example BST — highlighted node (16) is the search target" />
            </Mechanics>
            <Objectives>Search for the number <CopyCode code={'16'} /> in a binary tree, printing out the values of each node along the way
              <ul className="list-disc list-inside">
                <li>Start at the root node</li>
                <li>Print the nodes value</li>
                <li>If the value of the current node is the target, stop searching</li>
                <li>If the value of the current node is less than the target, go to the right child</li>
                <li>If the value of the current node is greater than the target, go to the left child</li>
                <li>Repeat until the target is found or a leaf node is reached</li>
              </ul>
            </Objectives>
            <Hints>create a <CopyCode code={'current_node'} /> variable to keep track of the node you are currently visiting</Hints>
            <Hints>set <CopyCode code={'current_node = root'} /> to start at the root node</Hints>
            <Hints>set <CopyCode code={'current_node = current_node.left'} /> to move to the left child</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Add a new node" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p2'} initialCode={'# Insert the value 16 into the tree'} setupCode={TREE_CODE + INIT_TREE_CODE + "\nroot = _init_tree([20, 10, 30, 5, 25, 36])"}  cachedCode={submissionStates[`${questionName}_p2`]?.code} initialVDivider={100} validationState={validationStates['p2'] || null} validationMessage={validationMessages['p2']} onCodeStart={() => startCode('p2')} onCodeEnd={validateCodeP2}>
            <Mechanics>New <span className="font-bold">nodes</span> added to the tree must obey the <span className="font-bold">binary search tree property</span><br/>
            <ul className="list-disc list-inside">
              <li>Left child value is less than its parent node value</li>
              <li>Right child value is greater than its parent node value</li>
            </ul>
            This is accomplished by searching for where the node <span className="font-bold">should</span> be in the tree, and adding it as a child of the leaf node where the search ends.
            </Mechanics>
            <Objectives>Insert the node into the correct position in the tree

              <ul className="list-disc list-inside">
                <li>Start at the root node</li>
                <li>If the value of the new node is less than the current node, go to the left child. If there is no left child, insert the new node here.</li>
                <li>If the value of the new node is greater than the current node, go to the right child. If there is no right child, insert the new node here.</li>
                <li>Repeat until the new node is inserted</li>
              </ul>
            </Objectives>
            <Hints>create a <CopyCode code={'current_node'} /> variable to keep track of the node you are currently visiting</Hints>
            <Hints>check if the left child is empty using <CopyCode code={'current_node.left == None'} /> </Hints>
            <Hints>Create a new <CopyCode code={'Node'} /> with the value to be inserted using <CopyCode code={'new_node = Node(16)'} /></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Traverse the tree" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p3'} setupCode={TREE_CODE + INIT_TREE_CODE + "\nroot = _init_tree([20, 10, 30, 5, 16, 25, 36])"}  initialCode={'# Complete this function to perform an in-order traversal of a binary search tree\ndef printTree(node):\n    # if the node is None, call \'return\' to exit\n    \n    # call the printTree function on the left branch to print that subtree\n    \n    # print the value of the current node\n    \n    # call the printTree function on the right branch to print that subtree\n    \n\nprintTree(root)'} cachedCode={submissionStates[`${questionName}_p3`]?.code} initialVDivider={100} validationState={validationStates['p3'] || null} validationMessage={validationMessages['p3']} onCodeStart={() => startCode('p3')} onCodeEnd={validateCodeP3}>
            <Mechanics>Values stored in the tree are <b>structured</b> but not yet sorted.<br/>To extract the values in sorted order, we want to perform an <b>in order</b> traversal of the tree.<br/>This is the same as squashing the tree to be flat, then listing its values from left to right
              <TreeVisualizer root={bstExample} height={200} caption="The BST — values are structured but spread across levels" />
              <GraphVisualizer graph={linkedListGraph([5, 10, 16, 20, 25, 30, 35], false)} height={100}   />

              An in-order traversal of a tree with depth 1 can be accomplished by printing the left child, then the current node, then the right child.
              <TreeVisualizer root={{ value: '20', left: { value: '10' }, right: { value: '30' } }} height={150} caption="In-order traversal of a single node tree - 10, 20, 30" />
              For deeper trees, we first perform an in-order traversal of the left subtree, then print the current node, then perform an in-order traversal of the right subtree.
            </Mechanics>
            <Objectives>Complete this function that performs an in-order traversal of a binary search tree and returns the values in sorted order.
              <ul className="list-disc list-inside">
                <li>If the current node is None, exit</li>
                <li>Perform an in-order traversal of the left subtree</li>
                <li>Print the value of the current node</li>
                <li>Perform an in-order traversal of the right subtree</li>
              </ul>
            </Objectives>
            <Hints>Use <CopyCode code="node == None" /> to check if the current node is None</Hints>
            <Hints>Exit the function using the <CopyCode code="return" /> keyword</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q6" prevHref="q4" />
        </div>
      </div>
    </>
  );
}
