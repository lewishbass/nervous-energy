'use client';

import {
  FaEnvelope,
  FaUser,
  FaHome,
  FaBook,
  FaCalendar,
  //FaStore,
  FaUsers,
  FaSun,
  FaMoon,
  FaPuzzlePiece,
  FaMicroscope,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useClickAway } from '@/hooks/useClickAway';
import SearchExpand from './SearchExpand';
import { useAuth } from '@/context/AuthContext';
import { toys } from '@/data/toys';
import { link } from 'fs';

const PROFILE_ROUTE = '/.netlify/functions/profile';

interface MenuProps {
  toggleDark: () => void;
  isOpen: boolean;
  onClose: () => void;
  openMessageModal: () => void;
  openProfileModal: () => void;
  openNotificationModal: () => void;
}

export default function Menu({
  isOpen,
  toggleDark,
  onClose,
  openMessageModal,
  openProfileModal,
  openNotificationModal,
}: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [backendVersion, setBackendVersion] = useState<string | null>(null);
  const [dbVersion, setDbVersion] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const [newChats, setNewChats] = useState<boolean>(false);
  const [newNotifications, setNewNotifications] = useState<boolean>(false);

  const { username, isLoggedIn } = useAuth();

  useClickAway(menuRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      checkNotification(); // Initial check on mount
      const intervalId = setInterval(checkNotification, 10000); // Check every 10 seconds

      return () => clearInterval(intervalId); // Clean up interval on unmount
    }
  }, [username, newChats, newNotifications, isLoggedIn]);

  const checkNotification = async () => {
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
        if (data.updatedChats) {
          if (!newChats) {
            console.log('New chat!');
          }
          setNewChats(true);
        } else {
          setNewChats(false);
        }


        if (data.newNotifications) {
          if (!newNotifications) {
            console.log('New notification!');
            setNewNotifications(true);
          }
        }

      } else {
        console.error('Failed to check notifications');
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/.netlify/functions/version');
        if (response.ok) {
          const data = await response.json();
          setBackendVersion(data.version);
          setDbVersion(data.database?.version);
          setDbStatus(data.database?.status);
        } else {
          console.error('Failed to fetch version');
        }
      } catch (error) {
        console.error('Error fetching version:', error);
      }
    };

    fetchVersion();
  }, []);

  // Create search dictionary combining base entries with dynamically generated toy entries
  const searchDictionary = [
    { name: 'Home', link: '/home', keyword: 'dashboard', description: 'Go to the dashboard', requireAuth: false },
    { name: 'Books', link: '/books', keyword: 'reading library', description: 'Explore our collection of books', requireAuth: false },
    { name: 'Events', link: '/events', keyword: 'calendar schedule', description: 'View upcoming events', requireAuth: false },
    //{ name: 'Shop', link: '/shop', keyword: 'store purchase', description: 'Visit our online shop', requireAuth: false },
    { name: 'Tutoring', link: '/tutoring', keyword: 'learning help', description: 'Sign up for tutoring', requireAuth: false },
    { name: 'Friends', link: '/friends', keyword: 'social network', description: 'Connect with friends', requireAuth: true },
    { name: 'Toys', link: '/toys', keyword: 'interactive demo ml machine learning', description: 'Explore interactive machine learning demos', requireAuth: false },
    //{ name: 'Papers', link: '/papers', keyword: 'research articles', description: 'My papers and reviews', requireAuth: false },
    // Add toy entries dynamically from the centralized toys data
    ...toys.map(toy => ({
      name: toy.title,
      link: toy.link,
      keyword: toy.keywords,
      description: toy.description,
      requireAuth: toy.reqAuth
    }))
  ];

  return (
    <div ref={menuRef} className="absolute top-0 right-0 w-[300px] h-full bg2 tc2 flex flex-col">
      <div className="pt-24 px-6 flex-grow">
        {/* Quick Action Buttons */}
        <div className="flex justify-between gap-1 mb-12 relative w-50 mx-auto">
          {/* Search Component */}
          <div className="left-0">
            <SearchExpand width={48} height={48} expandWidth={240} expandOffset={-20} searchDictionary={searchDictionary} placeholder="Search ..." />
          </div>

          {/* Other Action Buttons */}
          <button
            className="min-w-12 h-12 rounded-full flex items-center justify-center bt2 transition-colors wg relative"
            onClick={(e) => {
              e.preventDefault();
              openMessageModal();
              setNewChats(false);
            }}
          >
            {(newChats) && (
              <>
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
              </>
            )}
            <FaEnvelope className="w-5 h-5" />
          </button>
          <button
            className="min-w-12 h-12 rounded-full flex items-center justify-center bt2 transition-colors wg"
            onClick={(e) => {
              e.preventDefault();
              openProfileModal();
            }}
          >
            <FaUser className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {[{ href: '/home', icon: FaHome, label: 'Home', requireAuth: false },
            { href: '/books', icon: FaBook, label: 'Books', requireAuth: false },
            { href: '/events', icon: FaCalendar, label: 'Events', requireAuth: false },
            //{ href: '/shop', icon: FaStore, label: 'Shop', requireAuth: false },
            { href: '/tutoring', icon: FaChalkboardTeacher, label: 'Tutoring', requireAuth: false },
            { href: '/toys', icon: FaPuzzlePiece, label: 'Toys', requireAuth: false },
            // { href: '/papers', icon: FaMicroscope, label: 'Papers', requireAuth: false },
            { href: '/friends', icon: FaUsers, label: 'Friends', requireAuth: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-5 p-3 bt1 rounded-lg transition-colors my-0 py-4 px-4 wg"
              style={{ maxHeight: (!item.requireAuth || isLoggedIn ? '50px' : '0px'), marginBottom: (!item.requireAuth || isLoggedIn ? '10px' : '0px'), opacity: (!item.requireAuth || isLoggedIn ? 1 : 0), overflow: 'hidden', transition: 'max-height 1s ease-in-out, margin-bottom 1s ease-in-out, opacity 0.3s ease-in-out' }}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* User Info (if logged in) */}

      <div
        className="mx-8 flex items-center gap-4 cursor-pointer hover:bg1 p-2 rounded-lg transition-colors"
        style={{
          paddingTop: (isLoggedIn ? '10px' : '0px'),
          maxHeight: (isLoggedIn ? '70px' : '0px'),
          marginBottom: (isLoggedIn ? '10px' : '0px'),
          opacity: (isLoggedIn ? 1 : 0),
          overflow: 'hidden',
          transition: 'max-height 1s ease-in-out, margin-bottom 1s ease-in-out, opacity 0.3s ease-in-out'
        }}
        onClick={(e) => {
          e.preventDefault();
          if (isLoggedIn) {
            openNotificationModal();
            setNewNotifications(false);
          }
        }}
      >
        <div className="relative w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          {(newNotifications) && (
            <>
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
            </>
          )}
          <span className="text-lg font-bold tc3">
            {(username || 'J').charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium">{username || "John Doe"}</p>
          {newNotifications && (
            <p className="text-xs text-red-500">New notifications</p>
          )}
        </div>
      </div>
      {/* Dark Mode Toggle with Version Label */}
      <div className="p-6">
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-4 p-3 bt1 rounded-lg transition-colors"
        >
          <div className="relative w-8 h-8 rounded-full">
            <FaSun className="absolute w-full h-full transition-all duration-600 rotate-0 opacity-100 translate-y-0 text-yellow-500 dark:rotate-90 dark:opacity-0 dark:-translate-y-0" />
            <FaMoon className="absolute w-full h-full transition-all duration-600 rotate-[-90deg] opacity-0 translate-y-0 text-blue-500 dark:rotate-0 dark:opacity-100 dark:translate-y-0" />
          </div>
          <span className="text-lg">Dark Mode</span>
        </button>
        {backendVersion && (
          <div className="text-xs text-right opacity-35 mb-[-16] mt-[-0] tc1">
            Backend v{backendVersion}
            {dbStatus && (
              <span className={`ml-1 ${dbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}> | DB {dbStatus === 'connected' ? `v${dbVersion}` : dbStatus} </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}