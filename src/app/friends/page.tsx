// friends/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaUserPlus, FaUserFriends, FaClock, FaCheck, FaUserMinus } from 'react-icons/fa';

import '@/styles/toggles.css'; // Import the external slider styles

// Define interfaces for API responses and data structures
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  location?: string;
  birthday?: string;
}

interface UserData {
  lastSeen: Date;
  friends: string[];
}

interface User {
  username: string;
  profile: UserProfile;
  data: UserData;
  id: string;
}

interface SelfResponse {
  user: User;
}

interface Friend {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio: string;
  lastSeen?: Date;
  location: string;
  id: string;
}

interface OtherUser {
  username: string;
  lastSeen: Date;
  status?: 'none' | 'pending' | 'received' | 'friends';
  id: string;
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [otherUsers, setOtherUsers] = useState<OtherUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingOthers, setIsLoadingOthers] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [requestsRefresh, setRequestsRefresh] = useState<number>(0);
  const [removingFriends, setRemovingFriends] = useState<Set<string>>(new Set());
  const [showFriendsInSearch, setShowFriendsInSearch] = useState<boolean>(false);
  
  const { username, token, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchFriends = async (): Promise<void> => {
      if (!isLoggedIn) {
        return;
      }
      try {
        setIsLoading(true);
        
        if (!username || !token) {
          throw new Error('Not authenticated');
        }

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

        const selfData: SelfResponse = await selfResponse.json();
        
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
        
        const friendsData: User[] = await friendsResponse.json();
        console.log("num friends: " + friendsData.length);
        for(let i = 0; i < friendsData.length; i++) {
          console.log(friendsData[i]);
        }
        

        // Transform the data for UI display
        const formattedFriends: Friend[] = friendsData.map(friend => ({
          username: friend.username,
          firstName: friend.profile.firstName || '-',
          lastName: friend.profile.lastName || '-',
          profilePicture: friend.profile.profilePicture,
          bio: friend.profile.bio || '',
          lastSeen: friend.data.lastSeen,
          location: friend.profile.location || '-',
          id: friend.id,
        }));

        setFriends(formattedFriends);
      } catch (err) {
        console.error('Error fetching friends:', err);
        if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError('Failed to fetch friends');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [username, token, isLoggedIn]);


  useEffect(() => {
    const fetchOtherUsers = async (): Promise<void> => {
      try {
        setIsLoadingOthers(true);
        
        if (!username || !token) {
          throw new Error('Not authenticated');
        }

        // First get friendship status data
        const statusResponse = await fetch('/.netlify/functions/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getFriendshipStatus',
            username,
            token
          })
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch friendship statuses');
        }

        const statusData = await statusResponse.json();
        const statusMap: { [key: string]: string } = {};

        if (statusData.friends) {
          statusData.friends.forEach((friendId: string) => {
            statusMap[friendId] = 'friends';
          });
        }

        if (statusData.pendingFriends) {
          statusData.pendingFriends.forEach((pendingId: string) => {
            statusMap[pendingId] = 'pending';
          });
        }

        if (statusData.friendRequests) {
          statusData.friendRequests.forEach((requestId: string) => {
            statusMap[requestId] = 'received';
          });
        }


        const response = await fetch('/.netlify/functions/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'searchPeople',
            username_fragment: searchTerm,
            max_return: 20
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch other users');
        }

        const usersData = await response.json();

        // Enhance user data with friendship status
        const enhancedUsers = usersData.map((user: OtherUser) => {
          return {
            ...user,
            status: statusMap[user.id] || 'none'
          };
        });

        // Exclude self from the list
        const filteredUsers = enhancedUsers.filter((user: OtherUser) => user.username !== username);

        setOtherUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching other users:', err);
        // We don't set the main error state here to avoid blocking the friends list
      } finally {
        setIsLoadingOthers(false);
      }
    };

    fetchOtherUsers();
  }, [searchTerm, username, token, requestsRefresh]);

  // Helper function to format the last seen timestamp
  const formatLastSeen = (timestamp: Date | undefined): string => {
    if (!timestamp) return 'Unknown';
    
    const lastSeen = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Helper function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFriendRequest = async (friendId: string) => {
    if(!username || !token) {
      return;
    }
    try {
      const response = await fetch('/.netlify/functions/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'friendRequest',
          username,
          token,
          friendId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      // Refresh the user list to show updated status
      setRequestsRefresh(prev => prev + 1);
    } catch (err) {
      console.error('Error sending friend request:', err);
      // Handle error
    }
  }

  const handleAcceptRequest = async (friendId: string) => {
    if (!username || !token) {
      return;
    }
    try {
      const response = await fetch('/.netlify/functions/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acceptFriendRequest',
          username,
          token,
          friendId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Refresh the user list to show updated status
      setRequestsRefresh(prev => prev + 1);
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  }

  const handleRescindRequest = async (friendId: string) => {
    if (!username || !token) {
      return;
    }
    try {
      const response = await fetch('/.netlify/functions/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rescindFriendRequest',
          username,
          token,
          friendId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rescind friend request');
      }

      // Refresh the user list to show updated status
      setRequestsRefresh(prev => prev + 1);
    } catch (err) {
      console.error('Error rescinding friend request:', err);
      // Handle error
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!username || !token) {
      return;
    }
    try {
      // Add friend to removing set to trigger animation
      setRemovingFriends(prev => new Set(prev).add(friendId));

      const response = await fetch('/.netlify/functions/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeFriend',
          username,
          token,
          friendId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Failed to remove friend: ' + data.error);
      }

      // Wait for animation to complete before refreshing the list
      setTimeout(() => {
        // Remove from the friends list locally
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
        // Refresh other data
        setRequestsRefresh(prev => prev + 1);
        // Remove from the removing set
        setRemovingFriends(prev => {
          const newSet = new Set(prev);
          newSet.delete(friendId);
          return newSet;
        });
      }, 500); // Match this to animation duration
    } catch (err) {
      console.error('Error removing friend:', err);
      // Reset removing state if there's an error
      setRemovingFriends(prev => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  }

  const getFriendshipButton = (user: OtherUser) => {
    // Define common button/label classes
    const baseClasses = " cursor-pointer select-none px-3 py-1 rounded-full text-sm text-white flex items-center justify-center";

    // Define status-specific classes and properties
    let buttonClasses = baseClasses;
    let buttonIcon = <FaUserPlus className="text-lg" />;
    let toolTipText = "Add Friend";
    let onClick = () => handleFriendRequest(user.id);
    let isButton = true;
    let buttonStyle: React.CSSProperties = {
      transition: 'background-color 0.2s',
      aspectRatio: '1 / 1',
    };

    switch (user.status) {
      case 'friends':
        buttonStyle.backgroundColor = 'var(--khg)';
        buttonIcon = <FaUserFriends className="text-lg" />;
        toolTipText = "Friends";
        isButton = false;
        break;
      case 'pending':
        buttonStyle.backgroundColor = 'var(--khy)';
        buttonIcon = <FaClock className="text-lg" />;
        toolTipText = "Request Pending";
        onClick = () => handleRescindRequest(user.id);
        isButton = true;
        break;
      case 'received':
        buttonStyle.backgroundColor = 'var(--khb)';
        buttonIcon = <FaCheck className="text-lg" />;
        toolTipText = "Accept Request";
        onClick = () => handleAcceptRequest(user.id);
        break;
      default:
        buttonStyle.backgroundColor = 'var(--khb)';
        break;
    }

    return (
      <button
        className={buttonClasses}
        onClick={isButton ? onClick : undefined}
        disabled={!isButton}
        style={buttonStyle}
        title={toolTipText}
      >
        {buttonIcon}
      </button>
    );
  };

  if (isLoading) {
    return <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 tc1">Friends</h1>
      <p className="tc2">Loading your friends list...</p>
    </div>;
  }

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 tc1">Friends</h1>
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 tc1">Friends</h1>
      
      {/* Friends List */}
      <h2 className="text-2xl font-semibold mb-3 tc1">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="tc2 mb-8">You do not have any friends yet.</p>
      ) : (
          <div className="grid gap-4 mb-8 max-h-[50vh] overflow-y-auto mini-scroll">
          {friends.map((friend, index) => (
            <div
              key={index}
              className={`max-w-full bg2 p-3 rounded-xl shadow flex items-center justify-between transition-all duration-1000 overflow-hidden ${removingFriends.has(friend.id) ? 'opacity-0 transform -translate-x-full shift-out' : ''
                }`}
            >
              <div className="flex-grow min-w-0 mr-4">
                <div className='flex flex-row items-end gap-2 mb-2 border-b-2 border-gray-300 pb-[0.75] w-[75%]'>
                  <h2 className="text-xl font-semibold tc1">{friend.username}</h2>
                  <span className="tc2">{friend.firstName !== '-' ? friend.firstName : ''} {friend.lastName !== '-' ? friend.lastName : ''}</span>
                  <span className="ml-auto tc3 text-sm">{formatLastSeen(friend.lastSeen)}</span>
                </div>
                <p className="tc2 overflow-hidden text-ellipsis whitespace-nowrap">{friend.bio.length > 0 ? friend.bio : '---'}</p>
              </div>
              <button
                className="cursor-pointer select-none px-3 py-1 rounded-full text-sm text-white flex items-center justify-center flex-shrink-0"
                onClick={() => handleRemoveFriend(friend.id)}
                style={{
                  transition: 'background-color 0.2s',
                  aspectRatio: '1 / 1',
                  backgroundColor: 'var(--khr)'
                }}
                disabled={removingFriends.has(friend.id)}
                title="Remove Friend"
              >
                {removingFriends.has(friend.id) ? <FaClock className="text-lg" /> : <FaUserMinus className="text-lg" />}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Other Users List */}
      <div className="mt-8 border-t-[2px] border-gray-300 pt-6">
        <h2 className="text-2xl font-semibold mb-4 tc1">Other Users</h2>
        
        {/* Search input */}
        <div className="mb-4 flex-row gap-2 flex items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <label className="flex items-center gap-2 cursor-pointer select-none bg3 rounded-lg px-4 py-2.25 transition-all duration-300 hover:opacity-80">
            <span className="tc1 font-medium whitespace-nowrap">Friends</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showFriendsInSearch}
                onChange={() => setShowFriendsInSearch(!showFriendsInSearch)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 rounded peer-checked:bg-[var(--khg)] peer-checked:border-[var(--khg)] border-gray-400 transition-all flex items-center justify-center">
                {showFriendsInSearch && (
                  <FaCheck className="text-white text-xs" />
                )}
              </div>
            </div>
          </label>
        </div>

        {isLoadingOthers ? (
          <p className="tc2">Loading other users...</p>
        ) : otherUsers.length === 0 ? (
          <p className="tc2">No other users found.</p>
        ) : (
          <div className="grid gap-4 max-h-[50vh] overflow-y-auto mini-scroll">
            {otherUsers.map((user) => (
              (showFriendsInSearch || user.status !== 'friends') && (
                <div key={user.id} className="max-w-full bg2 p-3 rounded-xl shadow flex items-center justify-between">
                  <div className="flex-grow min-w-0 mr-4">
                    <div className='flex flex-row items-end gap-2 mb-2 border-b-2 border-gray-300 pb-[0.75] w-[75%]'>
                      <h2 className="text-xl font-semibold tc1">{user.username}</h2>
                      <span className="ml-auto tc3 text-sm">{formatLastSeen(user.lastSeen)}</span>
                    </div>
                    <p className="tc2 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.status === 'pending' ? 'Friend request pending' :
                        user.status === 'received' ? 'Sent you a friend request' :
                          '---'}
                    </p>
                </div>
                {getFriendshipButton(user)}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}