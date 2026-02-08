'use client';


import { useEffect, useState } from 'react';
import { FaGamepad, FaUsers, FaChevronLeft, FaChevronRight, FaPlus, FaChevronUp } from 'react-icons/fa';
import { GiTank } from 'react-icons/gi';
import { IoMdPeople } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';

import { Client } from 'colyseus.js';

import RoomModal, { RoomOptions } from './RoomModal';

interface Lobby {
	id: string;
	name: string;
	players: number;
	maxPlayers: number;
	map: string;
	status: 'waiting' | 'in-game' | 'full';
}

interface Player {
	id: string;
	name: string;
	level: number;
	status: 'online' | 'in-game' | 'away';
}

interface ChatMessage {
	id: string;
	playerId: string;
	playerName: string;
	message: string;
	timestamp: Date;
}

interface Room {
	clients: number;
	createdAt: Date;
	locked: boolean;
	maxClients: number;
	name: string;
	private: boolean;
	processId: string;
	roomId: string;
	unlisted: boolean;
	metadata: Record<string, any>;
}

// Dummy data for demonstration
const dummyLobbies: Lobby[] = [
	{ id: '1', name: 'Desert Storm', players: 4, maxPlayers: 8, map: 'Desert', status: 'waiting' },
	{ id: '2', name: 'Urban Warfare', players: 6, maxPlayers: 8, map: 'City', status: 'in-game' },
	{ id: '3', name: 'Arctic Assault', players: 8, maxPlayers: 8, map: 'Snow', status: 'full' },
	{ id: '4', name: 'Forest Battle', players: 2, maxPlayers: 6, map: 'Forest', status: 'waiting' },
];

const dummyPlayers: Player[] = [
	{ id: '1', name: 'TankCommander', level: 42, status: 'online' },
	{ id: '2', name: 'ArmoredKnight', level: 38, status: 'in-game' },
	{ id: '3', name: 'SteelWolf', level: 55, status: 'online' },
	{ id: '4', name: 'ThunderTank', level: 31, status: 'away' },
	{ id: '5', name: 'BattleMaster', level: 47, status: 'in-game' },
];

const dummyChatMessages: ChatMessage[] = [
	{ id: '1', playerId: '1', playerName: 'TankCommander', message: 'Ready to roll out!', timestamp: new Date(Date.now() - 300000) },
	{ id: '2', playerId: '3', playerName: 'SteelWolf', message: 'Let\'s dominate this match', timestamp: new Date(Date.now() - 240000) },
	{ id: '3', playerId: '1', playerName: 'TankCommander', message: 'Anyone have a mic?', timestamp: new Date(Date.now() - 180000) },
	{ id: '4', playerId: '2', playerName: 'ArmoredKnight', message: 'Yeah I do', timestamp: new Date(Date.now() - 120000) },
	{ id: '5', playerId: '3', playerName: 'SteelWolf', message: 'Same here', timestamp: new Date(Date.now() - 60000) },
	{ id: '6', playerId: '1', playerName: 'TankCommander', message: 'Perfect! Let\'s coordinate our attack', timestamp: new Date(Date.now() - 30000) },
];

interface SocialProps {
	username: string,
	subToken: string | null,
	isLoggedIn: boolean,
	client: Client | any,
}

const statusToColor: Record<string, string> = {
	'idle': 'gray-500',
	'fetching': 'yellow-500',
	'success': 'green-500',
	'error': 'red-500',
};

