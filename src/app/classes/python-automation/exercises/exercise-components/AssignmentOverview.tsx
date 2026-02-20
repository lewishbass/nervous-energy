'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  description?: string;
  objectives?: string[];
  startHref?: string;
  className?: string;
  questionList?: { title: string; link: string; description: string, status?: string }[];
};

export default function AssignmentOverview({
  title,
  description,
  objectives,
  startHref,
  className = '',
  questionList,
}: Props) {
  const router = useRouter();

  const statusColor = (status?: string): string => {
    if (!status || status === 'not-started') return '';
    if (status === 'completed') return 'text-green-500 dark:text-green-400';
    if (status === 'incorrect') return 'text-red-500 dark:text-red-400';
    if (status === 'in-progress') return 'text-yellow-500 dark:text-yellow-400';
    return '';
  };

  return (
    <div className={`mb-6 ${className}`}>
			<h3 className="text-4xl font-bold tc1 ml-3 mb-2">{title}</h3>
			{description && <p className="tc2 mb-4 text-lg">{description}</p>}

			{ objectives && <ul className="tc3 mt-3 list-disc list-inside space-y-1">
				{objectives.map((o, i) => (
					<li key={i}>{o}</li>
				))}
			</ul>}
			{startHref && 
				<Link href={startHref} className="group my-4 block tc1 font-bold py-4 px-8 rounded-lg outline-dashed outline-2 outline-gray-500/20 hover:outline-gray-500/40 hover:bg-gray-500/10 transition">
					Get started
          <FaArrowRight className="inline-block ml-2 mb-1 transition-transform group-hover:translate-x-1" />
				</Link>}
			
			{questionList && (
				<div className="px-0">
					{questionList.map((q, index) => (
						<div key={index} className="mb-2">
							<button
								className={`tc3 py-2 px-4 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50 transition-all duration-100 cursor-pointer w-full text-left select-none opacity-70 ${statusColor(q.status)}`}
								onClick={() => router.push(`/classes/python-automation/exercises/simple-coding-practice/${q.link}`)}
							>
								<span className={`font-bold ${statusColor(q.status) || 'tc2'}`}>{q.title}</span><span className="text-sm">{` ${q.description}`}</span>
							</button>
						</div>
					))}
				</div>
			)}
    </div>
  );
}
