'use client';

import Link from 'next/link';
import Image from 'next/image';
import { classes } from '@/data/classes';
import { StarBackground } from '@/components/backgrounds/StarBackground';

export default function Classes() {
	const getRandomRotation = () => {
		return Math.floor(Math.random() * 360);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div
				style={{
					background: `radial-gradient(circle at top left, #FFF2, transparent 60%)`,
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: 0,
				}}
				className='invert dark:invert-0'
			/>
			<div style={{ opacity: 0, animation: "fade-in 10s ease 0.2s forwards" }}><StarBackground /></div>

			<h1 className="text-4xl font-bold mb-8 tc1 relative z-10">Classes</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
				{classes.map((classInfo, index) => {
					const rotation = getRandomRotation();

					return (
						<div
							key={index}
							className="bg2 rounded-lg shadow-lg overflow-hidden cursor-pointer relative group"
						>
							<Image
								src="/KH_figures.svg"
								alt="Keith Haring background"
								className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-25 dark:opacity-15 dark:invert select-none pointer-events-none"
								width={100}
								height={100}
								style={{
									userSelect: "none",
									transform: `rotate(${rotation}deg) scale(1.3)`,
									transformOrigin: "center center",
								}}
							/>
							<Link href={classInfo.link}>
								<div className="p-5 h-full flex flex-col relative z-10">
									<div className="w-full h-48 relative mb-4 bg-gray-200 rounded-md overflow-hidden">
										<Image
											src={classInfo.imagePath}
											alt={classInfo.title}
											fill
											style={{ objectFit: 'cover', transform: `rotate(${rotation}deg) scale(2)`}}
											className="transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<h2 className="text-xl font-semibold mb-2 tc1">{classInfo.title}</h2>
									<p className="tc2 mb-2 text-sm">{classInfo.location}</p>
									<p className="tc2 mb-2 text-sm">
										{formatDate(classInfo.startDate)} - {formatDate(classInfo.endDate)}
									</p>
									<p className="tc2 mb-4 flex-grow">{classInfo.description}</p>
									<div className="flex justify-between items-center mt-auto">
										<span className={`text-sm px-3 py-1 rounded-full ${
											classInfo.status === 'upcoming' 
												? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
												: classInfo.status === 'ongoing'
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
												: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
										}`}>
											{classInfo.status === 'upcoming' ? 'Upcoming' : classInfo.status === 'ongoing' ? 'In Progress' : 'Completed'}
										</span>
										{classInfo.hasPage && (
											<span className="text-blue-500 dark:text-blue-400 group-hover:animate-[wiggle_0.25s_ease_1]">
												Learn more →
											</span>
										)}
									</div>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
}
