import React from 'react';
import { useSearchParams } from 'next/navigation';
import { FaListUl } from "react-icons/fa6";
import { BsFillGridFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { FaExpandAlt } from 'react-icons/fa';

import { lectureList, LecturePair } from './LectureInfo';


export default function LecturesTab() {
  const searchParams = useSearchParams();

  const [listMode, setListMode] = React.useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('pythonAutomationLecturesListMode');
      return storedValue === 'list' ? 'list' : 'grid';
    }
    return 'grid';
  });

  const [activeLecture, setActiveLecture] = React.useState<React.ComponentType<any> | null>(() => {
    if (typeof window !== 'undefined') {
      const lectureParam = searchParams.get('lecture');
      if (lectureParam) {
        const index = parseInt(lectureParam, 10);
        if (!isNaN(index) && index >= 0 && index < lectureList.length) {
          return lectureList[index].lecture;
        }
      }
    }
    return null;
  });

  const [slideMode, setSlideMode] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const slideModeParam = searchParams.get('slideMode');
      if (slideModeParam && slideModeParam === 'true') {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
        return true;
      }
    }
    return false;
  });

  // Sync with URL when searchParams change
  React.useEffect(() => {
    const lectureParam = searchParams.get('lecture');
    if (lectureParam) {
      const index = parseInt(lectureParam, 10);
      if (!isNaN(index) && index >= 0 && index < lectureList.length) {
        setActiveLecture(() => lectureList[index].lecture);
      }
    } else {
      setActiveLecture(null);
    }
    const slideModeParam = searchParams.get('slideMode');
    if (slideModeParam && slideModeParam === 'true') {
      setSlideMode(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      setSlideMode(false);
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [searchParams]);

  React.useEffect(() => {
    localStorage.setItem('pythonAutomationLecturesListMode', listMode);
  }, [listMode]);

  const handleLectureClick = (index: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('lecture', index.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    setActiveLecture(() => lectureList[index].lecture);
  };

  const handleCloseLecture = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('lecture');
    window.history.pushState(null, '', `?${params.toString()}`);
    setActiveLecture(null);
  };

  const handleEnterSlideMode = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('slideMode', 'true');
    window.history.pushState(null, '', `?${params.toString()}`);
    setSlideMode(true);
    // fullscreen window
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  const handleExitSlideMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    const params = new URLSearchParams(window.location.search);
    params.delete('slideMode');
    window.history.pushState(null, '', `?${params.toString()}`);
    setSlideMode(false);
  }
  // exit slide mode when exiting fullscreen
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('fullscreenchange event');
      if (!document.fullscreenElement) {
        handleExitSlideMode();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (slideMode && e.key === 'Escape') {
      handleExitSlideMode();
    }
  };

  React.useEffect(() => {
    if (slideMode) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [slideMode]);
  

  return (
    <div>
      {activeLecture === null && (
        <React.Fragment>
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tc1">Lecture Notes</h2>
            <div className="w-6 h-6 mr-2 relative overflow-visible flex items-center justify-center opacity-100 hover:opacity-60 transition-opacity duration-200 tc1">
              <BsFillGridFill
                className={`absolute w-[100%] h-[100%] cursor-pointer transition-opacity duration-300 ${listMode === 'list' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setListMode('grid')}
              />
              <FaListUl
                className={`absolute w-[100%] h-[100%] cursor-pointer transition-opacity duration-300 ${listMode === 'grid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setListMode('list')}
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className={`grid grid-cols-1 gap-1 ${listMode == 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 gap-4' : 'rounded-xl overflow-hidden'}`}>
              {lectureList.map((lecture, index) => {
                if (!lecture.finished) return null;
                const IconComponent = lecture.icon as React.ComponentType<{ displayMode: 'list' | 'card'; onClick: () => void; key: number }>;
                return <IconComponent displayMode={listMode === 'list' ? 'list' : 'card'} onClick={() => handleLectureClick(index)} key={index} />;
              })}
            </div>
          </div>
        </React.Fragment>
      )}
      {activeLecture && (
        <div className="max-w-4xl w-full relative">
          <div className="sticky top-0 right-1 float-right flex flex-row items-center justify-end gap-2">
            <div
              onClick={handleEnterSlideMode}
              className=" hover:opacity-60 transition-opacity duration-200 tc1 cursor-pointer z-10"
            >
              <FaExpandAlt className="w-5.5 h-5.5 tc1" />
            </div>
            <div
              onClick={handleCloseLecture}
              className=" hover:opacity-60 transition-opacity duration-200 tc1 cursor-pointer z-10"
            >
              <IoMdClose className="w-8 h-8 tc1" />
            </div>
          </div>

          {React.createElement(activeLecture, { displayMode: slideMode ? 'slideshow' : 'scrollable', className: '', style: {  }, exitFSCallback: handleExitSlideMode })}

        </div>
      )}
    </div>
  );
}
