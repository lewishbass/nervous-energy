import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

type Props = {
  assignmentPath: string;
  className?: string;
  textOverride?: string;
};

export default function BackToAssignment({ assignmentPath, className = '', textOverride }: Props) {
  return (
    <Link href={assignmentPath} className={`text-indigo-600 dark:text-indigo-500 underline hover:decoration-indigo-600 decoration-indigo-600/0 transition-all duration-200 group ${className}`}>
      <FaArrowLeft className="inline mr-2 mb-1 transition-transform duration-200 group-hover:translate-x-[-2px]" />
      {textOverride || 'Back to assignment'}
    </Link>
  );
}
