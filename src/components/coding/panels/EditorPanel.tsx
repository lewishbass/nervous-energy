import { useRef, useCallback, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { copyToClipboard } from '@/scripts/clipboard';
import { MdContentCopy } from 'react-icons/md';
import Editor, { type OnMount, type Monaco } from '@monaco-editor/react';
import type { editor, IDisposable } from 'monaco-editor';
import { pyodidePool, registerSemanticProvider, registerCompletionProvider } from '../PoolManager';

type EditorPanelProps = {
	isCompact?: boolean;
	initialCode: string;              // renamed: only used once
	onCodeChange: (code: string) => void;  // callback, not setState
	wordWrap: boolean;
	handleEditorMount: OnMount;
	localsRef?: React.RefObject<unknown>; // dill dump of locals for completion provider, parent executes code and provides updated locals to editor panel for 
	preCode?: string; // code to execute before user's code on each run, e.g. for setting up imports or helper functions
};

// Module-level singleton — prevents re-registering across React re-renders/remounts
let _semanticDisposable: IDisposable | null = null;
let _completionDisposable: IDisposable | null = null;
// Updated by the component on mount to forward the latest locals ref
let _getLocals: () => Uint8Array | null = () => null;

const beforeMount = (monacoInstance: Monaco) => {
	/* --- Register Themes --- */
	monacoInstance.editor.defineTheme('python-dark', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'namespace', foreground: '4EC9B0' },
			{ token: 'type', foreground: '4EC9B0' },
			{ token: 'function', foreground: 'DCDCAA' },
			{ token: 'parameter', foreground: '6F99EC' },
			{ token: 'variable', foreground: '9CDCFE' },
			{ token: 'property', foreground: 'B8EAFF' },
			{ token: 'decorator', foreground: 'C586C0' },
		],
		colors: {},
	});

	monacoInstance.editor.defineTheme('python-light', {
		base: 'vs',
		inherit: true,
		rules: [
			{ token: 'namespace', foreground: '267F99' },
			{ token: 'type', foreground: '267F99' },
			{ token: 'function', foreground: '795E26' },
			{ token: 'parameter', foreground: '001060' },
			{ token: 'variable', foreground: '0020A0' },
			{ token: 'property', foreground: '1050C0' },
			{ token: 'decorator', foreground: '795E26' },
		],
		colors: {},
	});
	/* --- Register Semantic Tokens Provider --- */

	if (!_semanticDisposable) {
		_semanticDisposable = registerSemanticProvider(monacoInstance, pyodidePool, 'editor-semantic');
	}

	/* --- Register Completion Provider --- */

	if (!_completionDisposable) {
		_completionDisposable = registerCompletionProvider(monacoInstance, pyodidePool, 'editor-completion', () => _getLocals());
	}
};

export default function EditorPanel({
	isCompact = false,
	initialCode,
	onCodeChange,
	wordWrap,
	handleEditorMount,
	localsRef,
	preCode,
}: EditorPanelProps) {
	const { theme } = useTheme();
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const onCodeChangeRef = useRef(onCodeChange);
	onCodeChangeRef.current = onCodeChange; // always fresh, no re-render

	const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
	//const [collapsePreCode, setCollapsePreCode] = useState<boolean>(false);

	//console.log('editor panel render')


	const onMount: OnMount = useCallback(
		(editor, monaco) => {
			editorRef.current = editor;

			// Push changes to parent WITHOUT causing re-render back into editor
			editor.onDidChangeModelContent(() => {
				onCodeChangeRef.current(editor.getValue());
			});

			if (localsRef) {
				_getLocals = () => (localsRef.current as Uint8Array | null) ?? null;
			}

			// Forward to external mount handler
			handleEditorMount(editor, monaco);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleEditorMount, localsRef]
	);

	const editorOptions = useMemo(
		() => ({
			minimap: { enabled: false },
			fontSize: 14,
			fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
			fontLigatures: true,
			lineNumbers: (showLineNumbers ? ('on' as const) : ('off' as const)),
			roundedSelection: true,
			scrollBeyondLastLine: true,
			automaticLayout: true,
			padding: { top: 12 },
			cursorBlinking: 'smooth' as const,
			cursorSmoothCaretAnimation: 'on' as const,
			smoothScrolling: false,
			acceptSuggestionOnEnter: 'off' as const,
			lineNumbersMinChars: 2,
			occurrencesHighlight: 'singleFile' as const,
			'semanticHighlighting.enabled': true,
			folding: !isCompact,
			wordWrap: (wordWrap ? 'on' as const : 'off' as const),
		}),
		[showLineNumbers, isCompact, wordWrap]
	);

	return (
		<div className="overflow-auto mini-scroll flex flex-col h-full">
			{!isCompact && (
				<div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm flex items-center justify-between">
					<h3 className="text-sm font-bold tc1 select-none">Editor</h3>
					<MdContentCopy
						className="ml-auto w-4 h-4 opacity-50 hover:opacity-100 transition-all hover:text-blue-500 cursor-pointer"
						onClick={() => {
							const current = editorRef.current?.getValue() ?? '';
							copyToClipboard(current, 'Code copied to clipboard!');
						}}
					/>
				</div>
			)}
			{/*<div>
				{preCode && (
					<div
						className={`px-3 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm cursor-pointer select-none ${collapsePreCode ? 'line-clamp-1' : ''}`}
						onClick={() => setCollapsePreCode(!collapsePreCode)}
						title="Click to expand/collapse pre-code"
					>
						{collapsePreCode ? (
							<></>
						) : (
							<p className="mt-1 text-sm opacity-70 whitespace-pre-wrap">{preCode}</p>
						)}
					</div>
				)}
			</div>
			<div className="flex-grow overflow-hidden relative bg1">
			</div>*/}
			<div className="flex-grow overflow-hidden relative bg1">
				<div
					className="absolute top-0 left-0 w-2 h-full z-100 hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none bg-gray-200/20 dark:bg-gray-800/20"
					onClick={() => setShowLineNumbers(!showLineNumbers)}
				/>

				<Editor
					height="100%"
					defaultLanguage="python"
					defaultValue={initialCode}
					onMount={onMount}
					beforeMount={beforeMount}
					theme={theme === 'dark' ? 'python-dark' : 'python-light'}
					options={editorOptions}
				/>
			</div>
		</div>
	);
}