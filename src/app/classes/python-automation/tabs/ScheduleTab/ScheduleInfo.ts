import { lectureList, LecturePair } from "../LecturesTab/LectureInfo";

export type AssignmentType = 'homework' | 'exercise' | 'project' | 'quiz' | 'test' | 'survey' | 'extra';

export type AssignmentInfo = {
	name: string;
	description: string;
	link: string;
	uuid: string;
	startClassIndex: number;
	endClassIndex: number;
	type?: AssignmentType;
	finished?: boolean;
};


export type ClassSessionInfo = {
	startTime: Date;
	endTime: Date;
	unitNumber: number;
	assignmentsDue: AssignmentInfo[];
	assignmentsAssigned: AssignmentInfo[];
	lecture?: LecturePair[];
};

export type UnitInfo = {
	unitNumber: number;
	unitName: string;
	unitDescription: string;
	assignmentsDue: AssignmentInfo[];
	assignmentsAssigned: AssignmentInfo[];
	topicsCovered?: string[];
};

export const units: UnitInfo[] = [
	{
		unitNumber: 0,
		unitName: 'Foundations of Programming',
		unitDescription: "Introduce the basics of Python, including variables, data types like int and string, and operators.",
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'using Python environments with conda',
			'installing and configuring VSCode, Jupyter Notebooks',
			'int vs float',
			'variables and assignment',
			'arithmetic operators',
			'chars and strings',
			'string manipulation',
			'input and output',
			'the stack and memory basics',
		]
	},
	{
		unitNumber: 1,
		unitName: 'Flow Control',
		unitDescription: 'Cover if/elif/else statements, for loops, and while loops.',
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'boolean logic',
			'if, else statements',
			'switch statements with match-case',
			'while loops',
			'for loops and range()',
			'break and continue',
		]
	},
	{
		unitNumber: 2,
		unitName: 'The Data Structures Toolbox',
		unitDescription: 'Focus on core data structures: lists, tuples, dicts, and sets.',
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'lists and methods',
			'dictionaries and methods',
			'sets and methods',
			'tuples and immutability',
			'sorting and filtering',
			'pointers',
			'numpy introduction',
		]
	},
	{
		unitNumber: 3,
		unitName: 'Functions, Classes and Errors',
		unitDescription: 'Introduce functions, including how to define them with parameters and return values. Also cover basic error handling with try/except blocks.',
		assignmentsAssigned: [],
		assignmentsDue: [],
		topicsCovered: [
			'defining functions',
			'function parameters and return values',
			'pass by reference vs pass by value',
			'scope and lifetime of variables',
			'passing functions as arguments',
			'simple structures with classes',
			'member variables and methods',
			'try/except blocks and throwing errors',
		]
	},
	{
		unitNumber: 4,
		unitName: 'Working with Files',
		unitDescription: 'Dive into file I/O, specifically reading and writing text and binary files using the open() function and the with statement for proper resource management. Different file types and filesystem operations.',
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'with open() as f',
			'csv and json formats',
			'pandas and pickle files',
			'os module and file system operations',
		],
	},
	{
		unitNumber: 5,
		unitName: 'Tooling',
		unitDescription: 'Combining programs into streamlined tools for the CLI or GUI.',
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'sys module cli arguments, argparse',
			'packaging with setuptools and pip',
			'GUI with Tkinter',
			'web GUI with Flask',
			'Docker basics',
		],
	},
	{
		unitNumber: 6,
		unitName: 'Project Completion',
		unitDescription: 'Focus on integrating all learned concepts into a final project. Individualized assistance and topics relevant to each student\'s project will be covered.',
		assignmentsDue: [],
		assignmentsAssigned: [],
	},
	{
		unitNumber: 7,
		unitName: 'Advanced Topics',
		unitDescription: 'Explore advanced Python topics such as decorators, generators, and inline logic to enhance coding skills.',
		assignmentsDue: [],
		assignmentsAssigned: [],
		topicsCovered: [
			'decorators',
			'generators, yield, and iterators',
			'inline lists, loops and conditionals',
			'builtin variables and functions',
		]
	}
];

