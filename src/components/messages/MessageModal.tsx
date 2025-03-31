import React, { useState, useEffect, useRef } from 'react';
import ModalTemplate from '../modals/ModalTemplate';
import MessageBubble from './MessageBubble';
import { IoSend } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import CreateMessageModal from './CreateMessageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGear } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

// API endpoint
const CONVERSATION_API = '/.netlify/functions/conv';

// Types for our data structures
interface Conversation {
  id: string;
  name: string;
  convType: string;  // Changed from 'type' to 'convType'
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
  participants: {
    userId: string;
    role: string;
    isActive: boolean;
  }[];
  userInfo?: {
    newMessages: boolean;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date | string;
  replyTo?: string;
  edited?: boolean;
  deleted?: boolean;
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: Date;
  }[];
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  const { username, token, userId } = useAuth();
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<{ [key: string]: string }>({});
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isUpdatingMessages, setIsUpdatingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isFetchingConversations, setIsFetchingConversations] = useState(false);
  const isFetchingConversationsRef = useRef(false);

  const [createMessageModalOpen, setCreateMessageModalOpen] = useState(false);
  const [sendButtonState, setSendButtonState] = useState<'valid' | 'invalid' | 'sending'>('valid');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);


  const closeCreateMessageModal = () => {
    setCreateMessageModalOpen(false);
  }

  useEffect(() => {
    isFetchingConversationsRef.current = isFetchingConversations;
  }, [isFetchingConversations]);

  useEffect(() => {
    console.log("Message error: ", error);
  }, [error]);

  // Function to check if there are updates available
  const checkForUpdates = async () => {

    if (!username) return;

    try {
      const response = await fetch('/.netlify/functions/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getIsUpdated',
          username
        }),
      });

      const data = await response.json();

      if (response.ok && data.updatedChats) {
        console.log("Conversations updated, fetching new data...");
        // If there are updates, fetch the conversations
        fetchConversations();
        if (selectedConversationId) {
          fetchMessages(selectedConversationId);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  useEffect(() => {
    // Reset selected conversation if it doesn't exist in the list    
    if (conversations.length == 0) setSelectedConversationId(null);
    else if (!conversations.some(conv => conv.id === selectedConversationId))
      setSelectedConversationId(null)
  }, [conversations, selectedConversationId]);



  // Fetch user's conversations when modal opens and poll every 3 seconds for updates
  useEffect(() => {
    setMessages([]); // Clear messages when modal opens
    setIsLoadingMessages(true); // Set loading state for messages

    if (isOpen && username && token) {
      // Initial fetch
      // SefefetchCon lling for the updates check instead of fetching everything
      fetchConversations();
      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
      const updateCheckInterval = setInterval(() => {
        if (!isFetchingConversationsRef.current) {
          checkForUpdates();
        }
      }, 1000); // Check for updates every 3 seconds

      // Cleanup on unmount or when modal closes
      return () => {
        clearInterval(updateCheckInterval);
      };
    }
  }, [isOpen, username, token, selectedConversationId]);


  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    console.log("Fetching conversations...");
    if (!username || !token) return;
    console.log("Fetching conversations for user:", username);
    //setIsLoading(true);
    setIsFetchingConversations(true);

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getUserConversations',
          username,
          token,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConversations(data.conversations);

        // If there's at least one conversation and none is selected, select the first one
        if (data.conversations.length > 0 && !selectedConversationId) {
          setSelectedConversationId(data.conversations[0].id);
        }
      } else {
        setError(data.error || 'Failed to fetch conversations');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    console.log("Fetching messages for conversation ID:", conversationId);
    if (!username || !token) return;
    if (!conversationId || conversationId === '') return;

    setIsUpdatingMessages(true);

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getMessages',
          username,
          token,
          conversationId,
          limit: 50, // Adjust as needed
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages(data.messages);

        // Build participant lookup dictionary for display names
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
          // Initially use user IDs as placeholder names
          const participantLookup: { [key: string]: string } = {};
          conversation.participants.forEach(p => {
            participantLookup[p.userId] = p.userId; // Initially use ID as name
          });

          // Extract all participant user IDs
          const participantIds = conversation.participants.map(p => p.userId);

          // Fetch user profiles to get display names
          const profileResponse = await fetch('/.netlify/functions/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get',
              username,
              token,
              toFetch: participantIds,
              isId: true
            }),
          });

          const profileData = await profileResponse.json();

          // Update participant lookup with actual names
          if (Array.isArray(profileData)) {
            const updatedLookup = { ...participantLookup };
            profileData.forEach(user => {
              if (user.id && user.username) {
                updatedLookup[user.id] = user.profile?.firstName
                  ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                  : user.username;
              }
            });
            setParticipants(updatedLookup);
          }
          // set this conversation newMessages to false
          setConversations(prev =>
            prev.map(conv =>
              conv.id === conversationId
                ? { ...conv, userInfo: { ...conv.userInfo, newMessages: false } }
                : conv
            )
          );
        }
      } else {
        console.error('Failed to fetch messages:', data.error);
        console.log('Response:', data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
      setIsUpdatingMessages(false);
    }
  };


  const sendMessage = async () => {
    if (!username || !token || !selectedConversationId || !newMessageContent.trim()) return;
    if (sendButtonState === 'sending') return; // Prevent multiple sends
    setSendButtonState('sending');
    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          username,
          token,
          conversationId: selectedConversationId,
          content: newMessageContent.trim(),
          replyTo: replyingTo ? replyingTo.id : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new message to the current messages
        setMessages(prevMessages => [...prevMessages, {
          ...data.message,
          // Convert server timestamp string to Date object
          timestamp: new Date(data.message.timestamp)
        }]);

        // Clear the input and reset replyingTo
        setNewMessageContent('');
        setReplyingTo(null);

        // Update the conversation's last message
        setConversations(prev =>
          prev.map(conv =>
            conv.id === selectedConversationId
              ? {
                ...conv,
                lastMessage: {
                  content: newMessageContent.trim(),
                  senderId: userId || '',
                  timestamp: new Date()
                }
              }
              : conv
          )
        );
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    finally {
      setSendButtonState('valid');
    }
  };

  const handleEditMessage = async (id: string, content: string) => {
    if (!username || !token) return;

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'editMessage',
          username,
          token,
          messageId: id,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the message in the UI
        setMessages(prev =>
          prev.map(msg =>
            msg.id === id
              ? { ...msg, content, edited: true }
              : msg
          )
        );
      } else {
        console.error('Failed to edit message:', data.error);
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!username || !token) return;

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteMessage',
          username,
          token,
          messageId: id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the message in the UI
        setMessages(prev =>
          prev.map(msg =>
            msg.id === id
              ? { ...msg, content: "[This message has been deleted]", deleted: true }
              : msg
          )
        );
      } else {
        console.error('Failed to delete message:', data.error);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReactToMessage = async (id: string, emoji: string) => {
    if (!username || !token) return;

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addReaction',
          username,
          token,
          messageId: id,
          emoji,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the message reactions in the UI
        setMessages(prev =>
          prev.map(msg =>
            msg.id === id
              ? { ...msg, reactions: data.reactions }
              : msg
          )
        );
      } else {
        console.error('Failed to add reaction:', data.error);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
    // Focus the input field
    messageInputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Add the delete conversation handler
  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent selecting the conversation when clicking delete

    if (!username || !token) return;

    try {
      const response = await fetch(CONVERSATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'editConversation',
          username,
          token,
          conversationId,
          deleteConv: true
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the conversation from the UI
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));

        // If the deleted conversation was selected, clear the selection
        if (selectedConversationId === conversationId) {
          setSelectedConversationId(null);
          setMessages([]);
        }
      } else {
        console.error('Failed to delete conversation:', data.error);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Determine the name to display for a user ID
  const getUserDisplayName = (userId: string) => {
    return participants[userId] || userId;
  };

  // Format date for displaying in the UI
  const formatMessageDate = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for conversation list
  const formatConversationDate = (timestamp: Date | string) => {
    if (!timestamp) return '';

    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 86400000;

    if (diff < dayInMs) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * dayInMs) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;

    // For direct conversations without a name, use the other participant's ID
    if (conversation.convType === 'direct') {  // Changed from 'type' to 'convType'
      const otherParticipant = conversation.participants.find(p => p.userId !== userId);
      return otherParticipant ? getUserDisplayName(otherParticipant.userId) : 'Conversation';
    }

    return 'Group Conversation';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  const SendButton = () => {
    return (
      <AnimatePresence mode="wait">
        {sendButtonState === "valid" ? (
          <motion.div
            key="sendIcon"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IoSend size={24} />
          </motion.div>
        ) : (
          <motion.div
            key="loadingSpinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: "20px",
                height: "20px",
                border: "4px solid #ffffff",
                borderTop: "2px solid transparent",
                borderRadius: "50%"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Messages" contentLoading={isLoading && conversations.length === 0}>
      <CreateMessageModal isOpen={createMessageModalOpen} onClose={closeCreateMessageModal} />
      <div className="flex h-[60vh]">
        {/* Left Panel - Conversation List */}
        <div className={`${isLeftPanelCollapsed ? 'w-15' : 'w-1/3'} transition-all duration-600 border-r border-gray-200 flex flex-col`}>
          {/* Panel Header */}
          <div className="p-2 flex justify-between items-center">
            {!isLeftPanelCollapsed && <h3 className="tc2 font-medium overflow-hidden">Conversations</h3>}
            <button
              className="p-1 rounded hover:bg-gray-300/40  tc1 ml-auto w-8 h-8 rounded-full flex items-center justify-center"
              onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
            >
              {isLeftPanelCollapsed ? '→' : '←'}
            </button>
          </div>

          {/* Conversation List - Modified to add delete button */}
          <div className="overflow-y-auto flex-1 space-y-2 p-2 overflow-x-hidden">
            {conversations.length === 0 && !isLoading ? (
              <div className="text-center p-4 tc3 text-nowrap">No conversations yet</div>
            ) : (
                conversations.map((conversation) => (
                <div
                    key={conversation.id}
                    className={` relative min-w-10 min-h-10 overflow-hidden p-3 rounded-lg cursor-pointer ${selectedConversationId === conversation.id
                      ? 'bg3'
                      : conversation.userInfo?.newMessages
                        ? 'bg2 opacity-80'
                        : 'bg2 opacity-50'
                    }`}
                    onClick={() => { setSelectedConversationId(conversation.id); scrollToBottom(); }}
                >


                    <AnimatePresence >
                      <motion.div
                        initial={{ opacity: 0, translateX: -20 }}
                        animate={{
                          opacity: isLeftPanelCollapsed ? 0 : 1,
                          translateX: isLeftPanelCollapsed ? -20 : 0,
                          maxHeight: isLeftPanelCollapsed ? 0 : '100px',
                        }}
                        transition={{ duration: 0.3 }}>

                        <div className="flex justify-between overflow-hidden text-nowrap">
                          {conversation.userInfo?.newMessages && <>
                            <div className="absolute top-1/2 -translate-y-1/2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-2 w-3 h-3 bg-red-500 rounded-full" />
                          </>}
                          <span className="font-semibold tc1">{getConversationName(conversation)}</span>
                          <div className="flex text-sm opacity-75 tc2">

                            {conversation.lastMessage ? formatConversationDate(conversation.lastMessage.timestamp) : ''}
                            {/* Add the delete button */}
                            <button
                              className="w-5 h-5 rounded-full 
                                flex items-center justify-center text-gray-600 z-10 opacity-70 hover:opacity-100 cursor-pointer"
                              onClick={(e) => handleDeleteConversation(e, conversation.id)}
                              aria-label="Delete conversation"
                            >
                              <IoClose size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm truncate tc3">
                          {conversation.lastMessage ?
                            (conversation.lastMessage.senderId === userId ? 'You: ' : '') + conversation.lastMessage.content
                            : 'No messages yet'}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    <AnimatePresence>
                      <motion.div
                        className="absolute top-5 left-5 -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: !isLeftPanelCollapsed ? 0 : 1 }}
                        transition={{ duration: 0.3 }}>
                        <span className="font-semibold tc1">{getConversationName(conversation).charAt(0)}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))
            )}
          </div>


          {/* New Message Button */}
          <div className="p-2">

            <button
              className="w-full px-3 py-1 w-10 h-10 rounded-full text-3xl bg2 tc1 shadow-md flex items-center justify-center cursor-pointer"
              onClick={() => setCreateMessageModalOpen(true)}
            >
              {isLeftPanelCollapsed ? "+" : <span className="text-lg text-nowrap overflow-hidden">New Message</span>}
            </button>
          </div>
        </div>

        {/* Right Panel - Chat Display */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <>
              {/* Chat Header */}
              <div className="py-3 px-4 bg2">
                <div className="flex items-center">
                  <h3 className="tc1 font-medium">
                    {getConversationName(conversations.find(c => c.id === selectedConversationId) || { id: '', name: '', convType: '', participants: [] })}
                  </h3>
                  {isUpdatingMessages ? (
                    <div className="ml-2 animate-spin">
                      <FaGear size={20} className="text-gray-500 w-5 h-5" />
                    </div>
                  ) :
                    (<div className="ml-2 w-5 h-5" />)}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 mini-scroll">
                {isLoadingMessages ? (
                  <div className="text-center p-4 tc3">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center p-4 tc3">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((message) => {
                    // Find referenced message if this is a reply
                    const referencedMessage = message.replyTo
                      ? messages.find(m => m.id === message.replyTo)
                      : null;
                    return (
                      <MessageBubble
                        key={message.id}
                        message={{
                          id: message.id,
                          sender: getUserDisplayName(message.senderId),
                          content: message.content,
                          time: formatMessageDate(message.timestamp),
                          isMine: message.senderId === userId,
                          replyToMessage: referencedMessage ? {
                            id: referencedMessage.id,
                            sender: getUserDisplayName(referencedMessage.senderId),
                            content: referencedMessage.content,
                          } : undefined,
                          edited: message.edited,
                          deleted: message.deleted,
                          reactions: message.reactions
                        }}
                        onEdit={(id, content) => handleEditMessage(id, content)}
                        onDelete={(id) => handleDeleteMessage(id)}
                        onReact={(id, emoji) => handleReactToMessage(id, emoji)}
                        onReply={() => handleReplyToMessage(message)}
                      />
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview (if replying) */}
              {replyingTo && (
                <div className="p-2 bg2 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs tc3">Replying to {getUserDisplayName(replyingTo.senderId)}</span>
                    <span className="text-sm tc2 truncate">{replyingTo.content}</span>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={cancelReply}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="p-3 flex flex-row w-full">
                <div className="flex flex-grow items-center bg2 rounded-full shadow-md px-4 py-1 mr-3">
                  <input
                    ref={messageInputRef}
                    type="text"
                    className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 tc1"
                    placeholder="Type a message..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sendButtonState === 'sending'}
                    style={{
                      filter: sendButtonState === 'sending' ? 'contrast(0.1)' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                </div>
                <button
                  className="p-3 rounded-full text-white hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md cursor-pointer w-12"
                  style={{
                    backgroundColor: 'var(--khb)',
                    opacity: newMessageContent.trim() ? 1 : 0.75,
                    transition: 'opacity 0.3s ease',
                  }}
                  onClick={sendMessage}
                  disabled={!newMessageContent.trim()}
                >
                  {SendButton()}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-6">
              <div className="text-center">
                <p className="tc2 text-xl mb-2">Select a conversation</p>
                <p className="tc3 text-sm">or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalTemplate>
  );
};

export default MessageModal;
