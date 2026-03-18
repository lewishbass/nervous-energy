'use client';
import { useRef, useMemo, useState, useCallback, useEffect } from 'react';

import LineAnimation from '@/components/backgrounds/LineAnimation';
import WorkerPanel from '@/components/coding/panels/WorkerPanel';
import EditorPanel from '@/components/coding/panels/EditorPanel';
import ToolbarPanel from '@/components/coding/panels/ToolbarPanel';
import VariableExplorer, { type FrameData, type VariableSummary } from '@/components/coding/panels/VariableExplorer';
import TerminalPane from '@/components/coding/panels/TerminalPane';
import DraggableDivider from '@/components/DraggableDivider';
import { pyodidePool, type OutputEntry } from '@/components/coding/PoolManager';
import { copyToClipboard } from '@/scripts/clipboard';
import type { OnMount } from '@monaco-editor/react';

import '@/components/coding/PythonIde.css';

const DEFAULT_CODE = `# Write your Python code here
class Robot:
	def __init__(self):
		self.pos = [0, 0]
	def speak(self):
		print("Beep boop!")

robby = Robot()
robby.speak()
`;

type TerminalLine = { text: string; type: 'stdout' | 'stderr' | 'info' | 'error' };

export default function PythonPlayground() {
	// ---- stable task id for this playground instance ----
	const taskId = useMemo(
		() => `playground-${Math.random().toString(36).substr(2, 9)}`,
		[]
	);

	// ---- refs ----
	const codeRef = useRef(DEFAULT_CODE);
	const kernelWorkerIdRef = useRef<string | null>(null);
	const dillRef = useRef<Uint8Array | null>(null);
	const monacoRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);
	const lastHighlightRef = useRef<string[] | null>(null);
	const monacoInstanceRef = useRef<import('@monaco-editor/react').Monaco | null>(null);

	// ---- state ----
	const [running, setRunning] = useState(false);
	const [paused, setPaused] = useState(false);
	const [speed, setSpeed] = useState(0.3);
	const [documentName, setDocumentName] = useState('test.py');
	const [isCompact, setIsCompact] = useState(false);
	const [wordWrap, setWordWrap] = useState(true);
	const [persistentExec, setPersistentExec] = useState(false);

	const [frames, setFrames] = useState<FrameData[]>([]);
	const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

	const settings = useMemo(() => [
		{ text: 'Compact UI', get: isCompact, set: setIsCompact },
		{ text: 'Word Wrap', get: wordWrap, set: setWordWrap },
		{ text: 'Persistent Execution', get: persistentExec, set: setPersistentExec },
	], [isCompact, wordWrap, persistentExec]);

	// ---- line highlighting ----
	const highlightLine = useCallback((lineNumber: number | null) => {
		const monaco = monacoInstanceRef.current;
		const editor = monacoRef.current;
		if (!monaco || !editor) return;

		if (lastHighlightRef.current) {
			editor.deltaDecorations(lastHighlightRef.current, []);
			lastHighlightRef.current = null;
		}
		if (lineNumber != null) {
			lastHighlightRef.current = editor.deltaDecorations([], [{
				range: new monaco.Range(lineNumber, 1, lineNumber, 1),
				options: { isWholeLine: true, className: 'running-line-highlight' },
			}]);
		}
	}, []);

	// ---- helper: build nested VariableSummary tree from flat kernel dict ----
	const buildVariableTree = useCallback((flat: Record<string, VariableSummary>, parent?: string): Record<string, VariableSummary> => {
		const base: Record<string, VariableSummary> = {};

		if (!flat || Object.keys(flat).length === 0) return base;

		for (const [path, v] of Object.entries(flat)) {
			const isDirectChild = parent
				? path.startsWith(parent + '.') && !path.slice(parent.length + 1).includes('.')
				: !path.includes('.');

			if (isDirectChild) {
				const name = parent ? path.slice(parent.length + 1) : path;
				const childEntries = Object.entries(flat).filter(([p]) => p.startsWith(path + '.'));
				const children = childEntries.length > 0
					? buildVariableTree(Object.fromEntries(childEntries), path)
					: undefined;
				base[name] = { ...v, name, children, expanded: childEntries.length > 0 };
			}
		}

		return base;
	}, []);

	// ---- subscribe to kernel worker messages ----
	useEffect(() => {
		const unsub = pyodidePool.subscribe(taskId, (entry: OutputEntry) => {
			const data = entry.data as Record<string, unknown>;
			const responseType = entry.responseType;

			if (responseType === 'stdout') {
				setTerminalLines(prev => [...prev, { text: data.text as string, type: 'stdout' }]);
			} else if (responseType === 'stderr') {
				setTerminalLines(prev => [...prev, { text: data.text as string, type: 'stderr' }]);
			} else if (responseType === 'trace') {
				const line = data.line as number;
				const frameNames = data.frameNames as string[];
				const frameSummaries = data.frameSummaries as Record<string, VariableSummary>[];

				highlightLine(line);

				const newFrames: FrameData[] = frameNames.map((name, i) => ({
					name,
					locals: buildVariableTree(frameSummaries[i] || {}),
				}));
				setFrames(newFrames);
			} else if (responseType === 'execution_complete') {
				setRunning(false);
				setPaused(false);
				highlightLine(null);

				const error = data.error as string | null;
				if (error) {
					setTerminalLines(prev => [
						...prev,
						...error.split('\n').map(l => ({ text: l, type: 'error' as const })),
					]);
				}

				// update final variables
				const vars = data.variables as Record<string, VariableSummary> | undefined;
				if (vars) {
					setFrames([{ name: '<module>', locals: buildVariableTree(vars) }]);
				}

				// store dill for editor completions
				if (data.dill) {
					dillRef.current = data.dill as Uint8Array;
				}

				setTerminalLines(prev => [...prev, { text: '>> ', type: 'info' }]);
			} else if (responseType === 'execution_stopped') {
				setRunning(false);
				setPaused(false);
				highlightLine(null);
				setTerminalLines(prev => [...prev, { text: 'Execution stopped.', type: 'info' }]);
			} else if (responseType === 'variableinfo') {
				console.log("Received variable info:", data);
				const frameSummary = data.frameSummary as Record<string, VariableSummary> | undefined;
				const targetFrame = data.target_frame as string | undefined;
				if (frameSummary && targetFrame) {
					console.log("Updating variables for frame:", targetFrame, frameSummary);
					setFrames(prev => prev.map(frame => {
						if (frame.name !== targetFrame) return frame;
						console.log("Updating frame with new variable info:", frame.name, buildVariableTree(frameSummary));
						return { ...frame, locals: buildVariableTree(frameSummary) };
					}));
				}
			} else if (responseType === 'flow') {
				const state = data.state as string;
				if (state === 'paused') setPaused(true);
				else if (state === 'running') setPaused(false);
				else if (state === 'stepping') setPaused(true);
				else if (state === 'reset') {
					setFrames([]);
					setTerminalLines([]);
					dillRef.current = null;
				}
			}
		});
		return unsub;
	}, [taskId, highlightLine, buildVariableTree]);

	// ---- ensure kernel worker exists ----
	const ensureKernel = useCallback(async () => {
		try {
			if (!kernelWorkerIdRef.current) throw new Error("No kernel worker ID in ref");
			const workerStatus = pyodidePool.checkWorkerStatus(kernelWorkerIdRef.current);
			if (!workerStatus) throw new Error(`Kernel worker with id ${kernelWorkerIdRef.current} is not in pool`);
			if (workerStatus.status !== 'allocated') throw new Error(`Kernel worker with id ${kernelWorkerIdRef.current} is not allocated (status: ${workerStatus.status})`);
			if (workerStatus.taskId !== taskId) throw new Error(`Kernel worker with id ${kernelWorkerIdRef.current} is allocated to a different task (taskId: ${workerStatus.taskId}, expected: ${taskId})`);
			return kernelWorkerIdRef.current;
		} catch (e) {
			console.warn("Kernel worker check failed, will attempt to allocate a new worker. Error:", e);
			const worker = await pyodidePool.allocateWorker(taskId, 'kernel', 'Playground Kernel');
			if (!worker) {
				console.error("Failed to allocate kernel worker");
				return null;
			}
			kernelWorkerIdRef.current = worker.workerId;
			return worker.workerId;
		}
	}, [taskId]);

	// ---- actions ----
	const handleRun = useCallback(async () => {
		const workerId = await ensureKernel();
		if (!workerId) {
			setTerminalLines(prev => [...prev, { text: 'Failed to obtain kernel worker', type: 'error' }]);
			return;
		}
		setRunning(true);
		setPaused(false);
		setTerminalLines(prev => [...prev, { text: `>> python ${documentName}`, type: 'info' }]);

		if (!persistentExec) {
			pyodidePool.messageWorker(workerId, { type: 'reset' });
			setFrames([]);
		}

		const codeId = `run-${Date.now()}`;
		pyodidePool.messageWorker(workerId, {
			type: 'execute',
			code: codeRef.current,
			codeId,
			codeContext: 'user',
		});
	}, [ensureKernel, documentName, persistentExec]);

	const sendFlowControl = useCallback((action: string, newSpeed?: number) => {
		const workerId = kernelWorkerIdRef.current;
		if (!workerId) return;
		pyodidePool.messageWorker(workerId, { type: 'flow_control', flowAction: action, newSpeed });
	}, []);

	const handlePause = useCallback(() => sendFlowControl('pause'), [sendFlowControl]);
	const handleResume = useCallback(() => sendFlowControl('resume'), [sendFlowControl]);
	const handleStep = useCallback(async () => {
		if (!running) {
			// start program in paused mode, then step once
			const workerId = await ensureKernel();
			if (!workerId) return;
			setRunning(true);
			setPaused(true);
			setTerminalLines(prev => [...prev, { text: `>> python ${documentName} (stepping)`, type: 'info' as const }]);

			if (!persistentExec) {
				pyodidePool.messageWorker(workerId, { type: 'reset' });
				setFrames([]);
			}

			const codeId = `step-${Date.now()}`;
			pyodidePool.messageWorker(workerId, {
				type: 'execute',
				code: codeRef.current,
				codeId,
				codeContext: 'user',
				startPaused: true,
			});
		} else {
			sendFlowControl('step');
		}
	}, [running, ensureKernel, documentName, persistentExec, sendFlowControl]);
	const handleStop = useCallback(() => sendFlowControl('stop'), [sendFlowControl]);

	const handleRestart = useCallback(async () => {
		const workerId = await ensureKernel();
		if (!workerId) return;
		pyodidePool.messageWorker(workerId, { type: 'reset' });
		setRunning(false);
		setPaused(false);
		setFrames([]);
		setTerminalLines([]);
		dillRef.current = null;
	}, [ensureKernel]);

	const handleSpeedChange = useCallback((newSpeed: number) => {
		setSpeed(newSpeed);
		sendFlowControl('speed', newSpeed);
	}, [sendFlowControl]);

	const handleExpandCollapse = useCallback((path: string, expand: boolean) => {
		const workerId = kernelWorkerIdRef.current;
		if (workerId) {
			pyodidePool.messageWorker(workerId, { type: expand ? 'expand' : 'collapse', path });
		}
		if (!expand) {
			// optimistically collapse in local state
			setFrames(prev => prev.map(frame => {
				const parts = path.split('.');
				const baseName = parts[0];
				if (!frame.locals[baseName]) return frame;
				const updatedLocals = { ...frame.locals };
				if (parts.length === 1) {
					updatedLocals[baseName] = { ...updatedLocals[baseName], expanded: false, children: undefined };
				} else {
					// walk to parent and collapse the target
					let parent = updatedLocals[baseName] = { ...updatedLocals[baseName] };
					for (let i = 1; i < parts.length; i++) {
						if (parent.children?.[parts[i]]) {
							parent.children = { ...parent.children };
							parent.children[parts[i]] = { ...parent.children[parts[i]] };
							if (i === parts.length - 1) {
								parent.children[parts[i]].expanded = false;
								parent.children[parts[i]].children = undefined;
							}
							parent = parent.children[parts[i]];
						} else break;
					}
				}
				return { ...frame, locals: updatedLocals };
			}));
		}
		// expand is handled by the variableinfo response from the kernel
	}, []);

	// ---- file management ----
	const listFiles = useCallback((): Record<string, string> => {
		if (typeof window === 'undefined') return {};
		const files = localStorage.getItem('pyodide_files');
		return files ? JSON.parse(files) : {};
	}, []);

	const saveFile = useCallback(() => {
		if (typeof window === 'undefined') return;
		const content = codeRef.current;
		const saveLocation = `pyodide_file_${documentName}`;
		localStorage.setItem(saveLocation, content);
		const files = listFiles();
		files[documentName] = saveLocation;
		localStorage.setItem('pyodide_files', JSON.stringify(files));
		copyToClipboard(content, `Saved "${documentName}"`, false);
	}, [documentName, listFiles]);

	const newFile = useCallback(() => {
		saveFile();
		const files = listFiles();
		for (let i = 0; i < 100; i++) {
			const name = `test_${i}.py`;
			if (!files[name]) {
				setDocumentName(name);
				break;
			}
		}
		codeRef.current = '';
		monacoRef.current?.setValue('');
	}, [saveFile, listFiles]);

	const loadFile = useCallback((name: string) => {
		if (typeof window === 'undefined') return;
		const files = listFiles();
		const content = localStorage.getItem(files[name]);
		if (content !== null) {
			codeRef.current = content;
			setDocumentName(name);
			monacoRef.current?.setValue(content);
		}
	}, [listFiles]);

	const deleteFile = useCallback((name: string) => {
		if (typeof window === 'undefined') return;
		const files = listFiles();
		localStorage.removeItem(files[name]);
		delete files[name];
		localStorage.setItem('pyodide_files', JSON.stringify(files));
	}, [listFiles]);

	// ---- editor mount ----
	const handleEditorMount: OnMount = useCallback((editor, monaco) => {
		monacoRef.current = editor;
		monacoInstanceRef.current = monaco;

		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
			handleRun();
		});
	}, [handleRun]);

	return (
		<div className="relative w-screen overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					seed={789}
					style={{ opacity: 0.35 }}
					spacing={200}
					doAnimation={false}
				/>
			</div>

			{/* ---- Toolbar ---- */}
			<ToolbarPanel
				isCompact={isCompact}
				running={running}
				paused={paused}
				documentName={documentName}
				onDocumentNameChange={setDocumentName}
				onRun={handleRun}
				onPause={handlePause}
				onResume={handleResume}
				onStep={handleStep}
				onStop={handleStop}
				onRestart={handleRestart}
				onSpeedChange={handleSpeedChange}
				speed={speed}
				onSave={saveFile}
				onNewFile={newFile}
				onLoadFile={loadFile}
				onDeleteFile={deleteFile}
				fileList={listFiles()}
				onRefreshFileList={listFiles}
				settings={settings}
			/>

			{/* ---- Body ---- */}
			<DraggableDivider
				direction="horizontal"
				initialPosition={55}
				edgeSize={[15, 15]}
				collapseEnd={true}
				color="purple"
				className="flex-grow overflow-hidden"
			>
				<DraggableDivider
					direction="vertical"
					initialPosition={50}
					edgeSize={[15, 15]}
					collapseEnd={true}
					color="orange"
					className="flex-grow overflow-hidden"

				>
					{/* Editor */}
					<EditorPanel
						isCompact={isCompact}
						initialCode={DEFAULT_CODE}
						wordWrap={wordWrap}
						handleEditorMount={handleEditorMount}
						onCodeChange={(code) => { codeRef.current = code; }}
						localsRef={dillRef}
					/>
					<WorkerPanel className="w-full h-full" />
				</DraggableDivider>

				{/* Variable Explorer + Terminal */}
				<DraggableDivider
					direction="vertical"
					initialPosition={50}
					edgeSize={[15, 15]}
					collapseEnd={true}
					collapseStart={true}
					color="green"
					className="flex-grow overflow-hidden"
				>
					<VariableExplorer
						frames={frames}
						onExpandCollapse={handleExpandCollapse}
						isCompact={isCompact}
					/>
					<TerminalPane
						terminalLines={terminalLines}
						onClearTerminal={() => setTerminalLines([])}
						isCompact={isCompact}
					/>
				</DraggableDivider>
			</DraggableDivider>
		</div>
	);
}
