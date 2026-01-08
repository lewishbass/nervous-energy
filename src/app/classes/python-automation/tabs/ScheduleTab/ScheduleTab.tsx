import InfoCard from '@/components/widgets/InfoCard';
import { classSessions, unitColors, units, assignments } from './ScheduleInfo';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/toggles.css';
import '@/styles/buttons.css';
import UnitModal from './UnitModal';
import { AssignmentInfo } from './ScheduleInfo';
import { FaCompress, FaExpand } from 'react-icons/fa';
import React from 'react';

const assignmentColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export default function ScheduleTab() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showStarttime, setShowStarttime] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowStarttime');
    try {
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return false;
    }
  })
  const [showEndtime, setShowEndtime] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowEndtime');
    try {
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return false;
    }
  })
  const [showDates, setShowDates] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowDates');
    try {
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return true;
    }
  })
  const [showAssignmentsDue, setShowAssignmentsDue] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowAssignmentsDue');
    try {
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return true;
    }
  })
  const [showUnit, setShowUnit] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowUnit');
    try {
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return true;
    }
  });
  const [showAssignmentWaterfall, setShowAssignmentWaterfall] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowAssignmentWaterfall');
    try {
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return false;
    }
  });
  const [lockScheduleHeight, setLockScheduleHeight] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationLockScheduleHeight');
    try {
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return true;
    }
  });
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentInfo | null>(null);
  const [showLectures, setShowLectures] = useState(() => {
    const stored = localStorage.getItem('pythonAutomationScheduleShowLectures');
    try {
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return true;
    }
  });
  
  // Restore scroll position on mount
  useEffect(() => {
    const savedScrollTop = localStorage.getItem('pythonAutomationScheduleScrollTop');
    const savedScrollLeft = localStorage.getItem('pythonAutomationScheduleScrollLeft');
    
    if (scrollContainerRef.current && savedScrollTop) {
      scrollContainerRef.current.scrollTop = parseInt(savedScrollTop, 10);
    }
    if (scrollContainerRef.current && savedScrollLeft) {
      scrollContainerRef.current.scrollLeft = parseInt(savedScrollLeft, 10);
    }
  }, []);

  // Save scroll position when scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    localStorage.setItem('pythonAutomationScheduleScrollTop', target.scrollTop.toString());
    localStorage.setItem('pythonAutomationScheduleScrollLeft', target.scrollLeft.toString());
  };

  useEffect(() => {
    //store preferences in local storage
    localStorage.setItem('pythonAutomationScheduleShowStarttime', JSON.stringify(showStarttime));
    localStorage.setItem('pythonAutomationScheduleShowEndtime', JSON.stringify(showEndtime));
    localStorage.setItem('pythonAutomationScheduleShowDates', JSON.stringify(showDates));
    localStorage.setItem('pythonAutomationScheduleShowAssignmentsDue', JSON.stringify(showAssignmentsDue));
    localStorage.setItem('pythonAutomationScheduleShowUnit', JSON.stringify(showUnit));
    localStorage.setItem('pythonAutomationScheduleShowAssignmentWaterfall', JSON.stringify(showAssignmentWaterfall));
    localStorage.setItem('pythonAutomationLockScheduleHeight', JSON.stringify(lockScheduleHeight));
    localStorage.setItem('pythonAutomationScheduleShowLectures', JSON.stringify(showLectures));
  }, [showStarttime, showEndtime, showDates, showAssignmentsDue, showUnit, showAssignmentWaterfall, lockScheduleHeight, showLectures]);

  // Calculate unit rowSpans for merging
  const unitRowSpans = classSessions.map((session, index) => {
    if (index === 0 || session.unitNumber !== classSessions[index - 1].unitNumber) {
      let span = 1;
      for (let i = index + 1; i < classSessions.length; i++) {
        if (classSessions[i].unitNumber === session.unitNumber) {
          span++;
        } else {
          break;
        }
      }
      return span;
    }
    return 0; // This cell should be skipped
  });

  const nextClass = classSessions.find(session => session.startTime > new Date());

  // Calculate assignment columns and rowSpans for Gantt chart
  const getAssignmentGanttData = () => {
    return assignments.map((assignment, idx) => ({
      ...assignment,
      color: assignmentColors[idx % assignmentColors.length],
    }));
  };

  // Calculate which column each assignment belongs to (to avoid overlaps)
  const calculateAssignmentColumns = () => {
    const ganttData = getAssignmentGanttData();
    const columns: { startClassIndex: number; endClassIndex: number }[][] = [];
    const assignmentColumns: Map<string, number> = new Map();
    
    const sortedAssignments = [...ganttData].sort((a, b) => a.startClassIndex - b.startClassIndex);
    
    for (const assignment of sortedAssignments) {
      let placedInColumn = -1;
      
      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const column = columns[colIdx];
        const hasOverlap = column.some(existing => 
          !(assignment.endClassIndex < existing.startClassIndex || 
            assignment.startClassIndex > existing.endClassIndex)
        );
        
        if (!hasOverlap) {
          column.push({ startClassIndex: assignment.startClassIndex, endClassIndex: assignment.endClassIndex });
          placedInColumn = colIdx;
          break;
        }
      }
      
      if (placedInColumn === -1) {
        columns.push([{ startClassIndex: assignment.startClassIndex, endClassIndex: assignment.endClassIndex }]);
        placedInColumn = columns.length - 1;
      }
      
      assignmentColumns.set(assignment.uuid, placedInColumn);
    }
    
    return { assignmentColumns, totalColumns: columns.length };
  };

  // Get assignments that start at a specific row for a specific column
  const getAssignmentForRowAndColumn = (rowIndex: number, columnIndex: number) => {
    const { assignmentColumns } = calculateAssignmentColumns();
    const ganttData = getAssignmentGanttData();
    
    return ganttData.find(a => 
      a.startClassIndex === rowIndex && 
      assignmentColumns.get(a.uuid) === columnIndex
    );
  };

  // Check if a cell should be skipped (already covered by a rowSpan)
  const shouldSkipAssignmentCell = (rowIndex: number, columnIndex: number) => {
    const { assignmentColumns } = calculateAssignmentColumns();
    const ganttData = getAssignmentGanttData();
    
    return ganttData.some(a => {
      const col = assignmentColumns.get(a.uuid);
      return col === columnIndex && 
             rowIndex > a.startClassIndex && 
             rowIndex <= a.endClassIndex;
    });
  };

  // Get rowSpan for an assignment
  const getAssignmentRowSpan = (assignment: ReturnType<typeof getAssignmentGanttData>[0]) => {
    return assignment.endClassIndex - assignment.startClassIndex + 1;
  };

  const handleUnitClick = (unitNumber: number) => {
    console.log('Clicked unit number:', unitNumber);
    setSelectedUnitNumber(unitNumber);
    setSelectedAssignment(null);
    setIsUnitModalOpen(true);
  };

  const handleAssignmentClick = (assignment: AssignmentInfo) => {
    console.log('Clicked assignment:', assignment);
    setSelectedAssignment(assignment);
    setSelectedUnitNumber(null);
    setIsUnitModalOpen(true);
  };

  const { totalColumns } = calculateAssignmentColumns();

  const navigateToLecture = (lectureIndex: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'lectures');
    params.set('lecture', lectureIndex.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 tc1">Course Schedule</h2>
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 items-center">
        <div className="button-group flex-wrap">
          <button
            onClick={() => setShowDates(!showDates)}
            className={`control-button text-xs sm:text-sm ${showDates ? 'button-primary button-active' : 'button-secondary'}`}
          >
            Dates
          </button>
          <button
            onClick={() => setShowStarttime(!showStarttime)}
            className={`control-button text-xs sm:text-sm ${showStarttime ? 'button-primary button-active' : 'button-secondary'}`}
          >
            Start
          </button>
          <button
            onClick={() => setShowEndtime(!showEndtime)}
            className={`control-button text-xs sm:text-sm ${showEndtime ? 'button-primary button-active' : 'button-secondary'}`}
          >
            End
          </button>
          <button
            onClick={() => setShowUnit(!showUnit)}
            className={`control-button text-xs sm:text-sm ${showUnit ? 'button-primary button-active' : 'button-secondary'}`}
          >
            Unit
          </button>
          <button
            onClick={() => setShowAssignmentWaterfall(!showAssignmentWaterfall)}
            className={`control-button text-xs sm:text-sm ${showAssignmentWaterfall ? 'button-primary button-active' : 'button-secondary'}`}
          >
            EX Chart
          </button>
          <button
            onClick={() => setShowLectures(!showLectures)}
            className={`control-button text-xs sm:text-sm ${showLectures ? 'button-primary button-active' : 'button-secondary'}`}
          >
            Lecture
          </button>
          <button
            onClick={() => setShowAssignmentsDue(!showAssignmentsDue)}
            className={`control-button text-xs sm:text-sm ${showAssignmentsDue ? 'button-primary button-active' : 'button-secondary'}`}
          >
            Exercises Due
          </button>
          
        </div>
        
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center tc1 ml-auto mr-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 touch-manipulation" onClick={() => setLockScheduleHeight(!lockScheduleHeight)}>
            <FaExpand className={`absolute transition-opacity duration-300 ${lockScheduleHeight ? 'opacity-100' : 'opacity-0'}`} />
            <FaCompress className={`absolute transition-opacity duration-300 ${!lockScheduleHeight ? 'opacity-100' : 'opacity-0'}`} />
          </div>
      </div>
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 overflow-x-auto overflow-y-auto mini-scroll rounded-lg shadow-sm max-w-[100vw]" 
        style={{maxHeight: lockScheduleHeight ? '600px' : '1600px', transition: 'max-height 0.3s ease-in-out'}}
      >
        <table className="min-w-full border-collapse text-sm sm:text-base" >
          <thead className="sticky top-0 z-10 ">
            <tr className="outline-solid outline-[1px] outline-black dark:outline-white h-[50px]">
              {showDates && <th className="text-left p-2 sm:p-3 tc1 font-bold w-0 whitespace-nowrap text-xs sm:text-base">Date</th>}
              {showStarttime && <th className="text-left p-2 sm:p-3 tc1 font-bold w-0 whitespace-nowrap text-xs sm:text-base">Start</th>}
              {showEndtime && <th className="text-left p-2 sm:p-3 tc1 font-bold w-0 whitespace-nowrap text-xs sm:text-base">End</th>}
              {showUnit && <th className="text-left p-2 sm:p-3 tc1 font-bold w-0 min-w-[100px] sm:min-w-[20%] whitespace-nowrap text-xs sm:text-base">Unit</th>}
              {showAssignmentWaterfall && Array.from({ length: totalColumns }).map((_, colIdx) => (
                <th key={`hw-col-${colIdx}`} className="text-left p-1 tc1 font-bold w-0">
                  {colIdx === 0 ? '' : ''}
                </th>
              ))}
              {showLectures && <th className="text-left p-2 sm:p-3 tc1 font-bold w-0 text-xs sm:text-base">Lecture</th>}
              {showAssignmentsDue && <th className="text-left p-2 sm:p-3 tc1 font-bold text-xs sm:text-base">Exercises Due</th>}
            </tr>
            <div className="absolute bg3 inset-0 -z-1"></div>
          </thead>
          <tbody className="max-h-100 overflow-y-auto">
            {classSessions.map((classinfo, index) => (
              <tr key={index} className={`relative border-b-[2px] border-blue-100 dark:border-slate-900 h-[50px]`}>
                {showDates && <td className="p-2 px-3 sm:p-3 sm:px-6 tc2 whitespace-nowrap text-xs sm:text-base">
                  {`${(classinfo.startTime.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${classinfo
                      .startTime.getDate()
                      .toString()
                      .padStart(2, '0')}`} 
                </td>}
                {showStarttime && <td className="p-2 px-3 sm:p-3 sm:px-6 tc2 whitespace-nowrap text-xs sm:text-base">
                  {classinfo.startTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </td>}
                {showEndtime && <td className="p-2 px-3 sm:p-3 sm:px-6 tc2 whitespace-nowrap text-xs sm:text-base">
                  {classinfo.endTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </td>}
                {showUnit && unitRowSpans[index] > 0 && (
                  <td
                    rowSpan={unitRowSpans[index]}
                    className="relative cursor-pointer p-0 select-none touch-manipulation active:opacity-50"
                    onClick={() => handleUnitClick(classinfo.unitNumber)}
                    style={{ verticalAlign: 'top' }}
                  >
                    <div className="border-l-[3px] sm:border-l-[4px] border-solid border backdrop-blur-[3px] hover:opacity-70 active:opacity-50 transition-all duration-300"
                      style={{
                        backgroundColor: `${unitColors[classinfo.unitNumber % unitColors.length]}70`,
                        borderColor: `${unitColors[classinfo.unitNumber % unitColors.length]}80`,
                        borderRadius: '8px',
                        position: 'absolute',
                        zIndex: 1,
                        top: '4px',
                        left: '0px',
                        right: '0px',
                        bottom: '4px',
                      }}
                    >
                    </div>
                    <div className="p-2 px-2 sm:p-3 sm:px-3 font-semibold relative z-2 pointer-events-none">
                      <span className="tc1 font-bold text-xs sm:text-base">{units[classinfo.unitNumber].unitName}</span>
                    </div>
                  </td>
                )}
                
                {showAssignmentWaterfall && Array.from({ length: totalColumns }).map((_, colIdx) => {
                  // Check if this cell should be skipped (covered by rowSpan above)
                  if (shouldSkipAssignmentCell(index, colIdx)) {
                    return null;
                  }
                  
                  const assignment = getAssignmentForRowAndColumn(index, colIdx);
                  
                  if (assignment) {
                    const rowSpan = getAssignmentRowSpan(assignment);
                    return (
                      <td
                        key={`hw-${index}-${colIdx}`}
                        rowSpan={rowSpan}
                        className="relative cursor-pointer hover:opacity-90 active:opacity-50 transition-opacity duration-300 select-none min-w-[20px] sm:min-w-[25px] p-1 touch-manipulation"
                        onClick={() => handleAssignmentClick(assignment)}
                        style={{ verticalAlign: 'top'}}
                      >
                        <div
                          className="hover:shadow-lg active:shadow-xl transition-shadow duration-200"
                          style={{
                            backgroundColor: `${assignment.color}FF`,
                            borderColor: assignment.color,
                            borderRadius: '4px',
                            position: 'absolute',
                            zIndex: 1,
                            top: '4px',
                            left: '2px',
                            right: '0px',
                            bottom: '4px',
                            transition: 'opacity 0.2s',
                          }}
                        >
                          <div className="flex items-center justify-center h-full w-full overflow-hidden">
                          <span
                            className="h-full px-1 sm:px-2 text-[10px] sm:text-xs font-bold text-white text-ellipsis overflow-hidden whitespace-nowrap"
                            style={{
                              writingMode: 'vertical-rl',
                              textOrientation: 'mixed',
                              transform: 'rotate(180deg)',
                              maxHeight: '100%'
                            }}
                            title={`${assignment.name}\n${assignment.description}`}
                          >
                            {assignment.name}
                            </span>
                          </div>
                        </div>
                        
                      </td>
                    );
                  }
                  
                  // Empty cell (no assignment in this column at this row)
                  return <td key={`hw-${index}-${colIdx}`} className="p-1" />;
                })}
                
                {showLectures && <td className="p-2 px-3 sm:p-3 sm:px-6 tc2">
                  {classinfo.lecture ? React.createElement(classinfo.lecture.icon, { displayMode: "table", className:"cursor-pointer select-none hover:opacity-60 active:opacity-40 transition-opacity duration-200 whitespace-nowrap touch-manipulation text-xs sm:text-base", onClick: () => {if(classinfo && classinfo.lecture && classinfo.lecture.index !== undefined) navigateToLecture(classinfo.lecture.index) } } as any) : '--'}
                </td>}
                
                {showAssignmentsDue && <td className="p-2 px-3 sm:p-3 sm:px-6 tc2 text-xs sm:text-base" >
                  {classinfo.assignmentsDue.length > 0
                    ? classinfo.assignmentsDue.map((a) => <p key={a.uuid} className="cursor-pointer select-none hover:opacity-60 active:opacity-40 transition-opacity duration-200 touch-manipulation" onClick={() => handleAssignmentClick(a)}>{a.name}</p>)
                    : '--'}
                </td>}
                <div
                  className='-z-1'
                  style={{
                  backgroundColor: (classinfo.startTime.toDateString() === nextClass?.startTime.toDateString()) ? "#88f5":(index % 2 == 0 ? 'none' : '#8882'),
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: -1,
                }}></div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        displayData={selectedAssignment || (selectedUnitNumber !== null ? units[selectedUnitNumber] : null)}
      />
    </div>
  );
}
