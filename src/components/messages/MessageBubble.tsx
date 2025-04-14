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
  const quickEmojis = [
    '👍', '👎', '🤣', '😭',
    '❤️', '🙏', '🔥', '💀',
    '💩', '👀', '👁️', '💋',
    '💯', '🎉', '💥', '🎆',
    '😘', '🥰', '😮', '😢', '🤔', '🤯', '🤩', '🥳',
    '😎', '😴', '🤤', '🤐', '🤢', '🤡', '🙄', '🥺',
    '👏', '🖕', '👉', '👌', '🤏', '✌', '👋', '🤘',

    '👻', '👽', '🤖', '🎃',
    '🙈', '🙉', '🙊', '🐒',
    '🐱', '🐮', '🐸', '🐦',
    '🐛', '🦋', '🐣', '🐓',
    '🐝', '🐞', '🐬', '🐙',
    '🎂', '🍿', '🍷', '🍜',
    '💃', '🏕', '🚨', '🍻',
  ];

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
        <div className={`text-xs rounded-lg p-1 mb-1 max-w-[80%] tc3 pl-4 ${message.isMine ? 'ml-auto bg-blue-50 dark:bg-slate-900' : 'bg3'}`}>
          <span className="font-medium">{message.replyToMessage.sender}</span>: {message.replyToMessage.content}
        </div>
      )}

      <div className={`relative p-3 rounded-lg max-w-[80%] ${message.isMine
        ? 'ml-auto bg-blue-100 dark:bg-slate-900 text-blue-200'
          : 'bg2 tc1'
        }`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium tc3">{message.sender}</span>
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
            <p className={message.deleted ? "italic text-gray-500" : "tc1"}>{message.content}</p>
        )}

        {/* Reactions display */}
        <div className="flex justify-between items-center mt-2">
        {Object.keys(groupedReactions).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(groupedReactions).map(([emoji, count]) => {
                // Determine the image source based on the emoji
                if (!emoji) return null;
                const codePoint = emoji.codePointAt(0);
                if (!codePoint) return null;
                const imgSrc = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codePoint.toString(16)}/512.gif`;
                const imgSrcWebp = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codePoint.toString(16)}/512.webp`;

                return (
                  <span key={emoji} className="text-md bg-white/70 dark:bg-white/10 rounded-lg px-1.5 py-0.5 flex items-center cursor-pointer outline-0 hover:outline-2 outline-black/50 dark:outline-gray-300"
                    style={{ transition: "outline 0.05s ease" }}
                    onClick={() => onReact?.(message.id, emoji)}>
                    <picture>
                      <source srcSet={imgSrcWebp} type="image/webp" />
                      <img src={imgSrc} alt={emoji} width="25" height="25" />
                    </picture>
                    {count > 1 && <span className="ml-1 text-gray-700">{count}</span>}
                  </span>
                );
              })}
          </div>
        )}
        </div>
        {/* Options that appear on hover */}
        {isHovered && !isEditing && (
          <div className={"absolute -bottom-4 flex space-x-1 bg3 p-1 rounded-md shadow-md z-10 right-0"}>
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
                <picture>
                  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif" alt="😀" width="20" height="20" />
                </picture>
              </button>

              {showEmojiPicker && (
                <div className="absolute top-full mt-1 right-0 bg2 p-1 rounded-md shadow-md gap-0 z-10 max-h-50 overflow-y-scroll mini-scroll snap-none scroll-smooth inline-grid grid-cols-4 w-30">
                  {quickEmojis.map(emoji => {
                    // Determine the image source based on the emoji
                    return (
                    <button
                      key={emoji}
                        className="hover:bg-gray-300 p-0 rounded flex items-center justify-center text-2xl"
                      onClick={() => {
                        onReact?.(message.id, emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                        {emoji}
                    </button>
                    );
                  })}
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

    </div>


  );
};

export default MessageBubble;
