// ProfileModal.jsx
// made using ModalTemplate similar to message modal
// dummy data
// displays user data

import React, { useEffect, useState } from 'react';
import ModalTemplate from './ModalTemplate';
import { useAuth } from '@/context/AuthContext';
import GenericEdit from '../generics/GenericEdit';
import ChangePasswordForm from '../generics/ChangePasswordForm';
import DeleteAccountForm from '../generics/DeleteAccountForm';
import { analytics } from '@/context/Analytics';

const PROFILE_ROUTE = '/.netlify/functions/profile';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalWidth?: string;
}

// Define user profile interface based on backend data structure
interface UserProfile {
  username: string;
  id?: string;
  createdAt?: Date;
  profile: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio: string;
    email?: string;
    location?: string;
    birthday?: Date;
  };
  data: {
    lastSeen: Date;
    friends?: [];
    history?: [];
    booksRead?: [];
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, modalWidth = "80%" }) => {
  // Replace dummy data with state for real user data
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { username, token, logout, userId } = useAuth();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  // Track modal open event
  useEffect(() => {
    if (isOpen) {
      analytics.track('modal_open', { modalType: 'profile' });
    }
  }, [isOpen]);

  // Function to fetch user profile from backend
  const fetchUserProfile = async () => {
    if (!username || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PROFILE_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getSelf',
          username,
          token,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAndClose = () => {
    if (logout) {
      logout();
    }
    onClose();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, username]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  // Display error state
  if (error) {
    return (
      <ModalTemplate isOpen={isOpen} onClose={onClose} title="My Profile" contentLoading={false}>
        <div className="flex justify-center items-center h-40 flex-col">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={fetchUserProfile}
          >
            Retry
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2"
            onClick={logoutAndClose}
          >
            Log Out
          </button>
        </div>
      </ModalTemplate>
    );
  }

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="My Profile" contentLoading={isLoading} modalWidth={modalWidth}>
      <div className="space-y-6">
        {/* Profile Header with Avatar */}
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {/* Placeholder for profile image */}
            <span className="text-2xl text-gray-600">
              {userData ? userData.username.charAt(0) : '-'}
            </span>
          </div>
          <div>
            <div className="max-w-50 text-2xl font-bold tc1 flex flex-direction-row items-center">
              <GenericEdit
                className="mr-2"
                type="word"
                editable={isEditing}
                value={userData?.profile.firstName || ''}
                placeholder={'First'}
                submitField="firstName"
                submitRoute={PROFILE_ROUTE}
              />
              <GenericEdit
                type="word"
                editable={isEditing}
                value={userData?.profile.lastName || ''}
                placeholder={'Last'}
                submitField="lastName"
                submitRoute={PROFILE_ROUTE}
              />
            </div>
            <p className="text-sm tc3">@{userData ? userData.username : '-'}</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          className="w-full py-2 bt2 rounded-lg tc2 font-medium"
          style={{
            boxShadow: !isEditing ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.15)',
          }}
          onClick={() => toggleEdit()}
        >
          <div>Edit Profile</div>
        </button>

        {/* User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">{userData?.data.history?.length}</div>
              <div className="text-xs tc3">Profile Edits</div>
            </div>
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">{userData?.data.friends?.length}</div>
              <div className="text-xs tc3">Friends</div>
            </div>
            <div className="p-2 bg2 rounded-lg">
              <div className="font-bold tc1">{userData?.data.booksRead ? userData.data.booksRead.length : 0}</div>
              <div className="text-xs tc3">Books Read</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[17px] tc2">
              <h3 className="text-sm font-semibold tc3">Email</h3>
              <GenericEdit
                type="string"
                editable={isEditing}
                value={userData?.profile.email || ''}
                placeholder={'your@email'}
                submitField="email"
                submitRoute={PROFILE_ROUTE}
              />
            </div>

            <div className="tc2 text-[17px]">
              <h3 className="text-sm font-semibold tc3">Bio</h3>
              <GenericEdit
                type="paragraph"
                editable={isEditing}
                value={userData?.profile.bio || ''}
                placeholder={'Tell us about yourself'}
                submitField="bio"
                submitRoute={PROFILE_ROUTE}
              />
            </div>

            <div className="text-[17px] tc2">
              <h3 className="text-sm font-semibold tc3">Location</h3>
              <GenericEdit
                type="location"
                editable={isEditing}
                value={userData?.profile.location || ''}
                placeholder={'Where are you from'}
                submitField="location"
                submitRoute={PROFILE_ROUTE}
              />
            </div>

            <div className="text-[17px] tc2">
              <h3 className="text-sm font-semibold tc3">Birthday</h3>
              <GenericEdit
                type="date"
                editable={isEditing}
                value={userData?.profile.birthday ? userData.profile.birthday : null}
                placeholder={Date.now()}
                submitField="birthday"
                submitRoute={PROFILE_ROUTE}
              />
            </div>

            <div className="text-[17px] tc2">
              <h3 className="text-sm font-semibold tc3">Member Since</h3>
              <span className="ml-1">
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                  : 'Unknown'}
              </span>
            </div>

            {/*<div>
              <h3 className="text-sm font-semibold tc3">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Sci-Fi', 'Fantasy'].map((genre, index) => (
                  <span key={index} className="px-2 py-1 text-xs rounded-full bg3 tc2">
                    {genre}
                  </span>
                ))}
              </div>
            </div>*/}
          </div>
        </div>

        {/* Account Management Forms - Side by side with animation */}
        <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${isEditing ? 'max-h-220 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col md:flex-row gap-4 border-t-2 border-gray-200">
            {/* Password Change Form */}
            <div className="flex-1 transition-all duration-1000 ease-in-out transform origin-top p-3">
              <ChangePasswordForm userId={userId} isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>

            {/* Delete Account Form */}
            <div className="flex-1 transition-all duration-1000 ease-in-out transform origin-top p-3">
              <DeleteAccountForm
                userId={userId}
                username={username} // Pass the username prop
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onDelete={logoutAndClose}
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-6 mt-2 border-t-2 border-gray-200 space-y-3">
          {/* Logout Button */}
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