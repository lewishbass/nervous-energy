'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getQuestionSubmissionStatus } from './ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import BackToAssignment from './BackToAssignment';
import { CodeBlock } from '@/components/CodeBlock';
import { FaCheckCircle, FaTimesCircle, FaCircle, FaPrint } from 'react-icons/fa';
import './ExerciseOverview.css';
import { copyToClipboard } from '@/scripts/clipboard';
import NextQuestion from './NextQuestion';
import { FaArrowUp } from 'react-icons/fa6';

// ─── Shared Types ────────────────────────────────────────────────────────────

export type PartData = {
  id: string;
  title: string;
  objectives: string[];
  mechanics?: string[];
  hints?: string[];
  codeExamples?: string[];
};

export type QuestionData = {
  id: string;
  title: string;
  description: string;
  parts: PartData[];
};

// ─── Props ───────────────────────────────────────────────────────────────────

type ExerciseOverviewProps = {
  /** Class identifier used for API calls (e.g. 'python-automation') */
  classId: string;
  /** Assignment identifier used for API calls (e.g. 'simple-coding-practice') */
  assignmentId: string;
  /** Absolute path prefix for navigation (e.g. '/classes/python-automation/exercises/simple-coding-practice') */
  assignmentPath: string;
  /** Full question + part data to render */
  questions: QuestionData[];
  /** Page heading shown on the title page */
  title: string;
  /** Subtitle line (e.g. course name) */
  subtitle?: string;
  /** Smaller unit label beneath the subtitle */
  unitLabel?: string;
  /** Logo image src */
  logoSrc?: string;
  /** Where the logo click navigates */
  logoHref?: string;
  /** Seed for the random background */
  backgroundSeed?: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status: string | undefined): string {
  switch (status) {
    case 'passed': return 'text-green-500 dark:text-green-400';
    case 'failed': return 'text-red-500 dark:text-red-400';
    default: return 'tc3';
  }
}

function statusIcon(status: string | undefined) {
  switch (status) {
    case 'passed': return <FaCheckCircle className="text-green-500 dark:text-green-400 inline mr-1.5 mb-1" />;
    case 'failed': return <FaTimesCircle className="text-red-500   dark:text-red-400   inline mr-1.5 mb-1" />;
    default: return       <FaCircle      className="text-gray-400  dark:text-gray-600  inline mr-1.5 mb-1 text-xs" />;
  }
}

