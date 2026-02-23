"use client";

import Image from 'next/image';
import { Suspense, useEffect, useState, useRef, lazy } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBook, FaFileAlt } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { MdSchedule, MdModeComment } from "react-icons/md";
import CircleAnimation from '@/components/backgrounds/CircleAnimmation';
import LoadingSpinner from '@/components/LoadingSpinner';

import { analytics } from '@/context/Analytics';

// Lazy load tab components
const SyllabusTab = lazy(() => import('./tabs/SyllabusTab/SyllabusTab'));
const ScheduleTab = lazy(() => import('./tabs/ScheduleTab/ScheduleTab'));
const LecturesTab = lazy(() => import('./tabs/LecturesTab/LecturesTab'));
const ExercisesTab = lazy(() => import('./tabs/ExercisesTab/ExercisesTab'));
const DiscussionsTab = lazy(() => import('./tabs/DiscussionsTab/DiscussionsTab'));

// Navigation Tab Component
interface NavigationTabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabId: string;
  title: string;
  icon: React.ReactNode;
  rotate?: boolean;
  color?: string;
}

function NavigationTab({ activeTab, setActiveTab, tabId, title, icon, rotate = false, color = 'var(--khb)' }: NavigationTabProps) {
  const tabStyle = {
    base: "px-[3%] py-3 cursor-pointer transition-all mx-1 font-medium relative user-select-none overflow-hidden",
    active: "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-full after:animate-tabSlideIn after:transition-transform after:duration-300",
    inactive: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-full after:scale-x-0 after:transition-transform after:duration-300"
  };

  return (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`${tabStyle.base} ${activeTab === tabId ? tabStyle.active : tabStyle.inactive}`}
      style={activeTab === tabId ? {
        color: color,
        '--tw-after-bg': color
      } as React.CSSProperties & { '--tw-after-bg': string } : {
        '--tw-after-bg': color
      } as React.CSSProperties & { '--tw-after-bg': string }}
    >
      <span className={`${rotate ? 'rotate' : 'wg'} flex items-center whitespace-nowrap`}>
        <span className="min-w-5 min-h-5 mx-auto sm:mr-2">{icon}</span>
        <span className="hidden sm:inline">{title}</span>
      </span>
      <style jsx>{`
        button::after {
          background-color: var(--tw-after-bg);
        }
      `}</style>
    </button>
  );
}

function PythonAutomationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL first, then localStorage, then default
    if (typeof window !== 'undefined') {
      const urlTab = searchParams.get('tab');
      if (urlTab) return urlTab;
    }
    return '';
  });

  const [showSidebar, setShowSidebar] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('pythonAutomationShowSidebar');
      return storedValue === null ? false : storedValue === 'true';
    }
  });

  // Sync state with URL when searchParams change (browser navigation)
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  // Update URL when tab changes (but not on initial mount)
  useEffect(() => {
    analytics.track('tab_change', { tab: activeTab });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Set initial URL if not already set
      if (!searchParams.get('tab')) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', activeTab);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
      return;
    }
    

    
    const params = new URLSearchParams(searchParams.toString());
    const currentUrlTab = params.get('tab');
    
    // Only update URL if it's different from current
    if (currentUrlTab !== activeTab) {
      params.set('tab', activeTab);
      // Clean up lecture param when switching away from lectures tab
      if (activeTab !== 'lectures') {
        params.delete('lecture');
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [activeTab]);

  return (
    <div className="relative flex flex-row justify-center">
      <div className="absolute inset-0 -z-10 invert dark:invert-0">
        <CircleAnimation
          radiusRange={[100, 800]}
          seed={456}
          style={{ opacity: 0.125 }}
          doAnimation={false}
        />
      </div>
      {/* Sidebar */}
      {showSidebar && <div className="w-60 h-[80vh] ml-auto mr-0 tc2 backdrop-blur-[12px]">
        <div className="my-2">
          <h2 className="text-xl font-semibold tc1 px-2">Dev TODO</h2>
          <div className="mb-0 w-full rounded-full h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        </div>
        <ul className="list-disc space-y-2 marker:text-purple-500 pl-6">
          <li>Discussion latex and codeblocks rendering</li>

        </ul>
        <div className="my-2 mt-6">
          <h2 className="text-xl font-semibold tc1 px-2">Finished</h2>
          <div className="mb-0 w-full rounded-full h-[4px] bg-gradient-to-r from-green-500 via-lime-500 to-cyan-400"></div>
        </div>
        <ul className="list-disc  space-y-2 marker:text-green-500 pl-6">
          <li>Syllabus Tab</li>
          <li>Schedule Chart</li>
          <li>Lecture Notes Layout</li>
          <li>Exercise Layout</li>
          <li>Survey Exercise</li>
          <li>Redo Syllabus</li>
          <li>Link Exercises to Users</li>
          <li>Discussion Functionality</li>
          <li>Lecture Styles and Nav Links</li>
          <li>Start Lecture Content</li>
          <li>Start Exercise Content</li>
        </ul>
      </div>}

      {/* Main Content */}
      <div className={`p-6 relative min-h-[100vh] max-w-4xl w-4xl mx-auto ${showSidebar ? 'ml-10' : 'ml-auto'} pb-200`}>
        {/* Header */}
        <div className="inset-0 absolute backdrop-blur-[8px] bg-white/25 dark:bg-gray-950/25 -z-1">

        </div>
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/classes/Python-logo-notext.svg"
              alt="Python Logo"
              width={80}
              height={80}
              className="rounded-lg"
              onClick={() => { setShowSidebar(!showSidebar) }}
            />
            <div>
              <h1 className="text-4xl font-bold tc1">Python for Automation and Scripting</h1>
              <p className="tc2 text-lg mt-2">Henrico County Adult Education Center</p>
              <p className="tc3 text-sm">Feb 9, 2026 - April 22, 2026</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700 justify-start gap-1 overflow-x-auto">
          <NavigationTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabId="syllabus"
            title="Syllabus"
            icon={<FaFileAlt className="min-w-5 min-h-5 mx-auto sm:mr-2" />}
            color="var(--khr)"
          />
          <NavigationTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabId="schedule"
            title="Schedule"
            icon={<MdSchedule className="min-w-5 min-h-5 mx-auto sm:mr-2" />}
            rotate={true}
            color="var(--kho)"
          />
          <NavigationTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabId="lectures"
            title="Lecture Notes"
            icon={<FaBook className="min-w-5 min-h-5 mx-auto sm:mr-2" />}
            color="var(--khy)"
          />
          <NavigationTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabId="exercises"
            title="Exercises"
            icon={<FaListCheck className="min-w-5 min-h-5 mx-auto sm:mr-2" />}
            color="var(--khg)"
          />
          <NavigationTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabId="discussions"
            title="Discussions"
            icon={<MdModeComment className="min-w-5 min-h-5 mx-auto sm:mr-2" />}
            color="var(--khb)"
          />
        </div>

        {/* Tab Content */}
        <Suspense fallback={<LoadingSpinner className="min-h-[400px]" />}>
          {activeTab === 'syllabus' && <SyllabusTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'lectures' && <LecturesTab />}
          {activeTab === 'exercises' && <ExercisesTab />}
          {activeTab === 'discussions' && <DiscussionsTab />}
        </Suspense>
      </div>
    </div>
  );
}

export default function PythonAutomation() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    }>
      <PythonAutomationContent />
    </Suspense>
  );
}