// /analytics

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LineAnimation from '@/components/backgrounds/LineAnimation';

const ANALYTICS_ROUTE = '/.netlify/functions/analytics';

interface SessionEvent {
	sessionId: string;
	eventType: string;
	timestamp: string;
	data: Record<string, any>;
}

interface Session {
	sessionId: string;
	startTime: string;
	country?: string;
	city?: string;
	region?: string;
	ip?: string;
	userAgent?: string;
	browser?: string;
	os?: string;
	device?: string;
	screenSize?: number[];
	viewport?: number[];
	language?: string;
	timezone?: string;
	source?: string;
	events: SessionEvent[];
}

export default function AnalyticsPage() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

	useEffect(() => {
		fetchSessions();
	}, []);

	const fetchSessions = async () => {
		setIsLoading(true);
		try {
			// First, fetch session IDs
			const idsResponse = await fetch(ANALYTICS_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'get_session_ids',
					limit: 20,
				}),
			});

			if (!idsResponse.ok) {
				console.error("Failed to fetch session IDs");
				setIsLoading(false);
				return;
			}

			const sessionIds: string[] = await idsResponse.json();

			if (sessionIds.length === 0) {
				setSessions([]);
				setIsLoading(false);
				return;
			}

			// Then, fetch session info
			const infoResponse = await fetch(ANALYTICS_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'get_session_info',
					sessionIds,
				}),
			});

			if (!infoResponse.ok) {
				console.error("Failed to fetch session info");
				setIsLoading(false);
				return;
			}

			const sessionsData: Session[] = await infoResponse.json();
			setSessions(sessionsData);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleSession = (sessionId: string) => {
		setExpandedSessions(prev => {
			const newSet = new Set(prev);
			if (newSet.has(sessionId)) {
				newSet.delete(sessionId);
			} else {
				newSet.add(sessionId);
			}
			return newSet;
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					spacing={200}
					seed={789}
					style={{ opacity: 0.5 }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 p-6 max-w-6xl mx-auto backdrop-blur-sm min-h-screen tc2">
				<div className="mb-6 flex justify-between items-center">
					<Link
						href="/"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</Link>

					<button
						onClick={fetchSessions}
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
						disabled={isLoading}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Refresh
					</button>
				</div>

				{/* Header */}
				<div className="mb-0 p-4 rounded-lg">
					<h1 className="text-4xl font-bold tc1">Analytics Dashboard</h1>
					<p className="tc2 italic mt-2 opacity-60">20 Most Recent Sessions</p>
				</div>

				<div className="prose dark:prose-invert max-w-none mt-8">
					{/* Sessions Content */}
					{isLoading && <div>Loading sessions...</div>}
					{!isLoading && sessions.length === 0 && <div>No sessions found.</div>}
					{!isLoading && sessions.length > 0 && sessions.map((session) => {
						const isExpanded = expandedSessions.has(session.sessionId);
						
						return (
							<div className="be mb-6 p-4 rounded-lg" key={session.sessionId}>
								<h3 
									className="text-xl font-semibold mb-1 mt-1 tc1 cursor-pointer hover:opacity-80 transition-opacity flex items-center"
									onClick={() => toggleSession(session.sessionId)}
								>
									<svg 
										className={`w-5 h-5 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
									Session: {session.sessionId.substring(0, 8)}...
									<span className="ml-4 text-sm tc3 font-normal">
										{formatDate(session.startTime)}
									</span>
								</h3>

								{isExpanded && (
									<>
										{/* Session Metadata */}
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-sm tc3 select-none mt-4">
											{session.ip && (
												<div><span className="font-semibold tc2">IP:</span> {session.ip}</div>
											)}
											{session.country && (
												<div><span className="font-semibold tc2">Country:</span> {session.country}</div>
											)}
											{session.city && (
												<div><span className="font-semibold tc2">City:</span> {session.city}</div>
											)}
											{session.region && (
												<div><span className="font-semibold tc2">Region:</span> {session.region}</div>
											)}
											{session.browser && (
												<div><span className="font-semibold tc2">Browser:</span> {session.browser}</div>
											)}
											{session.os && (
												<div><span className="font-semibold tc2">OS:</span> {session.os}</div>
											)}
											{session.device && (
												<div><span className="font-semibold tc2">Device:</span> {session.device}</div>
											)}
											{session.language && (
												<div><span className="font-semibold tc2">Language:</span> {session.language}</div>
											)}
											{session.timezone && (
												<div><span className="font-semibold tc2">Timezone:</span> {session.timezone}</div>
											)}
											{session.screenSize && (
												<div><span className="font-semibold tc2">Screen:</span> {session.screenSize[0]}x{session.screenSize[1]}</div>
											)}
											{session.viewport && (
												<div><span className="font-semibold tc2">Viewport:</span> {session.viewport[0]}x{session.viewport[1]}</div>
											)}
											{session.source && (
												<div><span className="font-semibold tc2">Source:</span> {session.source === 'direct' ? 'Direct' : session.source}</div>
											)}
										</div>

										{/* Events Table */}
										<h4 className="text-lg font-semibold mt-4 mb-2 tc2">Events ({session.events.length})</h4>
										{session.events.length > 0 ? (
											<div className="overflow-x-auto select-none mini-scroll">
												<table className="w-full mb-4 text-sm">
													<thead>
														<tr className="border-b-2">
															<th className="px-2 py-2 text-left">Event Type</th>
															<th className="px-2 py-2 text-left">Timestamp</th>
															<th className="px-2 py-2 text-left">Data</th>
														</tr>
													</thead>
													<tbody>
														{session.events.map((event, eventIndex) => (
															<tr key={eventIndex} className="border-b">
																<td className="px-2 py-2">{event.eventType}</td>
																<td className="px-2 py-2">{formatDate(event.timestamp)}</td>
																<td className="px-2 py-2">
																	<pre className="text-xs overflow-auto">
																		{JSON.stringify(event.data, null, 2)}
																	</pre>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<p className="text-sm tc3 italic">No events recorded for this session.</p>
										)}
									</>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}