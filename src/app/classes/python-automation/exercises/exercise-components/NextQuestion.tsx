import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaList } from 'react-icons/fa6';

type Props = {
  prevHref?: string;
  nextHref?: string;
  prevLabel?: string;
  nextLabel?: string;
  assignmentPath: string;
};

export default function NextQuestion({ prevHref, nextHref, prevLabel = 'Previous', nextLabel = 'Next', assignmentPath }: Props) {
  const isNextOverview = nextHref ? nextHref.indexOf('overview') > -1 : false;
  return (
    <div className="flex items-center rounded-lg overflow-hidden">
      {prevHref ? (
        <Link href={prevHref} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm tc3 hover:bg-gray-200 dark:hover:bg-gray-700 border-r-2 border-gray-800 dark:border-gray-500 group">
          <FaArrowLeft className="inline mr-2 mb-1 transition-transform duration-200 group-hover:translate-x-[-2px]" />
          {prevLabel}
        </Link>
      ) : null}
        <Link
          href={nextHref ?? assignmentPath}
          className={`px-4 py-2 text-sm group ${nextHref ? !isNextOverview ? 'bg-indigo-600 text-white hover:opacity-95' : 'bg-sky-600 text-white hover:opacity-95' : 'bg-green-600 text-white hover:opacity-95'}`}>
          {nextHref ? isNextOverview ? 'Overview' : nextLabel : 'Finish'}
					{nextHref ? isNextOverview ? <FaList className="inline ml-2 mb-0.5" /> :<FaArrowRight className="inline ml-2 mb-1 transition-transform duration-200 group-hover:translate-x-[2px]" /> : null}
        </Link>
    </div>
  );
}
