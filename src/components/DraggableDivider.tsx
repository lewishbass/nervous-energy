'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type DraggableDividerProps = {
	/** Two panels: [start (left/top), end (right/bottom)] */
	children: [React.ReactNode, React.ReactNode];
	direction?: 'horizontal' | 'vertical';
	/** Initial divider position as a percentage (0–100). Default: 50 */
	initialPosition?: number;
	/** Minimum percentage from each edge [startMin, endMin]. Default: [0, 0] */
	edgeSize?: [number, number];
	/** If whether to collapse when reaching the edge */
	collapseStart?: boolean;
	collapseEnd?: boolean;
	className?: string;
	style?: React.CSSProperties;
	color?: string;
};

export default function DraggableDivider({
	children,
	direction = 'horizontal',
	initialPosition = 50,
	edgeSize = [0, 0],
	collapseStart = false,
	collapseEnd = false,
	className = '',
	style = {},
	color = "blue",
	
}: DraggableDividerProps) {
	const [position, setPosition] = useState(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const isHorizontal = direction === 'horizontal';
	const startCollapsed = collapseStart && position <= edgeSize[0];
	const endCollapsed = collapseEnd && position >= 100 - edgeSize[1];
	const isCollapsed = startCollapsed || endCollapsed;

	const onMouseDown = useCallback(() => setIsDragging(true), []);

	useEffect(() => {
		if (!isDragging) return;

		document.body.style.userSelect = 'none';
		document.body.style.cursor = isHorizontal ? 'ew-resize' : 'ns-resize';

		const onMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const raw = isHorizontal
				? ((e.clientX - rect.left) / rect.width) * 100
				: ((e.clientY - rect.top) / rect.height) * 100;
			setPosition(Math.min(Math.max(raw, edgeSize[0]), 100 - edgeSize[1]));
		};

		const onUp = () => {
			setIsDragging(false);
			document.body.style.userSelect = 'auto';
			document.body.style.cursor = 'default';
		};

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		};
	}, [isDragging, isHorizontal, edgeSize]);

	const dividerThickness = isHorizontal
		? isCollapsed ? 'w-3' : isDragging ? 'w-1.75' : 'w-1.5'
		: isCollapsed ? 'h-3' : isDragging ? 'h-1.75' : 'h-1.5';

	const cursorClass = isHorizontal ? 'cursor-ew-resize' : 'cursor-ns-resize';

	return (
		<div
			ref={containerRef}
			className={`w-full h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
			style={style}
		>
			{/* Start panel */}
			{!startCollapsed && (
				<div
					className="overflow-hidden min-w-0 min-h-0"
					style={
						endCollapsed
							? { flex: 1 }
							: isHorizontal
							? { width: `${position}%`, flexShrink: 0 }
							: { height: `${position}%`, flexShrink: 0 }
					}
				>
					{children[0]}
				</div>
			)}

			{/* Divider bar */}
			<div
				onMouseDown={onMouseDown}
				className={`flex-shrink-0 ${dividerThickness} ${cursorClass} relative flex items-center justify-center group backdrop-blur-md `}
			>
				<div style={{backgroundColor: color}} className={`absolute inset-0 transition-opacity ${isDragging
						? `opacity-42`
						: `opacity-25 hover:opacity-35`
				}`}/>
				<div
					style={{backgroundColor: color}}
					className={'opacity-100 rounded-full duration-300 '+
						(isHorizontal ? `${isDragging? 'h-18' :'h-12'} transition-[height] group-hover:h-18 group-active:h-21 ${isCollapsed? 'w-1' : 'w-0.5'}`
							: `${isDragging? 'w-18':'w-12'} transition-[width] group-hover:w-18 group-active:w-21 ${isCollapsed? 'h-1' : 'h-0.5'}`)
					}
				/>
			</div>

			{/* End panel */}
			{!endCollapsed && (
				<div
					className="overflow-hidden min-w-0 min-h-0 flex-1"
				>
					{children[1]}
				</div>
			)}
		</div>
	);
}
