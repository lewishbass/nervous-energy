import { useRef, useEffect } from 'react';
import { VscClearAll } from 'react-icons/vsc';

type TerminalLine = { text: string; type: 'stdout' | 'stderr' | 'info' | 'error' };

type TerminalPaneProps = {
	terminalLines: TerminalLine[];
	onClearTerminal: () => void;
	isCompact?: boolean;
};

export default function TerminalPane({
	terminalLines,
	onClearTerminal,
	isCompact = false,
}: TerminalPaneProps) {
	const terminalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalLines]);

	return (
		<div className="flex-1 overflow-hidden flex flex-col min-h-0 h-full">
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
	);
}
