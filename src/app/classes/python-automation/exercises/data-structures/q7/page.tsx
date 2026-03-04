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
const questionName = 'q7';
const questionParts = ['p1', 'p2', 'p3', 'p4'];

export default function Question7() {
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
          title="Q7 - Hash Tables"
          description="Implement a hash table with basic collision handling and key-value lookups."
          objectives={[
            'Understand how a hash function maps keys to indices',
            'Implement a simple hash table using a list',
            'Handle collisions using chaining or open addressing',
            'Implement get, set, and delete operations',
          ]}
        />

        <QuestionBorderAnimation validationState={validationStates['p1'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p1' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 1" partName="p1" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p1'} initialCode={'# Your code here'} cachedCode={submissionStates[`${questionName}_p1`]?.code} initialVDivider={100} validationState={validationStates['p1'] || null} validationMessage={validationMessages['p1']} onCodeStart={() => startCode('p1')} onCodeEnd={validateCodeP1}>
            <Mechanics>TODO: Add mechanics for Part 1.</Mechanics>
            <Objectives>TODO: Add objectives for Part 1.</Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p2'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p2' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 2" partName="p2" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p2'} initialCode={'# Your code here'} cachedCode={submissionStates[`${questionName}_p2`]?.code} initialVDivider={100} validationState={validationStates['p2'] || null} validationMessage={validationMessages['p2']} onCodeStart={() => startCode('p2')} onCodeEnd={validateCodeP2}>
            <Mechanics>TODO: Add mechanics for Part 2.</Mechanics>
            <Objectives>TODO: Add objectives for Part 2.</Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p3'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p3' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 3" partName="p3" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p3'} initialCode={'# Your code here'} cachedCode={submissionStates[`${questionName}_p3`]?.code} initialVDivider={100} validationState={validationStates['p3'] || null} validationMessage={validationMessages['p3']} onCodeStart={() => startCode('p3')} onCodeEnd={validateCodeP3}>
            <Mechanics>TODO: Add mechanics for Part 3.</Mechanics>
            <Objectives>TODO: Add objectives for Part 3.</Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>
        <div className="h-4"></div>

        <QuestionBorderAnimation validationState={validationStates['p4'] || null} className="bg1 rounded-lg p-8 shadow-sm overflow-hidden" style={{ maxHeight: selectedQuestion === 'p4' ? 'fit-content' : '110px' }}>
          <QuestionHeader title="Part 4" partName="p4" questionName={questionName} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} submissionStates={submissionStates} validationStates={validationStates} />
          <QuestionPart isActive={selectedQuestion === 'p4'} initialCode={'# Your code here'} cachedCode={submissionStates[`${questionName}_p4`]?.code} initialVDivider={100} validationState={validationStates['p4'] || null} validationMessage={validationMessages['p4']} onCodeStart={() => startCode('p4')} onCodeEnd={validateCodeP4}>
            <Mechanics>TODO: Add mechanics for Part 4.</Mechanics>
            <Objectives>TODO: Add objectives for Part 4.</Objectives>
          </QuestionPart>
        </QuestionBorderAnimation>

        <div className="mt-6 flex items-center justify-between gap-4">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} nextHref="q8" prevHref="q6" />
        </div>
      </div>
    </>
  );
}