export const scheduleDates: Date[] = [
	// February (month index 1)
	new Date(2026, 1, 9, 18, 0, 0),
	new Date(2026, 1, 11, 18, 0, 0),
	new Date(2026, 1, 18, 18, 0, 0),
	new Date(2026, 1, 23, 18, 0, 0),
	new Date(2026, 1, 25, 18, 0, 0),

	// March (month index 2)
	new Date(2026, 2, 2, 18, 0, 0),
	new Date(2026, 2, 4, 18, 0, 0),
	new Date(2026, 2, 9, 18, 0, 0),
	new Date(2026, 2, 11, 18, 0, 0),
	new Date(2026, 2, 16, 18, 0, 0),
	new Date(2026, 2, 18, 18, 0, 0),
	new Date(2026, 2, 23, 18, 0, 0),
	new Date(2026, 2, 25, 18, 0, 0),
	new Date(2026, 2, 30, 18, 0, 0),

	// April (month index 3)
	new Date(2026, 3, 6, 18, 0, 0),
	new Date(2026, 3, 8, 18, 0, 0),
	new Date(2026, 3, 13, 18, 0, 0),
	new Date(2026, 3, 15, 18, 0, 0),
	new Date(2026, 3, 20, 18, 0, 0),
	new Date(2026, 3, 22, 18, 0, 0)
];

export const unitColors: string[] = [
	'#EC343E',
	'#F47820',
	'#FEE606',
	'#1AB157',
	'#01AFEE',
	'#EC018C',
];


export const assignments: AssignmentInfo[] = [
	{
		name: 'Intro Survey',
		description: 'Complete the introductory survey to help us understand your background and goals for this course.',
		link: 'intro-survey',
		uuid: 'z9y8x7w6-v5u4-3210-zyxw-v9876543210ab',
		startClassIndex: 0,
		endClassIndex: 1,
		type: 'survey',
		finished: true
	},
	{
		name: 'Simple Coding Practice',
		description: 'Perform simple operations with ints, floats, bools and strings.',
		link: 'simple-coding-practice',
		uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		startClassIndex: 1,
		endClassIndex: 4,
		type: 'homework',
		finished: true
	},
	{
		name: 'Functions, Arrays and Loops',
		description: 'Using functions and loops to perform more complex manipulations',
		link: 'functions-arrays-loops',
		uuid: 'b2c3d4e5-f6g7-8901-bcde-fg2345678901',
		startClassIndex: 3,
		endClassIndex: 6,
		type: 'homework'
	},
	{
		name: 'TMP-Grade Book Manager',
		description: 'Develop a grade tracking system using lists and dictionaries to store student information, calculate averages, identify top performers, and generate grade distributions.',
		link: 'gradebook-manager',
		uuid: 'c3d4e5f6-g7h8-9012-cdef-gh3456789012',
		startClassIndex: 5,
		endClassIndex: 8,
		type: 'project'
	},
	{
		name: 'TMP-Unit 2 Quiz',
		description: 'Assessment covering lists, dictionaries, sets, tuples, and basic numpy operations.',
		link: 'unit-2-quiz',
		uuid: 'd4e5f6g7-h8i9-0123-defg-hi4567890123',
		startClassIndex: 7,
		endClassIndex: 8,
		type: 'quiz'
	},
	{
		name: 'TMP-Text Statistics Analyzer',
		description: 'Build a tool that reads text input and uses functions to calculate word count, sentence count, reading time, most common words, and readability scores.',
		link: 'text-analyzer',
		uuid: 'e5f6g7h8-i9j0-1234-efgh-ij5678901234',
		startClassIndex: 8,
		endClassIndex: 11,
		type: 'homework'
	},
	{
		name: 'TMP-Personal Expense Tracker',
		description: 'Create a program that reads/writes expense data to CSV files, categorizes spending, generates monthly reports, and visualizes spending patterns with charts.',
		link: 'expense-tracker',
		uuid: 'f6g7h8i9-j0k1-2345-fghi-jk6789012345',
		startClassIndex: 10,
		endClassIndex: 13,
		type: 'project'
	},
	{
		name: 'TMP-Unit 4 Quiz',
		description: 'Assessment covering file I/O, CSV/JSON handling, pandas basics, and file system operations.',
		link: 'unit-4-quiz',
		uuid: 'g7h8i9j0-k1l2-3456-ghij-kl7890123456',
		startClassIndex: 11,
		endClassIndex: 12,
		type: 'quiz'
	},
	{
		name: 'TMP-Command-Line Todo Manager',
		description: 'Develop a CLI todo list application with argparse that supports adding, completing, listing, and filtering tasks. Package it as an installable tool.',
		link: 'cli-todo-manager',
		uuid: 'h8i9j0k1-l2m3-4567-hijk-lm8901234567',
		startClassIndex: 12,
		endClassIndex: 15,
		type: 'project'
	},
	{
		name: 'TMP-Final Project Proposal',
		description: 'Submit a detailed proposal for your final project, including objectives, technologies to be used, timeline, and expected outcomes.',
		link: 'final-project-proposal',
		uuid: 'i9j0k1l2-m3n4-5678-ijkl-mn9012345678',
		startClassIndex: 13,
		endClassIndex: 15,
		type: 'homework'
	},
	{
		name: 'TMP-Final Project',
		description: 'Complete a comprehensive Python project that integrates multiple concepts from the course. Must include data processing, file I/O, and either a CLI or GUI interface.',
		link: 'final-project',
		uuid: 'j0k1l2m3-n4o5-6789-jklm-no0123456789',
		startClassIndex: 14,
		endClassIndex: 19,
		type: 'project'
	},
	{
		name: 'TMP-Code Optimization Exercise',
		description: 'Refactor provided code using advanced Python features like list comprehensions, generators, and decorators to improve performance and readability.',
		link: 'code-optimization',
		uuid: 'k1l2m3n4-o5p6-7890-klmn-op1234567890',
		startClassIndex: 17,
		endClassIndex: 19,
		type: 'exercise'
	}
];

