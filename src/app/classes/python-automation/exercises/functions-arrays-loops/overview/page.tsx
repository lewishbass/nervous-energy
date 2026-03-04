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
				hints: [
					"Use the string's `.count('a')` method to get the count of 'a's",
					"Use `len()` to get the total number of characters in the string",
				],
			},
			{
				id: 'p2',
				title: 'Write some tests',
				objectives: [
					'Given the function `genEmail`, finish writing the test cases so it passes them all',
				],
				mechanics: [
					"Each test case uses the `==` operator to compare the actual result of the function call with the expected value",
				],
				hints: [
					"The expected result of `genEmail('alice', 'example.com')` is `'alice@example.com'`",
				],
				codeExamples: [
					`genEmail('john', 'aol.com') == 'john@aol.com'`,
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
				hints: [
					'Find which input triggers the bug, and write a test case using that input and its CORRECT output',
					"The function returns 'D' for any score less than 60, but it should return 'F'",
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
					`my_numbers = [1, 2, 3, 4, 5]\nmy_words = ["hello", "world"]`,
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
    spaceship.status("pressure is normal")`,
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
			{
				id: 'p1',
				title: 'For Loops',
				objectives: [
					'Create 3 `for` loops, each printing every element in an array, a string, and a range',
				],
				mechanics: [
					'Strings, arrays and ranges all automatically feed `for` loops their elements one at a time',
				],
				codeExamples: [
					`for c in "ymca":\n    print(c, end='-')  # prints y-m-c-a-`,
				],
			},
			{
				id: 'p2',
				title: 'Break',
				objectives: [
					'Create a function `duckGame` that takes an array and returns all elements up to and including "goose"',
				],
				mechanics: [
					'`break` statements immediately terminate a loop, skipping the rest of the block and any remaining iterations',
				],
				hints: [
					'Create an empty list `result = []`, and append each element to it using the list\'s `.append()` method',
					'Append each element to the result, and then check if it\'s "goose". If so, break',
				],
				codeExamples: [
					`a = [1, 2, 3, 4, 5]
for num in a:
    if num == 4:
        break
    print(num)
# 1, 2, 3`,
				],
			},
			{
				id: 'p3',
				title: 'Count Ducks',
				objectives: [
					'Create a function `countDucks` that returns the number of times "duck" appears in an array',
				],
				hints: [
					'Create a counter variable `count = 0`, and increment it using `count += 1`',
				],
			},
			{
				id: 'p4',
				title: 'Continue',
				objectives: [
					'Create a function `clip` that raises any number below `min_val` up to `min_val`, using `continue` to skip elements that don\'t need clipping',
				],
				mechanics: [
					'When `continue` is called, it skips the rest of the current block but continues with the next iteration',
				],
				hints: [
					'Use `for i in range(len(numbers)):` to loop by index so you can modify elements in place',
					'Check if each number should be skipped with `if numbers[i] >= min_val:` and `continue` to skip it',
				],
				codeExamples: [
					`for p in pokemon:
    if p.type() != "fire":
        continue  # skip non-fire pokemon
    p.addToBackpack()`,
				],
			},
		],
	},
	{
		id: 'q6',
		title: 'Q6 - While Loops',
		description: 'Use while loops for condition-based iteration.',
		parts: [
			{
				id: 'p1',
				title: 'Powers of Two',
				objectives: [
					'Create a function `powersOfTwo` that prints all powers of two less than `maxValue`',
				],
				mechanics: [
					'While loops use the syntax `while condition:` and execute the block until the condition is false',
				],
				hints: [
					'Start with `n = 1` then `print(n)` and multiply n by 2 each loop',
					'Use `while n < maxValue:` to stop when n exceeds the max value',
				],
				codeExamples: [
					`i = 0\nwhile i < 5:\n    print(i)\n    i += 1\n# 0 1 2 3 4`,
				],
			},
			{
				id: 'p2',
				title: 'TakeOff',
				objectives: [
					'Create a function `takeOff` that accelerates a `SpaceShip` object until it runs out of fuel',
				],
				mechanics: [
					'The `SpaceShip` class has `.speed`, `.fuel`, and `.accelerate()` method',
				],
				hints: [
					'Use `while spaceship.fuel > 0:` to check fuel level',
				],
			},
			{
				id: 'p3',
				title: 'Event Loop',
				objectives: [
					'Create a function `programLoop` that prints events from a `UserInput` object until the "escape" event',
				],
				mechanics: [
					'Use `while True:` to create an indefinite loop and `break` to exit when needed',
					'The `UserInput` class returns events with its `.getEvent()` method',
				],
				hints: [
					'Use `if event == "escape":` to check for the escape event and `break` to exit',
					'Check if you should break AFTER you print the event',
				],
			},
			{
				id: 'p4',
				title: 'Record Local Requests',
				objectives: [
					'Create a function `recordLocalRequests` that collects local IPs (starting with "10.0") from a `WebPort` until "10.0.0.67" is received',
				],
				mechanics: [
					'The `WebPort` class returns IP addresses with its `.listen()` method',
				],
				hints: [
					'Create an empty list `localRequests = []` and append local requests using `.append()`',
					'Use the string\'s `.startswith("10.0")` method to check if an IP is local',
				],
			},
		],
	},
	{
		id: 'q7',
		title: 'Q7 - Sums, Min and Max, Fibonacci',
		description: 'Implement algorithms to perform array operations.',
		parts: [
			{
				id: 'p1',
				title: 'Sum Array',
				objectives: [
					'Create a function `sumArray` that returns the sum of the elements in an array using a `for` loop',
				],
				hints: [
					'Use `for a in arr:` to iterate through each element',
					'Create a `total = 0` variable, and add each element to total inside the loop',
				],
			},
			{
				id: 'p2',
				title: 'Min Array',
				objectives: [
					'Create a function `minArray` that returns the minimum element in a non-empty array using a `for` loop',
				],
				hints: [
					'Create a `min_value` variable to track the minimum value so far',
					'Initialize `min_value` to the first element with `min_value = arr[0]`',
				],
			},
			{
				id: 'p3',
				title: 'Max Array',
				objectives: [
					'Create a function `maxArray` that returns the maximum element in a non-empty array using a `for` loop',
				],
				hints: [
					'This is very similar to Min Array — just change the comparison direction',
				],
			},
			{
				id: 'p4',
				title: 'Fibonacci',
				objectives: [
					'Create a function `fibonacci` that returns a list containing the first `n` terms of the Fibonacci sequence',
				],
				mechanics: [
					'The Fibonacci sequence starts with 0, 1 and each subsequent number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8...',
				],
				hints: [
					'Use `arr[-1]` and `arr[-2]` to access the last two elements of the array',
					'Start with `arr = [0, 1]` and use a `for` loop to append new Fibonacci numbers',
					'Handle the edge cases for n=0 and n=1 before the loop with early `return` statements',
				],
			},
		],
	},
	{
		id: 'q8',
		title: 'Q8 - Review',
		description: 'Create arrays, loop over the elements, and apply all concepts learned.',
		parts: [
			{
				id: 'p1',
				title: 'Find the bug',
				objectives: [
					'The function `addFirstThree` contains a bug - write a test case that finds this bug and returns false',
				],
				mechanics: [
					'Test cases check a function\'s output against its expected output to verify correctness',
				],
				hints: [
					'Find which input triggers the bug, and write a test case using that input and its CORRECT output',
					'The function exits too early on arrays that are only 3 elements long',
				],
				codeExamples: [
					`def add(a, b):\n    return a + b\ntest1 = ( add(2, 3) == 5 )\ntest2 = ( add(-1, 1) == 0 )`,
				],
			},
			{
				id: 'p2',
				title: 'Number Stats',
				objectives: [
					'Create a function `numStats` that prints whether a number is even/odd, positive/negative/zero, integer/decimal, and a multiple of 5 or not',
				],
				mechanics: [
					'`if` statements execute a block of code if a condition is true; `else` executes if the condition is false',
				],
				hints: [
					'Use `n % 2 == 0` to check even, `n % 5 == 0` to check multiples of 5',
					'Use `n == int(n)` to check if a number is an integer',
				],
				codeExamples: [
					`if n % 2 == 0:\n    print("even")\nelse:\n    print("odd")`,
				],
			},
			{
				id: 'p3',
				title: 'Weighted Sum',
				objectives: [
					'Create a function `weightedSum` that returns the sum of each element multiplied by its index, using `enumerate`',
				],
				mechanics: [
					'The `enumerate` function can be used to get both the index and element while looping',
				],
				hints: [
					'Create a `total = 0` variable, and add `index * element` to it in each iteration',
					'Use `for index, element in enumerate(arr):` to loop with both index and value',
				],
				codeExamples: [
					`for index, element in enumerate(["zero", "one", "two"]):\n    print(index, element)\n# 0 zero\n# 1 one\n# 2 two`,
				],
			},
			{
				id: 'p4',
				title: 'Fibonacci Greater Than',
				objectives: [
					'Create a function `fibbGTT` that returns the first Fibonacci number greater than `n` using a `while` loop',
				],
				mechanics: [
					'While loops execute until a condition is false',
				],
				hints: [
					'Start with `a, b = 0, 1` and use `a, b = b, a + b` to generate the next Fibonacci number',
					'Use `while b <= n:` to keep generating until b exceeds n, then return `b`',
				],
			},
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
			unitLabel="Unit 2: Flow Control"
			backgroundSeed={10}
		/>
	);
}

