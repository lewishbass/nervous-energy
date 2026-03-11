import {
	VscPlay,
	VscDebugPause,
	VscDebugStepOver,
	VscDebugRestart,
	VscDebugStop,
	VscSave,
	VscNewFile,
	VscFolderOpened,
	VscSettingsGear,
	VscTrash,
	VscArchive,
	VscServer,
} from 'react-icons/vsc';
import { useState } from 'react';
import { copyToClipboard } from '@/scripts/clipboard';
import { pyodidePool, WorkerInfoPublic } from '@/components/coding/PoolManager';

type ToolbarPanelProps = {
	isCompact?: boolean;
	running: boolean;
	paused: boolean;
	documentName: string;
	onDocumentNameChange: (name: string) => void;
	onRun: () => void;
	onPause: () => void;
	onResume: () => void;
	onStep: () => void;
	onStop: () => void;
	onRestart: () => void;
	onSpeedChange: (speed: number) => void;
	speed: number;
	cachedCode?: string;
	onLoadCachedCode?: () => void;
	// file management
	onSave: () => void;
	onNewFile: () => void;
	onLoadFile: (name: string) => void;
	onDeleteFile: (name: string) => void;
	fileList: Record<string, string>;
	onRefreshFileList: () => Record<string, string>;
	// settings
	settings: { text: string; get: boolean; set: (v: boolean) => void }[];
};

const ToolBtn = ({ icon: Icon, label, accent, onClick, children, className, isCompact: compact, disabled }: {
	icon: React.ElementType; label: string; accent?: string; onClick?: () => void;
	children?: React.ReactNode; className?: string; isCompact?: boolean; disabled?: boolean;
}) => (
	<button
		title={label}
		disabled={disabled}
		className={`p-${compact ? '0.5' : '1.5'} rounded-md hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed ${className || ''}`}
		style={{ color: accent }}
		onClick={onClick}
	>
		<Icon className="w-5 h-5" />
		{children}
	</button>
);

