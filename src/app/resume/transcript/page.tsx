// /resume/transcript
// This is the transcript page

'use client';

import Link from 'next/link';
import LineAnimation from '@/components/backgrounds/LineAnimation';
//import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext'
import '@/styles/toggles.css'; // Import the external slider styles


export interface Class {
	subject: string;
	course: string;
	campus: string;
	level: string;
	title: string;
	grade: string | null;
	credit_hours: number;
	quality_points: number | null;
}

export interface Semester {
	semester_name: string;
	term_code: string;
	institution: string;
	start_date: string | null;
	end_date: string | null;
	academic_level: string;
	primary_college: string | null;
	primary_major: string | null;
	academic_standing: string | null;
	attempt_hours: number;
	passed_hours: number | null;
	earned_hours: number | null;
	gpa_hours: number | null;
	quality_points: number | null;
	term_gpa: number | null;
	cumulative_gpa: number | null;
	classes: Class[];
}

const TRANSCRIPT_ROUTE = '/.netlify/functions/msc_fetch';

export default function TranscriptPage() {

	const { username, token, isLoggedIn } = useAuth();

	const [transcriptData, setTranscriptData] = useState<Semester[][] | null>(null);
	const [fetchGrades, setFetchGrades] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());
	const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(new Set());

	// load fetchgrades and expanded states from local storage and load transcript data
	useEffect(() => {
		const storedFetchGrades = localStorage.getItem('fetchGrades');
		const parsedFetchGrades = storedFetchGrades ? JSON.parse(storedFetchGrades) : false;
		setFetchGrades(parsedFetchGrades);

		const storedExpandedLevels = localStorage.getItem('expandedLevels');
		if (storedExpandedLevels) {
			const parsedLevels: number[] = JSON.parse(storedExpandedLevels);
			setExpandedLevels(new Set(parsedLevels));
		}
		const storedExpandedSemesters = localStorage.getItem('expandedSemesters');
		if (storedExpandedSemesters) {
			const parsedSemesters: string[] = JSON.parse(storedExpandedSemesters);
			setExpandedSemesters(new Set(parsedSemesters));
		}
	}, []);

	// save expanded states to local storage on change
	useEffect(() => {
		localStorage.setItem('expandedLevels', JSON.stringify(Array.from(expandedLevels)));
	}, [expandedLevels]);

	//save expanded semesters to local storage on change
	useEffect(() => {
		localStorage.setItem('expandedSemesters', JSON.stringify(Array.from(expandedSemesters)));
	}, [expandedSemesters]);

	// load grades on fetchGrades or auth change
	useEffect(() => {
		if (fetchGrades) {
			fetchTranscriptData(fetchGrades, username, token);
		} else {
			fetchTranscriptData(fetchGrades);
		}
		// save fetch grades on change
		localStorage.setItem('fetchGrades', JSON.stringify(fetchGrades));
		//console.log("Fetch grades changed to:", fetchGrades);
	}, [fetchGrades, username, token]);

	const separateTranscriptByLevel = (data: Semester[]) => {
		let levels: Semester[][] = [];
		data.forEach(semester => {
			if (levels.length <= 0 || levels[levels.length - 1][0].academic_level !== semester.academic_level) {
				levels.push([semester]);
				console.log(semester)
			} else {
				levels[levels.length - 1].push(semester);
			}
		});
		levels.reverse();
		return levels;
	}

	const fetchTranscriptData = async (includeGrades: boolean, username: string | null = null, token: string | null = null) => {
		console.log("Fetching transcript data. Include grades:", includeGrades);
		setIsLoading(true);
		try {
			let response;
			if (includeGrades && username && token) {
				// fetch with grades
				response = await fetch(TRANSCRIPT_ROUTE, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						action: 'fetch_transcript_grades',
						username,
						token,
					}),
				});
			}
			else {
				// fetch without grades
				response = await fetch(TRANSCRIPT_ROUTE, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						action: 'fetch_transcript',
					}),
				});
			}
			// parse response
			const data = await response.json();
			if (response.ok) {
				setTranscriptData(separateTranscriptByLevel(data.transcript));
			} else {
				console.error("Failed to fetch transcript data:", data.message);
			}
			setIsLoading(false);

		} catch (error) {
			console.error("Error fetching transcript data:", error);
			setIsLoading(false);
		}
	};

	const toggleLevel = (levelIndex: number) => {
		setExpandedLevels(prev => {
			const newSet = new Set(prev);
			if (newSet.has(levelIndex)) {
				newSet.delete(levelIndex);
			} else {
				newSet.add(levelIndex);
			}
			return newSet;
		});
	};

	const toggleSemester = (levelIndex: number, semesterIndex: number) => {
		const key = `${levelIndex}-${semesterIndex}`;
		setExpandedSemesters(prev => {
			const newSet = new Set(prev);
			if (newSet.has(key)) {
				newSet.delete(key);
			} else {
				newSet.add(key);
			}
			return newSet;
		});
	};

	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					spacing={200}
					seed={456}
					style={{ opacity: 0.5 }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 p-6 max-w-6xl mx-auto backdrop-blur-sm min-h-screen tc2">
				<div className="mb-6 flex justify-between items-center">
					<Link
						href="/resume"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Resume
					</Link>

					{/*<div className="flex gap-2">
						<DownloadButton
							relativePath="src/app/resume/transcript/page.tsx"
							fileName="transcript_page.tsx"
						/>
						<GitHubButton
							relativePath="src/app/resume/transcript/page.tsx"
						/>
					</div>*/}
				</div>

				{/* Header */}
				<div className="mb-0 p-4 rounded-lg flex flex-row items-center">
					<h1 className="text-4xl font-bold tc1">Lewis H. Bass</h1>
					<p className="tc2 italic ml-4 opacity-30">Unofficial Transcript</p>

				</div>
				<div className="flex items-center">
					<label className="toggle-switch mr-3">
						<input
							type="checkbox"
							checked={fetchGrades}
							onChange={() => setFetchGrades(!fetchGrades)}
						/>
						<span className="toggle-slider"></span>
					</label>
					<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
						fetch grades {fetchGrades && !isLoggedIn ? (<span className="text-red-500">log in to view grades</span>) : (<></>)}
					</span>
				</div>

				<div className="prose dark:prose-invert max-w-none mt-8">
					{/* Transcript Content */}
					{isLoading && !transcriptData && <div>Loading transcript data...</div>}
					{!isLoading && !transcriptData && <div>No transcript data available.</div>}
					{transcriptData && transcriptData.map((level, levelIndex) => (
						<div key={levelIndex}>
							<h2 
								className="text-2xl font-semibold mt-8 mb-4 tc1 cursor-pointer hover:opacity-80 transition-opacity flex items-center"
								onClick={() => toggleLevel(levelIndex)}
							>
								<svg 
									className={`w-6 h-6 mr-2 transition-transform ${expandedLevels.has(levelIndex) ? 'rotate-90' : ''}`}
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
								{level[0].academic_level}
							</h2>
							{expandedLevels.has(levelIndex) && level.map((semester, semesterIndex) => {
								const semesterKey = `${levelIndex}-${semesterIndex}`;
								const isExpanded = expandedSemesters.has(semesterKey);
								
								return (
									<div className="be mb-6 p-4 rounded-lg" key={semesterIndex}>
										<h3 
											className="text-xl font-semibold mb-1 mt-1 tc1 cursor-pointer hover:opacity-80 transition-opacity flex items-center"
											onClick={() => toggleSemester(levelIndex, semesterIndex)}
										>
											<svg 
												className={`w-5 h-5 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
											{semester.semester_name} - {semester.institution}
										</h3>

										{isExpanded && (
											<>
												{/* Semester Details */}
												<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-sm tc3 select-none">
													{semester.term_code && (
														<div><span className="font-semibold tc2">Term Code:</span> {semester.term_code}</div>
													)}
													{semester.start_date && (
														<div><span className="font-semibold tc2">Start:</span> {semester.start_date}</div>
													)}
													{semester.end_date && (
														<div><span className="font-semibold tc2">End:</span> {semester.end_date}</div>
													)}
													{semester.primary_college && (
														<div><span className="font-semibold tc2">College:</span> {semester.primary_college}</div>
													)}
													{semester.primary_major && (
														<div><span className="font-semibold tc2">Major:</span> {semester.primary_major}</div>
													)}
													{semester.academic_standing && (
														<div><span className="font-semibold tc2">Standing:</span> {semester.academic_standing}</div>
													)}
												</div>

												{/* Course Table */}
												<div className="overflow-x-auto select-none mini-scroll">
													<table className="w-full mb-4 text-sm">
														<thead>
															<tr className="border-b-2">
																<th className="px-2 py-2 text-left w-16">Subject</th>
																<th className="px-2 py-2 text-left w-16">Course</th>
																<th className="px-2 py-2 text-left flex-1">Title</th>
																{semester.classes.some(c => c.campus) && (
																	<th className="px-2 py-2 text-left w-20">Campus</th>
																)}
																{semester.classes.some(c => c.level) && (
																	<th className="px-2 py-2 text-left w-16">Level</th>
																)}
																{semester.classes.some(c => c.grade !== null) && (
																	<th className="px-2 py-2 text-left w-16">Grade</th>
																)}
																<th className="px-2 py-2 text-center w-20">Credits</th>
																{semester.classes.some(c => c.quality_points !== null) && (
																	<th className="px-2 py-2 text-right w-25">Quality Pts</th>
																)}
															</tr>
														</thead>
														<tbody>
															{semester.classes.map((course, courseIndex) => (
																<tr key={courseIndex} className="border-b">
																	<td className="px-2 py-2 w-16">{course.subject}</td>
																	<td className="px-2 py-2 w-16">{course.course}</td>
																	<td className="px-2 py-2 flex-1">{course.title}</td>
																	{semester.classes.some(c => c.campus) && (
																		<td className="px-2 py-2 w-20">{course.campus || ''}</td>
																	)}
																	{semester.classes.some(c => c.level) && (
																		<td className="px-2 py-2 w-16">{course.level || ''}</td>
																	)}
																	{semester.classes.some(c => c.grade !== null) && (
																		<td className="px-2 py-2 text-center w-16">{course.grade || ''}</td>
																	)}
																	<td className="px-2 py-2 text-center w-20">{course.credit_hours}</td>
																	{semester.classes.some(c => c.quality_points !== null) && (
																		<td className="px-2 py-2 text-center w-20">{course.quality_points !== null ? course.quality_points.toFixed(2) : ''}</td>
																	)}
																</tr>
															))}
														</tbody>
													</table>
												</div>

												{/* Semester Summary */}
												<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-4 pt-4 border-t select-none">
													<div><span className="font-semibold">Attempted Hours:</span> {semester.attempt_hours}</div>
													{semester.passed_hours !== null && (
														<div><span className="font-semibold">Passed Hours:</span> {semester.passed_hours}</div>
													)}
													{semester.earned_hours !== null && (
														<div><span className="font-semibold">Earned Hours:</span> {semester.earned_hours}</div>
													)}
													{semester.gpa_hours !== null && (
														<div><span className="font-semibold">GPA Hours:</span> {semester.gpa_hours}</div>
													)}
													{semester.quality_points !== null && (
														<div><span className="font-semibold">Quality Points:</span> {semester.quality_points.toFixed(2)}</div>
													)}
													{semester.term_gpa !== null && (
														<div><span className="font-semibold">Term GPA:</span> {semester.term_gpa.toFixed(3)}</div>
													)}
													{semester.cumulative_gpa !== null && (
														<div><span className="font-semibold">Cumulative GPA:</span> {semester.cumulative_gpa.toFixed(3)}</div>
													)}
												</div>
											</>
										)}
									</div>
								);
							})}
						</div>
					))}

					{/* Footer */}
					<div className="text-center mt-8 mb-24">
						<p className="tc2 italic text">This is an unofficial transcript</p>
					</div>
				</div>
			</div>
		</div>
	);
}

