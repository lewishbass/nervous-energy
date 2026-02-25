import { FaAngleDown, FaCarrot } from 'react-icons/fa6';
import { CloudIndicator, sanitizeSubmissionState } from './ExerciseUtils';

interface QuestionHeaderProps {
  title: string;
  partName: string;
  questionName: string;
  selectedQuestion: string | null;
  setSelectedQuestion: (part: string | null) => void;
  submissionStates: Record<string, any>;
  validationStates: Record<string, 'passed' | 'failed' | 'pending' | null>;
}

export default function QuestionHeader({
  title,
  partName,
  questionName,
  selectedQuestion,
  setSelectedQuestion,
  submissionStates,
  validationStates
}: QuestionHeaderProps) {
  return (
    <div 
      onClick={() => setSelectedQuestion(selectedQuestion === partName ? null : partName)} 
      className="cursor-pointer flex flex-row items-center mb-4 gap-2"
    >
      <h2 className="text-xl font-semibold tc1 mr-auto">{title}</h2>
      <CloudIndicator state={sanitizeSubmissionState(submissionStates[`${questionName}_${partName}`] || 'idle')} />
      <FaCarrot className={`text-green-400 dark:text-green-600 text-2xl transition-opacity duration-300 ${validationStates[partName] === 'passed' ? 'opacity-100' : 'opacity-0'}`} />
      <FaAngleDown className={`text-gray-400 dark:text-gray-600 text-xl transition-transform duration-300 ${selectedQuestion !== partName ? 'rotate-180' : ''}`} />
    </div>
  );
}
