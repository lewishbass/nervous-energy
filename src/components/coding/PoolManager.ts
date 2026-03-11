// manages pool py pyodide workers

import { Monaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";

// worker types
// line by line debugging
// semantics and completion providers

const EDITOR_URL = '/workers/python_editor.worker.js';
const KERNEL_URL = '/workers/python_kernel.worker.js';

type Status = 'init' | 'idle' | 'busy' | 'allocated';
type WorkerJob = 'editor' | 'kernel';


type WorkerInfo = {
	worker: Worker;
	name: string;
	status: Status;
	type: WorkerJob;
	workerId: string; // unique id for worker, can be used to send messages to specific worker
	taskId?: string; // if allocated to specific task
}
export type OutputEntry = { workerId: string; workerName: string; data: unknown; timestamp: number; taskId: string | null, responseType:string };
export type WorkerInfoPublic = Omit<WorkerInfo, 'worker'>;
type OutputListener = (entry: OutputEntry) => void;
type WorkerListListener = (workers: WorkerInfoPublic[]) => void;
type ListenerRegistration = { taskId: string | null; listener: OutputListener };

class PyodidePoolManager{
	private workers: Map<string, WorkerInfo> = new Map()
	private outputBuffer: OutputEntry[] = [];
	private listeners: Set<ListenerRegistration> = new Set();
	private workerListListeners: Set<WorkerListListener> = new Set();

	// stores locks for tasks already being completion and semantically processed
	private semanticLocks: Set<string> = new Set();
	private completionLocks: Set<string> = new Set();

	// promises for semantic and completion results, stored stored on worker start, and picked up and fulfilled on worker response, keyed by taskId
	// times out automatically after 10 seconds to prevent memory leaks
	private semanticPromises: Map<string, { resolve: (value: unknown) => void; reject: (reason?: any) => void; timeoutId: NodeJS.Timeout; workerId: string }> = new Map();
	private completionPromises: Map<string, { resolve: (value: unknown) => void; reject: (reason?: any) => void; timeoutId: NodeJS.Timeout; workerId: string }> = new Map();

	// promises resolved when a worker sends its ready message, keyed by workerId
	private initPromises: Map<string, { resolve: (value: WorkerInfo) => void; reject: (reason?: unknown) => void }> = new Map();

	constructor(n_kernel: number = 0, n_editor: number = 0) {
		for (let i = 0; i < n_kernel; i++) {
			this.createWorker('kernel');
		}
		for (let i = 0; i < n_editor; i++) {
			this.createWorker('editor');
		}
	}

	/* --- Semantic Promises --- */
	async requestSemantic(taskId: string, code: string): Promise<unknown> {

		if (this.semanticLocks.has(taskId)) {
			return Promise.reject(new Error("Semantic request already in progress for this task"));
		}
		this.semanticLocks.add(taskId);
		

		// make sure semantic worker is available
		let workerInfo:WorkerInfo|null|undefined = Array.from(this.workers.values()).find(w => w.type === 'editor' && (w.status === 'idle'));
		if (!workerInfo) {
			// create new worker if none available
			workerInfo = await this.createWorker('editor', taskId);
		}

		if (!workerInfo) {
			this.semanticLocks.delete(taskId);
			return Promise.reject(new Error("Failed to obtain editor worker"));
		}

		workerInfo.status = 'busy';
		this.notifyWorkerList();
		workerInfo.worker.postMessage({ type: 'semantic', code, taskId });

		const capturedWorker = workerInfo;
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				this.semanticLocks.delete(taskId);
				this.semanticPromises.delete(taskId);
				capturedWorker.status = 'idle';
				this.notifyWorkerList();
				reject(new Error("Semantic request timed out"));
			}, 10000); // 10 seconds timeout
			this.semanticPromises.set(taskId, { resolve, reject, timeoutId, workerId: capturedWorker.workerId });
		});

	}

	fulfillSemantic(taskId: string, result: unknown) {
		const pending = this.semanticPromises.get(taskId);
		if (!pending) return;

		clearTimeout(pending.timeoutId);
		this.semanticPromises.delete(taskId);
		this.semanticLocks.delete(taskId);

		const workerInfo = this.workers.get(pending.workerId);
		if (workerInfo) {
			workerInfo.status = 'idle';
			this.notifyWorkerList();
		}

		pending.resolve(result);
	}

	/* --- Completion Promises --- */
	async requestCompletion(taskId: string, code: string, line: number, col: number, locals?: Uint8Array | null): Promise<unknown> {
		// this.notify({ taskId, workerId: "pool", workerName:"pool", data:{ message:"requesting completion"}, timestamp: Date.now(), responseType:"log" });
		if (this.completionLocks.has(taskId)) {
			return Promise.reject(new Error("Completion request already in progress for this task"));
		}
		this.completionLocks.add(taskId);

		let workerInfo: WorkerInfo | null | undefined = Array.from(this.workers.values()).find(w => w.type === 'editor' && w.status === 'idle');
		if (!workerInfo) {
			try {
				workerInfo = await this.createWorker('editor', taskId);
			} catch (e) {
				console.log("failed completion worker creation request: ", e)
			}
		}

		if (!workerInfo) {
			this.completionLocks.delete(taskId);
			return Promise.reject(new Error("Failed to obtain editor worker"));
		}

		workerInfo.status = 'busy';
		this.notifyWorkerList();
		const message: Record<string, unknown> = { type: 'completion', code, line, col, taskId };
		if (locals) message.locals = locals;
		workerInfo.worker.postMessage(message);

		const capturedWorker = workerInfo;
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				this.completionLocks.delete(taskId);
				this.completionPromises.delete(taskId);
				capturedWorker.status = 'idle';
				this.notifyWorkerList();
				reject(new Error("Completion request timed out"));
			}, 10000);
			this.completionPromises.set(taskId, { resolve, reject, timeoutId, workerId: capturedWorker.workerId });
		});
	}

	fulfillCompletion(taskId: string, result: unknown) {
		const pending = this.completionPromises.get(taskId);
		if (!pending) return;

		clearTimeout(pending.timeoutId);
		this.completionPromises.delete(taskId);
		this.completionLocks.delete(taskId);

		const workerInfo = this.workers.get(pending.workerId);
		if (workerInfo) {
			workerInfo.status = 'idle';
			this.notifyWorkerList();
		}

		pending.resolve(result);
	}
	
	/* --- Routing --- */
	processMessageResponse(event: MessageEvent, worker: Worker, type: WorkerJob) {
		//console.log(`Message from ${type} worker:`, event.data);
		const workerInfo = Array.from(this.workers.values()).find(w => w.worker === worker);
		if(!workerInfo) {
			console.warn(`Received message from unknown worker:`, event.data);
			return;
		}
		const taskId: string | null = event.data.taskId ?? event.data.id ?? null;
		const responseType = event.data.type ?? null;
		const entry: OutputEntry = {
			workerId: workerInfo?.workerId ?? 'unknown',
			workerName: workerInfo?.name ?? type,
			data: event.data,
			timestamp: Date.now(),
			taskId,
			responseType
		};

		// forward error messages
		if (responseType === 'error') {
			this.notify(entry);
			// if worker was init, dispose of worker and reject init promise
			if (workerInfo.status === 'init') {
				workerInfo.worker.terminate();
				this.workers.delete(workerInfo.workerId);
				const initPromise = this.initPromises.get(workerInfo.workerId);
				if (initPromise) {
					initPromise.reject(new Error("Worker initialization failed"));
					this.initPromises.delete(workerInfo.workerId);
				}
			}
			this.notifyWorkerList();
			return;
		}

		// check if ready msesage
		if (responseType === 'ready' && workerInfo.status === 'init') {
			workerInfo.status = 'idle';
			console.log(`Worker ${workerInfo.name} with id ${workerInfo.workerId} is ready and now idle`);
			this.notifyWorkerList();
			const initPromise = this.initPromises.get(workerInfo.workerId);
			if (initPromise) {
				initPromise.resolve(workerInfo);
				this.initPromises.delete(workerInfo.workerId);
			}
			return;
		}

		// check if lock release message
		if (responseType === 'unlock' && workerInfo.status == 'busy') {
			// sets task back to idle
			// allocated workers are more permanently locked to their tasks
			workerInfo.status = 'idle';
			this.notifyWorkerList();
			return;
		}
		// check if message is a semantic promise completion
		if (workerInfo.type === 'editor') {
			// check response type and pending promise
			if (taskId && responseType === 'semantics') {
				this.fulfillSemantic(taskId, event.data.semantics);
				return;
			}
			if (taskId && responseType === 'completion') {
				this.fulfillCompletion(taskId, event.data.completions);
				return;
			}
			console.warn("Unhandled editor response:", event.data);
			return;
		}

		// kernel messages: trace, execution_complete, execution_stopped, flow, stdout, stderr, expand_ack
		// all forwarded to subscribers via the output buffer
		this.outputBuffer.push(entry);
		this.notify(entry);
	}


	/* --- Output Management --- */

	subscribe(taskId: string | null, listener: OutputListener): () => void {
		const registration: ListenerRegistration = { taskId, listener };
		this.listeners.add(registration);
		return () => this.listeners.delete(registration);
	}

	private notify(entry: OutputEntry) {
		this.listeners.forEach(reg => {
			if (reg.taskId === null || reg.taskId === entry.taskId) {
				reg.listener(entry);
			}
		});
	}

	/* --- Worker Management --- */

	createWorker(type: WorkerJob = 'kernel', taskId?: string, name?: string): Promise<WorkerInfo | null> {
		if (typeof window === 'undefined') return Promise.resolve(null);
		const worker = new Worker(type === 'editor' ? EDITOR_URL : KERNEL_URL);
		worker.onmessage = (event) => {
			this.processMessageResponse(event, worker, type);
		};
		const newWorkerInfo = {
			worker,
			name: name ? name : `${type === 'editor' ? 'Editor' : 'Kernel'} Worker ${this.workers.size}`,

			status: 'init',
			type: type,
			workerId: crypto.randomUUID(),
			taskId: taskId ? taskId : undefined
		} as WorkerInfo;
		this.workers.set(newWorkerInfo.workerId, newWorkerInfo);
		console.log(`Created new ${type} worker with id ${newWorkerInfo.workerId} for task ${taskId ? taskId : 'none'}`);  
		this.notifyWorkerList();
		return new Promise<WorkerInfo>((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error("Semantic request timed out"));
			}, 10000); // 10 seconds timeout
			this.initPromises.set(newWorkerInfo.workerId, { resolve, reject });
		});
	}	

	async allocateWorker(taskId: string, type: WorkerJob = 'kernel', newName?: string, workerId?: string): Promise<WorkerInfo | null> {
		if (workerId) { // attempt to allocate specific worker
			const workerInfo = this.workers.get(workerId);
			if (workerInfo && workerInfo.status === 'idle' && workerInfo.type === type) {
				workerInfo.status = 'allocated';
				workerInfo.taskId = taskId;
				if (newName) workerInfo.name = newName;
				workerInfo.worker.postMessage({ type: 'lock', taskId }); // send lock message to worker to set task id and prevent other allocations
				console.log(`Found ${type} worker for task ${taskId}`);
				this.notifyWorkerList();
				return workerInfo;
			}
		}
		// iterate through workers to find idle worker of correct type
		for (const workerInfo of this.workers.values()) {
			if (workerInfo.status === 'idle' && workerInfo.type === type) {
				workerInfo.status = 'allocated';
				workerInfo.taskId = taskId;
				if (newName) workerInfo.name = newName;
				workerInfo.worker.postMessage({ type: 'lock', taskId }); // send lock message to worker to set task id and prevent other allocations
				console.log(`Found ${type} worker for task ${taskId}`);
				this.notifyWorkerList();
				return workerInfo;
			}
		}
		// if no worker found, create new worker
		const newWorkerInfo = await this.createWorker(type, taskId, newName);
		await new Promise(resolve => setTimeout(resolve, 100)); // wait for worker to initialize and become idle

		if (!newWorkerInfo) {
			console.warn(`Failed to create new ${type} worker for task ${taskId}`);
			return null;
		}

		// allocate new worker
		newWorkerInfo.status = 'allocated';
		newWorkerInfo.taskId = taskId;
		newWorkerInfo.worker.postMessage({ type: 'lock', taskId });
		console.log(`Allocated new ${type} worker with id ${newWorkerInfo.workerId} for task ${taskId}`);
		this.notifyWorkerList();

		return newWorkerInfo;
	}
	
	abandonWorker(workerId: string) {
		const workerInfo = this.workers.get(workerId);
		if (workerInfo && workerInfo.status === 'allocated') {
			workerInfo.status = 'idle';
			workerInfo.taskId = undefined;
			workerInfo.worker.postMessage({ type: 'unlock', taskId: workerInfo.taskId }); // send unlock message to worker to reset context
			console.log(`Worker ${workerInfo.name} with id ${workerId} is now idle`);
			this.notifyWorkerList();
		} else {
			console.warn(`Worker to abandon with id ${workerId} not found in pool`);
		}
	}

	deleteWorker(workerId: string) {
		const workerInfo = this.workers.get(workerId);
		if (workerInfo) {
			workerInfo.worker.terminate();
			this.workers.delete(workerId);
			console.log(`Worker with id ${workerId} deleted from pool`);
			this.notifyWorkerList();
		} else {
			console.warn(`Worker to delete with id ${workerId} not found in pool`);
		}
	}

	messageWorker(workerId: string, message: Record<string, unknown>) {
		const workerInfo = this.workers.get(workerId);
		if (workerInfo) {
			const messageAndId = { id: workerInfo.taskId ?? null, ...message };
			workerInfo.worker.postMessage(messageAndId);
			console.log(`Sent message to worker ${workerInfo.name} with id ${workerId}:`, messageAndId);
		} else {
			console.warn(`Worker to message with id ${workerId} not found in pool`);
		}
	}

	/* --- Worker Listing --- */

	getAllWorkers(): WorkerInfoPublic[] {
		console.log(`Getting all workers. Total count: ${this.workers.size}`);
		return Array.from(this.workers.values()).map(({ worker: _w, ...rest }) => rest as WorkerInfoPublic);
	}

	private notifyWorkerList() {
		const snapshot = Array.from(this.workers.values()).map(({ worker: _w, ...rest }) => rest as WorkerInfoPublic);
		this.workerListListeners.forEach(listener => listener(snapshot));
	}

	subscribeToWorkerList(listener: WorkerListListener): () => void {
		this.workerListListeners.add(listener);
		return () => this.workerListListeners.delete(listener);
	}
}

