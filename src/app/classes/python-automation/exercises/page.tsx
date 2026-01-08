'use client';

import { assignments } from '../tabs/ScheduleTab/ScheduleInfo';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExercisesPage() {

	const router = useRouter();
	const destURL = "/classes/python-automation?tab=exercises";

	useEffect(() => {
		// Redirect to the Exercises tab
		router.replace(destURL);
	}, [router]);
		


return (
		<div className="">
			<h1 className="tc1 font-bold text-2xl p-8">Redirecting...</h1>
		</div>
	);
}