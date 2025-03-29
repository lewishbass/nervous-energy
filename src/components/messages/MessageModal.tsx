// MessageModal.tsx
// node.js, react, typescript, tailwindcss

import React, { useState } from 'react';
import ModalTemplate from '../modals/ModalTemplate';
import MessageBubble from './MessageBubble';
import { IoSend } from 'react-icons/io5'; // Import the send icon

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  { id: 1, sender: 'Jane Smith', preview: 'Hey, did you get my last email about the...', time: '10:30 AM', unread: true },
  { id: 2, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
  { id: 3, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
  { id: 4, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
  { id: 5, sender: 'Alice Johnson', preview: 'Could you review the document I sent...', time: 'Aug 10', unread: false },
];

// Mock data for messages
const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: 'Jane Smith', content: 'Hey, did you get my last email about the project?', time: '10:28 AM', isMine: false },
    { id: 2, sender: 'Me', content: 'Not yet, can you summarize it?', time: '10:30 AM', isMine: true },
    { id: 3, sender: 'Jane Smith', content: 'Sure, I was thinking we should move the deadline.', time: '10:32 AM', isMine: false },
  ],
  2: [
    { id: 1, sender: 'John Doe', content: 'The meeting has been rescheduled to tomorrow.', time: '9:00 AM', isMine: false },
    { id: 2, sender: 'Me', content: 'Thanks for letting me know.', time: '9:05 AM', isMine: true },
  ],
  // mock data for other conversations would go here
};

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const handleEditMessage = (id: number, content: string) => {
    // In a real app, you would implement actual editing functionality
    alert(`Editing message ${id}: ${content}`);
  };

  const handleDeleteMessage = (id: number) => {
    // In a real app, you would implement actual deletion
    alert(`Deleting message ${id}`);
  };

  const handleReactToMessage = (id: number, emoji: string) => {
    // In a real app, you would save the reaction
    alert(`Reacted with ${emoji} to message ${id}`);
  };

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Messages" contentLoading={false}>
      <div className="flex h-[60vh]">
        {/* Left Panel - Conversation List */}
        <div className={`${isLeftPanelCollapsed ? 'w-12' : 'w-1/3'} transition-all duration-300 border-r border-gray-200 flex flex-col`}>
          {/* Panel Header */}
          <div className="p-2 flex justify-between items-center">
            {!isLeftPanelCollapsed && <h3 className="tc2 font-medium">Conversations</h3>}
            <button
              className="p-1 rounded hover:bg-gray-100 tc1"
              onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
            >
              {isLeftPanelCollapsed ? '→' : '←'}
            </button>
          </div>

          {/* Conversation List */}
          {!isLeftPanelCollapsed ? (
            <div className="overflow-y-auto flex-1 space-y-2 p-2">
              {MOCK_CONVERSATIONS.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer ${selectedConversationId === conversation.id ? 'bg3' : conversation.unread ? 'bg3 opacity-80' : 'bg2'
                    }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold tc1">{conversation.sender}</span>
                    <span className="text-sm opacity-75 tc2">{conversation.time}</span>
                  </div>
                  <p className="text-sm truncate tc3">{conversation.preview}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 py-2">
              {MOCK_CONVERSATIONS.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`mx-auto w-8 h-8 rounded-full mb-2 flex items-center justify-center cursor-pointer ${selectedConversationId === conversation.id ? 'bg3' : conversation.unread ? 'bg3 opacity-80' : 'bg2'
                    }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
                >
                  <span className="font-semibold tc1">{conversation.sender.charAt(0)}</span>
                </div>
              ))}
            </div>
          )}

          {/* New Message Button */}
          <div className="p-2">
            {isLeftPanelCollapsed ? (
              <button
                className="w-8 h-8 rounded-full bg2 shadow-md flex items-center justify-center mx-auto tc1"
                onClick={() => alert('New Message button clicked!')}
              >
                +
              </button>
            ) : (
              <button
                className="w-full px-4 py-3 rounded-full text-lg bg2 tc1 shadow-md flex items-center justify-center cursor-pointer ml-[-6]"
                onClick={() => alert('New Message button clicked!')}
              >
                New Message
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Chat Display */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <>
              {/* Chat Header */}
              <div className="py-3 px-4 ">
                <h3 className="tc1 font-medium">
                  {MOCK_CONVERSATIONS.find(c => c.id === selectedConversationId)?.sender}
                </h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {// @ts-expect-error funky typing
                  MOCK_MESSAGES[selectedConversationId]?.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onReact={handleReactToMessage}
                    />
                  ))}
              </div>

              {/* Message Input */}
              <div className="p-3 flex flex-row w-full ">
                <div className="flex flex-grow items-center bg2 rounded-full shadow-md px-4 py-1 mr-3">
                  <input
                    type="text"
                    className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 tc1"
                    placeholder="Type a message..."
                  />
                </div>
                <button
                  className="p-3 rounded-full text-white hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md"
                  style={{ backgroundColor: 'var(--khb)' }}
                >
                  <IoSend size={22} />
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
