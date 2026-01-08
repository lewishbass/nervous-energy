import { AssignmentInfo, assignments, scheduleDates } from '../ScheduleTab/ScheduleInfo';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ModalTemplate from '@/components/modals/ModalTemplate';

import GenericGraph from './GenericGraph';


const CLASSWORK_ROUTE = '/.netlify/functions/classwork';

type AdminStatsProps = {
	assignment: AssignmentInfo;
	className: string;
	onClose: () => void;
};

type SubmissionData = {
	id: string;
	username: string;
	userId: string;
	submittedAt: string;
	submissionData: any;
};

export default function AdminStats({ assignment, className, onClose }: AdminStatsProps) {
	const { username, token } = useAuth();
	const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [clearClickCount, setClearClickCount] = useState(0);
	const [clearClickTimer, setClearClickTimer] = useState<NodeJS.Timeout | null>(null);
	const [hoveredCell, setHoveredCell] = useState<string | null>(null);

	const [graphField, setGraphField] = useState<string | null>(null);

	useEffect(() => {
		fetchSubmissions();
	}, [assignment, className, username, token]);

	const fetchSubmissions = async () => {
		if (!username || !token) return;
		
		setLoading(true);
		setError(null);
		
		try {
			const response = await fetch(CLASSWORK_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'get_data',
					username,
					token,
					queryOptions: {
						className,
						assignmentName: assignment.link,
					},
				}),
			});

			if (!response.ok) throw new Error(`Error fetching submissions: ${response.statusText}`);
			
			const data = await response.json();
			setSubmissions(data.submissions || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	const deleteSubmission = async (submissionId: string) => {
		if (!username || !token) return;
		
		try {
			const response = await fetch(CLASSWORK_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'delete_submission',
					username,
					token,
					uuid: submissionId,
				}),
			});
			const submission = submissions.find(s => s.id === submissionId);
			const location = submissions.findIndex(s => s.id === submissionId);
			// Remove from local state
			setSubmissions(prev => prev.filter(s => s.id !== submissionId));
			if (!response.ok) {
				// add it back
				if (submission) {
					setSubmissions(prev => {
						const newSubmissions = [...prev];
						newSubmissions.splice(location, 0, submission);
						return newSubmissions;
					});
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error deleting submission');
		}
	};

	const handleClearAllClick = () => {
		if (clearClickTimer) {
			clearTimeout(clearClickTimer);
		}

		const newCount = clearClickCount + 1;
		setClearClickCount(newCount);

		if (newCount >= 5) {
			// Clear all submissions
			clearAllSubmissions();
			setClearClickCount(0);
			setClearClickTimer(null);
		} else {
			// Set timer to reset count after 2 seconds
			const timer = setTimeout(() => {
				setClearClickCount(0);
				setClearClickTimer(null);
			}, 2000);
			setClearClickTimer(timer);
		}
	};

	const clearAllSubmissions = async () => {
		if (!username || !token) return;
		
		try {
			const response = await fetch(CLASSWORK_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'delete_submission',
					username,
					token,
					className,
					assignmentName: assignment.link,
				}),
			});

			if (!response.ok) throw new Error(`Error clearing all submissions: ${response.statusText}`);
			
			// Clear local state
			setSubmissions([]);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error clearing submissions');
		}
	};

	const formatValue = (value: any): string => {
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		if (typeof value === 'object' && value !== null) {
			return JSON.stringify(value);
		}
		return String(value);
	};

	const getAllQuestions = (): string[] => {
		const questionsSet = new Set<string>();
		submissions.forEach(sub => {
			if (sub.submissionData && typeof sub.submissionData === 'object') {
				Object.keys(sub.submissionData).forEach(key => questionsSet.add(key));
			}
		});
		return Array.from(questionsSet).sort();
	};

	return (
		<ModalTemplate 
			isOpen={true} 
			onClose={onClose} 
			title={`Admin Stats: ${assignment.name}`}
			contentLoading={loading}
			modalWidth="90%"
		>
			{error && (
				<div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
					Error: {error}
				</div>
			)}

			{!loading && !error && (
				<div>
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold tc2 mb-2">Summary</h3>
							<p className="tc3">Total Submissions: {submissions.length}</p>
						</div>
						{submissions.length > 0 && (
							<button
								onClick={handleClearAllClick}
								className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-70"
								title={`Click ${5 - clearClickCount} more time${5 - clearClickCount !== 1 ? 's' : ''} to clear all`}
							>
								Clear All {clearClickCount > 0 && `(${clearClickCount}/5)`}
							</button>
						)}
					</div>

					<div className="relative z-10 overflow-x-auto overflow-y-auto mini-scroll rounded-lg" style={{maxHeight: '800px'}}>
						{submissions.length === 0 ? (
							<p className="tc3 text-center py-8">No submissions yet</p>
						) : (
								<table className="min-w-full border-collapse" style={{display: graphField ? 'none' : 'table'}}>
								<thead className="sticky top-0 z-10 bg3">
										<tr className="outline-solid outline-[1px] outline-black dark:outline-white">
										<th className="text-left p-3 tc1 font-bold whitespace-nowrap">name</th>
											<th className="text-left p-3 tc1 font-bold whitespace-nowrap hover:opacity-70 cursor-pointer whitespace-nowrap transition-opacity duration-300" onClick={() => setGraphField('date')}>date</th>
										{getAllQuestions().map((question) => (
											<th key={question} className="text-left p-3 tc1 font-bold hover:opacity-70 cursor-pointer whitespace-nowrap transition-opacity duration-300" onClick={() => setGraphField(question)}>
												{question}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{submissions.map((submission, index) => (
										<tr key={index} className="relative border-b-[2px] border-blue-100 dark:border-slate-900">
											<td className="p-3 px-6 tc2 font-semibold whitespace-nowrap">
												<button
													onClick={() => deleteSubmission(submission.id)}
													className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded p-1 transition-colors mr-1"
													title="Delete submission"
												>
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
													</svg>
												</button>
												{submission.username}
											</td>
											<td className="p-3 px-6 tc2 whitespace-nowrap">
												{new Date(submission.submittedAt).toLocaleString('en-US', {
													month: '2-digit',
													day: '2-digit',
													hour: 'numeric',
													minute: '2-digit',
													hour12: true
												})}
											</td>
											{getAllQuestions().map((question) => {
												const cellKey = `${index}-${question}`;
												const cellValue = submission.submissionData?.[question] !== undefined
													? formatValue(submission.submissionData[question])
													: '-';
												const isHovered = hoveredCell === cellKey;

												return (
													<td
														key={question}
														className="p-3 px-6 tc3 relative group"
														onMouseEnter={() => setHoveredCell(cellKey)}
														onMouseLeave={() => setHoveredCell(null)}
													>
														<div className={`${true ? 'truncate max-w-[200px]' : ''}`}>
															{cellValue}
														</div>
														{isHovered && cellValue.length > 30 && (
															<div className="absolute z-50 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 mt-1 left-0 max-w-[400px] whitespace-normal break-words">
																{cellValue}
															</div>
														)}
													</td>
												);
											})}
											<div
												className='-z-1'
												style={{
													backgroundColor: index % 2 === 0 ? 'none' : '#8882',
													position: 'absolute',
													top: 0,
													left: 0,
													right: 0,
													bottom: -1,
												}}
											/>
										</tr>
									))}
								</tbody>
							</table>
						)}
						{graphField && <GenericGraph field={graphField} submissions={submissions} onClose={() => setGraphField(null)}/>}
					</div>
				</div>
			)}
		</ModalTemplate>
	);
}