export default function Social({ username, subToken, isLoggedIn, client }: SocialProps) {
	const [selectedLobby, setSelectedLobby] = useState<string | null>('1');
	const [lobbiesCollapsed, setLobbiesCollapsed] = useState(true);
	const [playersCollapsed, setPlayersCollapsed] = useState(true);
	const [dividerPosition, setDividerPosition] = useState(50); // percentage
	const [isDragging, setIsDragging] = useState(false);
	const [chatMessage, setChatMessage] = useState('');

	const [roomFetchStatus, setRoomFetchStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

	const [rooms, setRooms] = useState<Room[]>([{
		clients: 0,
		createdAt: new Date(),
		locked: false,
		maxClients: 0,
		name: 'WIP coming soon',
		private: false,
		processId: '12345',
		roomId: '1',
		unlisted: false,
		metadata: {
			map: 'Desert',
			status: 'waiting'
		}
	}]);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'waiting':
			case 'online':
				return 'bg-green-500';
			case 'in-game':
				return 'bg-yellow-500';
			case 'full':
			case 'away':
				return 'bg-gray-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'waiting':
				return 'Waiting';
			case 'in-game':
				return 'In Game';
			case 'full':
				return 'Full';
			default:
				return status;
		}
	};

	const handleDividerMouseDown = () => {
		setIsDragging(true);
	};

	const createRoom = (options: RoomOptions) => {
		// Implement room creation logic here
		console.log('Creating room with options:', options);
		// TODO: Use client to create room with the provided options
	};

	const joinRoom = (roomId: string) => {

	}



	useEffect(() => {
		if (isDragging) {
			document.body.style.userSelect = 'none';
			document.body.style.cursor = 'ns-resize';
		} else {
			document.body.style.userSelect = 'auto';
			document.body.style.cursor = 'default';
		}
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const lobbySection = document.getElementById('lobby-content');
			if (!lobbySection) return;

			const rect = lobbySection.getBoundingClientRect();
			const newPosition = ((e.clientY - rect.top) / rect.height) * 100;

			// Clamp between 20% and 80%
			setDividerPosition(Math.min(Math.max(newPosition, 0), 100));
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging]);

	const getLobbies = async () => {
		// Fetch lobbies from server
		setRoomFetchStatus('fetching');
		if (!client) {
			setTimeout(() => setRoomFetchStatus('error'), 3000);
			console.error('No client available to fetch lobbies');
			return;
		}
		client.http.get("/api/room_list").then((response: any) => {
			if (response && response.data && response.data.rooms) {
				setRooms(response.data.rooms);
				setRoomFetchStatus('success');
			} else {
				setRoomFetchStatus('error');
			}
		}).catch((error: any) => {
			console.error('Error fetching lobbies:', error);
			setRoomFetchStatus('error');
		});
	};



	if (lobbiesCollapsed && playersCollapsed) {
		return (
			<div className="fixed right-0 bottom-[5vh] -translate-y-1/2 z-50">
				<button
					onClick={() => { setLobbiesCollapsed(false); setPlayersCollapsed(false); }}
					className="bg2 p-2 rounded-l-3xl shadow-lg border border-r-0 border-gray-200 dark:border-gray-700 hover:bg-gradient-to-l hover:from-blue-500/10 hover:to-purple-500/10 transition-all -mr-4 hover:pr-4 cursor-pointer select-none"
					title="Show lobby sidebar"
				>
					<FaChevronLeft className="text-2xl tc1" />
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 relative h-full lg:ml-6 lg:max-w-70">

			{/* Available Lobbies */}
			<div className={`bg2 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all ${lobbiesCollapsed ? 'flex-grow-0' : 'flex-grow'}`}>
				<div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10 cursor-pointer select-none" onClick={() => setLobbiesCollapsed(!lobbiesCollapsed)}>
					<h3 className="text-xl font-bold tc1 flex items-center">
						<FaGamepad className={`cursor-pointer text-xl hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-all mr-2 text-${statusToColor[roomFetchStatus]}`} onClick={(e: React.MouseEvent) => { getLobbies(); e.stopPropagation(); }} />
						Available Lobbies
						<FaChevronUp className={`ml-auto rounded-full p-1 cursor-pointer w-6 h-6 transition-transform duration-300 ${lobbiesCollapsed ? 'rotate-180' : ''}`} />
					</h3>
				</div>
				<div className="overflow-y-scroll mini-scroll transition-all duration-300 flex-grow bg1" style={{ maxHeight: lobbiesCollapsed ? '0' : playersCollapsed ? '800px' : '400px' }}>
					<div className="space-y-2 p-4">
						{rooms.map((lobby) => (
							<div
								key={lobby.roomId}
								onClick={() => setSelectedLobby(lobby.roomId)}
								className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${selectedLobby === lobby.roomId
										? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 outline-2 outline-blue-500/50'
										: 'bg2 opacity-50 hover:opacity-80 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10'
									}`}
							>
								<div className="flex items-center justify-between mb-2">
									<span className="font-bold tc1">{lobby.name}</span>
									<div className="flex items-center gap-1">
										<div className={`w-2 h-2 rounded-full ${getStatusColor(lobby.metadata.status || 'waiting')}`} />
										<span className="text-xs tc2">{getStatusText(lobby.metadata.status || 'invalid')}</span>
									</div>
								</div>
								<div className="flex items-center justify-between text-sm tc2">
									<span className="flex items-center gap-1">
										{lobby.metadata.map || 'Unknown Map'}
									</span>
									<span className="flex items-center gap-1">
										<IoMdPeople className="text-base" />
										{lobby.clients}/{lobby.maxClients}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="px-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300" style={{ maxHeight: lobbiesCollapsed ? '0' : '100px' }}>
					<button
						onClick={() => setIsRoomModalOpen(true)}
						className="my-4 cursor-pointer select-none w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
					>
						<FaPlus />
						Create Room
					</button>
				</div>
			</div>

			{/* Current Lobby Players & Chat */}
			{selectedLobby && (
				<div className={`bg2 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all ${playersCollapsed ? 'flex-grow-0' : 'flex-grow'}`}>
					<div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500/10 to-emerald-500/10 cursor-pointer select-none" onClick={() => setPlayersCollapsed(!playersCollapsed)} >
						<h3 className="text-xl font-bold tc1 flex items-center">
							<FaUsers className="mr-2" />
							{dummyLobbies.find(l => l.id === selectedLobby)?.name}
							<FaChevronUp className={`ml-auto rounded-full p-1 cursor-pointer w-6 h-6 transition-transform duration-300 bg ${playersCollapsed ? 'rotate-180' : ''}`} />

						</h3>
					</div>
					<div id="lobby-content" className="overflow-hidden transition-all duration-300 flex-grow bg1 flex flex-col" style={{ maxHeight: playersCollapsed ? '0' : lobbiesCollapsed ? '800px' : '400px' }}>
						{/* Players Section */}
						<div className="overflow-y-scroll mini-scroll" style={{ height: `${dividerPosition}%` }}>
							<div className="space-y-2 p-4">
								{dummyPlayers.slice(0, dummyLobbies.find(l => l.id === selectedLobby)?.players || 0).map((player) => (
									<div
										key={player.id}
										className="p-3 rounded-xl bg2 opacity-50 hover:opacity-100 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 transition-all"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className={`w-2 h-2 rounded-full ${getStatusColor(player.status)}`} />
												<span className="font-bold tc1">{player.name}</span>
											</div>
											<span className="text-sm tc2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 rounded-full">
												Lv {player.level}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Draggable Divider */}
						<div
							onMouseDown={handleDividerMouseDown}
							className={`select-none h-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/50 hover:to-emerald-500/50 cursor-ns-resize flex items-center justify-center group ${isDragging ? 'from-green-500/70 to-emerald-500/70' : ''}`}
						>
							<div className="w-12 h-1 bg-green-500/50 rounded-full group-hover:bg-green-500/70 transition-all" />
						</div>

						{/* Chat Section */}
						<div className="overflow-y-scroll mini-scroll flex flex-col" style={{ height: `${100 - dividerPosition}%` }}>
							{/*<div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
								<h4 className="text-sm font-bold tc1 flex items-center">
									<BiSolidMessageSquareDetail className="mr-2" />
									Lobby Chat
								</h4>
							</div>*/}
							<div className="flex-grow space-y-1 p-2">
								{dummyChatMessages.map((msg) => (
									<div key={msg.id} className="flex flex-col gap-1">
											<span className="tc3 font-normal">
											<span className="font-bold tc2 text-sm">{msg.playerName}:&nbsp;</span>
											{msg.message}
											</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="relative p-0 border-t border-gray-200 dark:border-gray-700 transition-all duration-300" style={{ maxHeight: playersCollapsed ? '0' : '100px' }}>
						<div className="flex gap-2">
							<input
								type="text"
								value={chatMessage}
								onChange={(e) => setChatMessage(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter' && chatMessage.trim()) {
										// Handle send message
										setChatMessage('');
									}
								}}
								placeholder="..."
								className="flex-grow pl-4 pr-9 pb-3 py-2 bg1 border-none tc1 text-sm focus:outline-none focus:border-green-500/50"
							/>
							<button
								onClick={() => {
									if (chatMessage.trim()) {
										// Handle send message
										setChatMessage('');
									}
								}}
								className="absolute right-1 top-1 rounded-full cursor-pointer select-none px-2 py-2 tc1 font-bold hover:brightness-110 transition-all flex items-center justify-center hover:opacity-70"
							>
								<IoSend />
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Room Creation Modal */}
			<RoomModal
				isOpen={isRoomModalOpen}
				onClose={() => setIsRoomModalOpen(false)}
				onCreateRoom={createRoom}
			/>
		</div>


	);
}