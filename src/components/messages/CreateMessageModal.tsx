// CreateMessageModal.tsx
// node.js react typescript tailwindcss
// component for creating a message group
// lists friends with checkboxes beside each
// button at the bottom creates a group with the selected friends and closes the modal

import React, { useState, useEffect } from 'react';
import ModalTemplate from '../modals/ModalTemplate';
import { useAuth } from '@/context/AuthContext';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface CreateMessageModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface Friend {
	id: string;
	username: string;
	firstName?: string;
	lastName?: string;
}

interface FriendData {
	id: string;
	username: string;
	profile: {
		firstName?: string;
		lastName?: string;
	};
}

const colors = ["--khr", "--kho", "--khg", "--khp"];

const CreateMessageModal: React.FC<CreateMessageModalProps> = ({ isOpen, onClose }) => {
	// State to track selected friends
	const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [chatName, setChatName] = useState<string>('');
	const [chatType, setChatType] = useState<'direct' | 'group'>('direct');

	const { username, token, isLoggedIn } = useAuth();

	useEffect(() => {
		if (isOpen) {
			fetchFriends();
		}
	}, [isOpen]);

	const fetchFriends = async () => {
		if (!username || !token) {
			setIsLoading(false);
			setError('Not authenticated');
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			// First, get the user's profile to get their friends list
			const selfResponse = await fetch('/.netlify/functions/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getSelf',
					username,
					token
				})
			});

			if (!selfResponse.ok) {
				throw new Error('Failed to fetch profile');
			}

			const selfData = await selfResponse.json();

			// Get the friends' usernames from the user's data
			const friendIds = selfData.user.data.friends || [];
			if (friendIds.length === 0) {
				setFriends([]);
				setIsLoading(false);
				return;
			}

			// Then fetch details for each friend
			const friendsResponse = await fetch('/.netlify/functions/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'get',
					username,
					token,
					toFetch: friendIds,
					isId: true
				})
			});

			if (!friendsResponse.ok) {
				throw new Error('Failed to fetch friend details');
			}

			const friendsData = await friendsResponse.json();

			// Transform the data for UI display
			const formattedFriends = friendsData.map((friend: FriendData) => ({
				id: friend.id,
				username: friend.username,
				firstName: friend.profile.firstName || '',
				lastName: friend.profile.lastName || ''
			}));

			setFriends(formattedFriends);
		} catch (err) {
			console.error('Error fetching friends:', err);
			setError('Failed to load friends');
		} finally {
			setIsLoading(false);
		}
	};

	// Placeholder function for checkbox handling
	const handleCheckboxChange = (friendId: string) => {
		setSelectedFriends(prev => {
			if (prev.includes(friendId)) {
				return prev.filter(id => id !== friendId);
			} else {
				return [...prev, friendId];
			}
		});
	};

	// Create group chat
	const createGroup = async () => {
		if (!isLoggedIn) {
			setError('Not authenticated');
			return;
		}

		if (selectedFriends.length === 0) {
			setError('Please select at least one friend');
			return;
		}

		try {
			setIsSending(true);
			setError(null);

			// Determine the chat type based on selected participants count
			const type = selectedFriends.length > 1 || chatType === 'group' ? 'group' : 'direct';
			const name = type === 'group' && chatName ? chatName : ''; // Only use name for group chats

			// Call the createConversation endpoint
			const response = await fetch('/.netlify/functions/conv', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'createConversation',
					username,
					token,
					participants: selectedFriends,
					name,
					convType: type // Changed from 'type' to 'convType'
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create conversation');
			}

			if (data.success) {
				// Close the modal and optionally navigate to the new conversation
				onClose();
				
				// You might want to add a redirect to the new conversation here
				// For example, using a router like Next.js or React Router:
				// router.push(`/messages/${data.conversation.id}`);
				
				console.log('Conversation created successfully:', data.conversation);
			} else {
				throw new Error('Failed to create conversation');
			}
		} catch (err) {
			console.error('Error creating conversation:', err);
			setError(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setIsSending(false);
		}
	};

	const toggleChatType = () => {
		setChatType(prev => (prev === 'direct' ? 'group' : 'direct'));
	}

	return (
		<ModalTemplate isOpen={isOpen} onClose={onClose} title="New Message" contentLoading={isLoading} modalWidth='auto'>
			<div className="space-y-4">

				


				<h3 className="text-lg font-medium tc1">Select Friends</h3>
				{/* Friends list with checkboxes */}
				<div className="max-h-70 overflow-y-auto space-y-3 p-2 py-0 mini-scroll">
					{error ? (
						<p className="text-red-500">{error}</p>
					) : friends.length === 0 ? (
						<p className="tc2">No friends available</p>
					) : (
						friends.map((friend, indx) => (
							<div key={friend.id} className="flex items-center p-2 hover:bg2 rounded-full font-semibold cursor-pointer select-none"
								style={{
									backgroundColor: `var(${colors[indx % colors.length]})`,
									outline: `2px solid var(${colors[indx % colors.length]})`,
									outlineOffset: selectedFriends.includes(friend.id) ? '2px' : '-2px',
									transition: 'outline-offset 0.2s ease-in-out, background-color 0.2s ease-in-out'
								}}
								onClick={() => handleCheckboxChange(friend.id)}>

								<div className="relative flex items-center w-8 h-8 text-white"
									style={{
										transform: selectedFriends.includes(friend.id) ? 'rotate(0)' : 'rotate(90deg)',
										transition: 'transform 0.2s ease-in-out'
									}}>
									<FaCheck className="w-6 h-6 absolute left-[calc(50%-3px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
										style={{
											opacity: selectedFriends.includes(friend.id) ? 1 : 0,
											transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out'
										}}
									/>
									<FaTimes className="w-7 h-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
										style={{
											opacity: !selectedFriends.includes(friend.id) ? 1 : 0,
											transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out'
										}}
									/>
								</div>
								<label htmlFor={`friend-${friend.id}`} className="cursor-pointer text-white pr-4">
									{friend.username}
								</label>
							</div>
						))
					)}
				</div>
				{/* Add chat type selection - Direct or Group */}
				<div className="flex flex-col space-y-4 p-2 py-4 border-t border-gray-200/30">
					<button
						className={`text-white px-3 py-1 rounded-full w-full cursor-pointer`}
						style={{ backgroundColor: `var(--khb)` }}
						onClick={() => toggleChatType()}
					>
						<div className="flex items-center justify-center w-full">
							<AnimatePresence mode='wait'>
								<motion.div
									key={chatType}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3, delay: 0.2 }}
								>
									<div className="p-2">{chatType === 'direct' ? 'Direct' : 'Group:'}</div>
								</motion.div>
							</AnimatePresence>
							<AnimatePresence>
								<motion.div
									key={chatType === 'direct' ? 'group' : 'direct'}
									initial={{ opacity: 0, maxWidth: 0 }}
									animate={{ opacity: 1, maxWidth: 100 }}
									exit={{ opacity: 0, maxWidth: 0 }}
									transition={{ duration: 0.6 }}
								>
									{chatType === 'group' && (
										<input
											onClick={(e) => e.stopPropagation()}
											type="text"
											value={chatName}
											onChange={(e) => setChatName(e.target.value)}
											placeholder="name"
											className="w-full rounded text-white/80 bg-transparent focus:outline-none py-2"
										/>
									)}
								</motion.div>
							</AnimatePresence>
						</div>
					</button>
					<button
						className="text-white px-3 py-1 rounded-full w-full cursor-pointer"
					style={{ backgroundColor: 'var(--khb)', opacity: selectedFriends.length === 0 || isSending ? 0.5 : 1 }}
					onClick={createGroup}
					disabled={selectedFriends.length === 0 || isSending}
					>
						<div className="p-2">{isSending ? 'Creating...' : 'Create Chat'}</div>
				</button>
			</div>
				</div>
				{/* Create button */}
				<div className="flex justify-center">
					
			</div>
		</ModalTemplate>
	);
};

export default CreateMessageModal;

