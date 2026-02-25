'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor, { type OnMount, type Monaco } from '@monaco-editor/react';
import {
	VscPlay,
	VscDebugStepOver,
	VscDebugRestart,
	VscDebugStop,
	VscSave,
	VscNewFile,
	VscFolderOpened,
	VscSettingsGear,
	VscClearAll,
	VscTrash,
	VscArchive,
} from 'react-icons/vsc';
import { useTheme } from 'next-themes';
import { usePyodide, registerPyodideCompletions, registerPyodideSemanticTokens, definePythonThemes, resetPyodideContext, getVariableInfo } from '@/scripts/pyodide';
import { copyToClipboard } from '@/scripts/clipboard';
import { MdContentCopy } from 'react-icons/md';
import { exec } from 'child_process';

// ---------- Types ----------

type VariableInfo = {
	name: string;
	type: string;
	value: string;
	callable: boolean;
	expanded?: boolean;
	children?: Record<string, VariableInfo>;
};

export type PythonIdeProps = {
	initialCode?: string;
	initialDocumentName?: string;
	initialShowLineNumbers?: boolean;
	initialIsCompact?: boolean;
	initialVDivider?: number;
	initialHDivider?: number;
	initialPersistentExec?: boolean;
	initialWordWrap?: boolean;
	onCodeStartCallback?: (code: string, pyodide: any) => void;
	onCodeEndCallback?: (code: string, pyodide: any, error: string | null, vars: Record<string, VariableInfo>, stdout: string | null) => void;
	cachedCode?: string;
};

// ---------- Component ----------

