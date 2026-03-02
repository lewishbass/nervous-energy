'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, CodeExample, Objectives, Hints } from '../../exercise-components/QuestionPart';
import CopyCode from '../../exercise-components/CopyCode';
import { useEffect, useState } from 'react';
import { validateError, createSetResult, getQuestionSubmissionStatus, checkRequiredCode, runTestCases } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import { useAuth } from '@/context/AuthContext';

const className = 'python-automation';
const assignmentName = 'functions-arrays-loops';
const questionName = 'q6';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

const spaceShipSetupCode = `class SpaceShip:
    def __init__(self, fuel=100):
        self.altitude = 0
        self.speed = 0
        self.fuel = fuel

    def accelerate(self):
        if self.fuel > 0:
            self.speed += 10
            self.fuel -= 1 * (1 + self.speed / 10)
            print(f"Accelerating: speed={self.speed}, fuel={self.fuel}")
        else:
            print("Out of fuel!")
            raise RuntimeError("The spaceship has run out of fuel and cannot accelerate.")
`;

const userInputSetupCode = `
class UserInput:
    def __init__(self, events):
        self._events = list(events)
        self._index = 0

    def getEvent(self):
        if self._index >= len(self._events):
            raise RuntimeError("No more events")
        event = self._events[self._index]
        self._index += 1
        return event
`;

const webPortSetupCode = `
class WebPort:
    def __init__(self, ips):
        self._ips = list(ips)
        self._index = 0

    def listen(self):
        if self._index >= len(self._ips):
            raise RuntimeError("No more requests")
        ip = self._ips[self._index]
        self._index += 1
        return ip
`;

