// ExerciseUtils.tsx

import { JSX } from 'react';
import {
  FaCloud,
  FaCloudArrowUp,
  FaCloudArrowDown,
} from 'react-icons/fa6';

/**
 * Infers the Python type from a repr string
 */
const inferPythonType = (repr: string): string => {
  const trimmed = repr.trim();
  if (trimmed === 'True' || trimmed === 'False') return 'bool';
  if (trimmed === 'None') return 'NoneType';
  if (trimmed.startsWith("'") || trimmed.startsWith('"')) return 'str';
  if (trimmed.startsWith('[')) return 'list';
  if (trimmed.includes('.') && !isNaN(Number(trimmed))) return 'float';
  if (!isNaN(Number(trimmed)) && trimmed !== '') return 'int';
  return 'str';
};

/**
 * Splits a Python list repr into its top-level element strings,
 * handling nested lists, tuples, and quoted strings with commas.
 */
const splitPythonListElements = (inner: string): string[] => {
  const elements: string[] = [];
  let depth = 0;
  let inStr = false;
  let strChar = '';
  let current = '';

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];

    if (inStr) {
      current += ch;
      if (ch === strChar && inner[i - 1] !== '\\') inStr = false;
    } else if (ch === "'" || ch === '"') {
      inStr = true;
      strChar = ch;
      current += ch;
    } else if (ch === '[' || ch === '(' || ch === '{') {
      depth++;
      current += ch;
    } else if (ch === ']' || ch === ')' || ch === '}') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      elements.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  if (current.trim() !== '') elements.push(current.trim());
  return elements;
};

/**
 * De-repr converts repr strings to their original form based on type
 * @param value - The repr string value from Python
 * @param type - The Python type (int, str, bool, float, list, etc.)
 * @returns The de-repr'd value
 */
export const deRepr = (value: string, type: string): any => {
  switch (type) {
    case 'int':
      return parseInt(value);
    case 'float':
      return parseFloat(value);
    case 'bool':
      return value === 'True';
    case 'str':
      if ((value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))) {
        return value.slice(1, -1);
      }
      return value;
    case 'NoneType':
      return null;
    case 'list': {
      const trimmed = value.trim();
      if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return value;
      const inner = trimmed.slice(1, -1).trim();
      if (inner === '') return [];
      const elements = splitPythonListElements(inner);
      return elements.map(el => deRepr(el, inferPythonType(el)));
    }
    default:
      return value;
  }
};

/**
 * Validate variable checks if a variable exists, has the correct type, and optionally the correct value
 * @param vars - The variables object from Python execution
 * @param name - The variable name to check
 * @param expectedType - The expected Python type
 * @param expectedValue - Optional expected value (already de-repr'd)
 * @returns Object with passed boolean and message string
 */
export const validateVariable = (
  vars: Record<string, any>,
  name: string,
  expectedType: string,
  expectedValue?: any
): {passed: boolean, message: string} => {
  if (!vars[name]) {
    return {passed: false, message: `Variable "${name}" not found.`};
  }

  if (vars[name].type !== expectedType) {
    return {passed: false, message: `Variable "${name}" is of type ${vars[name].type}, expected '${expectedType}'.`};
  }

  if (expectedValue !== undefined) {
    const actualValue = deRepr(vars[name].value, vars[name].type);

    if (expectedType === 'list') {
      const actual: any[] = actualValue;
      const expected: any[] = expectedValue;

      if (actual.length !== expected.length) {
        return {
          passed: false,
          message: `Variable "${name}" has length ${actual.length}, expected ${expected.length}.`
        };
      }

      const wrongIndices: string[] = [];
      for (let i = 0; i < expected.length; i++) {
        if (actual[i] !== expected[i]) {
          wrongIndices.push(`[${i}]: got ${JSON.stringify(actual[i])}, expected ${JSON.stringify(expected[i])}`);
          if (wrongIndices.length === 10) break;
        }
      }

      // check if there are more wrong indices beyond the 10 we collected
      let extra = 0;
      if (wrongIndices.length === 10) {
        for (let i = wrongIndices.length; i < expected.length; i++) {
          if (actual[i] !== expected[i]) extra++;
        }
      }

      if (wrongIndices.length > 0) {
        const summary = wrongIndices.join(', ') + (extra > 0 ? `, ...` : '');
        return {passed: false, message: `Variable "${name}" has incorrect values at indices: ${summary}`};
      }

      return {passed: true, message: `Variable "${name}" is correctly assigned.`};
    }

    if (actualValue !== expectedValue) {
      return {passed: false, message: `Variable "${name}" has value ${actualValue}, expected ${expectedValue}.`};
    }
  }

  return {passed: true, message: `Variable "${name}" is correctly assigned.`};
};

