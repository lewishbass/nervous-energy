import { copyToClipboard } from '@/scripts/clipboard';
import { units } from '../ScheduleTab/ScheduleInfo';
import { FaAngleDown } from 'react-icons/fa';
import { useState } from 'react';
import EntranceMap from './EntranceMap';


export default function SyllabusTab() {

	const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

	const position: [number, number] = [37.600539, -77.567012]; // Example coordinates (Henrico County Adult Education Center)
	const [lat, lon] = position;
	const parkingPolygon: [number, number][] = [ // placeholder square
		[37.599905, -77.568259],
		[37.600332, -77.569382],
		[37.601266, -77.568817],
		[37.600939, -77.5679686],
		[37.600665, -77.568138],
		[37.600353, -77.567333],
		[37.600584, -77.567190],
		[37.600463, -77.566873],
		[37.599883, -77.567226]
	].map(coord => [coord[1], coord[0]]); // Convert to [lat, lon]
	const entrancePath: [number, number][] = [ // placeholder path
		[37.599832, -77.567809],
		[37.599862, -77.568518],
		[37.599935, -77.568577],
		[37.600578, -77.568120],
		[37.600243, -77.567259],
		[37.600435, -77.567079]
	].map(coord => [coord[1], coord[0]]); // Convert to [lat, lon]


	return (
		<div>
			<h2 className="text-2xl font-bold mb-2 tc1">Course Syllabus</h2>
			<div className="grid gap-4">
				<div className="relative tc2 max-w-[95%] space-y-4 mb-6">
					<table className="w-full max-w-[95%] mb-4 table-auto border-separate border-spacing-y-1">
						<tbody>
							<tr>
								<td className="font-bold tc1 pr-4 align-top text-left whitespace-nowrap w-auto">Instructor:</td>
								<td className="align-top w-full">Lewis Bass <span className='opacity-50 text-green-500'>[</span><span className="opacity-70 cursor-pointer text-blue-500 hover:text-blue-400  transition-colors" onClick={() => copyToClipboard('lewishbass@gmail.com', 'Email Copied!')}>lewishbass@gmail.com</span><span className='opacity-50 text-green-500'>]</span></td>
							</tr>
							<tr>
								<td className="font-bold tc1 pr-4 align-top text-left whitespace-nowrap w-auto">Dates:</td>
								<td className="align-top w-full">February 9 - April 22, 2026</td>
							</tr>
							<tr>
								<td className="font-bold tc1 pr-4 align-top text-left whitespace-nowrap w-auto">Meeting Times:</td>
								<td className="align-top w-full">Mondays and Wednesdays 6-8pm</td>
							</tr>
							<tr>
								<td className="font-bold tc1 pr-4 align-top text-left whitespace-nowrap w-auto">Office Hours:</td>
								<td className="align-top w-full">Mondays and Wednesdays 4-6pm</td>
							</tr>
						</tbody>
					</table>
					<h2 className="font-bold tc1 text-lg">A beginners introduction to programming; using Python to automate tasks and workflows</h2>
					
					<p className='indent-4'>
						The main goal of this course is to give students a solid foundation in programming concepts, and equip them with the Python tools needed to automate simple repetitive tasks in real environments
					</p>
					<p className='-mt-2 indent-4'>
						A secondary goal is to introduce design patterns and advanced methods for more robust programming.
					</p>
					<p className='-mt-2 indent-4'>
						This is a <span className="font-bold tct">Special Topics</span> course, meaning the curriculum is new and flexible and can be adjusted based on student interests and goals.
						Please message the instructor if you have specific topics you would like to see covered.
					</p>
					<h3 className="font-bold tc1 text-lg mt-4">Learning Objectives</h3>
					<ul className="list-disc list-inside space-y-2">
						<li>Master Python syntax and data types</li>
						<li>Use functions, classes and flow control statements</li>
						<li>Write scripts to automate common tasks and workflows</li>
						<li>Work with files, directories, and system operations</li>
						<li>Process and manipulate data using Python libraries</li>
						<li>Understand modern LLMs tools and their place in development</li>
						<li>Demonstrate mastery with practical automation projects</li>
					</ul>
					<h3 className="font-bold tc1 text-lg mt-4">Prerequisites</h3>
					<p>
						No prior programming experience required. Basic computer literacy (preferred) and willingness to learn.
					</p>
					<h3 className="font-bold tc1 text-lg mt-4">Location</h3>
					<p>
						Henrico County Adult Education Center, Room 2xx : <span className="opacity-50 text-green-500">[</span><span className="opacity-70 cursor-pointer text-blue-500 hover:text-blue-400 transition-colors" onClick={() => copyToClipboard('1420 N Parham Rd, Henrico, VA 23229', 'Address Copied!')}>1420 N Parham Rd, Henrico, VA 23229</span><span className="opacity-50 text-green-500">]</span>
					</p>
					<p>
						Entrance is through the covered parking to the right of the big NOVA sign and pool entrance.
					</p>
					<EntranceMap location={position} entrancePath={entrancePath} parkingPolygon={parkingPolygon} />
					<h3 className='font-bold tc1 text-lg mt-4'>Grading</h3>
					<p>
						No grades will be assigned unless requested. Students will receive feedback on assignments and projects to help them improve their skills.
					</p>
					<h3 className="font-bold tc1 text-lg mt-4">Units</h3>
					<ul className="mx-4">
						{units.map((unit) => (
							<li key={unit.unitNumber} className="mb-2">
								<FaAngleDown
									className={`inline-block mr-2 transition-transform duration-200 cursor-pointer select-none ${expanded[unit.unitNumber] ? '' : '-rotate-90'} ${unit.topicsCovered ? 'visible' : 'invisible'}`}
									onClick={() => setExpanded({ ...expanded, [unit.unitNumber]: !expanded[unit.unitNumber] })}
								/>
								<span className="font-semibold tc2 cursor-pointer select-none" onClick={() => setExpanded({ ...expanded, [unit.unitNumber]: !expanded[unit.unitNumber] })}>{unit.unitName}</span>
								<p className="mx-4">{unit.unitDescription}</p>
								{unit.topicsCovered && (
									<ul className="list-disc list-inside mx-8 mt-1" style={{ maxHeight: expanded[unit.unitNumber] ? '230px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
										{unit.topicsCovered.map((topic, index) => (
											<li key={index}>{topic}</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
