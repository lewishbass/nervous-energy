'use client';
import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import RobotViz, { type RobotVizHandle, type RobotAction } from '@/components/coding/panels/visualizers/RobotViz';
import MazeViz, { type MazeVizHandle, type MazeAction } from '@/components/coding/panels/visualizers/MazeViz';

/* ---- unified vis action ---- */
export type VisAction = {
	actionClass: 'robot' | 'maze';
	actionType: string;
	[key: string]: unknown;
};

export type MscVizPanelHandle = {
	handleVisAction: (action: VisAction) => void;
	reset: () => void;
};

type MscVizPanelProps = {
	isCompact?: boolean;
};

/* re-export sub-types for convenience */
export type { RobotAction, MazeAction };

const MscVizPanel = forwardRef<MscVizPanelHandle, MscVizPanelProps>(
	function MscVizPanel({ isCompact = false }, ref) {
		const robotRef = useRef<RobotVizHandle>(null);
		const mazeRef = useRef<MazeVizHandle>(null);

		const [mode, setMode] = useState<'none' | 'robot' | 'maze'>('none');

		useImperativeHandle(ref, () => ({
			handleVisAction(action: VisAction) {
				if (action.actionClass === 'robot') {
					if (mode !== 'robot') setMode('robot');
					const robotAction: RobotAction = {
						action: action.actionType as RobotAction['action'],
						robotId: action.robotId as string,
						robotName: action.robotName as string,
						pos: action.pos as [number, number] | undefined,
						angle: action.angle as number | undefined,
						from: action.from as [number, number] | undefined,
						to: action.to as [number, number] | undefined,
						oldAngle: action.oldAngle as number | undefined,
					};
					robotRef.current?.handleRobotAction(robotAction);
				} else if (action.actionClass === 'maze') {
					if (mode !== 'maze') setMode('maze');
					const mazeAction: MazeAction = {
						type: action.actionType as MazeAction['type'],
						mazeId: action.mazeId as string,
						grid: action.grid as string[][] | undefined,
						rows: action.rows as number | undefined,
						cols: action.cols as number | undefined,
						runnerPos: action.runnerPos as [number, number] | undefined,
						runnerFacing: action.runnerFacing as MazeAction['runnerFacing'],
						success: action.success as boolean | undefined,
					};
					mazeRef.current?.handleMazeAction(mazeAction);
				}
			},

			reset() {
				setMode('none');
				robotRef.current?.reset();
				mazeRef.current?.reset();
			},
		}), [mode]);

		return (
			<div className="flex-1 overflow-hidden flex flex-col min-h-0 h-full">
				{!isCompact && (
					<div className="px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 backdrop-blur-sm">
						<h3 className="text-sm font-bold tc1 select-none">Visualizer</h3>
					</div>
				)}
				<div className="flex-grow bg2 tc1 overflow-hidden relative">
					{/* Robot visualizer */}
					<div className={`absolute inset-0 ${mode === 'robot' ? '' : 'hidden'}`}>
						<RobotViz ref={robotRef} />
					</div>
					{/* Maze visualizer */}
					<div className={`absolute inset-0 ${mode === 'maze' ? '' : 'hidden'}`}>
						<MazeViz ref={mazeRef} />
					</div>
					{/* Placeholder when no visualizer is active */}
					{mode === 'none' && (
						<p className="absolute inset-0 flex items-start pt-20 justify-center opacity-40 text-sm select-none pointer-events-none">
							Run code to visualize.
						</p>
					)}
				</div>
			</div>
		);
	}
);

export default MscVizPanel;