/**
 * Checks tha, FaCheckCircle, FaXmarkCirclet all required code snippets are present in the submitted code
 * @param code - The submitted code string
 * @param required - Array of required snippets
 * @returns Object with passed boolean and message string
 */
export const checkRequiredCode = (
  code: string,
  required: string[]
): { passed: boolean; message: string } => {
  for (const snippet of required) {
    if (!code.includes(snippet)) {
      return { passed: false, message: `Your code must use "${snippet}".` };
    }
  }
  return { passed: true, message: '' };
};


/**
 * Checks a provided error string against an optionally expected message and
 * produces a result indicating whether the validation passed along with a
 * human‑readable message.
 *
 * @param error - The error text returned by the operation, or `null` if no
 *   error occurred.
 * @param expectedMessage - An optional substring that should be present in the
 *   error message. When supplied, the function will assert that `error`
 *   contains this text.
 * @returns An object containing:
 *   - `passed`: `true` if the validation succeeded, otherwise `false`.
 *   - `message`: A description of the outcome; either confirmation that the
 *     correct error was raised, that no error was expected/raised, or the
 *     last line of the actual error when it didn’t match expectations.
 */
export const validateError = (
  error: string | null,
  expectedMessage: string | null = null
): { passed: boolean; message: string } => {
  if (expectedMessage) {
    if (error && error.includes(expectedMessage)) {
      return { passed: true, message: 'Correct error was raised.' };
    }
    if (!error) {
      return { passed: false, message: `Expected the error "${expectedMessage}", but no error was raised.` };
    }
  }
  if(!error){
    return { passed: true, message: 'No error was raised, as expected.' };
  }
  const lastLine = error.trim().split('\n').slice(-1)[0];
  return { passed: false, message: `${lastLine}` };
};

/**
 * Creates and animates a particle element at the given position with the
 * specified velocity, lifetime, and color. The particle is appended to the
 * document body and automatically removed after its lifetime expires.
 *
 * @param position - The initial coordinates of the particle ({ x, y } in pixels).
 * @param velocity - The velocity vector ({ x, y } in pixels per second) used to
 *   compute the translation over the lifetime.
 * @param lifetime - How long the particle should exist, in milliseconds.
 * @param color - Base CSS color string for the particle; a transparency suffix
 *   is added internally.
 */
export const spawnParticle = (position: { x: number; y: number }, velocity: { x: number; y: number }, lifetime:number, color: string) => {
  
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = `${position.x}px`;
  particle.style.top = `${position.y}px`;
  particle.style.backgroundColor = color + `80`; // add random transparency
  particle.style.width = '6px';
  particle.style.height = '6px';
  particle.style.animationDuration = `${lifetime}ms`;
  particle.style.setProperty('--dx', `${velocity.x * lifetime / 1000}px`);
  particle.style.setProperty('--dy', `${velocity.y * lifetime / 1000}px`);
  document.body.appendChild(particle);
  setTimeout(() => {
    particle.remove();
  }, lifetime);
}