const pyodidePool = new PyodidePoolManager(1, 1);


const registerSemanticProvider = (monacoInstance: Monaco, pool: PyodidePoolManager, taskId: string) => {
	const tokenTypes = ['namespace', 'type', 'function', 'parameter', 'variable', 'property', 'decorator'];
	const tokenModifiers = ['declaration', 'definition', 'defaultLibrary'];

	return monacoInstance.languages.registerDocumentSemanticTokensProvider('python', {
		getLegend: () => ({ tokenTypes, tokenModifiers }),

		provideDocumentSemanticTokens: async (model: editor.ITextModel) => {
			const code = model.getValue();
			if (!code.trim()) return null;
			try {
				return await pool.requestSemantic(taskId, code) as { data: Uint32Array; resultId: undefined };
			} catch {
				return null;
			}
		},

		releaseDocumentSemanticTokens: () => {},
	});
}

const registerCompletionProvider = (monacoInstance: Monaco, pool: PyodidePoolManager, taskId: string, getLocals: () => Uint8Array | null = () => null) => {
	const CIK = monacoInstance.languages.CompletionItemKind;
	const kindMap: Record<string, number> = {
		module:    CIK.Module,
		class:     CIK.Class,
		function:  CIK.Function,
		param:     CIK.Variable,
		instance:  CIK.Variable,
		keyword:   CIK.Keyword,
		statement: CIK.Keyword,
		property:  CIK.Property,
		path:      CIK.File,
	};

	return monacoInstance.languages.registerCompletionItemProvider('python', {
		triggerCharacters: ['.'],

		provideCompletionItems: async (model: editor.ITextModel, position: Position) => {
			const code = model.getValue();
			if (!code.trim()) return { suggestions: [] };
			const line = position.lineNumber;
			const col = position.column - 1; // Monaco 1-based → Jedi 0-based
			const locals = getLocals();
			try {
				const completions = await pool.requestCompletion(taskId, code, line, col, locals ?? undefined) as { label: string; type: string; signature: string }[];
				const word = model.getWordUntilPosition(position);
				const suggestions = completions
					.filter(c => !(c.label.startsWith('__') && c.label.endsWith('__')))
					.map(c => ({
						label: c.label,
						kind: kindMap[c.type] ?? CIK.Text,
						detail: c.signature,
						insertText: c.label,
						range: {
							startLineNumber: position.lineNumber,
							startColumn: word.startColumn,
							endLineNumber: position.lineNumber,
							endColumn: position.column,
						},
					}));
				return { suggestions };
			} catch {
				return { suggestions: [] };
			}
		},
	});
}

export { pyodidePool, registerSemanticProvider, registerCompletionProvider };