export default function ToolbarPanel({
	isCompact = false,
	running,
	paused,
	documentName,
	onDocumentNameChange,
	onRun,
	onPause,
	onResume,
	onStep,
	onStop,
	onRestart,
	onSpeedChange,
	speed,
	cachedCode,
	onLoadCachedCode,
	onSave,
	onNewFile,
	onLoadFile,
	onDeleteFile,
	fileList,
	onRefreshFileList,
	settings,
}: ToolbarPanelProps) {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [poolListOpen, setPoolListOpen] = useState(false);
	const [fileListOpen, setFileListOpen] = useState(false);
	const [currentFileList, setCurrentFileList] = useState<Record<string, string>>({});

	const openOneMenu = (toOpen: string) => {
		setSettingsOpen(toOpen === 'settings' ? !settingsOpen : false);
		setPoolListOpen(toOpen === 'pool' ? !poolListOpen : false);
		if (toOpen === 'file') {
			const newOpen = !fileListOpen;
			setFileListOpen(newOpen);
			if (newOpen) setCurrentFileList(onRefreshFileList());
		} else {
			setFileListOpen(false);
		}
	};

	return (
		<div className={`flex-shrink-0 flex items-center gap-1 px-3 py-${isCompact ? '0' : '1'} bg2 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm z-20`}>
			{!isCompact && (
				<>
					<input
						className="tc1 font-bold text-lg mr-4 select-none active:outline-1 pl-2 bg-transparent"
						value={documentName}
						onChange={(e) => onDocumentNameChange(e.target.value)}
						spellCheck={false}
						maxLength={25}
					/>
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
				</>
			)}

			{/* Run / Pause / Resume */}
			{!running ? (
				<ToolBtn icon={VscPlay} label="Run (Ctrl+Enter)" accent="var(--khg)" onClick={onRun} isCompact={isCompact} />
			) : paused ? (
				<ToolBtn icon={VscPlay} label="Resume" accent="var(--khg)" onClick={onResume} isCompact={isCompact} />
			) : (
				<ToolBtn icon={VscDebugPause} label="Pause" accent="var(--khy)" onClick={onPause} isCompact={isCompact} />
			)}

			<ToolBtn icon={VscDebugStepOver} label="Step" accent="var(--khb)" onClick={onStep} isCompact={isCompact} />
			<ToolBtn icon={VscDebugRestart} label="Restart Environment" accent="var(--kho)" onClick={onRestart} disabled={running} isCompact={isCompact} />
			<ToolBtn icon={VscDebugStop} label="Stop" accent="var(--khr)" onClick={onStop} disabled={!running} isCompact={isCompact} />

			{/* Speed slider */}
			<div className="flex items-center gap-1 ml-2 text-xs tc2 select-none">
				<span className="opacity-60 whitespace-nowrap font-courier">{speed.toFixed(1)}s</span>
				<style>{`
					.speed-slider {
						-webkit-appearance: none;
						appearance: none;
						width: 4rem;
						height: 12px;
						cursor: pointer;
						padding: 0;
						background: transparent;
					}
					.speed-slider::-webkit-slider-runnable-track {
						background: transparent;
						border: 2px solid #000;
						height: 14px;
						border-radius: 6px;
					}
					.speed-slider::-webkit-slider-thumb {
						-webkit-appearance: none;
						appearance: none;
						background: #000;
						border: none;
						border-radius: 50%;
						width: 12px;
						height: 12px;
						cursor: pointer;
						margin-top: -1px;
					}
					.speed-slider::-moz-range-track {
						background: transparent;
						border: 1px solid #000;
						height: 12px;
						border-radius: 6px;
					}
					.speed-slider::-moz-range-progress {
						background: transparent;
						border: none;
					}
					.speed-slider::-moz-range-thumb {
						background: #000;
						border: none;
						border-radius: 50%;
						width: 12px;
						height: 12px;
						cursor: pointer;
					}
					.speed-slider::-moz-focus-outer {
						border: none;
					}
					
						.dark .speed-slider::-webkit-slider-runnable-track {
							border-color: #e5e7eb;
						}
						.dark .speed-slider::-webkit-slider-thumb {
							background: #f3f4f6;
						}
						.dark .speed-slider::-moz-range-track {
							border-color: #e5e7eb;
						}
						.dark .speed-slider::-moz-range-thumb {
							background: #f3f4f6;
						}
					
				`}</style>
				<input
					type="range"
					min={0}
					max={2}
					step={0.1}
					value={speed}
					onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
					className="speed-slider"
					title="Trace speed (seconds between steps)"
				/>
			</div>

			{cachedCode && (
				<>
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
					<ToolBtn icon={VscArchive} label="Load Cached Code" onClick={onLoadCachedCode} isCompact={isCompact} />
				</>
			)}

			<div className="w-px h-6 bg-gray-400/40 mx-1.5" />
			<div className="h-6 mx-auto" />

			{!isCompact && (
				<>
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
					<ToolBtn icon={VscNewFile} label="New File" onClick={onNewFile} isCompact={isCompact} />
					<ToolBtn icon={VscFolderOpened} label="Open File" className="relative" onClick={() => openOneMenu('file')} isCompact={isCompact}>
						{fileListOpen && Object.keys(currentFileList).length > 0 && (
							<div className="absolute top-10 right-0 mt-1 w-48 bg2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-10"
								onMouseLeave={() => setFileListOpen(false)}>
								{Object.keys(currentFileList).map((fileName) => (
									<div key={fileName} className="relative px-3 py-2 hover:bg-gray-300/40 dark:hover:bg-gray-600/40 cursor-pointer transition-colors text-left pl-3"
										onClick={() => { onLoadFile(fileName); setFileListOpen(false); }}>
										{fileName}
										<VscTrash
											className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 hover:opacity-100 transition-all hover:text-red-500"
											title="Delete File"
											onClick={(e) => { e.stopPropagation(); onDeleteFile(fileName); setCurrentFileList(onRefreshFileList()); }}
										/>
									</div>
								))}
							</div>
						)}
					</ToolBtn>
					<ToolBtn icon={VscSave} label="Save" onClick={onSave} isCompact={isCompact} />
					<div className="w-px h-6 bg-gray-400/40 mx-1" />
				</>
			)}

			<ToolBtn icon={VscServer} label="Worker Pool" className="relative" onClick={() => openOneMenu('pool')} isCompact={isCompact}>
				{poolListOpen && (
					<div className="absolute top-10 right-0 mt-1 w-48 bg2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-10 p-3 gap-2 flex flex-col"
						onMouseLeave={() => setPoolListOpen(false)}>
						{pyodidePool.getAllWorkers().map((worker: WorkerInfoPublic, index: number) => (
							<div key={index} className="flex items-center justify-between cursor-pointer">
								<span className="text-sm mr-1 text-nowrap">{worker.name}</span>
								<span className="text-xs opacity-50 mr-1 text-nowrap">{worker.type}</span>
								<span className="text-xs opacity-50 text-nowrap">{worker.status}</span>
							</div>
						))}
						{pyodidePool.getAllWorkers().length === 0 && <span className="text-xs opacity-40">No workers</span>}
					</div>
				)}
			</ToolBtn>

			<ToolBtn icon={VscSettingsGear} label="Settings" onClick={() => openOneMenu('settings')} className="relative" isCompact={isCompact}>
				{settingsOpen && (
					<div className="absolute top-10 right-0 mt-1 w-64 bg2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-10 p-3 gap-2 flex flex-col"
						onMouseLeave={() => setSettingsOpen(false)}>
						{settings.map((s, i) => (
							<div key={i} className="flex items-center justify-between cursor-pointer" onClick={() => s.set(!s.get)}>
								<span className="text-sm">{s.text}</span>
								<input type="checkbox" checked={s.get} onChange={() => s.set(!s.get)} />
							</div>
						))}
					</div>
				)}
			</ToolBtn>
		</div>
	);
}