export const spawnParticlesAroundBox = (box: HTMLElement, color: string, n: number = 20) => {
  // spawns particles around edge of box
  const rect = box.getBoundingClientRect();
  console.log('Spawning particles around box at', rect);
  for (let i = 0; i < n; i++) {
    const edge = Math.floor(Math.random() * 4);
    let position = { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    if (edge == 0 || edge == 2) { // top or bottom
      x = rect.left + Math.random() * rect.width;
      y = edge == 0 ? rect.top : rect.bottom;
    } else { // left or right
      x = edge == 1 ? rect.left : rect.right;
      y = rect.top + Math.random() * rect.height;
    }
    position = { x, y };
    const angle = Math.random() * 2 * Math.PI;
    const speed = 20 + Math.random() * 10;
    const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    spawnParticle(position, velocity, (Math.random()**2)*1000+1000, color);
  }
};
const SUBMIT_ROUTE = '/.netlify/functions/classwork';

/**
 * Submits a question's code and result to the backend API.
 *
 * @param username - The user's username.
 * @param token - Authentication token for the user.
 * @param code - The code that is being submitted.
 * @param className - The class to which the submission belongs.
 * @param assignmentName - The name of the assignment.
 * @param questionName - The name of the question.
 * @param resultStatus - Status of the result (e.g. `'passed'`, `'failed'`).
 * @param resultMessage - Message associated with the result.
 * @returns A promise that resolves to an object containing:
 *   - `submissionState`: `'submitted'` on success or `'error'` on failure.
 *   - `message`: A human‑readable description of the outcome.
 */
export const submitQuestionToBackend = async (username:string, token:string, code: string, className: string, assignmentName: string, questionName: string, resultStatus: string, resultMessage: string) : Promise<{ submissionState: string; message: string }> => {
  if (!token) return { submissionState: 'error', message: 'Missing user token' };
  if (!username) return { submissionState: 'error', message: 'Missing username' };
  try{
    const response = await fetch(SUBMIT_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit_partial',
        username,
        token,
        className,
        assignmentName,
        questionName,
        submissionData: {
          code,
          resultStatus,
          resultMessage
        }
      }),
    })
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit your answer. Please try again.');
    }
    else{
      return { submissionState: 'submitted', message: 'Your answer was submitted successfully!' };
    }
  }catch (error){
    return { submissionState: 'error', message: error instanceof Error ? error.message : 'An error occurred while submitting your answer.' };
  }
  
};

/**
 * Retrieves the submission status for one or more questions in a given class
 * and assignment for a specific user.
 *
 * @param username - The username of the student.
 * @param token - Authentication token for the user.
 * @param className - The name of the class.
 * @param assignmentName - The name of the assignment.
 * @param questionNames - An array of question identifiers to query.
 *
 * @returns A promise that resolves to an object containing:
 *   - `submissionStates`: a record mapping each question name to its
 *     corresponding submission state (or an empty object if none).
 *   - `message`: a string describing the result of the operation.
 *   - `previousSubmissionData` (optional): any data from a prior submission.
 *
 */
export const getQuestionSubmissionStatus = async (username:string, token:string, className: string, assignmentName: string, questionNames: string[]) : Promise<  Record<string, any>> => {
  if (!token) return {};
  if (!username) return  {};
  try{
    const response = await fetch(SUBMIT_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get_partial_submission',
        username,
        token,
        className,
        assignmentName,
        questionNames
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to retrieve your submission status. Please try again.');
    }
    const data = await response.json();
    return data.submissionStates || {};
  }catch (error){
    return {};
  }
}

type CloudIndicatorProps = {
  state: 'downloading' | 'uploading' | 'idle' | 'correct' | 'incorrect';
}
export const CloudIndicator = ({state}: CloudIndicatorProps): JSX.Element => {
  // downloading - yellow cloud arrow down
  // uploading - blue cloud arrow up
  // idle - gray cloud
  // correct - green cloud
  // incorrect - red cloud
  const className = "text-2xl";
  return (
    <div style={{position: 'relative', width: '24px', height: '24px'}}>
      {state === 'downloading' && <FaCloudArrowDown className={className} style={{color: '#facc15', animation: 'bounce 2s infinite'}} />}
      {state === 'uploading' && <FaCloudArrowUp className={className} style={{color: '#3b82f6', animation: 'bounce 2s infinite'}} />}
      {state === 'idle' && <FaCloud className={className} style={{color: '#9ca3af30'}} />}
      {state === 'correct' && <FaCloud className={className} style={{color: '#10b981'}} />}
      {state === 'incorrect' && <FaCloud className={className} style={{color: '#ef4444'}} />}
    </div>
  );
};

export const sanitizeSubmissionState = (state: any) : 'downloading' | 'uploading' | 'idle' | 'correct' | 'incorrect' => {
  if(state === null || state === 'idle' || state === undefined) return 'idle';
  if(state === 'downloading' || state === 'uploading' )return state;
  if(state.resultStatus){
    if(state.resultStatus === 'passed') return 'correct';
    if(state.resultStatus === 'failed') return 'incorrect';
  }
  return 'idle';
}