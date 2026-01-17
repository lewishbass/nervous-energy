import '@/styles/toggles.css';
import '@/styles/buttons.css';
import '@/styles/popups.css';
import { useRef, useEffect, useState } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';

import { AssignmentInfo, assignments, scheduleDates } from '../ScheduleTab/ScheduleInfo';
import { schedule } from '@netlify/functions';
import AdminStats from './AdminStats';
import { FaChartBar } from 'react-icons/fa';

const CLASSWORK_ROUTE = '/.netlify/functions/classwork';

export default function ExercisesTab() {

  const router = useRouter();

  const [showCompleted, setShowCompleted] = useState(true);
  const [showPastDue, setShowPastDue] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [listMode, setListMode] = useState<'grid' | 'list'>(() => {
    const storedMode = localStorage.getItem('exerciseListMode');
    return storedMode === 'list' ? 'list' : 'grid';
  });
  const [submissionStatuses, setSubmissionStatuses] = useState<string[] | null>(null);

  const [viewingAssignment, setViewingAssignment] = useState<AssignmentInfo | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    localStorage.setItem('exerciseListMode', listMode);
  }, [listMode]);

  const today = new Date();

  const { username, token, isLoggedIn } = useAuth();


  const navigateToAssignment = (assignment: AssignmentInfo) => {
    window.history.pushState({}, '', document.location.href);
    router.replace('/classes/python-automation/exercises/' + assignment.link);
  }

  useEffect(() => {
    if (!isLoggedIn || !username || !token) {
      setSubmissionStatuses(null);
      setIsAuthorized(false);
      return;
    }
    updateSubmissionStatus(username, token, 'python-automation');
    checkAuthorization(username, token);
  }, [username, token, isLoggedIn]);

  const updateSubmissionStatus = async (username: string, token: string, className: string) => {
    try {
      if (!isLoggedIn || !username || !token) throw new Error("User not logged in");
      const response = await fetch(CLASSWORK_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_submitted_assignments',
          username,
          token,
          className,
        }),
      });
      if (!response.ok) throw new Error(`Error fetching submission statuses: ${response.statusText}`);
      const data = await response.json();
      console.log("Fetched submission statuses:", data);
      setSubmissionStatuses(data.assignmentNames || []);
    } catch (error) {
      console.error("Error fetching submission statuses:", error instanceof Error ? error.message : error);
    }
  }

  const checkAuthorization = async (username: string, token: string) => {
    try {
      const response = await fetch(CLASSWORK_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check_authorization',
          username,
          token,
        }),
      });
      if (!response.ok) throw new Error(`Error checking authorization: ${response.statusText}`);
      const data = await response.json();
      setIsAuthorized(data.authorized || false);
    } catch (error) {
      console.error("Error checking authorization:", error instanceof Error ? error.message : error);
      setIsAuthorized(false);
    }
  };

  return (
    <div>
      <div className={`flex flex-row items-center mb-1`}>
        <h2 className="text-2xl font-bold tc1">Exercises</h2>
        <div className="w-6 h-6 mr-2 ml-auto relative overflow-visible flex items-center justify-center opacity-100 hover:opacity-60 transition-opacity duration-200 tc1">
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
      <div className="button-group flex-wrap align-middle flex flex-row items-center mb-4">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`control-button ${showCompleted ? 'button-primary button-active' : 'button-secondary'} ${submissionStatuses == null ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Completed
        </button>
        <button
          onClick={() => setShowPastDue(!showPastDue)}
          className={`control-button ${showPastDue ? 'button-primary button-active' : 'button-secondary'}`}
        >
          Past Due
        </button>
        <button
          onClick={() => setShowUpcoming(!showUpcoming)}
          className={`mr-auto control-button ${showUpcoming ? 'button-primary button-active' : 'button-secondary'}`}
        >
          Upcoming
        </button>

      </div>
      <div className="grid gap-4">
        <div className={`grid grid-cols-1 gap-1 ${listMode == 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 gap-4' : 'rounded-xl overflow-hidden'}`}>
          {/* Exercise items go here */}
          {assignments.filter(
            (assignment) => {
              const startDate = scheduleDates[Math.min(Math.max(0, assignment.startClassIndex), scheduleDates.length - 1)];
              const endDate = scheduleDates[Math.min(Math.max(0, assignment.endClassIndex), scheduleDates.length - 1)];
              if (today > endDate) {
                const isCompleted = submissionStatuses ? submissionStatuses.includes(assignment.link) : true;
                return isCompleted ? showCompleted : showPastDue;
              }
              else if (today < startDate) {
                return showUpcoming;
              }
              return true;
            }
          ).map((assignment) => {
            const isSubmitted = submissionStatuses ? submissionStatuses.includes(assignment.link) : false;
            const startDate = scheduleDates[Math.min(Math.max(0, assignment.startClassIndex), scheduleDates.length - 1)];
            const endDate = scheduleDates[Math.min(Math.max(0, assignment.endClassIndex), scheduleDates.length - 1)];
            const isPastDue = today > endDate;

            let statusText = isSubmitted ? 'Submitted' : endDate.toDateString();
            let statusColor = isSubmitted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400';

            if (isPastDue && !isSubmitted) {
              statusText = 'Past Due';
              statusColor = 'text-red-600 dark:text-red-400';
            }

            if (listMode === 'grid') {
              return (
                <div className='relative lecture-card p-5 rounded-xl bg-gray-300/15 hover:bg-gray-300/25 dark:hover:bg-gray-300/20 hover:shadow-md dark:shadow-white/15 transition-all duration-200 cursor-pointer flex flex-col ' onClick={() => { navigateToAssignment(assignment); }}>
                  
                    <h2 className="text-xl font-semibold tc2 mb-2">{assignment.name}</h2>
                    <p className="tc3 text-sm mb-4 min-h-[4em]">{assignment.description}</p>
                    { (
                      <div className={`text-xs font-semibold mt-auto ${statusColor}`}>{statusText}</div>
                    )}
                  {isAuthorized && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingAssignment(assignment);
                      }}
                      className="absolute bottom-2 right-2 p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 transition-colors duration-200 cursor-pointer"
                      title="View Admin Stats"
                    >
                      <FaChartBar className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            } else {
              return (
                <div className='relative lecture-list-item bg-gray-300/10 hover:bg-gray-300/25 dark:hover:bg-gray-300/15 flex items-center p-5 transition-colors duration-300 cursor-pointer' onClick={() => { navigateToAssignment(assignment); }}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold tc2 mb-0.5 truncate">{assignment.name}</h3>
                    <p className="tc3 text-xs line-clamp-1">{assignment.description}</p>
                  </div>
                  {(
                    <span className={`text-xs font-semibold ml-4 whitespace-nowrap ${statusColor}`}>{statusText}</span>
                  )}
                  {isAuthorized && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingAssignment(assignment);
                      }}
                      className="ml-4 p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 transition-colors duration-200 cursor-pointer"
                      title="View Admin Stats"
                    >
                      <FaChartBar className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            }
          })}
        </div>
        {/* Admin Stats Panel */}
        {viewingAssignment && <AdminStats className="python-automation" assignment={viewingAssignment} onClose={() => setViewingAssignment(null)} />}
      </div>

    </div>

  );
}
