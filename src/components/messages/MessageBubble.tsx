import React, { useState } from 'react';

interface ReplyReference {
  id: string;
  sender: string;
  content: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
  replyToMessage?: ReplyReference;
  edited?: boolean;
  deleted?: boolean;
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: Date;
  }[];
}

interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReact?: (id: string, emoji: string) => void;
  onReply?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  onDelete,
  onReact,
  onReply,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  // Common emojis for quick reactions
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  const handleEditClick = () => {
    if (message.deleted) return;
    setIsEditing(true);
    setEditContent(message.content);
  };

  const submitEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc: { [key: string]: number }, reaction) => {
    if (!acc[reaction.emoji]) acc[reaction.emoji] = 0;
    acc[reaction.emoji]++;
    return acc;
  }, {}) || {};

  return (
    <div
      className={`relative ${message.isMine ? 'ml-auto' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Reply reference */}
      {message.replyToMessage && (
        <div className={`text-xs rounded-lg p-1 mb-1 max-w-[80%] ${message.isMine ? 'ml-auto bg-blue-50' : 'bg-gray-50'}`}>
          <span className="font-medium">{message.replyToMessage.sender}</span>: {message.replyToMessage.content}
        </div>
      )}

      <div className={`p-3 rounded-lg max-w-[80%] ${message.isMine
          ? 'ml-auto bg-blue-100 text-blue-900'
          : 'bg2 tc1'
        }`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{message.sender}</span>
          <div className="flex items-center text-xs opacity-75 ml-2">
            {message.edited && <span className="mr-1">(edited)</span>}
            <span>{message.time}</span>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={2}
            />
            <div className="flex justify-end mt-1 space-x-2">
              <button
                className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
              >
                Cancel
              </button>
              <button
                className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={submitEdit}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className={message.deleted ? "italic text-gray-500" : ""}>{message.content}</p>
        )}

        {/* Reactions display */}
        {Object.keys(groupedReactions).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <span key={emoji} className="text-xs bg-white bg-opacity-60 rounded-full px-1.5 py-0.5 flex items-center">
                {emoji} {count > 1 && <span className="ml-1 text-gray-700">{count}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Options that appear on hover */}
      {isHovered && !isEditing && (
        <div className="absolute -top-8 right-0 flex space-x-1 bg2 p-1 rounded-md shadow-md z-10">
          {/* Reply button */}
          <button
            className="hover:bg-gray-200 p-1 rounded"
            onClick={() => onReply && onReply()}
            title="Reply to message"
          >
            ↩️
          </button>

          <div className="relative">
            <button 
              className="hover:bg-gray-200 p-1 rounded"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="React with emoji"
            >
              😀
            </button>
            
            {showEmojiPicker && (
              <div className="absolute top-full mt-1 right-0 bg2 p-1 rounded-md shadow-md flex space-x-1 z-10">
                {quickEmojis.map(emoji => (
                  <button
                    key={emoji}
                    className="hover:bg-gray-200 p-1 rounded"
                    onClick={() => {
                      onReact?.(message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {message.isMine && !message.deleted && (
            <>
              <button 
                className="hover:bg-gray-200 p-1 rounded"
                onClick={handleEditClick}
                title="Edit message"
              >
                ✏️
              </button>
              <button 
                className="hover:bg-gray-200 p-1 rounded text-red-500"
                onClick={() => onDelete && onDelete(message.id)}
                title="Delete message"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