export const classSessions: ClassSessionInfo[] = [
	// February
	{
		startTime: scheduleDates[0],
		endTime: new Date(scheduleDates[0].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 0,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[1],
		endTime: new Date(scheduleDates[1].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 0,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[2],
		endTime: new Date(scheduleDates[2].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 0,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[3],
		endTime: new Date(scheduleDates[3].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 1,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[4],
		endTime: new Date(scheduleDates[4].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 1,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[5],
		endTime: new Date(scheduleDates[5].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 2,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[6],
		endTime: new Date(scheduleDates[6].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 2,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[7],
		endTime: new Date(scheduleDates[7].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 2,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[8],
		endTime: new Date(scheduleDates[8].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 3,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[9],
		endTime: new Date(scheduleDates[9].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 3,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[10],
		endTime: new Date(scheduleDates[10].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 4,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[11],
		endTime: new Date(scheduleDates[11].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 4,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[12],
		endTime: new Date(scheduleDates[12].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 5,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[13],
		endTime: new Date(scheduleDates[13].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 5,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[14],
		endTime: new Date(scheduleDates[14].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 6,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[15],
		endTime: new Date(scheduleDates[15].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 6,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	// April
	{
		startTime: scheduleDates[16],
		endTime: new Date(scheduleDates[16].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 6,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[17],
		endTime: new Date(scheduleDates[17].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 7,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[18],
		endTime: new Date(scheduleDates[18].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 7,
		assignmentsDue: [],
		assignmentsAssigned: []
	},
	{
		startTime: scheduleDates[19],
		endTime: new Date(scheduleDates[19].getTime() + 2 * 60 * 60 * 1000),
		unitNumber: 7,
		assignmentsDue: [],
		assignmentsAssigned: []
	}
];

assignments.forEach((assignment) => {
	classSessions[assignment.endClassIndex].assignmentsDue.push(assignment);
	const unitNum = classSessions[assignment.endClassIndex].unitNumber;
	if (units[unitNum]) {
		units[unitNum].assignmentsDue?.push(assignment);
	}
	classSessions[assignment.startClassIndex].assignmentsAssigned.push(assignment);
	const startUnitNum = classSessions[assignment.startClassIndex].unitNumber;
	if (units[startUnitNum]) {
		units[startUnitNum].assignmentsAssigned?.push(assignment);
	}
});
	
lectureList.forEach((lecturePair) => {
	const classIndex = lecturePair.classNumber;
	if (classIndex !== undefined && classSessions[classIndex]) {
		if (!classSessions[classIndex].lecture) {
			classSessions[classIndex].lecture = [];
		}
		classSessions[classIndex].lecture?.push(lecturePair);
	}
});

