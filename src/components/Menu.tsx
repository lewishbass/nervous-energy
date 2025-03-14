'use client';

import { 
  FaEnvelope, 
  FaUser, 
  FaHome, 
  FaBook, 
  FaCalendar, 
  FaStore, 
  FaUsers,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { useRef } from 'react';
import Link from 'next/link';
import { useClickAway } from '@/hooks/useClickAway';
import SearchExpand from './SearchExpand';

interface MenuProps {
  toggleDark: () => void;
  isOpen: boolean;
  onClose: () => void;
  openMessageModal: () => void;
  openProfileModal: () => void;
}

export default function Menu({ isOpen, toggleDark, onClose, openMessageModal, openProfileModal }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickAway(menuRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  // Example search dictionary - replace with your actual data or API route
  const searchDictionary = [
    { name: 'Home', link: '/home', keyword: 'dashboard' },
    { name: 'Books', link: '/books', keyword: 'reading library' },
    { name: 'Events', link: '/events', keyword: 'calendar schedule' },
    { name: 'Shop', link: '/shop', keyword: 'store purchase' },
    { name: 'Friends', link: '/friends', keyword: 'social network' }
  ];

  return (
    <div ref={menuRef} className="absolute top-0 right-0 w-[300px] h-full bg2 tc2 flex flex-col">
      <div className="pt-24 px-6 flex-grow">
        {/* Quick Action Buttons */}
        <div className="flex justify-between gap-1 mb-12 relative w-50 mx-auto">
          {/* Search Component */}
          <div className="left-0">
            <SearchExpand 
              width={48} 
              height={48} 
              expandWidth={240} 
              expandOffset={-20}
              searchDictionary={searchDictionary}
              placeholder="Search ..."
            />
          </div>

          {/* Other Action Buttons */}
            <button 
              className="min-w-12 h-12 rounded-full flex items-center justify-center bt2 transition-colors wg"
              onClick={(e) => {
                e.preventDefault();
                openMessageModal();
                //onClose();
              }}
            >
              <FaEnvelope className="w-5 h-5" />
            </button>
            <button 
              className="min-w-12 h-12 rounded-full flex items-center justify-center bt2 transition-colors wg"
              onClick={(e) => {
                e.preventDefault();
                openProfileModal();
                //onClose();
              }}
            >
              <FaUser className="w-5 h-5" />
            </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {[
            { href: '/home', icon: FaHome, label: 'Home' },
            { href: '/books', icon: FaBook, label: 'Books' },
            { href: '/events', icon: FaCalendar, label: 'Events' },
            { href: '/shop', icon: FaStore, label: 'Shop' },
            { href: '/friends', icon: FaUsers, label: 'Friends' },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-5 p-3 bt1 rounded-lg transition-colors my-0 py-4 px-4 wg"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Dark Mode Toggle */}
      <div className="p-6">
        <button 
          onClick={toggleDark}
          className="w-full flex items-cent!
          er gap-4 p-3 bt1 rounded-lg transition-colors"
        >
          <div className="relative w-8 h-8 rounded-full">
            <FaSun className="absolute w-full h-full transition-all duration-600 rotate-0 opacity-100 translate-y-0 text-yellow-500 dark:rotate-90 dark:opacity-0 dark:-translate-y-0" />
            <FaMoon className="absolute w-full h-full transition-all duration-600 rotate-[-90deg] opacity-0 translate-y-0 text-blue-500 dark:rotate-0 dark:opacity-100 dark:translate-y-0" />
          </div>
          <span className="text-lg">Dark Mode</span>
        </button>
      </div>
    </div>
  );
}