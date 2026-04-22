'use client';

import React, { useState } from 'react';
import '../lecture.css';

/* ─── Types ─── */

export interface DerivationStep {
  /** Short label shown in the header, e.g. "Step 1 — Apply limit definition" */
  label: string;
  /** Content rendered inside the step card (MathJax, text, etc.) */
  content: React.ReactNode;
}

export interface DerivationExample {
  /** Title shown in the card header, e.g. "f(x) = x²" */
  title: string;
  /** One-line prompt shown above the steps, e.g. "Find d/dx[x²]" */
  prompt?: React.ReactNode;
  /** Accent color family: 'indigo' | 'violet' | 'amber' | 'emerald' */
  color?: 'indigo' | 'violet' | 'amber' | 'emerald';
  steps: DerivationStep[];
}

export interface DerivationStepsProps {
  /** One or more derivation examples rendered side-by-side */
  examples: DerivationExample[];
  /** Passed down from parent lecture for slideshow scaling */
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
}

/* ─── Color palettes ─── */

const PALETTES = {
  indigo: {
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    headerBg: 'bg-indigo-500/20',
    headerBorder: 'border-indigo-500/30',
    label: 'text-indigo-400',
    stepBorder: 'border-indigo-400/25',
    stepBg: 'bg-indigo-500/10 hover:bg-indigo-500/20',
    stepBgRevealed: 'bg-indigo-500/20',
    blurColor: 'bg-indigo-400/10',
    revealLabel: 'text-indigo-400/60',
    revealLabelHover: 'group-hover:text-indigo-400',
  },
  violet: {
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    headerBg: 'bg-violet-500/20',
    headerBorder: 'border-violet-500/30',
    label: 'text-violet-400',
    stepBorder: 'border-violet-400/25',
    stepBg: 'bg-violet-500/10 hover:bg-violet-500/20',
    stepBgRevealed: 'bg-violet-500/20',
    blurColor: 'bg-violet-400/10',
    revealLabel: 'text-violet-400/60',
    revealLabelHover: 'group-hover:text-violet-400',
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    headerBg: 'bg-amber-500/20',
    headerBorder: 'border-amber-500/30',
    label: 'text-amber-400',
    stepBorder: 'border-amber-400/25',
    stepBg: 'bg-amber-500/10 hover:bg-amber-500/20',
    stepBgRevealed: 'bg-amber-500/20',
    blurColor: 'bg-amber-400/10',
    revealLabel: 'text-amber-400/60',
    revealLabelHover: 'group-hover:text-amber-400',
  },
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    headerBg: 'bg-emerald-500/20',
    headerBorder: 'border-emerald-500/30',
    label: 'text-emerald-400',
    stepBorder: 'border-emerald-400/25',
    stepBg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    stepBgRevealed: 'bg-emerald-500/20',
    blurColor: 'bg-emerald-400/10',
    revealLabel: 'text-emerald-400/60',
    revealLabelHover: 'group-hover:text-emerald-400',
  },
} as const;

/* ─── Single example card ─── */

interface ExampleCardProps {
  example: DerivationExample;
  /** Global step offset so step indices are unique across multiple examples */
  stepOffset: number;
  revealed: Set<number>;
  onToggle: (index: number) => void;
  displayMode: 'scrollable' | 'slideshow';
}

function ExampleCard({ example, stepOffset, revealed, onToggle, displayMode }: ExampleCardProps) {
  const pal = PALETTES[example.color ?? 'indigo'];
  const fs = displayMode === 'slideshow' ? 'text-[1.1vw]' : 'text-sm';
  const titleFs = displayMode === 'slideshow' ? 'text-[0.75vw]' : 'text-xs';

  return (
    <div className={`rounded-xl border ${pal.border} ${pal.bg} overflow-hidden flex flex-col`}>
      {/* Header */}
      <div className={`px-4 py-2 ${pal.headerBg} border-b ${pal.headerBorder}`}>
        <span className={`${pal.label} ${titleFs} font-bold uppercase tracking-wider`}>{example.title}</span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Prompt */}
        {example.prompt && (
          <p className={`tc2 ${fs} mb-1`}>{example.prompt}</p>
        )}

        {/* Steps */}
        <div className="flex flex-col gap-2">
          {example.steps.map((step, si) => {
            const globalIdx = stepOffset + si;
            const isRevealed = revealed.has(globalIdx);

            return (
              <button
                key={si}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(globalIdx); }}
                className={`
                  group relative w-full text-left rounded-lg border ${pal.stepBorder}
                  ${isRevealed ? pal.stepBgRevealed : pal.stepBg}
                  transition-all duration-200 cursor-pointer overflow-hidden
                `}
              >
                {/* Step label */}
                <div className={`px-3 pt-2 pb-1 ${titleFs} font-semibold uppercase tracking-wider opacity-60 ${pal.label} flex items-center justify-between`}>
                  <span>{step.label}</span>
                  
                </div>

                {/* Content — blurred until revealed */}
                <div className="relative px-3 pb-3">
                  <div
                    className={`tc2 transition-all duration-300 select-none ${isRevealed ? '' : 'blur-[5px] pointer-events-none'}`}
                    aria-hidden={!isRevealed}
                  >
                    {step.content}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */

function DerivationSteps({ examples, displayMode = 'scrollable', className = '' }: DerivationStepsProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Compute per-example step offsets so global indices never collide
  const offsets: number[] = [];
  let running = 0;
  for (const ex of examples) {
    offsets.push(running);
    running += ex.steps.length;
  }

  const cols = examples.length===1? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className={`grid ${cols} gap-3 my-4 ${className}`.trim()}>
      {examples.map((ex, i) => (
        <ExampleCard
          key={i}
          example={ex}
          stepOffset={offsets[i]}
          revealed={revealed}
          onToggle={toggle}
          displayMode={displayMode}
        />
      ))}
    </div>
  );
}

export { DerivationSteps };
export default DerivationSteps;
