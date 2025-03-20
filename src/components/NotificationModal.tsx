import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ModalTemplate from './ModalTemplate';

const PROFILE_ROUTE = '/.netlify/functions/profile';

export type Notification = {
  timeStamp: Date;
  message: string;
  notificationType: string;
  data: string; // stringified JSON
  read: boolean;
  id: string; // uuidv4
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { username, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotifications, setNewNotifications] = useState<boolean>(false);
  const [newChats, setNewChats] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newNotificationIds, setNewNotificationIds] = useState<Set<string>>(new Set());

  const fetchNotifications = useCallback(async () => {
    if (!username || !token) return;
    
    //setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(PROFILE_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getNotifications',
          username: username,
          token: token
        }),
      });
      if (response.ok) {
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
          try {
            data[i] = JSON.parse(data[i]);
          } catch (e) {
            console.error("Could not parse data", e);
          }
        }
        console.log(data[0]);
        setNotifications(data);
        setNewNotifications(false);
      } else {
        console.error('Failed to fetch notifications');
        setError('Failed to load notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  }, [username, token]);

  const checkNotification = useCallback(async () => {
    if (!username || !token) return;
    
    try {
      const response = await fetch(PROFILE_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getIsUpdated',
          username: username,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.newChats) {
          if (!newChats) {
            console.log('New chat!');
            setNewChats(true);
          }
        }

        if (data.newNotifications) {
          if (!newNotifications) {
            console.log('New notification!');
            setNewNotifications(true);
            // Fetch new notifications when new ones are detected
            await fetchNotifications();
          }
        }
      } else {
        console.error('Failed to check notifications');
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }, [username, token, newChats, newNotifications, fetchNotifications]);

  const dismissNotification = async (notificationId: string) => {
    if (!username || !token) return;
    
    try {
      const response = await fetch(PROFILE_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'dismissNotification',
          username: username,
          token: token,
          notificationId: notificationId
        }),
      });
      
      if (response.ok) {
        // Remove notification from local state
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      } else {
        console.error('Failed to dismiss notification', response);
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (!username || !token || notification.read) return;
    
    try {
      const response = await fetch(PROFILE_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'markNotificationRead',
          username: username,
          token: token,
          notificationId: notification.id
        }),
      });
      
      if (response.ok) {
        // Update notification in local state
        setNotifications(prev => 
          prev.map(item => 
            item.id === notification.id 
              ? { ...item, read: true } 
              : item
          )
        );
        
        // Remove from new notifications
        setNewNotificationIds(prev => {
          const updated = new Set(prev);
          updated.delete(notification.id);
          return updated;
        });
      } else {
        console.error('Failed to mark notification as read', response);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Initial fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Set up polling for new notifications every 10 seconds
  useEffect(() => {
    if (!isOpen) return;
    
    const intervalId = setInterval(checkNotification, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isOpen, checkNotification]);

  // Track new notifications for animation
  useEffect(() => {
    if (notifications.length > 0) {
      const newIds = new Set<string>();
      notifications.forEach(notification => {
        if (!notification.read) {
          newIds.add(notification.id);
        }
      });
      setNewNotificationIds(newIds);
    }
  }, [notifications]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Notifications" contentLoading={isLoading}>
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button 
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={fetchNotifications}
            >
              Retry
            </button>
          </div>
        )}
        
        {notifications.length === 0 && !isLoading && !error ? (
          <div className="text-center py-8 tc3">
            <p>No notifications yet</p>
          </div>
        ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {notifications.map((notification) => (
              <div key={notification.id.toString() || ''}
                className={`relative p-4 bg2 rounded-lg transition-all duration-500 ${
                  newNotificationIds.has(notification.id) ? 'fade-in double-wipe shift-in' : ''
                } ${!notification.read ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                >
                  
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 z-10"
                  aria-label="Dismiss notification"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div 
                  className="flex items-start"
                  onClick={(e) => {
                    // Prevent triggering if clicking on dismiss button
                    if (e.target instanceof Element && e.target.closest('button')) return;
                    markAsRead(notification);
                  }}
                >
                  <div className="mr-3">
                      {notification.notificationType === 'friendRequest' && (
                      <div className="p-2 bg-blue-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                      {notification.notificationType === 'message' && (
                      <div className="p-2 bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                    )}
                      {notification.notificationType === 'system' && (
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                      <div className="flex items-center">
                        {notification.message}
                        {newNotificationIds.has(notification.id) && (
                          <div className="relative">
                          <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full ml-2 animate-ping"></div>
                          </div>
                        )}
                      </div>
                    <p className="tc3 text-xs mt-1">{formatDate(notification.timeStamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalTemplate>
  );
};

export default NotificationModal;