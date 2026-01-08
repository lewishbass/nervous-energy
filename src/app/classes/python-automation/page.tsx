"use client";

import Image from 'next/image';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBook, FaFileAlt } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { MdSchedule, MdModeComment } from "react-icons/md";
import SyllabusTab from './tabs/SyllabusTab';
import ScheduleTab from './tabs/ScheduleTab/ScheduleTab';
import LecturesTab from './tabs/LecturesTab/LecturesTab';
import ExercisesTab from './tabs/ExercisesTab/ExercisesTab';
import DiscussionsTab from './tabs/DiscussionsTab';
import SquareAnimation from '@/components/backgrounds/SquareAnimation';
import { Square } from '@tensorflow/tfjs-core';
import LineAnimation from '@/components/backgrounds/LineAnimation';

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
    return 'syllabus';
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

  // Tab styles
  const tabStyle = {
    base: "px-[3%] py-3 cursor-pointer transition-all mx-1 font-medium relative user-select-none overflow-hidden",
    active: "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:animate-tabSlideIn after:transition-transform after:duration-300",
    inactive: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:scale-x-0 after:transition-transform after:duration-300"
  };

  return (
    <div className="relative flex flex-row justify-center">
      <div className="absolute inset-0 -z-10 invert dark:invert-0">
        <LineAnimation
          spacing={300}
          seed={456}
          style={{ opacity: 0.125 }}
        />
      </div>
      {/* Sidebar */}
      {showSidebar && <div className="w-60 h-[80vh] ml-auto mr-0 tc2 backdrop-blur-[12px]">
        <div className="my-2">
          <h2 className="text-xl font-semibold tc1 px-2">Dev TODO</h2>
          <div className="mb-0 w-full rounded-full h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        </div>
        <ul className="list-disc space-y-2 marker:text-purple-500 pl-6">
          <li>Start Lecture Content</li>
          <li>Lecture Styles and Nav Links</li>
          <li>Start Exercise Content</li>
          <li>Discussion Functionality</li>

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
        </ul>
      </div>}

      {/* Main Content */}
      <div className={`p-6 relative min-h-full max-w-4xl w-4xl mx-auto ${showSidebar ? 'ml-10' : 'ml-auto'} pb-200`}>
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
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`${tabStyle.base} ${activeTab === 'syllabus' ? tabStyle.active : tabStyle.inactive}`}
          >
            <span className="wg flex items-center whitespace-nowrap">
              <FaFileAlt className="min-w-5 min-h-5 mx-auto sm:mr-2" />
              <span className="hidden sm:inline">Syllabus</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`${tabStyle.base} ${activeTab === 'schedule' ? tabStyle.active : tabStyle.inactive}`}
          >
            <span className="rotate flex items-center whitespace-nowrap">
              <MdSchedule className="min-w-5 min-h-5 mx-auto sm:mr-2" />
              <span className="hidden sm:inline">Schedule</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`${tabStyle.base} ${activeTab === 'lectures' ? tabStyle.active : tabStyle.inactive}`}
          >
            <span className="wg flex items-center whitespace-nowrap">
              <FaBook className="min-w-5 min-h-5 mx-auto sm:mr-2" />
              <span className="hidden sm:inline">Lecture Notes</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`${tabStyle.base} ${activeTab === 'exercises' ? tabStyle.active : tabStyle.inactive}`}
          >
            <span className="wg flex items-center whitespace-nowrap">
              <FaListCheck className="min-w-5 min-h-5 mx-auto sm:mr-2" />
              <span className="hidden sm:inline">Exercises</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`${tabStyle.base} ${activeTab === 'discussions' ? tabStyle.active : tabStyle.inactive}`}
          >
            <span className="wg flex items-center whitespace-nowrap">
              <MdModeComment className="min-w-5 min-h-5 mx-auto sm:mr-2" />
              <span className="hidden sm:inline">Discussions</span>
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'syllabus' && <SyllabusTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'lectures' && <LecturesTab />}
        {activeTab === 'exercises' && <ExercisesTab />}
        {activeTab === 'discussions' && <DiscussionsTab />}
      </div>
    </div>
  );
}

export default function PythonAutomation() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="tc2">Loading...</p>
        </div>
      </div>
    }>
      <PythonAutomationContent />
    </Suspense>
  );
}