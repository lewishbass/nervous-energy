'use client';
import AssignmentOverview from '../../exercise-components/AssignmentOverview';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import NextQuestion from '../../exercise-components/NextQuestion';
import QuestionBorderAnimation from '../../exercise-components/QuestionBorderAnimation';
import QuestionHeader from '../../exercise-components/QuestionHeader';
import QuestionPart, { Mechanics, Objectives } from '../../exercise-components/QuestionPart';
import { useEffect, useState } from 'react';
import { validateError, createSetResult, getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
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
    setResult('p1', 'passed', 'Part 1 complete!', code);
  };

  const validateCodeP2 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p2', 'failed', err.message, code); return; }
    setResult('p2', 'passed', 'Part 2 complete!', code);
  };

  const validateCodeP3 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p3', 'failed', err.message, code); return; }
    setResult('p3', 'passed', 'Part 3 complete!', code);
  };

  const validateCodeP4 = async (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => {
    const err = validateError(error);
    if (!err.passed) { setResult('p4', 'failed', err.message, code); return; }
    setResult('p4', 'passed', 'Part 4 complete!', code);
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
            'Iterate over dictionary keys and values',
            'Use dictionaries to solve practical problems',
          ]}
        />

        {(['p1', 'p2', 'p3', 'p4'] as const).map((part, i) => {
          const validators = [validateCodeP1, validateCodeP2, validateCodeP3, validateCodeP4];
          return (
            <div key={part}>
              <QuestionBorderAnimation validationState={validationStates[part] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === part ? 'fit-content' : '110px' }}>
                <QuestionHeader title={`Part ${i + 1}`} partName={part} questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
                <QuestionPart
                  isActive={selectedQuestion === part}
                  initialCode={'# Your code here'}
                  cachedCode={submissionStates[`${questionName}_${part}`]?.code}
                  initialVDivider={100}
                  validationState={validationStates[part] || null}
                  validationMessage={validationMessages[part]}
                  onCodeStart={() => startCode(part)}
                  onCodeEnd={validators[i]}
                >
                  <Mechanics>TODO: Add mechanics for Part {i + 1}.</Mechanics>
                  <Objectives>TODO: Add objectives for Part {i + 1}.</Objectives>
                </QuestionPart>
              </QuestionBorderAnimation>
              <div className="h-4"></div>
            </div>
          );
        })}

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q3" prevHref="q1" />
        </div>
      </div>
    </>
  );
}
