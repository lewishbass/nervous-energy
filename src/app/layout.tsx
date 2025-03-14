'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Menu from '@/components/Menu';
import MessageModal from '@/components/MessageModal';
import ProfileModal from '@/components/ProfileModal';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDark = () => {
    setIsDark(!isDark);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDark));
  };

  

  // Store and load page state
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('isMenuOpen', JSON.stringify(isMenuOpen));
      localStorage.setItem('isMessageModalOpen', JSON.stringify(isMessageModalOpen));
      localStorage.setItem('isProfileModalOpen', JSON.stringify(isProfileModalOpen));
      localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMenuOpen, isMessageModalOpen, isProfileModalOpen]);

  useEffect(() => {
    const savedDarkModeState = localStorage.getItem('isDarkMode');
    const savedMenuState = localStorage.getItem('isMenuOpen');
    const savedMessageModalState = localStorage.getItem('isMessageModalOpen');
    const savedProfileModalState = localStorage.getItem('isProfileModalOpen');
    const savedScrollPosition = localStorage.getItem('scrollPosition');

    savedDarkModeState && setIsDark(JSON.parse(savedDarkModeState));
    savedMenuState && setIsMenuOpen(JSON.parse(savedMenuState));
    savedMessageModalState && setIsMessageModalOpen(JSON.parse(savedMessageModalState));
    savedProfileModalState && setIsProfileModalOpen(JSON.parse(savedProfileModalState));
    savedScrollPosition && window.scrollTo(0, JSON.parse(savedScrollPosition));
  }, []);


  // return html
  return (
    <html lang="en">
      <body className={`${inter.className} ${isDark ? 'dark' : ''} text1`} style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
        {/* Menu */}
        <div className="fixed inset-0 z-0">
          <Menu 
            isOpen={isMenuOpen} 
            toggleDark={toggleDark}
            onClose={() => setIsMenuOpen(isMessageModalOpen || isProfileModalOpen)}
            openMessageModal={() => setIsMessageModalOpen(true)}
            openProfileModal={() => setIsProfileModalOpen(true)}
          />
        </div>
        <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

        {/* Content wrapper */}
        <div 
          className={`min-h-screen pt-16 transition-transform duration-300 bg1 relative z-10 ${
            isMenuOpen ? 'translate-x-[-300px]' : ''
          }`} 
          style={{ boxShadow: isDark ? '10px 0 20px rgba(0, 0, 0, 0.5)' : '10px 0 20px rgba(0, 0, 0, 0.125)' , borderRight: isDark ? '1px solid #fff2' : '1px solid #0004' }}
        >
          {children}
        </div>
        {/*Modals*/}
        <div>
          <MessageModal 
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
          />
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
          />
        </div>
      </body>
    </html>
  );
}