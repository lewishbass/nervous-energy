'use client';

import { useEffect, useRef } from 'react';
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
}

export function CodeBlock({ code, language = 'python', caption, className = '', style = {}, filename, compact = false }: CodeBlockProps) {
		const codeRef = useRef<HTMLElement>(null);

		useEffect(() => {
			if (codeRef.current) {
				Prism.highlightElement(codeRef.current);
			}
		}, [code, language]);

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
			<div className={`flex flex-col justify-center items-center mb-3 ${className}`} style={style}>
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