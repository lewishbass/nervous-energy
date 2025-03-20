'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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
  const [friendshipStatus, setFriendshipStatus] = useState<{ [key: string]: string }>({});
  const [requestsRefresh, setRequestsRefresh] = useState<number>(0);
  
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
        console.log(friendIds);
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
          location: friend.profile.location || '-'
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

        setFriendshipStatus(statusMap);

        const response = await fetch('/.netlify/functions/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'searchPeople',
            username_fragment: searchTerm,
            max_return: 10
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

        setOtherUsers(enhancedUsers);
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

  const handleFriendRequest = async (friendUsername: string) => {
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
          friendUsername
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

  const handleAcceptRequest = async (friendUsername: string) => {
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
          friendUsername
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

  const getFriendshipButton = (user: OtherUser) => {
    // Define common button/label classes
    const baseClasses = "px-3 py-1 rounded-full text-sm text-white";

    // Define status-specific classes and properties
    let buttonClasses = baseClasses;
    let buttonText = "Add Friend";
    let onClick = () => handleFriendRequest(user.username);
    let isButton = true;

    switch (user.status) {
      case 'friends':
        buttonClasses = `${baseClasses} bg-green-500`;
        buttonText = "Friends";
        isButton = false;
        break;
      case 'pending':
        buttonClasses = `${baseClasses} bg-yellow-500`;
        buttonText = "Request Pending";
        isButton = false;
        break;
      case 'received':
        buttonClasses = `${baseClasses} bg-blue-500 hover:bg-blue-600`;
        buttonText = "Accept Request";
        onClick = () => handleAcceptRequest(user.username);
        break;
      default:
        buttonClasses = `${baseClasses} bg-blue-500 hover:bg-blue-600`;
        break;
    }

    return (
      <button
        className={buttonClasses}
        onClick={isButton ? onClick : undefined}
        disabled={!isButton}
        style={{
          transition: 'background-color 0.2s',
        }}
      >
        {buttonText}
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
        <div className="grid gap-4 mb-8">
          {friends.map((friend, index) => (
            <div key={index} className="bg2 p-6 rounded-lg shadow flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 tc1">{friend.username}</h2>
                <p className="tc2">Last seen: {formatLastSeen(friend.lastSeen)}</p>
              </div>
              {/*<span className={`px-3 py-1 rounded-full text-sm ${
                friend.status === 'Online' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {friend.status}
              </span>*/}
            </div>
          ))}
        </div>
      )}
      
      {/* Other Users List */}
      <div className="mt-8 border-t-[2px] border-gray-300 pt-6">
        <h2 className="text-2xl font-semibold mb-4 tc1">Other Users</h2>
        
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

          <div className="grid gap-4">
            {otherUsers.map((user, index) => (
              <div key={user.id} className="bg2 p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1 tc1">{user.username}</h3>
                  <p className="tc2">Last seen: {formatLastSeen(user.lastSeen)}</p>
                </div>
                {getFriendshipButton(user)}
              </div>
            ))}
          </div>

        {isLoadingOthers ? (
          <p className="tc2">Loading other users...</p>
        ) : otherUsers.length === 0 ? (
          <p className="tc2">No other users found.</p>
        ) : (<div />)}
      </div>
    </div>
  );
}