export default function Question6() {
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

  // P1: Powers of Two
  const validateCodeP1 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p1', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def powersOfTwo']);
    if (!funcDeclared.passed) { setResult('p1', 'failed', 'Define a function named `powersOfTwo`.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p1', 'failed', 'Use a `while` loop inside your function.', code); return; }

    const testCases = [
      { args: [100], expected: null, expectedStdout: ['1', '2', '4', '8', '16', '32', '64'], stdoutStrictOrder: true, restrictedStdout: ['128', '256', '512', '1024'] },
      { args: [10], expected: null, expectedStdout: ['1', '2', '4', '8'], stdoutStrictOrder: true , restrictedStdout: ['16', '32', '64', '128', '256', '512', '1024']},
      { args: [1], expected: null, expectedStdout: [] as string[], restrictedStdout: ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024'] },
      { args: [2], expected: null, expectedStdout: ['1'], stdoutStrictOrder: true, restrictedStdout: ['2', '4', '8', '16', '32', '64', '128', '256', '512', '1024']},
      { args: [0], expected: null, expectedStdout: [] as string[], restrictedStdout: ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024'] },
      { args: [-5], expected: null, expectedStdout: [] as string[], restrictedStdout: ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024'] },
      { args: [17], expected: null, expectedStdout: ['1', '2', '4', '8', '16'], stdoutStrictOrder: true, restrictedStdout: ['32', '64', '128', '256', '512', '1024'] },
      { args: [1024], expected: null, expectedStdout: ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512'], stdoutStrictOrder: true, restrictedStdout: ['1024', '2048', '4096'] },
    ];
    const testResults = await runTestCases(pyodide, 'powersOfTwo', testCases);
    if (!testResults.passed) {
      setResult('p1', 'failed', testResults.message, code);
      return;
    }
    setResult('p1', 'passed', testResults.message, code);
  };

  // P2: SpaceShip takeOff
  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def takeOff']);
    if (!funcDeclared.passed) { setResult('p2', 'failed', 'Define a function named `takeOff`.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p2', 'failed', 'Use a `while` loop inside your function.', code); return; }

    const hasAccelerate = checkRequiredCode(code, ['.accelerate(']);
    if (!hasAccelerate.passed) { setResult('p2', 'failed', 'Call the spaceship\'s `.accelerate()` method inside your loop.', code); return; }

    // Test with various fuel levels
    const fuelLevels = [100, 50, 10, 5, 1, 0, 3, 20];
    for (const fuel of fuelLevels) {
      try {
        const resultJson: string = await pyodide.runPythonAsync(`
import json as _json, sys as _sys, io as _io

_ship = SpaceShip(fuel=${fuel})
_capture = _io.StringIO()
_saved = _sys.stdout
_sys.stdout = _capture
try:
    takeOff(_ship)
finally:
    _sys.stdout = _saved
    _output = _capture.getvalue()

_json.dumps({
    'fuel': _ship.fuel,
    'has_out_of_fuel': 'Out of fuel!' in _output,
    'output': _output,
})
`);
        const parsed = JSON.parse(resultJson);

        if (parsed.has_out_of_fuel) {
          setResult('p2', 'failed', `takeOff(SpaceShip(fuel=${fuel})) printed "Out of fuel!" — your loop should stop before fuel reaches 0.`, code);
          return;
        }
        if (fuel > 0 && parsed.fuel > 0) {
          setResult('p2', 'failed', `takeOff(SpaceShip(fuel=${fuel})) left ${parsed.fuel} fuel remaining — the ship should accelerate until fuel is 0 or less.`, code);
          return;
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        const splitMsg = msg.split('\n'); // Get only the first line of the error for brevity
        const lastLine = splitMsg[splitMsg.length - 2];
        
        setResult('p2', 'failed', `Error testing takeOff with fuel=${fuel}: ${lastLine}`, code);
        return;
      }
    }

    setResult('p2', 'passed', `All 8/8 test cases passed!`, code);
  };

  // P3: Event Loop with break
  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def programLoop']);
    if (!funcDeclared.passed) { setResult('p3', 'failed', 'Define a function named `programLoop`.', code); return; }

    const hasWhileTrue = checkRequiredCode(code, ['while True']);
    if (!hasWhileTrue.passed) { setResult('p3', 'failed', 'Use `while True:` to create an indefinite loop.', code); return; }

    const hasBreak = checkRequiredCode(code, ['break']);
    if (!hasBreak.passed) { setResult('p3', 'failed', 'Use a `break` statement to exit the loop on "escape".', code); return; }

    try {
      await pyodide.runPythonAsync(`
def _testProgramLoop(events):
    ui = UserInput(events)
    programLoop(ui)
`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult('p3', 'failed', `Error setting up test wrapper: ${msg}`, code);
      return;
    }

    const testCases = [
      { args: [["click", "scroll", "escape", "keypress"]], expected: null, expectedStdout: ["click", "scroll", "escape"], stdoutStrictOrder: true, restrictedStdout: ["keypress"] },
      { args: [["escape", "click"]], expected: null, expectedStdout: ["escape"], stdoutStrictOrder: true, restrictedStdout: ["click"] },
      { args: [["keypress", "keypress", "escape"]], expected: null, expectedStdout: ["keypress", "keypress", "escape"], stdoutStrictOrder: true },
      { args: [["click", "escape"]], expected: null, expectedStdout: ["click", "escape"], stdoutStrictOrder: true },
      { args: [["scroll", "scroll", "scroll", "escape", "click"]], expected: null, expectedStdout: ["scroll", "scroll", "scroll", "escape"], stdoutStrictOrder: true, restrictedStdout: ["click"] },
      { args: [["keypress", "click", "scroll", "escape"]], expected: null, expectedStdout: ["keypress", "click", "scroll", "escape"], stdoutStrictOrder: true },
      { args: [["escape"]], expected: null, expectedStdout: ["escape"], stdoutStrictOrder: true },
      { args: [["click", "click", "click", "click", "escape", "scroll"]], expected: null, expectedStdout: ["click", "click", "click", "click", "escape"], stdoutStrictOrder: true, restrictedStdout: ["scroll"] },
    ];

    const testResults = await runTestCases(pyodide, '_testProgramLoop', testCases);
    if (!testResults.passed) {
      setResult('p3', 'failed', testResults.message, code);
      return;
    }
    setResult('p3', 'passed', testResults.message, code);
  };

  // P4: Record Local Requests
  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }

    const funcDeclared = checkRequiredCode(code, ['def recordLocalRequests']);
    if (!funcDeclared.passed) { setResult('p4', 'failed', 'Define a function named `recordLocalRequests`.', code); return; }

    const hasWhile = checkRequiredCode(code, ['while ']);
    if (!hasWhile.passed) { setResult('p4', 'failed', 'Use a `while` loop inside your function.', code); return; }

    // Create a wrapper function for testing
    try {
      await pyodide.runPythonAsync(`
def _testRecordLocal(ips):
    port = WebPort(ips)
    return recordLocalRequests(port)
`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult('p4', 'failed', `Error setting up test wrapper: ${msg}`, code);
      return;
    }

    const testCases = [
      { args: [["72.134.1.34", "10.0.1.5", "192.168.1.1", "10.0.2.3", "10.0.0.67"]], expected: ["10.0.1.5", "10.0.2.3"] },
      { args: [["10.0.0.67"]], expected: [] },
      { args: [["10.0.1.1", "10.0.0.67"]], expected: ["10.0.1.1"] },
      { args: [["192.168.1.1", "72.0.0.1", "10.0.0.67"]], expected: [] },
      { args: [["10.0.5.5", "10.0.6.6", "10.0.7.7", "10.0.0.67", "10.0.8.8"]], expected: ["10.0.5.5", "10.0.6.6", "10.0.7.7"] },
      { args: [["72.1.1.1", "10.0.0.1", "10.0.0.67"]], expected: ["10.0.0.1"] },
      { args: [["10.0.99.99", "192.168.0.1", "10.0.50.50", "72.0.0.1", "10.0.0.67"]], expected: ["10.0.99.99", "10.0.50.50"] },
      { args: [["192.168.1.1", "192.168.1.2", "10.0.0.67"]], expected: [] },
    ];
    const testResults = await runTestCases(pyodide, '_testRecordLocal', testCases);
    if (!testResults.passed) {
      setResult('p4', 'failed', testResults.message, code);
      return;
    }
    setResult('p4', 'passed', testResults.message, code);
  };

  return (
    <>
      <RandomBackground seed={16} density={0.5} />
      <div className="p-6 max-w-4xl mx-auto backdrop-blur bg-white/20 dark:bg-black/20 min-h-[100vh]">
        <AssignmentOverview
          title="Q6 - While Loops"
          description="Use while loops for condition-based iteration."
          objectives={[
            "Calculate powers of two",
            "Looping until a condition is met",
            "Breaking out of loops",
            "Collecting results in a list"
          ]}
        />

        {/* P1: Powers of Two */}
        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Powers of Two" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p1'}
            initialCode={"# powersOfTwo prints all powers of 2 less than maxValue\ndef powersOfTwo(maxValue):\n    # your code here\n"}
            cachedCode={submissionStates[`${questionName}_p1`]?.code}
            initialVDivider={100}
            validationState={validationStates['p1'] || null}
            validationMessage={validationMessages['p1']}
            onCodeStart={() => startCode('p1')}
            onCodeEnd={validateCodeP1}
          >
            <Mechanics>While loops use the syntax <CopyCode code="while condition:" /> and execute the following code block until the condition is false.
            <CodeExample code={`i = 0\nwhile i < 5:\n    print(i)\n    i += 1\n# 0 1 2 3 4`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Create a function that prints all powers of two less than a maximum value:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="powersOfTwo" /> takes the argument <CopyCode code="maxValue" /></li>
                <li>Prints all powers of two less than <CopyCode code="maxValue" />, starting with 1 (2⁰)</li>
              </ul>
            </Objectives>
            <Hints>start with <CopyCode code="n = 1" /> then <CopyCode code="print(n)" /> and multiply n by 2 each loop.</Hints>
            <Hints>use <CopyCode code="while n < maxValue:" /> to stop when n exceeds the max value.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P2: SpaceShip TakeOff */}
        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="TakeOff" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p2'}
            initialCode={"# takeOff accelerates the spaceship until fuel runs out\ndef takeOff(spaceship: SpaceShip):\n    # your code here\n"}
            setupCode={spaceShipSetupCode}
            cachedCode={submissionStates[`${questionName}_p2`]?.code}
            initialVDivider={60}
            validationState={validationStates['p2'] || null}
            validationMessage={validationMessages['p2']}
            onCodeStart={() => startCode('p2')}
            onCodeEnd={validateCodeP2}
          >
            <Mechanics>The <CopyCode code="SpaceShip" /> class is pre-defined in your editor. Use the variable monitor to inspect its methods.
            <CodeExample code={spaceShipSetupCode + `\napollo = SpaceShip()\nprint(apollo.speed)  # 0\nprint(apollo.fuel)   # 100\napollo.accelerate()\nprint(apollo.speed)  # 10\nprint(apollo.fuel)   # 99.0`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Create a function that accelerates a spaceship until it runs out of fuel:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="takeOff" /> takes a <CopyCode code="SpaceShip" /> object as an argument</li>
                <li>Uses a while loop to call the spaceship&apos;s <CopyCode code=".accelerate()" /> method until fuel is 0 or less</li>
                <li>Do not try to accelerate if the ship is out of fuel</li>
              </ul>
            </Objectives>
            <Hints>use <CopyCode code="while spaceship.fuel > 0:" /> to check fuel level.</Hints>
            <Hints>the <CopyCode code="spaceship : SpaceShip" /> tells Python that the spaceship parameter is of type SpaceShip.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P3: Event Loop */}
        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Event Loop" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p3'}
            initialCode={"# programLoop prints events until escape\ndef programLoop(ui : UserInput):\n    # your code here\n"}
            setupCode={userInputSetupCode}
            cachedCode={submissionStates[`${questionName}_p3`]?.code}
            validationState={validationStates['p3'] || null}
            validationMessage={validationMessages['p3']}
            onCodeStart={() => startCode('p3')}
            onCodeEnd={validateCodeP3}
          >
            <Mechanics>The <CopyCode code="UserInput" /> class returns events like &quot;click&quot;, &quot;scroll&quot; and &quot;keypress&quot; with its <CopyCode code=".getEvent()" /> method.
            <CodeExample code={`ui = UserInput(["click", "scroll", "keypress"])\nevent = ui.getEvent()\nprint(event)  # "click"\nevent = ui.getEvent()\nprint(event)  # "scroll"`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Create a function that prints each event, and exits on the &quot;escape&quot; event:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="programLoop" /> takes a <CopyCode code="UserInput" /> object as an argument</li>
                <li>Use a <CopyCode code="while True:" /> loop to loop indefinitely</li>
                <li>Sample the current event with <CopyCode code=".getEvent()" /></li>
                <li>Print every event, up to and <strong>including</strong> the &quot;escape&quot; event, then exit the loop</li>
              </ul>
            </Objectives>
            <Hints>use <CopyCode code='if event == "escape":' /> to check for the escape event and the <CopyCode code="break" /> statement to exit the loop.</Hints>
            <Hints>check if you should break AFTER you print the event</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        {/* P4: Record Local Requests */}
        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Record Local Requests" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart
            isActive={selectedQuestion === 'p4'}
            initialCode={"# recordLocalRequests collects local IPs until 10.0.0.67\ndef recordLocalRequests(port : WebPort):\n    # your code here\n"}
            setupCode={webPortSetupCode}
            cachedCode={submissionStates[`${questionName}_p4`]?.code}
            validationState={validationStates['p4'] || null}
            validationMessage={validationMessages['p4']}
            onCodeStart={() => startCode('p4')}
            onCodeEnd={validateCodeP4}
          >
            <Mechanics>The <CopyCode code="WebPort" /> class represents a web server port listening for incoming requests. Its <CopyCode code=".listen()" /> method returns the source IP.
            <CodeExample code={`print(port.listen())  # "72.134.1.34"\nprint(port.listen())  # "192.168.1.34"\nprint(port.listen())  # "10.0.0.24"`} /></Mechanics>
            <Objectives>
              <p className="mb-2">Record requests from your local network (<CopyCode code="10.0.x.x" />) and stop when signaled by <CopyCode code="10.0.0.67" />:</p>
              <ul className="list-disc list-inside mb-2 space-y-1">
                <li>Function named <CopyCode code="recordLocalRequests" /> takes a <CopyCode code="WebPort" /> object as an argument</li>
                <li>Returns an array of IP addresses starting with <CopyCode code='"10.0"' /> returned by <CopyCode code=".listen()" />, until and <strong>not including</strong> the IP <CopyCode code='"10.0.0.67"' /></li>
              </ul>
            </Objectives>
            <Hints>create an empty list <CopyCode code="localRequests = []" /> and append local requests with the list&apos;s <CopyCode code=".append()" /> method.</Hints>
            <Hints>use the string&apos;s <CopyCode code='.startswith("10.0")' /> method to check if an IP is local.</Hints>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref="q5" nextHref="q7" />
        </div>
      </div>
    </>
  );
}
