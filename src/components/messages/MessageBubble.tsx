import React, { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
  onReact?: (id: number, emoji: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  onDelete,
  onReact
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Common emojis for quick reactions
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  return (
    <div
      className={`p-3 rounded-lg max-w-[80%] relative ${
        message.isMine
          ? 'ml-auto bg-blue-100 text-blue-900'
          : 'bg2 tc1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{message.sender}</span>
        <span className="text-xs opacity-75 ml-2">{message.time}</span>
      </div>
      <p>{message.content}</p>
      
      {/* Options that appear on hover */}
      {isHovered && (
        <div className="absolute -top-8 right-0 flex space-x-1 bg2 p-1 rounded-md shadow-md">
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
          
          {message.isMine && (
            <>
              <button 
                className="hover:bg-gray-200 p-1 rounded"
                onClick={() => onEdit && onEdit(message.id, message.content)}
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
