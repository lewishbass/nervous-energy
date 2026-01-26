// src/app/events/page.tsx

"use client";
import { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { MdOutlineSatelliteAlt } from "react-icons/md";
import { FaHistory, FaRegCalendarAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';
import { analytics } from '@/context/Analytics';
//import { LuBird } from "react-icons/lu";

import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load tab components
const WeatherTab = lazy(() => import('./tabs/WeatherTab'));
const UpcomingTab = lazy(() => import('./tabs/UpcomingTab'));
const PreviousTab = lazy(() => import('./tabs/PreviousTab'));
const BirdsTab = lazy(() => import('./tabs/BirdsTab'));

// @ts-expect-error jsx usage
function EventsContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  const [activeTab, setActiveTab] = useState(() => {
    // Check URL first, then localStorage, then default
    if (typeof window !== 'undefined') {
      const urlTab = searchParams.get('tab');
      if (urlTab) return urlTab;
    }
    return 'weather';
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



  const tabStyle = {
    base: "px-[3%] py-3 cursor-pointer transition-all mx-1 font-medium relative user-select-none overflow-hidden",
    active: "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:animate-tabSlideIn after:transition-transform after:duration-300",
    inactive: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:scale-x-0 after:transition-transform after:duration-300"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mb-200">
      <h1 className="text-4xl font-bold mb-6 tc1">Events</h1>

      {/* Tabs Navigation */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700 justify-start gap-1">
        <button
          onClick={() => setActiveTab('weather')}
          className={`${tabStyle.base} ${activeTab === 'weather' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <MdOutlineSatelliteAlt className="min-w-5 min-h-5 mx-auto sm:mr-2" />
            <span className="hidden sm:inline">Weather</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`${tabStyle.base} ${activeTab === 'upcoming' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <FaRegCalendarAlt className="min-w-5 min-h-5 mx-auto sm:mr-2" />
            <span className="hidden sm:inline">Upcoming</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`${tabStyle.base} ${activeTab === 'previous' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="rotate flex items-center">
            <FaHistory className="min-w-5 min-h-5 mx-auto sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        </button>
        {/*<button
          onClick={() => setActiveTab('birds')}
          className={`${tabStyle.base} ${activeTab === 'birds' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <LuBird className="w-5 h-5 mr-2" />
            Birds
          </span>
        </button>*/}
      </div>

      {/* Tab Content */}
      <Suspense fallback={<LoadingSpinner className="min-h-[400px]" />}>
        {activeTab === 'weather' && <WeatherTab />}
        {activeTab === 'upcoming' && <UpcomingTab />}
        {activeTab === 'previous' && <PreviousTab />}
        {activeTab === 'birds' && <BirdsTab />}
      </Suspense>
    </div>
  );
}

// @ts-expect-error jsx usage
export default function Events(): JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <EventsContent />
    </Suspense>
  );
}