export default function PythonIde({
	initialCode = '',
	initialDocumentName = 'test.py',
	initialShowLineNumbers = true,
	initialIsCompact = false,
	initialVDivider = 70,
	initialHDivider = 50,
	initialPersistentExec = false,
	initialWordWrap=true,
	onCodeStartCallback,
	onCodeEndCallback,
	cachedCode,
}: PythonIdeProps) {
	const [code, setCode] = useState(initialCode);
	const [showLineNumbers, setShowLineNumbers] = useState(initialShowLineNumbers);
	const [persistentExec, setPersistentExec] = useState(initialPersistentExec);
	const [wordWrap, setWordWrap] = useState(initialWordWrap);
	const [isCompact, setIsCompact] = useState(initialIsCompact);

	const [documentName, setDocumentName] = useState(initialDocumentName);
	const [fileList, setFileList] = useState<Record<string, string>>({});
	const [settingsOpen, setSettingsOpen] = useState(false);
	const settings = [
		{ text: 'Show Line Numbers', get: showLineNumbers, set: setShowLineNumbers },
		{ text: 'Persistent Execution Context', get: persistentExec, set: setPersistentExec },
		{ text: 'Compact UI', get: isCompact, set: setIsCompact },
		{ text: 'Word Wrap', get: wordWrap, set: setWordWrap },
	];

	// ---------- Horizontal divider (editor | info) ----------
	const [hDivider, setHDivider] = useState(initialHDivider);
	const [hDragging, setHDragging] = useState(false);
	const [hCollapsed, setHCollapsed] = useState(0); // 0 = none, 1 = left, 2 = right
	const mainRef = useRef<HTMLDivElement>(null);

	// ---------- Vertical divider (main | terminal) ----------
	const [vDivider, setVDivider] = useState(initialVDivider);
	const [vDragging, setVDragging] = useState(false);
	const [vCollapsed, setVCollapsed] = useState(false);
	const bodyRef = useRef<HTMLDivElement>(null);

	// ---------- Terminal output + Variables ----------
	const [terminalLines, setTerminalLines] = useState<{ text: string; type: 'stdout' | 'stderr' | 'info' | 'error' }[]>([]);
	const [variables, setVariables] = useState<Record<string, VariableInfo>>({});

	const [running, setRunning] = useState(false);
	const terminalRef = useRef<HTMLDivElement>(null);

	// ---------- Pyodide ----------
	const { pyodide, loading: pyodideLoading, error: pyodideError } = usePyodide();
	const pyodideRef = useRef(pyodide);
	const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
	const runCodeRef = useRef<((code: string) => Promise<void>) | null>(null);

	// ---------- File helpers (localStorage) ----------

	const listFiles = () => {
		const files = localStorage.getItem('pyodide_files');
		return files ? (JSON.parse(files) as Record<string, string>) : {};
	};

	const saveFile = (name: string, content: string) => {
		const saveLocation = `pyodide_file_${name}`;
		localStorage.setItem(saveLocation, content);
		const files = listFiles();
		files[name] = saveLocation;
		localStorage.setItem('pyodide_files', JSON.stringify(files));
		copyToClipboard(content, `Saved "${name}"`, false);
	};

	const loadFile = (name: string) => {
		const files = listFiles();
		const content = localStorage.getItem(files[name]);
		return content ?? null;
	};

	const deleteFile = (name: string) => {
		const files = listFiles();
		localStorage.removeItem(files[name]);
		delete files[name];
		localStorage.setItem('pyodide_files', JSON.stringify(files));
	};

	// ---------- Effects ----------

	useEffect(() => {
		pyodideRef.current = pyodide;
	}, [pyodide]);

	// Auto-scroll terminal on new output
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalLines]);

	// ---------- Run code ----------

	const runCode = useCallback(async (codeToRun: string) => {
		if (!pyodideRef.current) {
			setTerminalLines(prev => [...prev, { text: 'Pyodide is still loading…', type: 'error' as const }]);
			return;
		}

		

		setRunning(true);
		onCodeStartCallback?.(codeToRun, pyodideRef.current);
		setTerminalLines(prev => [...prev, { text: `>> python${isCompact ? '' : ' ' + (documentName || 'playground')}`, type: 'info' as const }]);

		if (!persistentExec) {
			resetPyodideContext();
		}

		let execError: string | null = null;
		let validationVars = {} as Record<string, VariableInfo>;
		let execStdout: string | null = null;

		try {
			// Set up real-time print callback so stdout/stderr stream to the terminal
			pyodideRef.current.globals.set('_js_print_cb', (text: string, type: string) => {
				setTerminalLines(prev => [...prev, { text, type: type as 'stdout' | 'stderr' | 'info' | 'error' }]);
			});


			pyodideRef.current.globals.set('_user_code', codeToRun);
			pyodideRef.current.globals.set('_expanded_vars', getExpandedVariables());

			const resultJson: string = await pyodideRef.current.runPythonAsync(`
import sys as _sys, json as _json, traceback as _tb, textwrap as _textwrap

_save_out, _save_err = _sys.stdout, _sys.stderr
_rt_stdout = _RTOut(_js_print_cb, 'stdout')
_sys.stdout = _rt_stdout
_sys.stderr = _RTOut(_js_print_cb, 'stderr')

_exec_err = None
_exec_globals = globals()
try:
    # Transform time.sleep() to await asyncio.sleep() for non-blocking execution
    _transformed_code = _transform_sleeps(_user_code)

    _wrapped = f"""
async def __async_exec_wrapper(__globals):
{_textwrap.indent(_transformed_code, '    ')}
    _local_vars = {{k: v for k, v in locals().items() if k != '__globals' and __globals.get(k) != v}}
    
    # Get all expanded variables and their children to update their values
    _expanded_vars_refs = {{}}
    for _path_str in _expanded_vars:
        _parts = _path_str.split('.')
        _obj = __globals.get(_parts[0])
        for _attr in _parts[1:]:
            if _obj is None:
                break
            _obj = getattr(_obj, _attr, None)
        
        if _obj is not None:
            for _n in dir(_obj):
                if _n.startswith('_'):
                    continue
                try:
                    _v = getattr(_obj, _n)
                    _full_path = _path_str + '.' + _n
                    _expanded_vars_refs[_full_path] = _v
                except Exception:
                    pass
    
    return _local_vars | _expanded_vars_refs
"""

    _code_obj = compile(_wrapped, '<playground>', 'exec')
    exec(_code_obj, _exec_globals)

    _new_vars = await _exec_globals['__async_exec_wrapper'](_exec_globals)

    _exec_globals.update(_new_vars)
    _run_history.append(_user_code)

except Exception:
    _exec_err = _tb.format_exc()
    _new_vars = {}
finally:
    _sys.stdout.flush()
    _sys.stderr.flush()
    _sys.stdout, _sys.stderr = _save_out, _save_err

_skip = {'jedi', 'micropip', 'rlcompleter', '__async_exec_wrapper', 'asyncio'}

for _n, _v in sorted(_new_vars.items()):
    if _n.startswith('_') or _n in _skip:
        continue
    try:
        _repr = repr(_v)
        if len(_repr) > 100:
            _repr = _repr[:97] + '...'
        _user_vars[_n] = {'name': _n, 'type': type(_v).__name__, 'value': _repr, 'callable': callable(_v)}
    except Exception:
        _user_vars[_n] = {'name': _n, 'type': type(_v).__name__, 'value': '<error>', 'callable': callable(_v)}

_json.dumps({
    'error': _exec_err,
    'variables': _user_vars,
		'stdout': _rt_stdout._hist,
})
`);

			const parsed = JSON.parse(resultJson);
			// Errors are not streamed - display them from the result
			if (parsed.error) {
				execError = parsed.error.endsWith('\n') ? parsed.error.slice(0, -1) : parsed.error;
				setTerminalLines(prev => {
					const lines = [...prev];
					const e = execError || '';
					for (const l of e.split('\n')) lines.push({ text: l, type: 'error' as const });
					return lines;
				});
			}
			if (parsed.stdout && Array.isArray(parsed.stdout)) {
				execStdout = parsed.stdout.join('\n');
			}

			// remove non-base variables
			const vars = parsed.variables as Record<string, VariableInfo>;
			validationVars = vars;
			const baseVars = Object.fromEntries(Object.entries(vars).filter(([k]) => !k.includes('.')));
			// Re-append non-base variables to base vars
			Object.entries(vars).filter(([k]) => k.includes('.')).forEach(([k, v]) => {
				const pathParts = k.split('.');
				const baseName = pathParts[0];
				const varName = pathParts[pathParts.length - 1];
				const restPath = pathParts.slice(1, -1);
				if (!baseVars[baseName]) {
					console.warn(`Base variable ${baseName} not found for ${k}, skipping`);
					return;
				}
				let parent = baseVars[baseName];
				for (const part of restPath) {
					if (!parent.children || !parent.children[part]) {
						console.warn(`Parent variable ${part} not found in path ${k}, skipping`);
						return;
					}
					parent = parent.children[part];
				}
				if (!parent.children) parent.children = {};
				v.name = varName;
				parent.children[varName] = v;
				parent.expanded = true;
			});

			setVariables(baseVars as Record<string, VariableInfo> || {});
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e);
			execError = msg;
			setTerminalLines(prev => [...prev, { text: msg, type: 'error' as const }]);
		} finally {
			setRunning(false);
			setTerminalLines(prev => [...prev, { text: '>> ', type: 'info' as const }]);
			onCodeEndCallback?.(codeToRun, pyodideRef.current, execError, validationVars, execStdout);
		}
	}, [variables, documentName, isCompact, persistentExec, onCodeStartCallback, onCodeEndCallback]);

	// Update the ref whenever runCode changes
	useEffect(() => {
		runCodeRef.current = runCode;
	}, [runCode]);

	// ---------- Horizontal drag handler ----------
	const onHMouseDown = useCallback(() => setHDragging(true), []);

	const { theme } = useTheme();

	useEffect(() => {
		if (!hDragging) return;

		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'ew-resize';

		const onMove = (e: MouseEvent) => {
			if (!mainRef.current) return;
			const rect = mainRef.current.getBoundingClientRect();
			const pct = ((e.clientX - rect.left) / rect.width) * 100;
			setHDivider(Math.min(Math.max(pct, 0), 100));
			setHCollapsed(pct < 10 ? 1 : pct > 90 ? 2 : 0);
		};

		const onUp = () => {
			setHDragging(false);
			document.body.style.userSelect = 'auto';
			document.body.style.cursor = 'default';
		};

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		};
	}, [hDragging]);

	// ---------- Vertical drag handler ----------
	const onVMouseDown = useCallback(() => setVDragging(true), []);

	useEffect(() => {
		if (!vDragging) return;

		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'ns-resize';

		const onMove = (e: MouseEvent) => {
			if (!bodyRef.current) return;
			const rect = bodyRef.current.getBoundingClientRect();
			const pct = ((e.clientY - rect.top) / rect.height) * 100;
			setVDivider(Math.min(Math.max(pct, 15), 100));
			setVCollapsed(pct > 95);
		};

		const onUp = () => {
			setVDragging(false);
			document.body.style.userSelect = 'auto';
			document.body.style.cursor = 'default';
		};

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		};
	}, [vDragging]);

	// ---------- Monaco mount ----------
	const handleEditorBeforeMount = useCallback((monaco: Monaco) => {
		definePythonThemes(monaco);
	}, []);

	const handleEditorMount = useCallback<OnMount>((editor, monaco: Monaco) => {
		setMonacoInstance(monaco);

		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
			const value = editor.getValue();
			if (runCodeRef.current) {
				runCodeRef.current(value);
			}
		});
	}, []);

	// Register Jedi completions + semantic tokens when both Monaco and Pyodide are ready
	useEffect(() => {
		if (!monacoInstance || !pyodide) return;

		const d1 = registerPyodideCompletions(monacoInstance, pyodide);
		const d2 = registerPyodideSemanticTokens(monacoInstance, pyodide);
		return () => { d1.dispose(); d2.dispose(); };
	}, [monacoInstance, pyodide]);

	// ---------- Toolbar button helper ----------
	const ToolBtn = ({ icon: Icon, label, accent, onClick, children, className, isCompact: compact }: { icon: React.ElementType; label: string; accent?: string; onClick?: () => void; children?: React.ReactNode; className?: string; isCompact?: boolean }) => (
		<button
			title={label}
			className={`p-${compact ? '0.5' : '1.5'} rounded-md hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none ${className || ''}`}
			style={{ color: accent }}
			onClick={onClick}
		>
			<Icon className="w-5 h-5" />
			{children}
		</button>
	);

	// ---------- Variable renderer ----------
	const expandVariable = (v: VariableInfo, path: Array<string>) => {
		if (v.expanded || !pyodideRef.current) {
			v.expanded = false;
			setVariables(prev => ({ ...prev }));
			return;
		}
		getVariableInfo(pyodideRef.current!, [...path, v.name]).then(varInfo => {
			if (!varInfo) return;
			v.children = varInfo;
			v.expanded = true;
			setVariables(prev => ({ ...prev }));
		});
	};

	const renderVariable = (v: VariableInfo, index: number, path: Array<string> = [], depth: number = 0): React.ReactNode => {
		return (
			<>
				<tr key={v.name + '_' + depth + '_' + index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/5"
					onClick={() => expandVariable(v, path)}>
					<td title={v.name} className={`flex flex-row items-end py-1.5 pl-2 pr-3 text-blue-600 dark:text-blue-400 ${v.callable ? 'opacity-80' : 'font-semibold'} whitespace-nowrap`}>
						{path.map((p, i) => (
							<div key={p} className="opacity-50 text-xs pb-[0.75px] max-w-7.5 min-w-7.5 w-7.5 overflow-hidden" title={p}>
								{i > 0 && '.'}{p}
							</div>
						))}
						<div className="max-w-30 overflow-hidden text-ellipsis">{path.length > 0 && '.'}{v.name}</div>
					</td>
					<td className="py-1.5 pr-3 opacity-50 italic whitespace-nowrap max-w-30 text-ellipsis overflow-x-hidden" title={v.type}>{v.type}</td>
					<td className={`py-1 tc1 line-clamp-${isCompact ? '1' : '2'}`} title={v.value}>{v.value}</td>
				</tr>
				<>
					{v.expanded && v.children && Object.values(v.children).map((child, i) => (
						renderVariable(child, i, [...path, v.name], depth + 1)
					))}
				</>
			</>
		);
	};

	const getExpandedVariables = (v: VariableInfo | null = null, path = ''): Array<string> => {
		let result: Array<string> = [];
		const list = v ? v.children : variables;
		if (!list || Object.keys(list).length === 0) return [];
		Object.values(list).map(child => {
			if (child.expanded) {
				result.push((path ? (path + '.') : '') + child.name);
				result = result.concat(getExpandedVariables(child, (path ? (path + '.') : '') + child.name));
			}
		});
		return result;
	};
	

	// ---------- Render ----------

	return (
		<div className="relative w-full h-full overflow-hidden flex flex-col">
			{/* ============ TOOLBAR ============ */}
			<div className={`flex-shrink-0 flex items-center gap-1 px-3 py-${isCompact ? '0' : '1'} bg2 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm z-20`}>
				{!isCompact && (
					<>
						<input className="tc1 font-bold text-lg mr-4 select-none active:outline-1 pl-2" value={documentName} onChange={(e) => setDocumentName(e.target.value)} spellCheck={false} maxLength={25} />
						<div className="w-px h-6 bg-gray-400/40 mx-1" />
					</>
				)}

				<ToolBtn icon={VscPlay} label={running ? 'Running…' : 'Run (Ctrl+Enter)'} accent="var(--khg)" onClick={() => { if (!running) runCode(code); }} isCompact={isCompact} />
				<ToolBtn icon={VscDebugStepOver} label="Execute Next Line" accent="var(--khb)" isCompact={isCompact} />
				<ToolBtn icon={VscDebugRestart} label="Restart Environment" accent="var(--kho)" onClick={() => { resetPyodideContext(); setVariables({}); }} isCompact={isCompact} />
				<ToolBtn icon={VscDebugStop} label="Stop" accent="var(--khr)" isCompact={isCompact} />



				{cachedCode && (
				<>
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
					<div className="h-6" />
					<ToolBtn icon={VscArchive} label="Load Cached Code" onClick={() => {
						if (cachedCode) {
							setCode(cachedCode);
							copyToClipboard(cachedCode, 'Cached code loaded to editor', false);
						} else {
							copyToClipboard('', 'No cached code found', false);
						}
					}} isCompact={isCompact} />
				</>)}
				
				<div className="w-px h-6 bg-gray-400/40 mx-1.5" />
				<div className="h-6 mx-auto" />

				{!isCompact && <>
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
					<ToolBtn icon={VscNewFile} label="New File" onClick={() => {
						saveFile(documentName, code);
						const files = listFiles();
						for (let i = 0; i < 100; i++) {
							const newName = `test_${i}.py`;
							if (!files[newName]) {
								setDocumentName(newName);
								break;
							}
						}
						setCode('');
					}} isCompact={isCompact} />
					<ToolBtn icon={VscFolderOpened} label="Open File" className="relative" onClick={() => setFileList(listFiles())} isCompact={isCompact}>
						{Object.keys(fileList).length !== 0 && !isCompact && <div className="absolute top-10 right-0 mt-1 w-48 bg2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-10" onMouseLeave={() => { setFileList({}) }} tabIndex={0}>
							{Object.keys(fileList).map((fileName) => (
								<div key={fileName} className="relative px-3 py-2 hover:bg-gray-300/40 dark:hover:bg-gray-600/40 cursor-pointer transition-colors text-left pl-3"
									onClick={() => {
										const content = loadFile(fileName);
										if (content !== null) {
											setCode(content);
											setDocumentName(fileName);
										} else {
											alert('Failed to load file');
										}
									}}
								>
									{fileName}
									<VscTrash className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 hover:opacity-100 transition-all hover:text-red-500"
										title='Delete File'
										onClick={(e) => {
											e.stopPropagation();
											deleteFile(fileName);
											setFileList(listFiles());
										}}
									/>
								</div>
							))}
						</div>}
					</ToolBtn>
					<ToolBtn icon={VscSave} label="Save" onClick={() => saveFile(documentName, code)} isCompact={isCompact} />
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
				</>}

				<ToolBtn icon={VscSettingsGear} label="Settings" onClick={() => { setSettingsOpen(true) }} className="relative" isCompact={isCompact}>
					{settingsOpen && <div className="absolute top-10 right-0 mt-1 w-64 bg2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-10 p-3" onMouseLeave={() => { setSettingsOpen(false) }}>
						{settings.map((s, i) => (
							<div key={i} className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => s.set(!s.get)}>
								<span className="text-sm">{s.text}</span>
								<input type="checkbox" checked={s.get} onChange={() => s.set(!s.get)} />
							</div>
						))}
					</div>}
				</ToolBtn>
			</div>

			{/* ============ BODY (main + terminal) ============ */}
			<div ref={bodyRef} className="flex-grow flex flex-col overflow-hidden relative">

				{/* ---- MAIN AREA (editor + info) ---- */}
				<div
					ref={mainRef}
					className="flex overflow-hidden"
					style={{ height: `${vCollapsed ? '' : `${vDivider}%`}`, flexGrow: vCollapsed ? 1 : 'initial' }}
				>
					{/* Code Editor Panel */}
					{hCollapsed !== 1 &&
						<div
							className="overflow-auto mini-scroll flex flex-col"
							style={{ width: hCollapsed !== 2 ? `${hDivider}%` : '', flexGrow: hCollapsed === 2 ? 1 : 'initial' }}
						>
							{!isCompact && <div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm flex items-center justify-between">
								<h3 className="text-sm font-bold tc1 select-none">Editor</h3>
								<MdContentCopy className="ml-auto w-4 h-4 opacity-50 hover:opacity-100 transition-all hover:text-blue-500 cursor-pointer" onClick={() => copyToClipboard(code, 'Code copied to clipboard!')} />
							</div>}
							<div className="flex-grow overflow-hidden relative bg1">
								<div className="absolute top-0 left-0 w-2 h-full z-100 hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none bg-gray-200/20 dark:bg-gray-800/20" onClick={() => { setShowLineNumbers(!showLineNumbers) }} />

								<Editor
									height="100%"
									defaultLanguage="python"
									value={code}
									onChange={(v) => setCode(v ?? '')}
									onMount={handleEditorMount}
									beforeMount={handleEditorBeforeMount}
									theme={theme === 'dark' ? 'python-dark' : 'python-light'}
									language='python'
									options={{
										minimap: { enabled: false },
										fontSize: 14,
										fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
										fontLigatures: true,
										lineNumbers: showLineNumbers ? 'on' : 'off',
										roundedSelection: true,
										scrollBeyondLastLine: false,
										automaticLayout: true,
										padding: { top: 12 },
										cursorBlinking: 'smooth',
										cursorSmoothCaretAnimation: 'on',
										smoothScrolling: false,
										acceptSuggestionOnEnter: 'off',
										lineNumbersMinChars: 2,
										occurrencesHighlight: 'singleFile',
										'semanticHighlighting.enabled': true,
										folding: !isCompact,
										wordWrap: wordWrap ? 'on' : 'off',
									}}
								/>
							</div>
						</div>
					}

					{/* Horizontal Draggable Divider */}
					<div
						onMouseDown={onHMouseDown}
						className={`flex-shrink-0 ${hCollapsed ? 'w-3' : 'w-1.5'} cursor-ew-resize flex items-center justify-center group transition-colors backdrop-blur-md ${hDragging
							? 'bg-blue-500/50'
							: 'bg-gray-300/40 dark:bg-gray-600/40 hover:bg-blue-500/30'
							}`}
					>
						<div className="h-10 w-0.5 bg-blue-500/50 rounded-full group-hover:bg-blue-500/70 transition-all" />
					</div>

					{/* Information Display Panel */}
					{hCollapsed !== 2 &&
						<div
							className="overflow-auto mini-scroll flex flex-col"
							style={{ width: hCollapsed !== 1 ? `${100 - hDivider}%` : '', flexGrow: hCollapsed === 1 ? 1 : 'initial' }}
						>
							{!isCompact && <div className="px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm">
								<h3 className="text-sm font-bold tc1 select-none">Visualization</h3>
							</div>}
							<div className={`flex-grow bg2 px-${isCompact ? '1' : '4'} py-${isCompact ? '0' : '4'} tc1 overflow-auto mini-scroll min-w-[10vw] `}>
								{Object.keys(variables).length === 0 ? (
									<p className="opacity-40 text-sm select-none p-3">Run code to inspect variables.</p>
								) : (
									<table className="w-full text-sm font-mono">
										<thead>
											<tr className={isCompact ? "" : "border-b border-gray-300 dark:border-gray-600 text-left"}>
												<th className="w-1/4 pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide">{!isCompact && "Name"}</th>
												<th className="w-1/4 pb-1.5 pr-3 font-semibold tc2 text-xs uppercase tracking-wide">{!isCompact && "Type"}</th>
												<th className="pb-1.5 font-semibold tc2 text-xs uppercase tracking-wide">{!isCompact && "Value"}</th>
											</tr>
										</thead>
										<tbody>
											{Object.values(variables).map((v, i) => (
												renderVariable(v, i)
											))}
										</tbody>
									</table>
								)}
							</div>
						</div>
					}
				</div>

				{/* Vertical Draggable Divider */}
				<div
					onMouseDown={onVMouseDown}
					className={`flex-shrink-0 ${vCollapsed ? 'h-3' : 'h-1.5'} cursor-ns-resize flex items-center justify-center group transition-colors backdrop-blur-md ${vDragging
						? 'bg-purple-500/50'
						: 'bg-gray-300/40 dark:bg-gray-600/40 hover:bg-purple-500/30'
						}`}
				>
					<div className="w-12 h-0.5 bg-purple-500/50 rounded-full group-hover:bg-purple-500/70 transition-all" />
				</div>

				{/* ---- TERMINAL ---- */}
				{!vCollapsed && <div
					className="overflow-hidden flex flex-col"
					style={{ height: `${100 - vDivider}%` }}
				>
					{!isCompact && <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center gap-2 backdrop-blur-sm">
						<h3 className="text-sm font-bold tc1 select-none">Terminal</h3>
						<button
							title="Clear Terminal"
							onClick={() => setTerminalLines([])}
							className="ml-auto p-1 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none tc2"
						>
							<VscClearAll className="w-4 h-4" />
						</button>
					</div>}
					<div ref={terminalRef} className="flex-grow bg3 p-3 font-mono text-sm overflow-auto mini-scroll pb-20">
						{terminalLines.length === 0 ? (
							<span className="opacity-60 select-none text-green-600 dark:text-green-400"></span>
						) : (
							terminalLines.map((line, i) => (
								<div key={i} className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-500 dark:text-red-400' :
									line.type === 'stderr' ? 'text-yellow-600 dark:text-yellow-400' :
										line.type === 'info' ? 'opacity-50 text-gray-500 dark:text-gray-400' :
											'text-green-600 dark:text-green-400'
									}`}>
									{line.text}
								</div>
							))
						)}
					</div>
				</div>}
			</div>
		</div>
	);
}