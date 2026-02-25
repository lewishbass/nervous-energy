'use client';

import ExerciseOverview, { type QuestionData } from '../../exercise-components/ExerciseOverview';

const questions: QuestionData[] = [
  {
    id: 'q1',
    title: 'Q1 - Variable Assignment',
    description: 'Practice basic variable assignment in Python by assigning different types of values to variables.',
    parts: [
      {
        id: 'p1',
        title: 'Assigning Ints',
        objectives: ['Use the = operator to assign the integer value 42 to a variable named my_number.'],
        mechanics: ['The = operator takes a value on the right and assigns it to a variable on the left.'],
        codeExamples: ['variable_name = 5318008'],
      },
      {
        id: 'p2',
        title: 'Assigning Strings',
        objectives: ['Assign the string value "Hello World" to a variable named my_string.'],
        mechanics: ['Strings are sequences of characters enclosed in single or double quotes.'],
        codeExamples: ['example_variable = "This is a string"'],
      },
      {
        id: 'p3',
        title: 'Assigning Booleans',
        objectives: ['Assign the boolean value True to a variable named my_bool.'],
        mechanics: ['In Python, boolean values are capitalized: True and False.'],
        codeExamples: ['is_python_fun = False'],
      },
    ],
  },
  {
    id: 'q2',
    title: 'Q2 - Integer Operations',
    description: 'Perform simple operations on integer variables.',
    parts: [
      {
        id: 'p1',
        title: 'Basic Math Operations',
        objectives: [
          'Create two integer variables a and b.',
          'Create sum, product, and difference variables using +, *, -.',
        ],
        mechanics: ['Arithmetic operators take two operands and return the result.'],
        hints: ['Experiment with different values and see how it affects the results in the right panel.'],
        codeExamples: ['a = 1 + 3 # result 4 is stored in a'],
      },
      {
        id: 'p2',
        title: 'Printing to Console',
        objectives: [
          'Create a string variable message and an integer variable number.',
          'Use print() to output both variables to the console.',
        ],
        mechanics: ['The print() function outputs values or variables to the console. Separate multiple values with commas.'],
        codeExamples: ['name = "Alice"\nage = 30\nprint("Name:", name, "Age:", age)'],
      },
      {
        id: 'p3',
        title: 'Type Conversion',
        objectives: [
          'Convert num_str to an integer using int() and store in num_int.',
          'Convert age to a string using str() and store in age_str.',
        ],
        mechanics: ['int() converts to integer, str() converts to string.'],
        hints: ['Try setting num_str to a decimal value like "42.5" and see what error occurs.'],
        codeExamples: ['num_int = int("42") # convert the string "42" to the number 42'],
      },
    ],
  },
  {
    id: 'q3',
    title: 'Q3 - String Operations',
    description: 'Concatenate strings, convert case, trim whitespace, and check substrings.',
    parts: [
      {
        id: 'p1',
        title: 'String Concatenation',
        objectives: [
          'Create first_name and last_name string variables.',
          'Use the + operator to concatenate them with a space in between and store in full_name.',
        ],
        mechanics: ['The + operator concatenates strings when applied to string operands.'],
        codeExamples: ['name = "Lewis"\ngreeting = "Hello, " + name + ", Welcome!"\nprint(greeting) # Output: Hello, Lewis, Welcome!'],
      },
      {
        id: 'p2',
        title: 'Case Conversion',
        objectives: [
          'Use .upper() to convert message to uppercase and store in upper_message.',
          'Use .lower() to convert message to lowercase and store in lower_message.',
        ],
        mechanics: ['Strings have built-in methods for common operations, called using dot notation.'],
        codeExamples: ['text = "Hello World"\ncount = text.count("l") # use the count method that belongs to strings'],
      },
      {
        id: 'p3',
        title: 'Trimming Whitespace',
        objectives: [
          'Use the .strip() method to remove whitespace from untrimmed and store in trimmed.',
        ],
        mechanics: ['Whitespace characters (spaces, tabs, newlines) are often accidentally included and can cause errors.'],
        hints: ['Try using .lstrip() and .rstrip() to remove whitespace from the left or right.'],
      },
      {
        id: 'p4',
        title: 'Substring Check',
        objectives: [
          'Use the in operator to check if "Python" is in the sentence and store in has_python.',
          'Check if "java" is in the sentence and store in has_java.',
        ],
        mechanics: ['The in operator checks if a substring exists within a string.'],
        hints: ['"Python" and "python" are different strings - in is case-sensitive!'],
        codeExamples: ['is_gmail = "gmail.com" in "test_user@gmail.com"'],
      },
    ],
  },
  {
    id: 'q4',
    title: 'Q4 - Combining String Operations',
    description: 'Count characters, vowels, and calculate string fractions.',
    parts: [
      {
        id: 'p1',
        title: 'Character Count',
        objectives: ['Use len() to count the characters in text and store in char_count.'],
        mechanics: ['len() returns the number of items (or characters) in many types of objects.'],
        codeExamples: ['length = len("Hello")\nprint(length)  # Output: 5'],
      },
      {
        id: 'p2',
        title: 'Character Occurrences',
        objectives: ['Use .count() to count how many times target_char appears in text and store in char_occurrences.'],
        mechanics: ['.count() counts how many times a substring or character appears in a string.'],
        codeExamples: ['how_excited = "!!!!!!!!".count("!") # 8'],
      },
      {
        id: 'p3',
        title: 'Counting Vowels',
        objectives: ['Count the total number of vowels (a, e, i, o, u - upper and lower case) in text and store in vowel_count.'],
        hints: ['Use .count() for each vowel and add the results together.'],
      },
      {
        id: 'p4',
        title: 'Vowel Fraction',
        objectives: ['Calculate the fraction of characters in text that are vowels and store in vowel_fraction as a float.'],
        hints: ['Use len() and combine what you learned in the previous parts.'],
      },
    ],
  },
  {
    id: 'q5',
    title: 'Q5 - Boolean Operations',
    description: 'Use AND, OR, and NOT operators to combine and negate boolean values.',
    parts: [
      {
        id: 'p1',
        title: 'AND Operator',
        objectives: ['Use the and operator to combine right_place and right_time and store in success.'],
        mechanics: ['The and operator returns True only if both values are True.'],
        hints: ['Change the values of right_place and right_time to see how and behaves.'],
        codeExamples: ['result = False and True # False'],
      },
      {
        id: 'p2',
        title: 'OR Operator',
        objectives: ['Use the or operator to combine has_umbrella and has_jacket and store in is_dry.'],
        mechanics: ['The or operator returns True if at least one value is True.'],
        hints: ['Change the values to see how or behaves.'],
        codeExamples: ['result = False or True # True'],
      },
      {
        id: 'p3',
        title: 'NOT Operator',
        objectives: ['Use the not operator to negate is_tall and store in is_short.'],
        mechanics: ['The not operator returns the opposite boolean value.'],
        codeExamples: ['result = not True # False'],
      },
      {
        id: 'p4',
        title: 'Combining Boolean Expressions',
        objectives: ['Combine booleans using (hungry and dinner_time) and not has_leftovers and store in need_to_cook.'],
        mechanics: ['Use parentheses to control the order of operations when combining multiple boolean operators.'],
      },
    ],
  },
  {
    id: 'q6',
    title: 'Q6 - Numerical Comparisons',
    description: 'Use comparison operators to compare numbers, strings, and check equality.',
    parts: [
      {
        id: 'p1',
        title: 'Comparing Numbers',
        objectives: [
          'Use < to set is_am to True when time is before noon.',
          'Use >= to set is_pm to True when time is noon or later.',
        ],
        mechanics: ['The comparison operators <, <=, >, >=, ==, and != compare values and return a boolean.'],
        codeExamples: ['5 < 10 # Less Than : True\n5 > 10 # Greater Than: False\n5 == 5 # Equals: True\n5 != 5 # Not Equals: False'],
      },
      {
        id: 'p2',
        title: 'Double Comparison',
        objectives: [
          'in_low_bracket - True if salary is $0 to $99,999.',
          'in_medium_bracket - True if salary is $100,000 to $249,999.',
          'in_high_bracket - True if salary is $250,000 or above.',
        ],
        mechanics: ['Comparisons can be combined with and / or to test if a number is inside a range.'],
        codeExamples: ['is_between = (x > 0) and (x < 10) # True if x is in (0, 10)'],
      },
      {
        id: 'p3',
        title: 'Comparing Strings',
        objectives: [
          'Set between_name1_and_name2 to True if new_name comes after name1 and before name2.',
          'Set between_name2_and_name3 to True if new_name comes after name2 and before name3.',
        ],
        mechanics: ['Comparison operators compare strings alphabetically, like their order in a dictionary.'],
        codeExamples: ['a_before_b = "apple" < "banana" # True'],
      },
      {
        id: 'p4',
        title: 'Equals and Not Equals',
        objectives: [
          'is_paid_in_full - True if paid equals due.',
          'is_underpaid - True if paid is less than due.',
          'is_overpaid - True if paid is more than due.',
          'needs_change - True if paid does not equal due.',
        ],
        mechanics: ['== checks equality, != checks inequality.'],
        hints: ['Change the paid variable to see how it affects the boolean values.'],
        codeExamples: ['5 == 5 # True\n5 == 10 # False\n5 != 5 # False\n5 != 10 # True'],
      },
    ],
  },
  {
    id: 'q7',
    title: 'Q7 - Binary and Hexadecimal',
    description: 'Convert numbers to binary and hexadecimal strings, and validate their formats.',
    parts: [
      {
        id: 'p1',
        title: 'Binary Conversion',
        objectives: ['Use bin() to convert number to a binary string and store in bin_string.'],
        mechanics: ['bin() takes a decimal integer and returns its binary representation as a string (e.g. \'0b1010\').'],
      },
      {
        id: 'p2',
        title: 'Validating a Binary String',
        objectives: [
          'Split bin_string into prefix (first 2 chars) and binary_part (rest).',
          'Set is_valid_binary to True only when prefix is \'0b\' and the rest contains only 0s and 1s.',
        ],
        hints: ['Use == to validate the prefix, and .count() to make sure the total count of binary characters equals the length of the binary part.'],
      },
      {
        id: 'p3',
        title: 'Hexadecimal Conversion',
        objectives: ['Use hex() to convert number to a hexadecimal string and store in hex_string.'],
        mechanics: ['hex() takes a decimal integer and returns its hexadecimal representation as a string (e.g. \'0x2a\').'],
      },
      {
        id: 'p4',
        title: 'Validating a Hexadecimal String',
        objectives: [
          'Split hex_string into prefix (first 2 chars) and hex_part (rest).',
          'Set is_valid_hex to True only when prefix is \'0x\' and the rest contains only valid hex characters.',
        ],
        hints: ['Convert to lowercase first with .lower(), then check each character is in \'0123456789abcdef\'.'],
      },
    ],
  },
  {
    id: 'q8',
    title: 'Q8 - Review',
    description: 'Perform simple operations with ints, floats, bools and strings.',
    parts: [
      {
        id: 'p1',
        title: 'Initializing Variables',
        objectives: [
          'Initialize at least 4 integer variables.',
          'Initialize at least 4 float variables.',
          'Initialize at least 4 boolean variables.',
          'Initialize at least 4 string variables.',
          'Use print() to display all of them.',
        ],
      },
      {
        id: 'p2',
        title: 'Arithmetic & String Operations',
        objectives: [
          'Perform arithmetic using *, /, +, -, and %.',
          'Apply .upper(), .lower(), .strip() and len() to a string.',
        ],
      },
      {
        id: 'p3',
        title: 'Boolean Operations',
        objectives: ['Use the boolean operators: and, or, and not.'],
      },
      {
        id: 'p4',
        title: 'Comparisons',
        objectives: ['Use all six comparison operators: >, <, >=, <=, ==, !=.'],
      },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <ExerciseOverview
      classId="python-automation"
      assignmentId="simple-coding-practice"
      assignmentPath="/classes/python-automation/exercises/simple-coding-practice"
      questions={questions}
      title="Ex1: Simple Coding Practice - Overview"
      subtitle="Python for Automation and Scripting"
      unitLabel="Unit 0: Foundations of Programming"
      backgroundSeed={0}
    />
  );
}
