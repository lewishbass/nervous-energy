'use client';

import { useState, useEffect } from 'react';
import { FiTrash2, FiLogOut, FiPlus, FiLogIn } from 'react-icons/fi';
import { VscPlay, VscClearAll } from 'react-icons/vsc';
import { pyodidePool, OutputEntry } from '@/components/coding/PoolManager';
import { useWorkerList } from '@/hooks/useWorkerList';
import DraggableDivider from '@/components/DraggableDivider';

type WorkerPanelProps = {
	className?: string;
	style?: React.CSSProperties;
};

export default function WorkerPanel( { className = '', style = {} }: WorkerPanelProps) {
	const workers = useWorkerList();
	const [outputBuffer, setOutputBuffer] = useState<OutputEntry[]>([]);
	const [newWorkerType, setNewWorkerType] = useState<'editor' | 'kernel'>('kernel');
	const [newTaskId, setNewTaskId] = useState('');
	const [newWorkerName, setNewWorkerName] = useState('');

	useEffect(() => {
		return pyodidePool.subscribe(null, (entry) => {
			setOutputBuffer(prev => [...prev, entry]);
		});
	}, []);

	const handleCreateWorker = () => {
		const newWorker = pyodidePool.createWorker(
			newWorkerType,
			newTaskId || undefined,
			newWorkerName || undefined
		);
		if (newWorker != null) {
			setNewTaskId('');
			setNewWorkerName('');
		}
	};

	const handleAbandonWorker = (workerId: string) => {
		pyodidePool.abandonWorker(workerId);
	};

	const handleDeleteWorker = (workerId: string) => {
		pyodidePool.deleteWorker(workerId);
	};

	const handleAllocateWorker = (taskId: string, type: 'editor' | 'kernel', newName?: string, workerId?: string) => {
		pyodidePool.allocateWorker(taskId, type, newName, workerId);
	};

	const handleClearOutput = () => {
		setOutputBuffer([]);
	}

	return (
		<>
			<style>{`
				.worker-panel-select {
					color-scheme: light dark;
				}
				.worker-panel-select option {
					background-color: white;
					color: #111827;
					padding: 4px 8px;
				}
				.dark .worker-panel-select option {
					background-color: #1f2937;
					color: #f3f4f6;
				}
				.worker-panel-select option:checked {
					background: linear-gradient(#3b82f6, #3b82f6);
					background-color: #3b82f6 !important;
					color: white !important;
				}
			`}</style>
			<DraggableDivider
			direction="horizontal"
			initialPosition={30}
			edgeSize={[15, 15]}
			collapseStart collapseEnd
			className={className}
			style={style}
			color="green"
		>
			{/* ---- Worker Management ---- */}
			<div className="h-full flex flex-col overflow-hidden">
				{/* ---- Workers header ---- */}
				<div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 border-b border-gray-300 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm">
					<h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 select-none">Workers</h3>
				</div>

				{/* ---- Workers list ---- */}
				<div className="flex-1 overflow-y-auto mini-scroll p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
					{workers.length === 0 ? (
					<p className="opacity-40 text-sm text-gray-600 dark:text-gray-400 select-none p-1">No workers yet</p>
				) : (
					workers.map((workerInfo) => (
						<div
							key={workerInfo.workerId}
							className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{workerInfo.name}</p>
										<div className="flex flex-wrap gap-2 mt-1">
										<span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
											{workerInfo.type}
										</span>
										<span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
											workerInfo.status === 'idle'
												? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
												: workerInfo.status === 'allocated'
													? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
												: workerInfo.status === 'busy'
													? 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200'
												: workerInfo.status === 'init'
													? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
													: 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
											}`}>
												{workerInfo.status}
											</span>
										</div>
										{workerInfo.taskId && (
										<p className="text-xs text-gray-600 dark:text-gray-400 mt-1 break-words">ID: {workerInfo.taskId}</p>
										)}
									</div>
									<div className="flex gap-1">
										<button
										onClick={() => pyodidePool.messageWorker(workerInfo.workerId, { type: 'run', code: '1+1' })}
											className="p-1.5 hover:bg-green-500/20 dark:hover:bg-green-900/50 rounded transition-colors select-none cursor-pointer text-green-600 dark:text-green-400"
											title="Execute"
										>
											<VscPlay className="w-4 h-4" />
										</button>
										<button
											disabled={workerInfo.status === 'allocated'}
											className="p-1.5 hover:bg-green-500/20 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors select-none cursor-pointer text-green-600 dark:text-green-400"
											title="Allocate worker"
											onClick={() => handleAllocateWorker(newTaskId || 'newtaskid', workerInfo.type, workerInfo.name, workerInfo.workerId)}
										>
											<FiLogIn className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleAbandonWorker(workerInfo.workerId)}
											disabled={workerInfo.status === 'idle'}
											className="p-1.5 hover:bg-orange-500/20 dark:hover:bg-orange-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors select-none cursor-pointer text-orange-600 dark:text-orange-400"
											title="Abandon worker"
										>
											<FiLogOut className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDeleteWorker(workerInfo.workerId)}
											className="p-1.5 hover:bg-red-500/20 dark:hover:bg-red-900/50 rounded transition-colors select-none cursor-pointer text-red-600 dark:text-red-400"
											title="Delete worker"
										>
											<FiTrash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* ---- Create Worker header ---- */}
				<div className="px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-600/20 dark:to-emerald-600/20 border-t border-b border-gray-300 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm">
					<h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 select-none">Create Worker</h3>
				</div>

				{/* ---- Create Worker form ---- */}
				<div className="p-3 space-y-3 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
					<div>
						<label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2 uppercase tracking-wide">Type</label>
						<select
							value={newWorkerType}
							onChange={(e) => setNewWorkerType(e.target.value as 'editor' | 'kernel')}
							className="worker-panel-select w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors appearance-none cursor-pointer"
						>
							<option value="kernel">Kernel</option>
							<option value="editor">Editor</option>
						</select>
					</div>
					<div>
						<label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2 uppercase tracking-wide">Task ID</label>
						<input
							type="text"
							value={newTaskId}
							onChange={(e) => setNewTaskId(e.target.value)}
							placeholder="Optional"
							className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 px-3 py-2.5 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2 uppercase tracking-wide">Name</label>
						<input
							type="text"
							value={newWorkerName}
							onChange={(e) => setNewWorkerName(e.target.value)}
							placeholder="Optional"
							className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 px-3 py-2.5 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
						/>
					</div>
					<button
						onClick={handleCreateWorker}
						className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 select-none cursor-pointer shadow-sm hover:shadow-md active:scale-98"
					>
						<FiPlus className="w-4 h-4" />
						Create Worker
					</button>
				</div>
			</div>

			{/* ---- Pool Output ---- */}
			<div className="h-full flex flex-col bg-white dark:bg-gray-950">
				{/* ---- Pool Output header ---- */}
				<div className="px-3 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-600/20 dark:to-red-600/20 border-b border-gray-300 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm flex flex-row items-center justify-between">
					<h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 select-none">Pool Output</h3>
					<VscClearAll className="cursor-pointer select-none text-gray-700 dark:text-gray-300 hover:opacity-70 active:opacity-50 transition-opacity" onClick={handleClearOutput} />
				</div>

				{/* ---- Pool Output list ---- */}
				<div className="flex-1 overflow-y-auto mini-scroll p-3 font-mono text-xs space-y-1  bg-gray-50 dark:bg-gray-900">
					{outputBuffer.length === 0 ? (
					<p className="opacity-40 text-sm text-gray-600 dark:text-gray-400 select-none p-1">No output yet</p>
				) : (
					outputBuffer.map((entry, i) => (
						<div key={i} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 space-y-0.5">
							<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
								<span className="text-blue-600 dark:text-blue-400 font-bold">{entry.workerName}</span>
								<span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
							</div>
							<pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all">{typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data, null, 2)}</pre>
							</div>
						))
					)}
				</div>
			</div>
		</DraggableDivider>
		</>
	);
}