function statusBorder(status: string | undefined): string {
  switch (status) {
    case 'passed': return 'border-green-400 dark:border-green-600';
    case 'failed': return 'border-red-400 dark:border-red-600';
    default: return 'border-gray-300 dark:border-gray-700';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExerciseOverview({
  classId,
  assignmentId,
  assignmentPath,
  questions,
  title,
  subtitle,
  unitLabel,
  logoSrc = '/images/classes/Python-logo-notext.svg',
  logoHref = '/classes/python-automation',
  backgroundSeed = 0,
}: ExerciseOverviewProps) {
  const router = useRouter();
  const { isLoggedIn, username, token } = useAuth();
  const [submissionStates, setSubmissionStates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [showMechanics, setShowMechanics] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showCodeExamples, setShowCodeExamples] = useState(false);

  const allPartNames = questions.flatMap(q =>
    q.parts.map(p => `${q.id}_${p.id}`)
  );

  useEffect(() => {
    if (!isLoggedIn || !username || !token) {
      setLoading(false);
      return;
    }
    getQuestionSubmissionStatus(username, token, classId, assignmentId, allPartNames)
      .then(states => {
        setSubmissionStates(states);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isLoggedIn, username, token]);

  const getPartStatus = (qId: string, pId: string): string | undefined => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.resultStatus) return undefined;
    return s.resultStatus;
  };

  const getPartCode = (qId: string, pId: string): string | null => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.code) return null;
    return s.code;
  };

  const getPartMessage = (qId: string, pId: string): string | null => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.resultMessage) return null;
    return s.resultMessage;
  };

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePrint = () => {
    window.print();
  };

  const getQuestionStatus = (q: QuestionData): string | undefined => {
    const partStatuses = q.parts.map(p => getPartStatus(q.id, p.id));
    const allPassed = partStatuses.every(s => s === 'passed');
    const anyFailed = partStatuses.some(s => s === 'failed');
    const anySubmitted = partStatuses.some(s => s !== undefined);
    if (allPassed) return 'passed';
    if (anyFailed) return 'failed';
    if (anySubmitted) return 'in-progress';
    return undefined;
  };

  const handleCopyAllCode = () => {
    let allCode = '';
    questions.forEach((q, qi) => {
      q.parts.forEach((p, pi) => {
        const code = getPartCode(q.id, p.id);
        if (code) {
          allCode += `######## Q${qi} - P${pi} - ${getPartStatus(q.id, p.id)} ########\n${code}\n\n`;
        }
      });
    });
    copyToClipboard(allCode.trim(), 'Copied All Code!');
  };

  return (
    <>
      <div className="print:hidden">
        <RandomBackground seed={backgroundSeed} density={0.5} doAnimation={false} />
      </div>
      <div className="p-6 max-w-4xl mx-auto min-h-screen mb-0 print:p-2 bg-white/40 dark:bg-black/40">

        {/* Header */}
        <div className="mb-8 print:mb-4 print:min-h-[70vh]] header title-page" ref={el => { sectionRefs.current['header'] = el; }}>
          <div className="flex items-center gap-4 mb-4 print:min-h-[50vh]">
            <Image
              src={logoSrc}
              alt="Logo"
              width={80}
              height={80}
              className="rounded-lg cursor-pointer print:hidden"
              onClick={() => router.push(logoHref)}
            />
            <div className="bg-white/40 dark:bg-black/40 rounded-lg">
              <h1 className="text-4xl font-bold tc1 print:text-6xl">{title}</h1>
              {subtitle && <p className="tc2 text-lg mt-2 print:text-3xl">{subtitle}</p>}
              {unitLabel && <p className="tc3 text-sm print:text-xl">{unitLabel}</p>}
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-wrap gap-2 mt-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-lg not-active:bg3 border-2 border-[var(--khr)] bg-slate-100 dark:bg-slate-800 active:bg-[var(--khr)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40 active:text-white active:border-white/30 select-none cursor-pointer"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={handleCopyAllCode}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-lg not-active:bg3 border-2 border-[var(--kho)] bg-slate-100 dark:bg-slate-800 active:bg-[var(--kho)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40 active:text-white active:border-white/30 select-none cursor-pointer"
            >
              Copy All Code
            </button>
            <button
              onClick={() => setShowMechanics(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showMechanics
                ? 'bg-[var(--khg)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khg)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Mechanics
            </button>
            <button
              onClick={() => setShowHints(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showHints
                ? 'bg-[var(--khb)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khb)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Hints
            </button>
            <button
              onClick={() => setShowCodeExamples(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showCodeExamples
                ? 'bg-[var(--khv)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khv)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Code Examples
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="bg1 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-8 print:hidden">
          <h2 className="text-xl font-bold tc1 mb-4 print:text-lg">Questions</h2>
          {loading ? (
            <p className="tc3 animate-pulse">Loading submission status…</p>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-4 print:gap-x-4 print:gap-y-2">
              {questions.map(q => (
                <div key={q.id} className="w-fit">
                  <button
                    onClick={() => scrollTo(q.id)}
                    className={`font-semibold text-left hover:underline ${statusColor(getQuestionStatus(q))} hover:opacity-70 cursor-pointer select-none`}
                  >
                    {statusIcon(getQuestionStatus(q))}
                    {q.title}
                  </button>
                  <div className="ml-6 mt-1 flex flex-wrap gap-x-4 gap-y-1 flex-col items-start w-fit opacity-80">
                    {q.parts.map(p => {
                      const st = getPartStatus(q.id, p.id);
                      return (
                        <button
                          key={`${q.id}_${p.id}`}
                          onClick={() => scrollTo(`${q.id}_${p.id}`)}
                          className={`text-sm hover:underline ${statusColor(st)} hover:opacity-70 cursor-pointer select-none`}
                        >
                          {statusIcon(st)}
                          {p.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 bg1 p-3 rounded-lg print:hidden outline outline-1 outline-gray-300 dark:outline-gray-700">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref={questions[questions.length - 1]?.id || 'overview'} />
        </div>

        {/* Question Sections */}
        {questions.map(q => (
          <div
            key={q.id}
            ref={el => { sectionRefs.current[q.id] = el; }}
            className="mb-10 print:mb-6 scroll-mt-6"
          >
            {/* Question header */}
            <div className="flex items-center gap-3 mb-2 print:mb-0 question-header">
              {statusIcon(getQuestionStatus(q))}
              <h2 className="text-2xl font-bold tc1 print:text-xl cursor-pointer select-none hover:underline hover:opacity-70" onClick={() => router.push(`${assignmentPath}/${q.id}`)}>{q.title}</h2>
              <FaArrowUp className="tc3 cursor-pointer transition-opacity ml-auto hover:opacity-70 active:opacity-40 bg-red w-12 h-12 p-3 print:hidden" onClick={() => scrollTo('header')} />
            </div>
            <p className="tc2 mb-4 print:mb-0 print:text-sm">{q.description}</p>

            {/* Parts */}
            {q.parts.map(p => {
              const partKey = `${q.id}_${p.id}`;
              const st = getPartStatus(q.id, p.id);
              const code = getPartCode(q.id, p.id);
              const message = getPartMessage(q.id, p.id);

              return (
                <div
                  key={partKey}
                  ref={el => { sectionRefs.current[partKey] = el; }}
                  className={`bg2 rounded-lg overflow-hidden p-0 shadow-sm print:shadow-none border-l-4 print:border-none mb-4 scroll-mt-6 question-part print:mb-0 ${statusBorder(st)}`}
                >
                  <div className="p-3 pb-0">
                    {/* Part title */}
                    <button
                      onClick={() => router.push(`${assignmentPath}/${q.id}`)}
                      className={`select-none cursor-pointer text-lg font-semibold hover:underline hover:opacity-70 mb-2 text-left ${statusColor(st)} print:text-base`}
                    >
                      {statusIcon(st)}
                      {p.id.toUpperCase()}: {p.title}
                    </button>

                    {/* Objectives */}
                    {p.objectives.length > 0 && (
                      <ul className="ml-4 list-inside mb-1">
                        {p.objectives.map((obj, i) => (
                          <li key={i} className="tc2 text-sm print:text-xs">{obj}</li>
                        ))}
                      </ul>
                    )}

                    {/* Mechanics */}
                    {showMechanics && p.mechanics && p.mechanics.length > 0 && (
                      <div className="mb-1 ml-4">
                        {p.mechanics.map((m, i) => (
                          <p key={i} className="tc3 text-sm italic print:text-xs">{m}</p>
                        ))}
                      </div>
                    )}

                    {/* Hints */}
                    {showHints && p.hints && p.hints.length > 0 && (
                      <div className="mb-1 ml-4">
                        {p.hints.map((h, i) => (
                          <p key={i} className="text-fuchsia-600 dark:text-fuchsia-400 text-sm print:text-xs">{h}</p>
                        ))}
                      </div>
                    )}

                    {/* Code examples */}
                    {showCodeExamples && p.codeExamples && p.codeExamples.length > 0 && (
                      <div className="mb-1">
                        {p.codeExamples.map((c, i) => (
                          <CodeBlock key={i} code={c} language="python" compact className="mb-1 text-sm" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submitted code */}
                  {code ? (
                    <div className="mt-1.5 px-8 border-t-4 print:border-none bg-white/40 dark:bg-gray-800/30 border-gray-500/20 pb-3 pt-2 print:pb-0">
                      <p className={`text-xs font-semibold mb-1 ${st === 'passed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {st === 'passed' ? '✓ ' : '✗ '}{message}
                      </p>
                      <CodeBlock code={code} language="python" className="" />
                    </div>
                  ) : (
                    <p className="tc3 text-xs italic mt-2 print:text-xs p-3">No submission yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        <div className="mb-6 flex items-center justify-between gap-4 bg1 p-3 rounded-lg print:hidden outline outline-1 outline-gray-300 dark:outline-gray-700">
          <BackToAssignment assignmentPath={assignmentPath} />
          <NextQuestion assignmentPath={assignmentPath} prevHref={questions[questions.length - 1]?.id || 'overview'} />
        </div>
      </div>
    </>
  );
}
