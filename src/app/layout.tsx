'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Menu from '@/components/Menu';
import MessageModal from '@/components/messages/MessageModal';
import ProfileModal from '@/components/modals/ProfileModal';
import AuthModal from '@/components/AuthModal';
import NotificationModal from '@/components/modals/NotificationModal';
import HeadMetadata from '@/components/HeadMetadata';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { MathJaxContext } from 'better-react-mathjax';

const inter = Inter({ subsets: ['latin'] });

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  const { isLoggedIn } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDark = () => {
    setIsDark(!isDark);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDark));
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleMessageClick = () => {
    if (isLoggedIn) {
      setIsMessageModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleNotificationClick = () => {
    if (isLoggedIn) {
      setIsNotificationModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Store and load page state
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('isMenuOpen', JSON.stringify(isMenuOpen));
      localStorage.setItem('isMessageModalOpen', JSON.stringify(isMessageModalOpen));
      localStorage.setItem('isProfileModalOpen', JSON.stringify(isProfileModalOpen));
      localStorage.setItem('isNotificationModalOpen', JSON.stringify(isNotificationModalOpen));
      localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMenuOpen, isMessageModalOpen, isProfileModalOpen, isNotificationModalOpen]);

  useEffect(() => {
    const savedDarkModeState = localStorage.getItem('isDarkMode');
    const savedMenuState = localStorage.getItem('isMenuOpen');
    const savedMessageModalState = localStorage.getItem('isMessageModalOpen');
    const savedProfileModalState = localStorage.getItem('isProfileModalOpen');
    const savedNotificationModalState = localStorage.getItem('isNotificationModalOpen');
    const savedScrollPosition = localStorage.getItem('scrollPosition');

    if (savedDarkModeState !== null) {
      setIsDark(JSON.parse(savedDarkModeState));
    }
    if (savedMenuState !== null) {
      setIsMenuOpen(JSON.parse(savedMenuState));
    }
    if (savedMessageModalState !== null) {
      setIsMessageModalOpen(JSON.parse(savedMessageModalState));
    }
    if (savedProfileModalState !== null) {
      setIsProfileModalOpen(JSON.parse(savedProfileModalState));
    }
    if (savedNotificationModalState !== null) {
      setIsNotificationModalOpen(JSON.parse(savedNotificationModalState));
    }
    if (savedScrollPosition !== null) {
      window.scrollTo(0, JSON.parse(savedScrollPosition));
    }
  }, []);

  return (
    <html lang="en" className='no-sb'>
      <HeadMetadata />
      <body className={`${inter.className} ${isDark ? 'dark' : ''} text1`} >
        {/* Menu */}
        <div className="fixed inset-0 z-0">
          <Menu 
            isOpen={isMenuOpen} 
            toggleDark={toggleDark}
            onClose={() => setIsMenuOpen(isMessageModalOpen || isProfileModalOpen || isAuthModalOpen || isNotificationModalOpen)}
            openMessageModal={handleMessageClick}
            openProfileModal={handleProfileClick}
            openNotificationModal={handleNotificationClick}
          />
        </div>
        <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

        {/* Content wrapper */}
        <div 
          className={`overflow-x-hidden min-h-screen pt-16 transition-transform duration-300 bg1 relative z-10 ${
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
            modalWidth='800px'
          />
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            modalWidth='800px'
          />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
          <NotificationModal
            isOpen={isNotificationModalOpen}
            onClose={() => setIsNotificationModalOpen(false)}
          />
        </div>
        <a href="https://github.com/lewishbass/nervous-energy/issues/new" target="_black" className="fixed z-100 left-0 bottom-0 text-center p-1 dark:bg-black/20 bg-white/20 text-xs tc1 opacity-30 select-none cursor-pointer hover:opacity-100 transition-opacity duration-300">
          Report Issue
        </a>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MathJaxContext>
      <AuthProvider>
        <RootLayoutContent>{children}</RootLayoutContent>
      </AuthProvider>
    </MathJaxContext>
  );
}