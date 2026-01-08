import { IoMdArrowRoundBack } from "react-icons/io";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

type GenericGraphProps = {
	field: string;
	submissions: any[];
	onClose?: () => void;
};

export default function GenericGraph({ field, submissions, onClose }: GenericGraphProps) {
	const chartData = useMemo(() => {
		if (field === 'date') {
			// Handle date field specially
			const dateCounts = new Map<string, number>();
			submissions.forEach(sub => {
				const date = new Date(sub.submittedAt);
				const dateKey = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
				dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
			});
			return Array.from(dateCounts.entries())
				.map(([date, count]) => ({ name: date, value: count }))
				.sort((a, b) => a.name.localeCompare(b.name));
		}

		// Extract values for the field
		const values = submissions
			.map(sub => sub.submissionData?.[field])
			.filter(val => val !== undefined && val !== null);

		if (values.length === 0) {
			return [];
		}

		// Determine data type
		const firstValue = values[0];
		
		if (Array.isArray(firstValue)) {
			// Handle array of strings - flatten and count
			const flatValues = values.flat();
			const counts = new Map<string, number>();
			flatValues.forEach(val => {
				const key = String(val);
				counts.set(key, (counts.get(key) || 0) + 1);
			});
			return Array.from(counts.entries())
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value);
		} else if (typeof firstValue === 'number') {
			// Handle numbers - create bins
			const numValues = values.filter(v => typeof v === 'number') as number[];
			const min = Math.min(...numValues);
			const max = Math.max(...numValues);
			const binCount = Math.min(10, Math.ceil(Math.sqrt(numValues.length)));
			const binSize = (max - min) / binCount || 1;
			
			const bins = new Map<string, number>();
			numValues.forEach(val => {
				const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
				const binStart = min + binIndex * binSize;
				const binEnd = binStart + binSize;
				const binKey = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
				bins.set(binKey, (bins.get(binKey) || 0) + 1);
			});
			
			return Array.from(bins.entries())
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
		} else {
			// Handle strings - count frequency
			const counts = new Map<string, number>();
			values.forEach(val => {
				const key = String(val);
				counts.set(key, (counts.get(key) || 0) + 1);
			});
			return Array.from(counts.entries())
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value);
		}
	}, [field, submissions]);

	const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'];

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex flex-row items-center justify-start mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
				<button
					onClick={onClose}
					className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors mr-3"
					aria-label="Go back"
				>
					<IoMdArrowRoundBack className="text-2xl tc2" />
				</button>
				<h2 className="font-semibold text-xl tc1">{field}</h2>
			</div>

			{chartData.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<p className="tc3 text-center py-12 text-lg">No data available for this field</p>
				</div>
			) : (
				<div className="flex-1 flex flex-col gap-6">
					<div className=" p-3" style={{ height: 450 }}>
						<ResponsiveContainer>
							<BarChart
								data={chartData}
								margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" vertical={false} />
								<XAxis
									dataKey="name"
									angle={0}
									textAnchor="middle"
									height={10}
									interval={0}
									tick={{ fontSize: 11, fill: 'currentColor' }}
									className="tc3"
									stroke="#9ca3af"
								/>
								<YAxis
									label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
									allowDecimals={false}
									tick={{ fontSize: 11, fill: 'currentColor' }}
									className="tc3"
									stroke="#9ca3af"
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(255, 255, 255, 0.98)',
										border: 'none',
										borderRadius: '8px',
										boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
										fontSize: '13px'
									}}
									cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
								/>
								<Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
									{chartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="bg1 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
						<h4 className="font-semibold tc1 mb-3 text-base">Statistics</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col">
								<span className="tc3 text-sm mb-1">Total Responses</span>
								<span className="tc1 text-2xl font-semibold">{submissions.length}</span>
							</div>
							<div className="flex flex-col">
								<span className="tc3 text-sm mb-1">Unique Values</span>
								<span className="tc1 text-2xl font-semibold">{chartData.length}</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}