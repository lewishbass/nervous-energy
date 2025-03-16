// ProfileModal.jsx
// made using ModalTemplate similar to message modal
// dummy data
// displays user data

import React from 'react';
import ModalTemplate from './ModalTemplate';
import { useAuth } from '@/context/AuthContext';
import GenericEdit from './generics/GenericEdit';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  // Dummy user data - use actual username if provided
  const user = {
    fullName: 'John Doe', // Simple transformation for demo
    email: 'john.doe@example.com',
    bio: 'Passionate reader, tech enthusiast, and avid hiker. Always looking for the next adventure in books and in life.',
    location: 'San Francisco, CA',
    birthday: 'January 15, 1990',
    joinDate: 'March 2021',
    booksRead: 47,
    friends: 218,
    favoriteGenres: ['Science Fiction', 'Mystery', 'Biography']
  };

  const { username, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const logoutAndClose = () => {
    if (logout) {
      logout();
    }
    onClose();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  }

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="My Profile">
      <div className="space-y-6">
        {/* Profile Header with Avatar */}
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {/* Placeholder for profile image */}
            <span className="text-2xl text-gray-600">
              {user.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold tc1">{user.fullName}</h2>
            <p className="text-sm tc3">@{username}</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button 
          className="w-full py-2 bt2 rounded-lg tc2 font-medium"
          style={{boxShadow: !isEditing ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.15)'}}
          onClick={() => toggleEdit()}
        >
          <div>Edit Profile</div>
        </button>

        {/* User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">{user.booksRead}</div>
              <div className="text-xs tc3">Books Read</div>
            </div>
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">{user.friends}</div>
              <div className="text-xs tc3">Friends</div>
            </div>
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">4.7</div>
              <div className="text-xs tc3">Avg Rating</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold tc3">Email</h3>
              <GenericEdit type="string" editable={isEditing} value={"john.doe@edit.com"} placeholder={"your@email"}/>
              <p className="tc2">{user.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold tc3">Bio</h3>
              <p className="tc2">{user.bio}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold tc3">Location</h3>
              <p className="tc2">{user.location}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold tc3">Birthday</h3>
              <p className="tc2">{user.birthday}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold tc3">Member Since</h3>
              <p className="tc2">{user.joinDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold tc3">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.favoriteGenres.map((genre, index) => (
                  <span key={index} className="px-2 py-1 text-xs rounded-full bg3 tc2">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-2 border-t-2 border-gray-200">
            <button 
            className="w-full text-center py-2 text-red-500 cursor-pointer"
            onClick={logoutAndClose}
            >
            Log Out
            </button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default ProfileModal;