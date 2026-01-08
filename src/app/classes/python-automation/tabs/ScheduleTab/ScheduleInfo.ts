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
};


export type ClassSessionInfo = {
	startTime: Date;
	endTime: Date;
	unitNumber: number;
	assignmentsDue: AssignmentInfo[];
	assignmentsAssigned: AssignmentInfo[];
	lecture?: LecturePair;
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
		link: 'intro-survey',//'https://forms.gle/your-survey-link',
		uuid: 'z9y8x7w6-v5u4-3210-zyxw-v9876543210ab',
		startClassIndex: 0,
		endClassIndex: 1,
		type: 'survey'
	},
	{
		name: 'Setup Python Environment',
		description: 'Install Python 3.x and set up a virtual environment using venv.',
		link: 'setup-python-environment',//'https://realpython.com/python-virtual-environments-a-primer/',
		uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		startClassIndex: 0,
		endClassIndex: 3,
		type: 'exercise'
	},
	{
		name: 'Basic Variables and Operators',
		description: 'Practice creating variables and using arithmetic operators in Python.',
		link: 'basic-variables-and-operators',//'https://www.python.org/doc/essays/blurb/',
		uuid: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
		startClassIndex: 1,
		endClassIndex: 4,
		type: 'exercise'
	},
	{
		name: 'Lists and Tuples Exercise',
		description: 'Implement data structures using lists and tuples with examples.',
		link: 'lists-and-tuples-exercise',//'https://docs.python.org/3/tutorial/datastructures.html',
		uuid: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
		startClassIndex: 5,
		endClassIndex: 8,
		type: 'exercise'
	},
	{
		name: 'Control Flow Practice',
		description: 'Write scripts with if statements and loops.',
		link: 'control-flow-practice',//'https://realpython.com/python-conditional-statements/',
		uuid: 'd4e5f6g7-h8i9-0123-def0-456789012345',
		startClassIndex: 9,
		endClassIndex: 12,
		type: 'exercise'
	},
	{
		name: 'File I/O Project',
		description: 'Create a program that reads and writes to files.',
		link: 'file-io-project',//'https://docs.python.org/3/tutorial/inputoutput.html',
		uuid: 'e5f6g7h8-i9j0-1234-ef01-567890123456',
		startClassIndex: 13,
		endClassIndex: 16,
		type: 'exercise'
	},
	{
		name: 'Dictionary and Set Manipulation',
		description: 'Work with dictionaries and sets to manage complex data.',
		link: 'dictionary-and-set-manipulation',//'https://realpython.com/python-dicts/',
		uuid: 'f6g7h8i9-j0k1-2345-fg12-678901234567',
		startClassIndex: 6,
		endClassIndex: 9,
		type: 'exercise'
	},
	{
		name: 'Function Definition Challenge',
		description: 'Define and call functions with various parameters and return types.',
		link: 'function-definition-challenge',//'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
		uuid: 'g7h8i9j0-k1l2-3456-gh23-789012345678',
		startClassIndex: 10,
		endClassIndex: 13,
		type: 'exercise'
	},
	{
		name: 'Exception Handling Exercise',
		description: 'Implement try/except blocks to handle errors gracefully.',
		link: 'exception-handling-exercise',//'https://realpython.com/python-exceptions/',
		uuid: 'h8i9j0k1-l2m3-4567-hi34-890123456789',
		startClassIndex: 14,
		endClassIndex: 17,
		type: 'exercise'
	},
	{
		name: 'Package Management with pip',
		description: 'Install and manage Python packages using pip in a virtual environment.',
		link: 'package-management-with-pip',//'https://realpython.com/what-is-pip/',
		uuid: 'i9j0k1l2-m3n4-5678-ij45-901234567890',
		startClassIndex: 15,
		endClassIndex: 18,
		type: 'exercise'
	},
	{
		name: 'Final Project - CLI Tool',
		description: 'Build a command-line tool using argparse that integrates all learned concepts.',
		link: 'final-project-cli-tool',//'https://docs.python.org/3/howto/argparse.html',
		uuid: 'j0k1l2m3-n4o5-6789-jk56-012345678901',
		startClassIndex: 17,
		endClassIndex: 19,
		type: 'exercise'
	},
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
		classSessions[classIndex].lecture = lecturePair;
	}
});

