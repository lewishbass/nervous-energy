'use client';

// slurm/page.tsx
// recieves updates from slurm middleman server and displays the data

import { useEffect, useRef, useState } from 'react';
import { JSX } from 'react';
import { io, Socket } from 'socket.io-client';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { data } from '@tensorflow/tfjs';
import GenericGraph from './GenericGraph';
import { DataPoint, ChartType } from './GenericGraph';
import Enumber from '../../scripts/enumber';
import '../../styles/sliders.css';


const SanitizedString = (str: any) => {
	const input_type = typeof str;
	let sanitizedStr = '';
	if (input_type === 'string') sanitizedStr = str;
	else if (input_type === 'object') sanitizedStr = JSON.stringify(str, null, 2);
	else if (input_type === 'number') sanitizedStr = Enumber(str);


	return (
		<MathJaxContext>
			<MathJax>
				<ReactMarkdown
					remarkPlugins={[remarkGfm, remarkMath]}
					rehypePlugins={[rehypeKatex]}>
					{sanitizedStr}
				</ReactMarkdown>
			</MathJax >
		</MathJaxContext >);
}

export default function SlurmPage() {
	const [updates, setUpdates] = useState<string[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
	const [socket, setSocket] = useState<Socket | null>(null);
	// data is a map from socket ID to another map storing socket data
	// socket data is a map from field value to either a value or list of values
	const [database, setDatabase] = useState<Record<string, any>>({});
	const [activeSource, setActiveSource] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'updates' | 'database' | 'graphs' | 'console'>('graphs');

	const [consoleSpacing, setConsoleSpacing] = useState(0);
	const consoleSpacingTimer = useRef<NodeJS.Timeout | null>(null);

	// activate first source if available
	useEffect(() => {
		if (Object.keys(database).length > 0 && activeSource === null) {
			setActiveSource(Object.keys(database)[0]);
		}
	}, [database, activeSource]);

	useEffect(() => {
		// Create socket connection to the /client namespace
		const clientSocket = io('https://slurm.duggydiggytunnel.store/client', {
			transports: ['websocket'],
			upgrade: false,
		});

		clientSocket.on('connect', () => {
			setConnectionStatus('connected');
			console.log('Connected to SLURM server');
		});

		clientSocket.on('disconnect', () => {
			setConnectionStatus('disconnected');
			console.log('Disconnected from SLURM server');
		});

		clientSocket.on('stored_states', (data: Record<string, any>) => {
			setDatabase(prev => ({
				...prev,
				...Object.fromEntries(
					Object.entries(data).map(([sourceId, sourceData]) => [
						sourceId,
						{ ...prev[sourceId], ...sourceData }
					])
				)
			}));
			console.log('Initial stored states received:', data);
		});

		// Listen for updates
		clientSocket.on('state_update', (data: any) => {
			console.log('Received update:', data);
			const sourceId = data.id || 'unknown';
			const deltas = data.deltas as Record<string, any> || {};
			const statics = data.statics as Record<string, any> || {};

			const newUpdate = [] as string[];
			deltas && Object.entries(deltas).forEach(([key, value]) => {
				newUpdate.push(`${sourceId} - ${key}: ${value}`);
			});
			statics && Object.entries(statics).forEach(([key, value]) => {
				newUpdate.push(`${sourceId} - ${key}: ${value}`);
			});
			setUpdates(prev => [...newUpdate, ...prev.slice(0, 99)]); // Keep only last 100 updates

			// Properly update database with immutable updates
			setDatabase(prev => {
				const currentSource = prev[sourceId] || {};

				// Handle deltas (append to arrays)
				const updatedDeltas = Object.fromEntries(
					Object.entries(deltas).map(([key, value]) => {
						const currentArray = Array.isArray(currentSource[key]) ? currentSource[key] : [];
						return [key, [...currentArray, ...value]];
					})
				);

				// Handle statics (replace values)
				const updatedStatics = { ...statics };

				return {
					...prev,
					[sourceId]: {
						...currentSource,
						...updatedDeltas,
						...updatedStatics
					}
				};
			});
		});

		// Handle connection errors
		clientSocket.on('connect_error', (error) => {
			console.error('Connection error:', error);
			setConnectionStatus('disconnected');
		});

		setSocket(clientSocket);

		// Cleanup
		return () => {
			clientSocket.disconnect();
		};
	}, []);

	const getStatusColor = () => {
		switch (connectionStatus) {
			case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'connecting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'disconnected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
		}
	};


	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div
				style={{
					background: `radial-gradient(circle at top left, #FFF2, transparent 60%)`,
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: 0,
				}}
				className='invert dark:invert-0'
			/>
			<div style={{ opacity: 0, animation: "fade-in 10s ease 0.2s forwards" }}>

			</div>

			<div className="relative z-10">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold tc1">SLURM Monitor</h1>
					<div className="flex items-center gap-4">
						<span className={`text-sm px-3 py-1 rounded-full ${getStatusColor()}`}>
							{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
						</span>
						<span className="tc2 text-sm">
							{updates.length} updates received
						</span>
					</div>
				</div>

				{/*updates.length === 0 ? (
					<div className="bg2 rounded-lg shadow-lg p-8 text-center">
						<p className="tc2 text-lg">
							{connectionStatus === 'connected'
								? 'Waiting for SLURM updates...'
								: 'Connecting to SLURM server...'}
						</p>
					</div>
				) : (
					<div className="space-y-1 mx-20 p-4 bg2 h-30 max-h-30 overflow-y-scroll mini-scroll">
						{updates.map((update, index) => (
							<p
								key={index}
								className="tc2"
							>
								{update}
							</p>
						))}
					</div>
				)*/}

				{
					Object.entries(database).length === 0 ? (
						<div className="bg2 rounded-lg shadow-lg p-8 text-center">
							<p className="tc2 text-lg">
								{connectionStatus === 'connected'
									? 'Waiting for SLURM updates...'
									: 'Connecting to SLURM server...'}
							</p>
						</div>
					) : (
						<div className="flex flex-row gap-4">
							{/* Source List */}
							<ul className="bg2 rounded-lg shadow-lg p-4 space-y-2 max-h-[80vh] h-[80vh] overflow-y-auto mini-scroll w-50 min-w-30">
								{
									database && Object.entries(database).map(([sourceId, sourceData]) => (
										<li key={sourceId} className="p-4 bg3 rounded-lg shadow select-none cursor-pointer flex flex-row flex-no-wrap items-center">
											<h2
												className="text-xl font-semibold tc2 truncate"
												style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
												onClick={() => setActiveSource(activeSource === sourceId ? null : sourceId)}
											>
												{(sourceData.name || sourceId).replace(/_/g, ' ')}
											</h2>
											{/* close button */}
											<button
												className="cursor-pointer text-red-500/50 hover:text-red-700/50 ml-2"
												onClick={(e) => {
													e.stopPropagation();
													setDatabase(prev => {
														const newDb = { ...prev };
														delete newDb[sourceId];
														return newDb;
													});
													if (activeSource === sourceId) setActiveSource(null);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										</li>
									))

								}
							</ul>
							{/* Main Content */}
							<div className="flex-grow bg2 rounded-lg shadow-lg p-4 max-w-[80%] max-h-[80vh] overflow-y-auto mini-scroll">
								<div className="w-full mb-4 flex flex-row border-b-2 border-gray-300 px-4 overflow-hidden">
									<h2 className="tc1 font-semibold text-2xl max-w-[50%] overflow-hidden text-ellipsis mb-1 mr-auto truncate">
										{!activeSource
											? 'Select Source'
											: (database[activeSource]?.name || activeSource)}
									</h2>
									{activeTab === 'console' && (
											<input
												id="console-slider"
												type="range"
												min={0}
												max={100}
												step={1}
												defaultValue={50}
												className="slider max-w-30"
												onChange={e => {
													if (consoleSpacingTimer.current) {
														clearTimeout(consoleSpacingTimer.current);
													}
													const newSpacing = parseInt(e.target.value, 10);
													consoleSpacingTimer.current = setTimeout(() => {
														setConsoleSpacing(newSpacing);
													}, 200);

												}}
											/>
									)}
									{[...(activeSource && database[activeSource] && database[activeSource]["graphs"] ? ['graphs'] : []), ...(activeSource && database[activeSource] && database[activeSource]["console"] ? ['console'] : []), 'updates', 'database'].map(tab => (
										<div
											className="rounded-t-lg p-2 mx-2 cursor-pointer hover:opacity-100 opacity-80 transition-all duration-300 hover:translate-y-1 active:translate-y-0 translate-y-2"
											style={{ backgroundColor: activeTab !== tab ? '#8884' : '#888B' }}
											onClick={() => setActiveTab(tab as 'updates' | 'database' | 'graphs')}
										>
											<span className="tc2 m-auto">
												{tab.charAt(0).toUpperCase() + tab.slice(1)}
											</span>
										</div>
									))}

								</div>
								{/* Updates Tab */ activeTab === 'updates' && (
									<div
										className="bg2 rounded-lg shadow-lg p-4 h-75 max-h-75 overflow-y-auto mini-scroll"
										ref={el => {
											if (el) el.scrollTop = el.scrollHeight;
										}}
									>
										{updates.length === 0 ? (
											<p className="tc2 text-lg">No updates received yet.</p>
										) : (
											updates.map((update, index) => (
												<p key={index} className="tc2">{update}</p>
											))
										)}
									</div>
								)}


								{/* Database Tab */ activeTab === 'database' && activeSource && database[activeSource] &&
									<div className='flex flex-row flex-wrap gap-4'>
										{
											activeSource && database[activeSource] && Object.entries(database[activeSource]).map(([field, value]) => (
												<div key={field} className="bg-gray-500/20 rounded-lg p-2 w-40">
													<h3 className="text-lg font-semibold tc2">{field}</h3>
													{
														Array.isArray(value) ? (
															<ul className="list pl-1 max-h-30 h-30 w-full overflow-y-auto mini-scroll overflow-x-hidden" ref={el => {
																if (el) el.scrollTop = el.scrollHeight;
															}}>
																{value.slice(-50).map((item, index) => (
																	<li key={index} className="tc2 w-full">{SanitizedString(item)}</li>
																))}
															</ul>
														) : (
															<p className="tc2">
																{SanitizedString(value)}
															</p>
														)
													}
												</div>
											))
										}

									</div>
								}
								{/* Graphs Tab */ activeTab === 'graphs' && activeSource && database[activeSource] && database[activeSource]["graphs"] &&
									<div className="w-full flex flex-row gap-2 overflow-x-auto flex-wrap justify-start overflow-y-hidden">
										{database[activeSource]["graphs"].map((graphSpec: any, index: number) => {

											// Handle both single key (string) and multiple keys (array)
											const keys = Array.isArray(graphSpec.key) ? graphSpec.key : [graphSpec.key];

											// Check if any of the keys have valid data
											// @ts-expect-error
											const hasValidData = keys.some(key => key && database[activeSource][key]);
											if (!hasValidData) {
												return <div key={index} className="flex-shrink-1 w-full h-[20vh] bg3 rounded-lg p-2 pb-4 flex items-center justify-center tc3"><span>No Data</span></div>;
											}

											// Convert data to the format expected by GenericGraph
											let formattedData: DataPoint[] = [];
											let labels: string[] = [];

											if (keys.length === 1) {
												// Single series
												const graphData = database[activeSource][keys[0]];
												if (Array.isArray(graphData)) {
													formattedData = graphData.map((value, idx) => ({
														x: idx,
														y: typeof value === 'number' ? value : parseFloat(value) || 0
													}));
												} else if (typeof graphData === 'number') {
													formattedData = [{ x: 0, y: graphData }];
												}
												labels = [graphSpec.display_name || keys[0]];
											} else {
												// Multiple series - need to merge data points by index
												const allDataSeries = keys.map((key: string) => {
													const data = database[activeSource][key];
													if (Array.isArray(data)) {
														return data.map(value => typeof value === 'number' ? value : parseFloat(value) || 0);
													} else if (typeof data === 'number') {
														return [data];
													}
													return [];
												});

												// Find the maximum length across all series
												const maxLength: number = Math.max(...allDataSeries.map((series: number[]) => series.length));

												// Create combined data points
												formattedData = Array.from({ length: maxLength }, (_, idx) => {
													const dataPoint: any = { x: idx };
													keys.forEach((key: string, seriesIdx: number) => {
														dataPoint[`y${seriesIdx}`] = allDataSeries[seriesIdx][idx] || null;
													});
													return dataPoint;
												});

												labels = keys.map((key: string, idx: number) => graphSpec.labels && graphSpec.labels[idx] || key);
											}

											return (
												<div key={index} className="flex-shrink-1 w-full h-[20vh] bg3 rounded-lg p-2 pb-4">
													<GenericGraph
														type={graphSpec.type || 'scatter'}
														title={graphSpec.display_name || keys.join(', ')}
														data={formattedData}
														xlabel={graphSpec.xlabel || 'Index'}
														ylabel={graphSpec.ylabel || keys[0]}
														units={graphSpec.unit || ''}
														labels={labels}
														keys={keys.length > 1 ? keys.map((_: string, idx: string) => `y${idx}`) : undefined}
														isLiveData={true}
														maxDataPoints={200}
														index={index}
														colors={graphSpec.color}
													/>
												</div>
											);
										})}
									</div>
								}
								{/* Console Tab */ activeTab === 'console' && activeSource && database[activeSource] && database[activeSource]["console"] &&
									<ul
										className="h-[70vh] overflow-y-auto mini-scroll bg2 rounded-lg shadow-lg p-4"
										ref={el => {
											if (el) el.scrollTop = el.scrollHeight;
										}}
									>
											{
												database[activeSource]["console"].map((consoleLine: string, index: number) => (
													<li key={index} className="tc2" style={{ marginBottom: `${consoleSpacing}px` }}>
														{SanitizedString(consoleLine)}
													</li>
												))
											}
									</ul>

									}
							</div>
						</div>
					)
				}
			</div>
		</div>
	);
}

