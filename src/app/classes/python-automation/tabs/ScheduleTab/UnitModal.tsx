import React from 'react';
import ModalTemplate from '@/components/modals/ModalTemplate';
import { UnitInfo, unitColors, AssignmentInfo } from './ScheduleInfo';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayData: UnitInfo | AssignmentInfo | null;
}

const isAssignment = (data: UnitInfo | AssignmentInfo): data is AssignmentInfo => {
  return 'uuid' in data && 'link' in data;
};

const UnitModal: React.FC<UnitModalProps> = ({ isOpen, onClose, displayData }) => {
  if (!displayData) return null;

  const router = useRouter();

  const isAssignmentData = isAssignment(displayData);

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={isAssignmentData 
        ? displayData.name 
        : `Unit ${displayData.unitNumber}: ${displayData.unitName}`}
      contentLoading={false}
      modalWidth="600px"
			transitionSpeed={0.7}
			skipLoadingAnimation={true}
    >
      {isAssignmentData ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold tc1 mb-2">Description</h3>
            <p className="tc2">{displayData.description}</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold tc1 mb-2">Timeline</h3>
            <p className="tc2">Assigned: Class {displayData.startClassIndex + 1}</p>
            <p className="tc2">Due: Class {displayData.endClassIndex + 1}</p>
          </div>
          {displayData.link && (
            <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold tc1 mb-2">Link</h3>
              <a 
                onClick={() => router.push(`/classes/python-automation/exercises/${displayData.link}`)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tc2 hover:opacity-60 transition-opacity duration-300 break-all cursor-pointer"
              >
                <FaArrowRight className="inline"/> {displayData.link}
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: unitColors[displayData.unitNumber % unitColors.length] + '40',
              borderLeft: `4px solid ${unitColors[displayData.unitNumber % unitColors.length]}`
            }}
          >
            <h3 className="text-lg font-semibold tc1 mb-2">Description</h3>
            <p className="tc2">{displayData.unitDescription}</p>
          </div>
            <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700">
              {displayData.topicsCovered && displayData.topicsCovered.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold tc1 mb-2">Topics Covered</h3>
                  <ul className="list-disc list-inside tc2">
                    {displayData.topicsCovered?.map((topic, index) => (
                      <li key={index} className="mb-1">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <h3 className="text-lg font-semibold tc1 mb-2">Assignments</h3>
            {displayData.assignmentsAssigned.length > 0 ? (
              <ul className="tc2">
                {displayData.assignmentsAssigned.map((assignment, index) => (
                  <li key={index} className="mb-1 hover:opacity-60 transition-opacity duration-300 break-all cursor-pointer" onClick={() => router.push(`/classes/python-automation/exercises/${assignment.link}`)}>
                    <FaArrowRight className="inline"/> {assignment.name} (Due by Class {assignment.endClassIndex + 1})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tc2">No assignments due for this unit.</p>
              )}
              
          </div>
        </div>
      )}
    </ModalTemplate>
  );
};

export default UnitModal;
