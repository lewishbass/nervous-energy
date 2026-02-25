'use client';

import ExerciseOverview, { type QuestionData } from '../../exercise-components/ExerciseOverview';

const questions: QuestionData[] = [
	{
		id: 'q1',
		title: 'Q1 - Intro To Functions',
		description: 'Define simple functions with parameters, return values, and call them.',
		parts: [
			{
				id: 'p1',
				title: 'Define and Call',
				objectives: [
					'Define a function named `increment` that takes one parameter and returns that parameter plus 1',
					'Call your function and store the results in a variable',
				],
				mechanics: [
					'Use the `def` keyword to name your function',
					'Input parameters are listed in parentheses after the function name',
					'Use the `return` keyword to return a value from a function',
					'The indented block after `def` ending with `:` tells Python what is in the function',
				],
				hints: [
					'A function is a re-usable block of code that takes variables and returns results',
				],
				codeExamples: [
					`def double(a): # function named double that takes one parameter a
    output = a * 2 # multiply a by 2 and store in variable output
    return output # return the value of output
b = double(5) # passes 5 to our function, and stores the returned value in b`,
				],
			},
			{
				id: 'p2',
				title: 'Test Cases',
				objectives: [
					'Implement the function `foobar` that passes the provided test cases',
				],
				mechanics: [
					'Test cases verify that your function works correctly by checking outputs against expected values',
					'Tests focus on edge cases, where weird values might break your function',
					'This is how programs are graded in this class and the real world',
				],
			},
			{
				id: 'p3',
				title: 'Multiple Parameters',
				objectives: [
					'Create a function named `swap` that takes two parameters and returns them in reverse order',
					'e.g. `swap(1, 2)` should return `2, 1`',
				],
				mechanics: [
					'Functions can take and return multiple values',
					'Inside the parentheses after `def`, list multiple parameters separated by commas',
					'List multiple variables after `return` separated by commas, and catch the output in multiple variables',
				],
				codeExamples: [
					`def math_ops(a, b): # this function requires both a and b to work
  sum = a + b
  diff = a - b
  return sum, diff

result_sum, result_diff = math_ops(5, 3) # call the function, and catch both outputs`,
				],
			},
		],
	},
	{
		id: 'q2',
		title: 'Q2 - Test Cases',
		description: 'Write functions and test cases, verify function behavior and correctness.',
		parts: [
			{
				id: 'p1',
				title: 'Pass some tests',
				objectives: [
					"Create a function `aRatio` that returns the fraction of letters in a string that are 'a'",
				],
				mechanics: [
					"Test cases are used to verify that a program behaves correctly under specific conditions",
					"Most questions won't explicitly tell you what cases you have to pass - it is up to you to imagine where your program might fail and make it robust",
				],
			},
			{
				id: 'p2',
				title: 'Write some tests',
				objectives: [
					'Given the function `genEmail`, finish writing the test cases so it passes them all',
				],
			},
			{
				id: 'p3',
				title: 'Find a bug',
				objectives: [
					'The function `getGrade` contains a bug - write a test case that finds this bug and returns false',
				],
				mechanics: [
					'When designing test cases, it is important to cover both common cases and edge cases',
				],
			},
		],
	},
	{
		id: 'q3',
		title: 'Q3 - Making and Editing Arrays',
		description: 'Initialize arrays with values, modify elements, retrieve values.',
		parts: [
			{
				id: 'p1',
				title: 'Create Arrays',
				objectives: [
					'Create three arrays, each with at least 3 elements:',
					'`int_array` - containing integers',
					'`float_array` - containing floats (e.g. 1.5, 2.0)',
					'`string_array` - containing strings',
				],
				mechanics: [
					'An array (called a `list` in Python) is an ordered collection of values',
					'Create a list using square brackets `[]` with values separated by commas',
				],
				codeExamples: [
					`my_numbers = [1, 2, 3, 4, 5]
my_words = ["hello", "world"]`,
				],
			},
			{
				id: 'p2',
				title: 'Modify Arrays',
				objectives: [
					'Starting from `int_array`, perform the following operations in order:',
					'Set the second element to 10',
					'Append 8 to the end',
					'Reverse the array',
					'Extend the array with [1, 2, 3]',
				],
				mechanics: [
					'Lists can be modified after creation - change elements, add new ones, reverse the order, and more',
				],
				codeExamples: [
					`nums = [1, 2, 3]
nums[0] = 99       # set first element to 99 → [99, 2, 3]
nums.append(4)     # add 4 to the end → [99, 2, 3, 4]
nums.reverse()     # reverse in place → [4, 3, 2, 99]
nums.extend([7,8]) # add multiple items → [4, 3, 2, 99, 7, 8]`,
				],
			},
			{
				id: 'p3',
				title: 'Retrieve Values',
				objectives: [
					'Retrieve the third element into `third_element`',
					'Retrieve the first 5 elements using a slice into `first_five`',
					'Pop the last item into `popped_item`',
				],
				mechanics: [
					'You can access elements by index, slice a sub-list, or remove items with `.pop()`',
				],
				codeExamples: [
					`nums = [10, 20, 30, 40, 50, 60]
element = nums[2]       # get third element → 30
first_three = nums[:3]  # slice first 3 → [10, 20, 30]
last = nums.pop()       # remove & return last → 60`,
				],
			},
			{
				id: 'p4',
				title: 'Loop Over an Array',
				objectives: [
					'Use a `for` loop to print every element in `int_array`',
				],
				mechanics: [
					'A `for` loop lets you visit each element in a list one at a time',
				],
				codeExamples: [
					`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)  # prints each fruit on its own line`,
				],
			},
		],
	},
	{
		id: 'q4',
		title: 'Q4 - If Statements',
		description: 'Switch between two different code paths using if statements.',
		parts: [
			{
				id: 'p1',
				title: 'If / Else',
				objectives: [
					'Create a function named `whatToWear` that takes in a variable `temp`',
					'If `temp` is greater than 45, print "shorts"',
					'Otherwise, print "pants"',
				],
				mechanics: [
					'If statements take a boolean value and execute the following block of code only if it is true',
					'When followed by an `else` statement, the else block executes if the condition is false',
				],
				codeExamples: [
					`oxygen_level = 15
if oxygen_level > 19.5 and oxygen_level < 23.5:
    print("Air is safe")
else:
    print("Time to fix your air supply!")`,
				],
			},
			{
				id: 'p2',
				title: 'Modifying Variables with If',
				objectives: [
					'Create a function named `doubleOrHalf` that takes in a variable `value` and a string `action`',
					'If `action` is "double", double the value',
					'If `action` is "half", halve the value',
					'Return the result',
				],
				mechanics: [
					'Code executed inside the if block can modify variables',
				],
				codeExamples: [
					`if oxygen_level < 19.5:
    oxygen_level += 0.1  # PUMP IN SOME MORE AIR`,
				],
			},
			{
				id: 'p3',
				title: 'If / Elif / Else',
				objectives: [
					'Create a function named `categorizeNumber` that takes in a variable `num`',
					'If `num` < 0, return "negative"',
					'If `num` > 0, return "positive"',
					'Otherwise, return "zero"',
				],
				mechanics: [
					'`elif` statements act like else (executing when a previous if is false) but also check their own conditions',
				],
				hints: [
					'You can put return statements inside if blocks - they will exit the function immediately',
				],
				codeExamples: [
					`if atmospheres < 0.47:
    spaceship.warn("Low pressure detected, pumping in air")
elif atmospheres > 2.0:
    spaceship.warn("Critical pressure detected, emergency venting!")
else:
    spaceship.warn("pressure is normal")`,
				],
			},
			{
				id: 'p4',
				title: 'Inline If',
				objectives: [
					'Create a function named `smallerNumber` that takes in variables `a` and `b`',
					'Returns the smaller number using an inline if statement',
				],
				mechanics: [
					'Inline if statements use the pattern `value_if_true if condition else value_if_false` to assign a value in a single line',
				],
				codeExamples: [
					`air_locks = "sealed" if in_space else "open"`,
				],
			},
		],
	},
	{
		id: 'q5',
		title: 'Q5 - For Loops',
		description: 'Use for loops to traverse array elements.',
		parts: [
			{ id: 'p1', title: 'Iterate Over a Range', objectives: ['Iterate over a range, array and string printing each element'] },
			{ id: 'p2', title: 'Break', objectives: ['Use break to stop a for loop when a condition is met'] },
			{ id: 'p3', title: 'Continue', objectives: ['Skip some iterations of a loop using continue'] },
			{ id: 'p4', title: 'Count Elements', objectives: ['Count the number of times a specific element appears in an array'] },
		],
	},
	{
		id: 'q6',
		title: 'Q6 - While Loops',
		description: 'Use while loops for condition-based iteration.',
		parts: [
			{ id: 'p1', title: 'Basic While Loop', objectives: [] },
			{ id: 'p2', title: 'While with Break', objectives: [] },
			{ id: 'p3', title: 'While with Continue', objectives: [] },
			{ id: 'p4', title: 'Nested Loops', objectives: [] },
		],
	},
	{
		id: 'q7',
		title: 'Q7 - Sums, Min and Max, Fourier',
		description: 'Implement algorithms to perform array operations.',
		parts: [
			{ id: 'p1', title: 'Sum of Array', objectives: [] },
			{ id: 'p2', title: 'Min and Max', objectives: [] },
			{ id: 'p3', title: 'Average', objectives: [] },
			{ id: 'p4', title: 'Fourier Series', objectives: [] },
		],
	},
	{
		id: 'q8',
		title: 'Q8 - Review',
		description: 'Create arrays, loop over the elements, and apply all concepts learned.',
		parts: [
			{ id: 'p1', title: 'Create and Modify Arrays', objectives: [] },
			{ id: 'p2', title: 'Loop and Transform', objectives: [] },
			{ id: 'p3', title: 'Functions with Arrays', objectives: [] },
			{ id: 'p4', title: 'Putting It All Together', objectives: [] },
		],
	},
];

export default function OverviewPage() {
	return (
		<ExerciseOverview
			classId="python-automation"
			assignmentId="functions-arrays-loops"
			assignmentPath="/classes/python-automation/exercises/functions-arrays-loops"
			questions={questions}
			title="Ex2: Functions, Arrays & Loops - Overview"
			subtitle="Python for Automation and Scripting"
			unitLabel="Unit 1: Core Programming Concepts"
			backgroundSeed={10}
		/>
	);
}

