'use client';

import { useState } from 'react';
import ModalTemplate from '@/components/modals/ModalTemplate';
import { FaUsers, FaMap, FaGamepad, FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface RoomModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateRoom: (options: RoomOptions) => void;
}

export interface RoomOptions {
	name: string;
	maxPlayers: number;
	map: string;
}

const AVAILABLE_MAPS = [
	{ id: 'mountains', name: 'Mountains', icon: '⛰️' },
	{ id: 'forest', name: 'Forest', icon: '🌲' },
	{ id: 'desert', name: 'Desert', icon: '🏜️' },
	{ id: 'random', name: 'Random', icon: '🎲' },
];

export default function RoomModal({ isOpen, onClose, onCreateRoom }: RoomModalProps) {
	const [roomName, setRoomName] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(4);
	const [selectedMap, setSelectedMap] = useState('mountains');

	const clampPlayers = (value: number) => Math.max(0, Math.min(16, value));

	const handlePlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? 0 : parseInt(e.target.value);
		if (!isNaN(value)) {
			setMaxPlayers(clampPlayers(value));
		}
	};

	const incrementPlayers = () => setMaxPlayers(prev => clampPlayers(prev + 1));
	const decrementPlayers = () => setMaxPlayers(prev => clampPlayers(prev - 1));

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		if (e.deltaY < 0) {
			incrementPlayers();
		} else {
			decrementPlayers();
		}
		e.stopPropagation();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		const options: RoomOptions = {
			name: roomName.trim() || 'Unnamed Room',
			maxPlayers,
			map: selectedMap,
		};

		onCreateRoom(options);
		handleClose();
	};

	const handleClose = () => {
		// Reset form
		setRoomName('');
		setMaxPlayers(4);
		setSelectedMap('mountains');
		onClose();
	};

	return (
		<ModalTemplate
			isOpen={isOpen}
			onClose={handleClose}
			title="Create New Room"
			contentLoading={false}
			modalWidth="600px"
			skipLoadingAnimation={true}
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Room Name */}
				<div>
					<label className="block text-sm font-bold tc2 mb-2 flex items-center gap-2">
						<FaGamepad />
						Room Name
					</label>
					<input
						type="text"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						placeholder="Enter room name..."
						className="w-full px-4 py-2 bg2 border border-gray-300 dark:border-gray-600 rounded-lg tc1 focus:outline-none focus:ring-2 focus:ring-blue-500"
						maxLength={50}
					/>
				</div>

				{/* Max Players */}
				<div>
					<label className="block text-sm font-bold tc2 mb-2 flex items-center gap-2">
						<FaUsers />
						Max Players (0-16)
					</label>
					<div 
						className="flex items-center gap-2"
						onWheel={handleWheel}
					>
						<input
							value={maxPlayers}
							onChange={handlePlayersChange}
							min="0"
							max="16"
							className="w-13 px-4 py-2 bg2 border border-gray-300 dark:border-gray-600 rounded-lg tc1 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<div className="flex flex-col gap-1">
							<button
								type="button"
								onClick={incrementPlayers}
								className="p-1 rounded cursor-pointer select-none"
							>
								<FaChevronUp className="text-xs tc1" />
							</button>
							<button
								type="button"
								onClick={decrementPlayers}
								className="p-1 rounded cursor-pointer select-none"
							>
								<FaChevronDown className="text-xs tc1" />
							</button>
						</div>
					</div>
				</div>

				{/* Map Selection */}
				<div>
					<label className="block text-sm font-bold tc2 mb-2 flex items-center gap-2">
						<FaMap />
						Select Map
					</label>
					<div className="grid grid-cols-2 gap-3">
						{AVAILABLE_MAPS.map((map) => (
							<div
								key={map.id}
								onClick={() => setSelectedMap(map.id)}
								className={`p-4 rounded-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-blue-500/20 outline-2 ${
									selectedMap === map.id
									? 'outline-sky-500/50'
									: 'saturate-30 hover:saturate-60 brightness-50 outline-gray-500/50'
								}`}
							>
								<div className="text-2xl mb-1">{map.icon}</div>
								<div className="text-sm font-bold tc1">{map.name}</div>
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 pt-4">
					<button
						type="submit"
						className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all hover:-translate-y-0.5 shadow-lg"
					>
						Create Room
					</button>
					<button
						type="button"
						onClick={handleClose}
						className="px-6 py-3 bg2 tc2 font-bold rounded-lg hover:opacity-70 transition-all"
					>
						Cancel
					</button>
				</div>
			</form>
		</ModalTemplate>
	);
}

