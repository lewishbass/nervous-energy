'use client';

import { memo } from 'react';
import ThreeStateCheckbox from './three-state-checkbox';
import type { TagFilter } from './useTagFilter';

export type TagItem = readonly [label: string, count: number];

interface TagCheckboxGridProps {
	items: readonly TagItem[];
	filter: TagFilter;
	/** min column width for the auto-fill grid */
	minColWidth?: number;
}

/**
 * A grid of three-state checkboxes with labels and counts.
 * Memoized so it only re-renders when items, filter state, or visibility change.
 * Each row is itself memoized so toggling one checkbox only re-renders that row.
 */
export default memo(function TagCheckboxGrid({
	items,
	filter,
	minColWidth = 180,
}: TagCheckboxGridProps) {
	return (
		<div
			className="grid gap-1"
			style={{
				gridAutoRows: 'min-content',
				gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`,
			}}
		>
			{items.map(([label, count]) => (
				<TagCheckboxRow
					key={label}
					label={label}
					count={count}
					value={filter.get(label)}
					onChange={filter.setterFor(label)}
				/>
			))}
		</div>
	);
});

interface TagCheckboxRowProps {
	label: string;
	count: number;
	value: boolean | null;
	onChange: (value: boolean | null) => void;
}

const TagCheckboxRow = memo(function TagCheckboxRow({
	label,
	count,
	value,
	onChange,
}: TagCheckboxRowProps) {
	return (
		<div className="flex flex-row items-center gap-1.5" title={label}>
			<ThreeStateCheckbox
				id={label + '-checkbox'}
				value={value}
				onChange={onChange}
			/>
			<label
				className="select-none cursor-pointer tc2 whitespace-nowrap text-ellipsis overflow-hidden"
				htmlFor={label + '-checkbox'}
			>
				{label}{' '}
			</label>
			<label
				className="select-none cursor-pointer tc3 text-xs pt-1 pl-[1px]"
				htmlFor={label + '-checkbox'}
			>
				({count})
			</label>
		</div>
	);
});
