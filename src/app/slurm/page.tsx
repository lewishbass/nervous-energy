'use client';

// slurm/page.tsx
// recieves updates from slurm middleman server and displays the data

import { useEffect, useState } from 'react';
import { JSX } from 'react';
import { io, Socket } from 'socket.io-client';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Star background component with parallax effect
const StarBackground = () => {
	const [stars, setStars] = useState<JSX.Element[]>([]);

	useEffect(() => {
		// Add keyframe animation to the document
		const style = document.createElement('style');
		style.innerHTML = `
      @keyframes starMove {
        from { transform: translateX(0); }
        to { transform: translateX(-100vw); }
      }
    `;
		document.head.appendChild(style);

		// Generate stars
		const newStars = [];
		const starCount = 600;

		for (let i = 0; i < starCount; i++) {
			const size = Math.random() * 2 + 1; // 1-3px
			const top = Math.random() * 100; // 0-100%
			const opacity = Math.random() * 0.5 + 0.2; // 0.2-0.7
			const duration = Math.random() * 30 + 40; // 40-70s
			const delay = -Math.random() * 150; // 0-15s

			newStars.push(
				<div
					key={i}
					className="absolute rounded-full invert dark:invert-0"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						top: `${top}%`,
						right: `-${size}px`,
						backgroundColor: `rgba(255, 255, 255, ${opacity})`,
						animation: `starMove ${duration}s linear ${delay}s infinite`,
					}}
				/>
			);
		}

		setStars(newStars);

		// Cleanup
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none">
			{stars}
		</div>
	);
};

const Enumber = (num: number) => {
	if (num === 0) return '0.00';
	const place = Math.floor(Math.log10(Math.abs(num)));
	return place >= 3 || place <= -3 ? (
		(num/Math.pow(10, place)).toFixed(1) + 'e' + place.toFixed(0)
	) : (
		place < 0 ? (
			num.toFixed(2)
		) : (
			num.toFixed(2-place)
		)
	)
}

const SanitizedString = (str: any) => {
	const input_type = typeof str;
	let sanitizedStr = '';
	if (input_type === 'string') sanitizedStr = str;
	else if (input_type === 'object') sanitizedStr = JSON.stringify(str, null, 2);
	else if (input_type === 'number') sanitizedStr = Enumber(str);

	
	return <MathJax>
		<ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}>
          {sanitizedStr}
        </ReactMarkdown>
	</MathJax>
}

export default function SlurmPage() {
	const [updates, setUpdates] = useState<string[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
	const [socket, setSocket] = useState<Socket | null>(null);
	// data is a map from socket ID to another map storing socket data
	// socket data is a map from field value to either a value or list of values
	const [database, setDatabase] = useState<Record<string, any>>({});
	const [activeSource, setActiveSource] = useState<string | null>(null);


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
			const updated = database;
			Object.entries(data).forEach(([sourceId, sourceData]) => {
				if (!(sourceId in updated)) {
					updated[sourceId] = {};
				}
				updated[sourceId] = sourceData;
			});
			setDatabase(prev => ({ ...prev, ...updated }));
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
			// add deltas to data, and change static values

			const updated = database;
			if (!(sourceId in updated)) {
				updated[sourceId] = {};
			}
			Object.entries(deltas).forEach(([key, value]) => {
				if (!Array.isArray(updated[sourceId][key])) {
					updated[sourceId][key] = [];
				}
				value.forEach((v: any) => {
					updated[sourceId][key].push(v);
				});
			});
			Object.entries(statics).forEach(([key, value]) => {
				updated[sourceId][key] = value;
			});
			console.log('Updated database:', updated);
			setDatabase(updated);

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
				<StarBackground />
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
						<ul className="bg2 rounded-lg shadow-lg p-4 space-y-2 max-h-[80vh] h-[80vh] overflow-y-auto mini-scroll w-50">
							{
								database && Object.entries(database).map(([sourceId, sourceData]) => (
									<li key={sourceId} className="p-4 bg3 rounded-lg shadow select-none cursor-pointer">
										<h2
											className="text-xl font-semibold tc2 truncate"
											style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
											onClick={() => setActiveSource(activeSource === sourceId ? null : sourceId)}
										>
											{sourceId}
										</h2>
									</li>
								))
										
							}
							</ul>
							<div className="flex-grow bg2 rounded-lg shadow-lg p-4">
								<h2 className="tc1 font-semibold text-2xl mb-4">{activeSource}</h2>
								<div className='flex flex-row flex-wrap gap-4'>
								{
									activeSource && database[activeSource] && Object.entries(database[activeSource]).map(([field, value]) => (
										<div key={field} className="bg-gray-500/20 rounded-lg p-2 w-40">
											<h3 className="text-lg font-semibold tc2">{field}</h3>
											{
												Array.isArray(value) ? (
													<ul className="list pl-1 max-h-30 h-30 w-full overflow-y-auto mini-scroll overflow-x-hidden">
														{value.map((item, index) => (
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
							</div>
					</div>
					)
				}
				</div>
		</div>
	);
}

