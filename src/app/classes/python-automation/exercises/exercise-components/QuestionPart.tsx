'use client';
import { ReactNode, useEffect, useState } from 'react';
import PythonIde from '@/components/coding/PythonIde';
import { CodeBlock } from '@/components/CodeBlock';
import { FaAngleDown, FaX } from 'react-icons/fa6';

export function Mechanics({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-800/30 rounded border-l-4 border-amber-600 dark:border-amber-400">
      <p className="text-amber-900 dark:text-amber-100">{children}</p>
    </div>
  );
}

export function CodeExample({ code, language = 'python' }: { code: string; language?: string }) {
  return (
    <div className="mx-8 mb-2">
      <CodeBlock compact code={code} language={language} className="my-4" />
    </div>
);
}

export function Objectives({ children }: { children: ReactNode }) {
	return (
		<div className="mb-4">
			
			<h3 className="text-xl font-bold tc1 mb-2">Objectives</h3>
			<div className="pl-5 relative tc2">
				<div className="absolute w-1 h-full left-0.25 rounded-full bg-blue-500 dark:bg-blue-400"/>
				{children}
			</div>
		</div>
	);
}

export function Hints({ children }: { children: ReactNode }) {
	const [revealed, setRevealed] = useState<boolean>(false);
	return (
		<div className="mb-2">
			<button
				onClick={() => setRevealed(!revealed)}
				className="group cursor-pointer select-none flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400 font-semibold hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors"
			>
				<span><FaAngleDown className={`transition-all duration-300  ${!revealed ? '-rotate-90 group-hover:-rotate-70' : ''}`}/></span>
				Hint
			</button>
			{revealed && (
				<div className="mt-2 p-3 bg-fuchsia-50 dark:bg-fuchsia-950 rounded border-l-4 border-fuchsia-600 dark:border-fuchsia-400 text-fuchsia-900 dark:text-fuchsia-100">
					{children}
				</div>
			)}
		</div>
	);
}

interface QuestionPartProps {
  isActive: boolean;
  initialCode: string;
  setupCode?: string;
  cachedCode?: string;
  initialVDivider?: number;
  initialHDivider?: number;
  validationState: 'passed' | 'failed' | 'pending' | null;
  validationMessage?: string;
  onCodeStart: () => void;
  onCodeEnd: (code: string, pyodide: any, error: string | null, vars: Record<string, any>, stdout: string | null) => void;
  children?: ReactNode;
}

export default function QuestionPart({
  isActive,
  initialCode,
  setupCode,
  cachedCode,
  initialVDivider = 100,
  initialHDivider = 60,
  validationState,
  validationMessage,
  onCodeStart,
  onCodeEnd,
  children,
}: QuestionPartProps) {
  const [hideValidation, setHideValidation] = useState<boolean>(false);
  useEffect(() => {
    setHideValidation(false);
  }, [validationState]);

  return (
    <>
      {children}

      <div className={` relative pt-3 w-full rounded-lg overflow-hidden ${isActive ? 'h-[500px]' : 'h-0'}`}>
        {isActive && (
          <PythonIde
            initialCode={initialCode}
            setupCode={setupCode}
            initialDocumentName="test.py"
            initialShowLineNumbers={false}
            initialIsCompact={true}
            initialVDivider={initialVDivider}
            initialHDivider={initialHDivider}
            initialPersistentExec={false}
            onCodeEndCallback={onCodeEnd}
            onCodeStartCallback={onCodeStart}
            cachedCode={cachedCode}
          />
        )}

        <div className="absolute bottom-4 z-200 w-[calc(100%-2rem)] mx-4 overflow-hidden" style={{ pointerEvents: !validationState || validationState === 'pending' || hideValidation ? 'none' : 'auto' }}>
          <div className={`flex items-center p-3 rounded transition-all duration-300 ${isActive ? '' : 'hidden'} ${
            !validationState || validationState === 'pending' || hideValidation
              ? 'translate-y-full opacity-0 pointer-events-none'
              : validationState === 'failed'
              ? 'bg-red-100 text-red-800 translate-y-0'
              : 'bg-green-100 text-green-800 translate-y-0'
          }`}>
            <span className="font-medium">{validationMessage || '\u00A0'}</span>
            <FaX className="inline ml-auto cursor-pointer opacity-50 hover:opacity-80 active:opacity-30 transition-opacity duration-300" onMouseUp={() => setHideValidation(true)} />
          </div>
        </div>
      </div>

      
    </>
  );
}