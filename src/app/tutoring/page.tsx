// src/app/tutoring/page.tsx

"use client";
import { useState } from 'react';
import { FaInfoCircle, FaRegCalendarAlt, FaUserPlus } from "react-icons/fa";
import AboutTab from './AboutTab';
import AvailabilityTab from './AvailabilityTab';
import SignUpTab from './SignUpTab';

// @ts-expect-error jsx usage
export default function Tutoring(): JSX.Element {
	const [activeTab, setActiveTab] = useState('about');

	const tabStyle = {
		base: "px-[3%] py-3 cursor-pointer transition-all mx-1 font-medium relative user-select-none overflow-hidden",
		active: "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:animate-tabSlideIn after:transition-transform after:duration-300",
		inactive: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:scale-x-0 after:transition-transform after:duration-300"
	};

	return (
		<div className="p-6 max-w-4xl mx-auto mb-200">
			<h1 className="text-4xl font-bold mb-6 tc1">Tutoring</h1>

			{/* Tabs Navigation */}
			<div className="flex mb-8 border-b border-gray-200 dark:border-gray-700 justify-start gap-1">
				<button
					onClick={() => setActiveTab('about')}
					className={`${tabStyle.base} ${activeTab === 'about' ? tabStyle.active : tabStyle.inactive}`}
				>
					<span className="wg flex items-center">
						<FaInfoCircle className="min-w-5 min-h-5 mx-auto sm:mr-2" />
						<span className="hidden sm:inline">About</span>
					</span>
				</button>
				<button
					onClick={() => setActiveTab('availability')}
					className={`${tabStyle.base} ${activeTab === 'availability' ? tabStyle.active : tabStyle.inactive}`}
				>
					<span className="wg flex items-center">
						<FaRegCalendarAlt className="min-w-5 min-h-5 mx-auto sm:mr-2" />
						<span className="hidden sm:inline">Availability</span>
					</span>
				</button>
				<button
					onClick={() => setActiveTab('signup')}
					className={`${tabStyle.base} ${activeTab === 'signup' ? tabStyle.active : tabStyle.inactive}`}
				>
					<span className="wg flex items-center">
						<FaUserPlus className="min-w-5 min-h-5 mx-auto sm:mr-2" />
						<span className="hidden sm:inline">Sign Up</span>
					</span>
				</button>
			</div>

			{activeTab === 'about' && <AboutTab />}
			{activeTab === 'availability' && <AvailabilityTab />}
			{activeTab === 'signup' && <SignUpTab />}
		</div>
	);
}