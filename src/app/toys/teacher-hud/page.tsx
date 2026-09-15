'use client';

import TeacherHudBackground from './TeacherHudBackground';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';

export default function TeacherHudPage() {
	return (
		<div className="fixed inset-0 z-100 mt-16">
			<TeacherHudBackground />
			<div className="absolute inset-0 bg1 opacity-30"/>

			<div className="absolute inset-0" >
				<DailyView className="absolute inset-0" />
			</div>
			
		</div>
	);
}