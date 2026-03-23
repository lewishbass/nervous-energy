'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Hints, Mechanics, Objectives } from '../../exercise-components/QuestionPart';
import { useEffect, useState } from 'react';
import { validateError, checkRequiredCode, runTestCases, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';
import CopyCode from '../../exercise-components/CopyCode';

const className = 'python-automation';
const assignmentName = 'data-structures';
const questionName = 'q3';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question3() {
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

    const hasStack = checkRequiredCode(code, ['Stack(']);
    if (!hasStack.passed) { setResult('p1', 'failed', 'Use the provided `Stack` class to create a stack.', code); return; }

    const hasPush = checkRequiredCode(code, ['.push(']);
    if (!hasPush.passed) { setResult('p1', 'failed', 'Use the `.push()` method to add items to the stack.', code); return; }

    const hasPop = checkRequiredCode(code, ['.pop(']);
    if (!hasPop.passed) { setResult('p1', 'failed', 'Use the `.pop()` method to remove items from the stack.', code); return; }

    // Verify a reversed list exists in the variables
    const verifyResult: string = await pyodide.runPythonAsync(`
import json as _json
_found = False
_var_name = None
for _name, _val in list(locals().items()):
    if _name.startswith('_'): continue
    if _name == 'arr': continue
    if isinstance(_val, list) and _val == arr[::-1]:
        _found = True
        _var_name = _name
        break
_json.dumps({'found': _found, 'name': _var_name})
`);
    const parsed = JSON.parse(verifyResult);
    if (!parsed.found) {
      setResult('p1', 'failed', 'Expected a variable containing the reversed list.', code); return;
    }

    setResult('p1', 'passed', 'Stack used to reverse the list correctly!', code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const hasDequeue = checkRequiredCode(code, ['.dequeue(']);
    if (!hasDequeue.passed) { setResult('p2', 'failed', 'Use the `.dequeue()` method to remove items from the front of the queue.', code); return; }

    const hasEnqueue = checkRequiredCode(code, ['.enqueue(']);
    if (!hasEnqueue.passed) { setResult('p2', 'failed', 'Use the `.enqueue()` method to add items back to the queue.', code); return; }

    const hasPrint = checkRequiredCode(code, ['print']);
    if (!hasPrint.passed) { setResult('p2', 'failed', 'Use `print()` to display each item.', code); return; }

    // Check stdout contains the queue items in FIFO order
    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    const expectedOrder = ['3', '1', '4', '1', '5', '3', '1', '4', '1', '5']; // each item should be printed twice in the order they appear in the queue

    if (outputLines.length == expectedOrder.length/2) {
      setResult('p2', 'failed', `Remember to print the queue twice in order`, code); return;
    }

    if (outputLines.length < expectedOrder.length) {
      setResult('p2', 'failed', `Expected at least ${expectedOrder.length} printed values, got ${outputLines.length}.`, code); return;
    }

    for (let i = 0; i < expectedOrder.length; i++) {
      if (!outputLines[i].includes(expectedOrder[i])) {
        setResult('p2', 'failed', `Expected "${expectedOrder[i]}" as output #${i + 1}, got "${outputLines[i]}".`, code); return;
      }
    }

    // check that the queue still contains all items in the correct order at the end
    const queueState: string = await pyodide.runPythonAsync(`import json as _json
if 'queue' in locals():
    _queue_contents = queue.items if isinstance(queue, Queue) else None
else:
    _queue_contents = None
_json.dumps(_queue_contents)`);

    const parsedQueue = JSON.parse(queueState);
    if (!Array.isArray(parsedQueue)) {
      setResult('p2', 'failed', 'Expected a variable named `queue` that is an instance of the Queue class.', code); return;
    }
    const expectedQueue = [3, 1, 4, 1, 5];
    if (parsedQueue.length !== expectedQueue.length) {
      setResult('p2', 'failed', `Expected the queue to have ${expectedQueue.length} items at the end, got ${parsedQueue.length}.`, code); return;
    }
    for (let i = 0; i < expectedQueue.length; i++) {
      if (parsedQueue[i] !== expectedQueue[i]) {
        setResult('p2', 'failed', `Expected the queue to contain ${expectedQueue.join(', ')} at the end, got ${parsedQueue.join(', ')}.`, code); return;
      }
    }

    setResult('p2', 'passed', 'Queue cycled correctly! All items printed in order.', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def check_brackets']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `check_brackets`.', code); return; }

    const hasStack = checkRequiredCode(code, ['Stack(']);
    if (!hasStack.passed) { setResult('p3', 'failed', 'Use the provided `Stack` class inside your function.', code); return; }

    const hasFor = checkRequiredCode(code, ['for ']);
    if (!hasFor.passed) { setResult('p3', 'failed', 'Use a `for` loop to iterate through the input string.', code); return; }

    const testCases = [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
      { args: ['((()))'], expected: true },
      { args: ['({[]})'], expected: true },
      { args: ['({[}])'], expected: false },
      { args: ['('], expected: false },
      { args: ['}'], expected: false },
      { args: ['{[()]}'], expected: true },
    ];
    const testResults = await runTestCases(pyodide, 'check_brackets', testCases);
    if (!testResults.passed) { setResult('p3', 'failed', testResults.message, code); return; }
    setResult('p3', 'passed', testResults.message, code);
  };

  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const hasDequeue = checkRequiredCode(code, ['.dequeue(']);
    if (!hasDequeue.passed) { setResult('p4', 'failed', 'Use the `.dequeue()` method to remove items from the queue.', code); return; }

    const hasEnqueue = checkRequiredCode(code, ['.enqueue(']);
    if (!hasEnqueue.passed) { setResult('p4', 'failed', 'Use the `.enqueue()` method to skip items by adding them to the back.', code); return; }

    const hasPrint = checkRequiredCode(code, ['print(']);
    if (!hasPrint.passed) { setResult('p4', 'failed', 'Use `print()` to display each removed item.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p4', 'failed', 'Use a `while` loop to repeat until the queue is empty.', code); return; }

    // Compute expected removal order using a reference solution
    const expectedResult: string = await pyodide.runPythonAsync(`
import json as _json
class _RefQueue:
    def __init__(self):
        self.items = []
    def enqueue(self, item):
        self.items.append(item)
    def dequeue(self):
        return self.items.pop(0)
    def is_empty(self):
        return len(self.items) == 0

_q = _RefQueue()
for _i in range(1, 11):
    _q.enqueue(_i)

_expected = []
while not _q.is_empty():
    _q.enqueue(_q.dequeue())
    _q.enqueue(_q.dequeue())
    _expected.append(str(_q.dequeue()))
_json.dumps(_expected)
`);
    const expectedOrder = JSON.parse(expectedResult);

    const outputLines = (stdout || '').trim().split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    if (outputLines.length !== expectedOrder.length) {
      setResult('p4', 'failed', `Expected ${expectedOrder.length} items printed, got ${outputLines.length}.`, code); return;
    }

    for (let i = 0; i < expectedOrder.length; i++) {
      if (!outputLines[i].includes(expectedOrder[i])) {
        setResult('p4', 'failed', `Expected "${expectedOrder[i]}" as removal #${i + 1}, got "${outputLines[i]}".`, code); return;
      }
    }

    setResult('p4', 'passed', `All ${expectedOrder.length}/${expectedOrder.length} items removed in the correct order!`, code);
  };

  return (
    <>
      <RandomBackground seed={11} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q3 - Stacks and Queues"
          description="Use stack (LIFO) and queue (FIFO) data structures."
          objectives={[
            'Implement a stack using a list',
            'Push and pop elements from a stack',
            'Evaluate if a parenthesis sequence is valid using a stack',
            'Remove every nth element from a queue until one remains',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 1" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p1'} initialCode={'# Use a stack to reverse this list\narr = [1, 2, 3, 4, 5]'} cachedCode={submissionStates[`${questionName}_p1`]?.code} initialVDivider={100} validationState={validationStates['p1'] || null} validationMessage={validationMessages['p1']} onCodeStart={() => startCode('p1')} onCodeEnd={validateCodeP1}
            setupCode={`
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"
class Stack(metaclass=_CustomClass):
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
    def pop(self):
        return self.items.pop()
    def top(self):
        return self.items[-1]
    def is_empty(self):
        return len(self.items) == 0
    def __repr__(self):
        return ", ".join(map(str, self.items))`
}>
            <Mechanics>A <b>stack</b> is a data structure that follows the <b>Last In, First Out (LIFO)</b> principle.<br/>New items added, with the <CopyCode code="push"/> method are placed on the top.<br/>Items are removed from the top using the <CopyCode code="pop"/> method.<br/>Older items are buried by new items like a <b>stack</b> of paperwork <br/><br/>They only need three methods, <CopyCode code="push"/>, <CopyCode code="pop"/>, and <CopyCode code="is_empty"/>.</Mechanics>
            <Objectives>Create an instance of the provided <CopyCode code="Stack"/> class and use it to reverse the provided list</Objectives>
            <Hints>Create a new, empty stack using <CopyCode code="stack = Stack()"/></Hints>
            <Hints>Iterate over the array, adding each item to the stack using <CopyCode code="for a in arr:"/></Hints>
            <Hints>After each item is in the stack, pop them and add them to a new array using a <CopyCode code="while not stack.is_empty():"/> since the stack is LIFO they will be reversed</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 2" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p2'} initialCode={'# print each item in the queue, then add it to the back, iterate over the queue TWICE'} cachedCode={submissionStates[`${questionName}_p2`]?.code} initialVDivider={100} validationState={validationStates['p2'] || null} validationMessage={validationMessages['p2']} onCodeStart={() => startCode('p2')} onCodeEnd={validateCodeP2}
            setupCode={`
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"
class Queue(metaclass=_CustomClass):
    def __init__(self):
        self.items = []
    def enqueue(self, item):
        self.items.append(item)
    def dequeue(self):
        return self.items.pop(0)
    def front(self):
        return self.items[0]
    def is_empty(self):
        return len(self.items) == 0
    def __len__(self):
        return len(self.items)
    def __repr__(self):
        return ", ".join(map(str, self.items))
        
queue = Queue()
queue.enqueue(3)
queue.enqueue(1)
queue.enqueue(4)
queue.enqueue(1)
queue.enqueue(5)`}>
            <Mechanics>A <b>queue</b> is a data structure that follows the <b> First In, First Out (FIFO)</b> principle.<br/> New items, added with the <CopyCode code="enqueue"/> method are placed at the back of the queue.<br/>Items are removed from the front using the <CopyCode code="dequeue"/> method.<br/>Older items are the first in line like a <b>queue</b> at an amusement park.<br/><br/>They only need three methods, <CopyCode code="enqueue"/>, <CopyCode code="dequeue"/>, and <CopyCode code="is_empty"/>.</Mechanics>
            <Objectives>Inspect the provided instance of a queue in the variable editor.<br/> One by one, take the first value from the queue, print it, then add it to the back.<br/>Iterate over the queue <b>TWICE</b>. <br/>This is similar to a common task where we want to perform a process over and over, but keep everything in order.</Objectives>
            <Hints>Use the <CopyCode code="len(queue)"/> function to check the length of the queue and a for loop to iterate that many times.</Hints>
            <Hints>Call the <CopyCode code=".dequeue()"/> to remove the first item and <CopyCode code=".enqueue()"/> to add it to the back.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 3" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p3'} initialCode={'# finish this function that checks if a sequence of brackets is valid\ndef check_brackets(input):\n    # your code here'} cachedCode={submissionStates[`${questionName}_p3`]?.code} initialVDivider={100} validationState={validationStates['p3'] || null} validationMessage={validationMessages['p3']} onCodeStart={() => startCode('p3')} onCodeEnd={validateCodeP3} 
            setupCode={`
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"

class Stack(metaclass=_CustomClass):
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
    def pop(self):
        return self.items.pop()
    def top(self):
        return self.items[-1]
    def is_empty(self):
        return len(self.items) == 0
    def __repr__(self):
        return ", ".join(map(str, self.items))`
}>
            <Mechanics>Parenthesis can by nested to form complex expressions, but they must be closed in the correct order<br/> If you want to stack a curly and smooth bracket, the <b>last</b> one opened should be the <b>first</b> one closed.<br/><span className="font-courier">(  &#123; &#125; )</span> - <span className="text-green-600 dark:text-green-400"><b>Correct</b>: last opened is first closed</span><br/><span className="font-courier">(  &#123; ) &#125;</span> - <span className="text-red-600 dark:text-red-400"><b>Incorrect</b>: last opened is not first closed</span></Mechanics>
            <Objectives>Create a function <CopyCode code="check_brackets"/> that evaluates if a sequence of brackets is valid.
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Create a function named <CopyCode code="check_brackets"/></li>
              <li>It takes the string <CopyCode code="input" /> containing a sequence of smooth, curly and square brackets ( [ &#123; &#125; ] )</li>
              <li>Iterate through the string
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>add open brackets to the stack</li>
                  <li>check if closing brackets match the top of the stack, and pop it if they do</li>
                </ul>
              </li>
              <li>Return false if you find a mismatch, return true if all match, and the stack is empty at the end</li>
            </ul>
            </Objectives>
            <Hints>Create a stack to track parenthesis with <CopyCode code="stack = Stack()"/></Hints>
            <Hints>Iterate through the string with <CopyCode code="for char in input:"/></Hints>
            <Hints>When you see an open bracket, add it to the stack with <CopyCode code="stack.push(char)"/></Hints>
            <Hints>When you see a closing bracket, check if the stack is empty (if it is, it's a mismatch), then check if the top of the stack is the matching open bracket (if it's not, it's a mismatch, return false), if it matches pop the stack with <CopyCode code="stack.pop()"/></Hints>
            <Hints>At the end, check if the stack is empty with <CopyCode code="stack.is_empty()"/></Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 4" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p4'} initialCode={'# remove and print every third element until it is empty'} cachedCode={submissionStates[`${questionName}_p4`]?.code} initialVDivider={60} validationState={validationStates['p4'] || null} validationMessage={validationMessages['p4']} onCodeStart={() => startCode('p4')} onCodeEnd={validateCodeP4} setupCode={`
class _CustomClass(type):
    def __repr__(cls):
        return f"{cls.__name__} class"

class Queue(metaclass=_CustomClass):
    def __init__(self):
        self.items = []
    def enqueue(self, item):
        self.items.append(item)
    def dequeue(self):
        return self.items.pop(0)  
    def is_empty(self):
        return len(self.items) == 0
    def __repr__(self):
        return ", ".join(map(str, self.items))
queue = Queue()
for i in range(1, 11):
    queue.enqueue(i)
`}>
            <Mechanics>In some cases, we want to repeatedly process items in a queue, but also want to remove items at regular intervals.<br/> For example, in a card game, you might want to repeatedly draw cards, but remove every 3rd card from the game.<br/><br/> In this problem, you'll iterate through the queue, removing every 3rd item until the queue is empty.</Mechanics>
            <Objectives>Iterate through the provided <CopyCode code="queue"/> , removing and printing every third element until it is empty
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Start by skipping two elements, using <CopyCode code=".dequeue()"/> to remove them from the front and <CopyCode code=".enqueue()"/> to add them to the back</li>
                <li>Remove and print the third element using <CopyCode code=".dequeue()"/></li>
                <li>Repeat the process until the queue is empty</li>
              </ul>
            </Objectives>
            <Hints>Use <CopyCode code="while not queue.is_empty():"/> to iterate until the queue is empty</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q4" prevHref="q2" />
        </div>
      </div>
    </>
  );
}
