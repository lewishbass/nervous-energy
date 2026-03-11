import { useRef, useEffect } from 'react';
import { VscClearAll } from 'react-icons/vsc';
import DraggableDivider from '@/components/DraggableDivider';


// Variable summary shape as returned by the kernel worker
export type VariableSummary = {
	name: string;
	type: string;
	json: string | null;
	repr: string | null;
	callable: boolean;
	id: string;
	// client-side only
	expanded?: boolean;
	children?: Record<string, VariableSummary>;
};

// One frame in the call stack
export type FrameData = {
	name: string;
	locals: Record<string, VariableSummary>;
};

type TerminalLine = { text: string; type: 'stdout' | 'stderr' | 'info' | 'error' };

type VariableExplorerProps = {
	frames: FrameData[];
	terminalLines: TerminalLine[];
	onClearTerminal: () => void;
	onExpandCollapse: (path: string, expand: boolean) => void;
	isCompact?: boolean;
};

export default function VariableExplorer({
	frames,
	terminalLines,
	onClearTerminal,
	onExpandCollapse,
	isCompact = false,
}: VariableExplorerProps) {
	const terminalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalLines]);

	const renderVariable = (v: VariableSummary, index: number, path: string[] = [], depth: number = 0): React.ReactNode => {
		const fullPath = [...path, v.name].join('.');
		const displayValue = v.repr ?? v.json ?? '<unknown>';
		return (
			<>
				<tr
					key={fullPath + '_' + depth + '_' + index}
					className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/5 cursor-pointer"
					onClick={() => onExpandCollapse(fullPath, !v.expanded)}
				>
					<td
						title={v.name}
						className={`flex flex-row items-end py-1.5 pl-2 pr-3 text-blue-600 dark:text-blue-400 ${v.callable ? 'opacity-80' : 'font-semibold'} whitespace-nowrap`}
					>
						{path.map((p, i) => (
							<div key={p + i} className="opacity-50 text-xs pb-[0.75px] max-w-7.5 min-w-7.5 w-7.5 overflow-hidden" title={p}>
								{i > 0 && '.'}{p}
							</div>
						))}
						<div className="max-w-30 overflow-hidden text-ellipsis">
							{path.length > 0 && '.'}{v.name}
						</div>
					</td>
					<td className="py-1.5 pr-3 opacity-50 italic whitespace-nowrap max-w-30 text-ellipsis overflow-x-hidden" title={v.type}>
						{v.type}
					</td>
					<td className={`py-1 tc1 line-clamp-${isCompact ? '1' : '2'}`} title={displayValue}>
						{displayValue}
					</td>
				</tr>
				{v.expanded && v.children && Object.values(v.children).map((child, i) => (
					renderVariable(child, i, [...path, v.name], depth + 1)
				))}
			</>
		);
	};

	const hasVariables = frames.some(f => Object.keys(f.locals).length > 0);

	return (
		<DraggableDivider
						direction="vertical"
						initialPosition={55}
						edgeSize={[15, 15]}
						collapseEnd={true} collapseStart={true}
						color="green"
						className="flex-grow overflow-hidden"
					>
			{/* ---- Variables section ---- */}
			<div className="flex-1 overflow-hidden flex flex-col min-h-0 h-full">
				{!isCompact && (
					<div className="px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm">
						<h3 className="text-sm font-bold tc1 select-none">Variables</h3>
					</div>
				)}
				<div className={`flex-grow bg2 px-${isCompact ? '1' : '2'} py-${isCompact ? '0' : '2'} tc1 overflow-auto mini-scroll`}>
					{!hasVariables ? (
						<p className="opacity-40 text-sm select-none p-3">Run code to inspect variables.</p>
					) : (
						frames.map((frame, frameIdx) => (
							<div key={frame.name + frameIdx} className="mb-3">
								{frames.length > 1 && (
									<div className="text-xs font-bold tc2 uppercase tracking-wide px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded mb-1 select-none">
										{frame.name === '<module>' ? 'Global' : frame.name}
									</div>
								)}
								<table className="w-full text-sm font-mono">
									{!isCompact && frameIdx === 0 && (
										<thead>
											<tr className="border-b border-gray-300 dark:border-gray-600 text-left">
												<th className="w-1/4 pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide">Name</th>
												<th className="w-1/4 pb-1.5 pr-3 font-semibold tc2 text-xs uppercase tracking-wide">Type</th>
												<th className="pb-1.5 font-semibold tc2 text-xs uppercase tracking-wide">Value</th>
											</tr>
										</thead>
									)}
									<tbody>
										{Object.values(frame.locals).map((v, i) => renderVariable(v, i))}
									</tbody>
								</table>
							</div>
						))
					)}
				</div>
			</div>

			{/* ---- Terminal section ---- */}
			<div className="flex-1 overflow-hidden flex flex-col min-h-0 border-t border-gray-200 dark:border-gray-700 h-full">
				{!isCompact && (
					<div className="px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center gap-2 backdrop-blur-sm">
						<h3 className="text-sm font-bold tc1 select-none">Terminal</h3>
						<button
							title="Clear Terminal"
							onClick={onClearTerminal}
							className="ml-auto p-1 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer select-none tc2"
						>
							<VscClearAll className="w-4 h-4" />
						</button>
					</div>
				)}
				<div ref={terminalRef} className="flex-grow bg3 p-3 font-mono text-sm overflow-auto mini-scroll pb-20">
					{terminalLines.length === 0 ? (
						<span className="opacity-60 select-none text-green-600 dark:text-green-400" />
					) : (
						terminalLines.map((line, i) => (
							<div key={i} className={`whitespace-pre-wrap ${
								line.type === 'error' ? 'text-red-500 dark:text-red-400' :
								line.type === 'stderr' ? 'text-yellow-600 dark:text-yellow-400' :
								line.type === 'info' ? 'opacity-50 text-gray-500 dark:text-gray-400' :
								'text-green-600 dark:text-green-400'
							}`}>
								{line.text}
							</div>
						))
					)}
				</div>
			</div>
		</DraggableDivider>
	);
}
