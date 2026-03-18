'use client';
import { useState } from "react";
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

type VariableExplorerProps = {
	frames: FrameData[];
	onExpandCollapse: (path: string, expand: boolean) => void;
	isCompact?: boolean;
	lastEvent?: string | null;
	lastArgs?: string | null;
};

export default function VariableExplorer({
	frames,
	onExpandCollapse,
	isCompact = false,
	lastEvent = null,
	lastArgs = null,

}: VariableExplorerProps) {

	const [expandNames, setExpandNames] = useState<boolean>(true);
	const [expandTypes, setExpandTypes] = useState<boolean>(true);
	const [expandValues, setExpandValues] = useState<boolean>(true);
	const [expandIds, setExpandIds] = useState<boolean>(false);

	const n_expanded = (expandNames ? 1 : 0) + (expandTypes ? 1 : 0) + (expandValues ? 1 : 0) + (expandIds ? 1 : 0);
	const col_width = (n_expanded === 0) ? '0' : `${100 / n_expanded}%`;

	const renderVariable = (v: VariableSummary, index: number, path: string[] = [], frame: FrameData, depth: number = 0): React.ReactNode => {
		const fullPath = frame.name + '|' + [...path, v.name].join('.');
		const displayValue = v.repr ?? v.json ?? '<unknown>';
		return (
			<>
				<tr
					key={fullPath + '_' + depth + '_' + index}
					className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/5" style={{ cursor: !v.callable ? 'pointer' : 'default' }}
					onClick={() => { if (!v.callable) onExpandCollapse(fullPath, !v.expanded) }}
				>
					<td
						title={fullPath}
						className={`flex flex-row items-end py-1.5 pl-2 pr-3 text-blue-600 dark:text-blue-400 ${v.callable ? 'opacity-80' : 'font-semibold'} whitespace-nowrap`}
					>
						{expandNames && path.map((p, i) => (
							<div key={p + i} className="opacity-50 text-xs pb-[0.75px] max-w-7.5 min-w-7.5 w-7.5 overflow-hidden" title={p}>
								{i > 0 && '.'}{p}
							</div>
						))}
						<div className="max-w-30 overflow-hidden text-ellipsis">
							{expandNames && path.length > 0 && '.'}{expandNames && v.name}
						</div>
					</td>
					<td className="py-1.5 pr-3 opacity-50 italic whitespace-nowrap max-w-30 text-ellipsis overflow-x-hidden" title={v.type}>
						{expandTypes && v.type}
					</td>
					<td className={`py-1 tc1 line-clamp-${isCompact ? '1' : '2'}`} title={displayValue}>
						{expandValues && displayValue}
					</td>
					<td className="py-1.5 pl-3 opacity-50 text-xs whitespace-nowrap">
						{expandIds && v.id}
					</td>
				</tr>
				{v.expanded && v.children && Object.values(v.children).map((child, i) => (
					renderVariable(child, i, [...path, v.name], frame, depth + 1)
				))}
			</>
		);
	};

	const hasVariables = frames.some(f => Object.keys(f.locals).length > 0);

	return (
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
							<table className="w-full text-sm font-mono">
								{!isCompact && (
									<thead>
									<tr className="border-b border-gray-300 dark:border-gray-600 text-left">
										<th className="pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide cursor-pointer select-none" style={{ width: expandNames ? col_width : '0' }} onClick={() => setExpandNames(!expandNames)}>Name</th>
										<th className="pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide cursor-pointer select-none" style={{ width: expandTypes ? col_width : '0' }} onClick={() => setExpandTypes(!expandTypes)}>Type</th>
										<th className="pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide cursor-pointer select-none" style={{ width: expandValues ? col_width : '0' }} onClick={() => setExpandValues(!expandValues)}>Value</th>
										<th className="pb-1.5 pl-2 pr-3 font-semibold tc2 text-xs uppercase tracking-wide cursor-pointer select-none" style={{ width: expandIds ? col_width : '0' }} onClick={() => setExpandIds(!expandIds)}>ID</th>
										</tr>
									</thead>
								)}
								<tbody>
									{
									frames.map((frame, frameIdx) => (
										<>
											<tr key={frame.name + '_frame_' + frameIdx}>
												<td colSpan={30}>
													<div className="bg-gray-100 dark:bg-gray-800 py-1.5 px-2 text-sm font-semibold tc2 lg mt-4">
													{frame.name === '<module>' ? 'Global' : frame.name}
													</div>
												</td>
											</tr>
											{Object.values(frame.locals).map((v, i) => renderVariable(v, i, [], frame))}
									</>
									)).reverse()
								}
								</tbody>
							</table>
					
				)}
			</div>
			{lastEvent && (
				<div className="px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm flex flex-row gap-4">
					<div className="text-sm tc2"><span className="tc1 font-bold">Last Event</span>: {lastEvent}</div>
					{lastArgs && lastArgs !== 'None' && <div className="text-sm tc2">( {lastArgs} )</div>}
				</div>
			)
			}
		</div>
	);
}
