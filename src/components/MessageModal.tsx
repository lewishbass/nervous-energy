import React from 'react';
import ModalTemplate from './ModalTemplate';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Messages">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="tc2 text-lg font-medium">Your Messages</h3>
            <button
            className="px-3 py-1 rounded text-sm bt2 tc3"
            onClick={() => alert('New Message button clicked!')}
            >
            New Message
            </button>
        </div>
        
        <div className="space-y-3">
          {/* Example messages - replace with actual data */}
          {[
            { id: 1, sender: 'Jane Smith', preview: 'Hey, did you get my last email about the...', time: '10:30 AM', unread: true },
            { id: 2, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
            { id: 3, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
            { id: 4, sender: 'John Doe', preview: 'The meeting has been rescheduled to...', time: 'Yesterday', unread: false },
            { id: 5, sender: 'Alice Johnson', preview: 'Could you review the document I sent...', time: 'Aug 10', unread: false },
          ].map((message) => (
            <div key={message.id} className={`p-3 rounded-lg ${message.unread ? 'bg3' : 'bg2'}`}>
              <div className="flex justify-between">
                <span className="font-semibold tc1">{message.sender}</span>
                <span className="text-sm opacity-75 tc2">{message.time}</span>
              </div>
              <p className="text-sm truncate tc3">{message.preview}</p>
            </div>
          ))}
        </div>
        
        <div className="pt-3 mt-2 border-t-2 border-gray-200">
          <button className="w-full text-center py-2 text-blue-500">View All Messages</button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default MessageModal;
