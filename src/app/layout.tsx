'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import HeadMetadata from '@/components/HeadMetadata';
import { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { analytics } from '@/context/Analytics';
import { ThemeProvider, useTheme } from 'next-themes';
import FooterContent from '@/components/FooterContent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Lazy load modals
const MessageModal = lazy(() => import('@/components/messages/MessageModal'));
const ProfileModal = lazy(() => import('@/components/modals/ProfileModal'));
const AuthModal = lazy(() => import('@/components/AuthModal'));
const NotificationModal = lazy(() => import('@/components/modals/NotificationModal'));
const Menu = lazy(() => import('@/components/Menu'));

function AuthModalHandler({
  isLoggedIn,
  setIsAuthModalOpen
}: {
  isLoggedIn: boolean;
  setIsAuthModalOpen: (value: boolean) => void
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('openAuth') === 'true' && !isLoggedIn) {
      setIsAuthModalOpen(true);
    }
  }, [searchParams, isLoggedIn, setIsAuthModalOpen]);

  return null;
}

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { isLoggedIn, userId } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    analytics.track('toggle_menu', { isMenuOpen: !isMenuOpen });
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDark = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    analytics.track('toggle_dark_mode', { isDarkMode: newTheme === 'dark' });
    setTheme(newTheme);
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
    const savedMenuState = localStorage.getItem('isMenuOpen');
    const savedMessageModalState = localStorage.getItem('isMessageModalOpen');
    const savedProfileModalState = localStorage.getItem('isProfileModalOpen');
    const savedNotificationModalState = localStorage.getItem('isNotificationModalOpen');
    const savedScrollPosition = localStorage.getItem('scrollPosition');

    if (savedMenuState !== null && savedMenuState === 'true') {
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
    <html lang="en" className={`no-sb ${inter.variable}`} suppressHydrationWarning>
      <HeadMetadata />
      <body className={`${inter.className} text1`} >
        <Suspense fallback={null}>
          <AuthModalHandler
            isLoggedIn={isLoggedIn}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        </ Suspense>
        {/* Menu */}
        <div className="fixed inset-0 z-0 print:hidden">
          <Suspense fallback={<div className="absolute top-0 right-0 w-[300px] h-full bg2 tc2 flex flex-col"></div>}>
          <Menu 
            isOpen={isMenuOpen} 
            toggleDark={toggleDark}
            onClose={() => setIsMenuOpen(isMessageModalOpen || isProfileModalOpen || isAuthModalOpen || isNotificationModalOpen)}
            openMessageModal={handleMessageClick}
            openProfileModal={handleProfileClick}
            openNotificationModal={handleNotificationClick}
            />
          </Suspense>
        </div>
        <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

        {/* Content wrapper */}
        <div 
          className={`overflow-x-hidden min-h-screen pt-16 transition-transform duration-300 bg1 relative z-10 flex flex-col print:border-none border-r border-[#00000040] dark:border-[#ffffff20] ${isMenuOpen ? 'translate-x-[-300px] print:translate-x-0' : ''
          }`} 
          style={{ boxShadow: theme === 'dark' ? '10px 0 20px rgba(0, 0, 0, 0.5)' : '10px 0 20px rgba(0, 0, 0, 0.125)' }}
        >
          <div className="flex-1">
            {children}
          </div>
          {/*footer content*/}
          <div className="mt-auto print:hidden">
            <FooterContent />
          </div>
          {/* */}
        </div>
        {/*Modals*/}
        <div>
          <Suspense fallback={null}>
            <MessageModal
              isOpen={isMessageModalOpen}
              onClose={() => setIsMessageModalOpen(false)}
              modalWidth='800px'
            />
          </Suspense>
          <Suspense fallback={null}>
            <ProfileModal
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              modalWidth='800px'
            />
          </Suspense>
          <Suspense fallback={null}>
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </Suspense>
          <Suspense fallback={null}>
            <NotificationModal
              isOpen={isNotificationModalOpen}
              onClose={() => setIsNotificationModalOpen(false)}
            />
          </Suspense>
        </div>
        <a href="https://github.com/lewishbass/nervous-energy/issues/new" target="_black" className="print:hidden fixed z-100 left-0 bottom-0 text-center p-1 dark:bg-black/20 bg-white/20 text-xs tc1 opacity-30 select-none cursor-pointer hover:opacity-100 transition-opacity duration-300">
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
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </ThemeProvider>
    </AuthProvider>
  );
}