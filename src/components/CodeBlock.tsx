'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Prism from 'prismjs';
import { copyToClipboard } from '@/scripts/clipboard';
import '@/styles/code.css';


import 'prism-themes/themes/prism-one-dark.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

interface CodeBlockProps {
		code: string;
		language?: string;
		caption?: string;
		className?: string;
		style?: React.CSSProperties;
		filename?: string;
		compact?: boolean;
		highlightLine?: number | number[] | null;
		onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
		onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
		onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function CodeBlock({ code, language = 'python', caption, className = '', style = {}, filename, compact = false, highlightLine = -1, onMouseEnter, onMouseLeave, onClick }: CodeBlockProps) {
	const codeRef = useRef<HTMLElement>(null);
	const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

		useEffect(() => {
			if (codeRef.current) {
				codeRef.current.textContent = code;
				Prism.highlightElement(codeRef.current);

				if (highlightLine !== undefined) {
					if (highlightTimeoutRef.current) {
						clearTimeout(highlightTimeoutRef.current);
					}
					highlightTimeoutRef.current = setTimeout(() => {
						if (!codeRef.current) return;
						const highlightLines = Array.isArray(highlightLine) ? highlightLine : [highlightLine];
						const lines = codeRef.current.innerHTML.split('\n');
						codeRef.current.innerHTML = lines.map((line, i) => {
							if (highlightLines.includes(i + 1)) {
								return `<span class="highlighted-line">${line}</span mark>`;
							}
							return line;
						}).join('\n').replace(/<\/span mark>\n/g, '</span>');
					}, 10);
				}
			}
		}, [code, language, highlightLine]);

		const handleCopy = () => {
			copyToClipboard(code, 'Code copied!');
		};

		// Get display name for language
		const getLanguageDisplayName = (lang: string) => {
			const languageMap: { [key: string]: string } = {
				'jupyter': 'Jupyter',
				'python': 'Python',
				'javascript': 'JavaScript',
				'typescript': 'TypeScript',
				'jsx': 'JSX',
				'tsx': 'TSX',
				'css': 'CSS',
				'html': 'HTML',
				'json': 'JSON',
				'bash': 'Bash',
				'powershell': 'PowerShell',
				'cpp': 'C++',
				'c': 'C',
				'java': 'Java',
			};
			return languageMap[lang.toLowerCase()] || lang.toUpperCase();
		};

	// get highlight language
	const getLanguageHighlight = (lang: string) => {
		const languageMap: { [key: string]: string } = {
			'jupyter': 'python'
		};
		return languageMap[lang.toLowerCase()] || lang.toLowerCase();
	}

		return (
			<div
				className={`flex flex-col justify-center items-center mb-3 ${className}`}
				style={style}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onClick={onClick}
			>
				<div className="relative rounded-md overflow-hidden max-w-[80vw] w-full" style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)' }}>
					<div className="code-block-header" onClick={handleCopy}>
						<button
							className="copy-code-button"
							aria-label="Copy code"
							title="Copy code"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
						</button>
						<div className="code-language-label">
							{getLanguageDisplayName(language)}
						</div>
					</div>
					
					<pre className={`mini-scroll code-block ${!compact ? 'line-numbers' : ''} ${compact ? 'compact' : ''} language-${getLanguageHighlight(language)}`} data-language={getLanguageHighlight(language)}>
						{filename && (
							<div className="code-filename">
								{filename}
							</div>
						)}
						<code ref={codeRef} className={`language-${getLanguageHighlight(language)}`}>
							{code}
						</code>
					</pre>
				</div>
				{caption && (
					<div className="text-center tc3">
						{caption}
					</div>
				)}
			</div>
		);
}

interface AnimatedCodeBlockProps {
	code: string;
	language?: string;
	caption?: string;
	className?: string;
	style?: React.CSSProperties;
	filename?: string;
	compact?: boolean;
	/** Ordered sequence of 1-indexed line numbers to cycle through */
	lines: number[];
	/** 'onHover' — animates continuously while hovered; 'onClick' — advances one line per click */
	scrollMode?: 'onHover' | 'onClick';
	/** Delay in ms between line advances in onHover mode (default 700) */
	interval?: number;
}

export function AnimatedCodeBlock({
	code,
	language = 'python',
	caption,
	className = '',
	style = {},
	filename,
	compact = false,
	lines,
	scrollMode = 'onHover',
	interval = 700,
}: AnimatedCodeBlockProps) {
	const [highlightLine, setHighlightLine] = useState<number | null>(null);
	const idxRef = useRef<number>(-1);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const activeRef = useRef(false);

	const advance = useCallback(() => {
		if (lines.length === 0) return;
		idxRef.current = (idxRef.current + 1) % lines.length;
		setHighlightLine(lines[idxRef.current]);
	}, [lines]);

	const startAnimation = useCallback(() => {
		if (activeRef.current) return;
		activeRef.current = true;
		idxRef.current = -1;
		advance();
		const tick = () => {
			if (!activeRef.current) return;
			advance();
			timerRef.current = setTimeout(tick, interval);
		};
		timerRef.current = setTimeout(tick, interval);
	}, [advance, interval]);

	const stopAnimation = useCallback(() => {
		activeRef.current = false;
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setHighlightLine(null);
		idxRef.current = -1;
	}, []);

	// Cleanup on unmount
	useEffect(() => () => stopAnimation(), [stopAnimation]);

	const hoverProps = scrollMode === 'onHover'
		? { onMouseEnter: startAnimation, onMouseLeave: stopAnimation }
		: {};

	const clickProps = scrollMode === 'onClick'
		? { onClick: (e: React.MouseEvent) => { advance(); e.stopPropagation(); }, style: { cursor: 'pointer', ...style } }
		: {};

	return (
			<CodeBlock
				code={code}
				language={language}
				caption={caption}
				className={className + " cursor-pointer"}
				style={style}
				filename={filename}
				compact={compact}
				highlightLine={highlightLine}
				onMouseEnter={scrollMode === 'onHover' ? startAnimation : undefined}
				onMouseLeave={scrollMode === 'onHover' ? stopAnimation : undefined}
				onClick={scrollMode === 'onClick' ? (e) => { advance(); e.stopPropagation(); } : undefined}
			/>
	);
}