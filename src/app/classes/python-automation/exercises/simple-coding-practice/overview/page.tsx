'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getQuestionSubmissionStatus } from '../../exercise-components/ExerciseUtils';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import BackToAssignment from '../../exercise-components/BackToAssignment';
import { CodeBlock } from '@/components/CodeBlock';
import { FaCheckCircle, FaTimesCircle, FaCircle, FaPrint } from 'react-icons/fa';
import './overview.css';
import { copyToClipboard } from '@/scripts/clipboard';

const className_val = 'python-automation';
const assignmentName = 'simple-coding-practice';
const assignmentPath = '/classes/python-automation/exercises/simple-coding-practice';

// ─── Question & Part Data ────────────────────────────────────────────────────

type PartData = {
  id: string;
  title: string;
  objectives: string[];
  mechanics?: string[];
  hints?: string[];
  codeExamples?: string[];
};

type QuestionData = {
  id: string;
  title: string;
  description: string;
  parts: PartData[];
};

const questions: QuestionData[] = [
  {
    id: 'q1',
    title: 'Q1 — Variable Assignment',
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
    title: 'Q2 — Integer Operations',
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
    title: 'Q3 — String Operations',
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
        hints: ['"Python" and "python" are different strings — in is case-sensitive!'],
        codeExamples: ['is_gmail = "gmail.com" in "test_user@gmail.com"'],
      },
    ],
  },
  {
    id: 'q4',
    title: 'Q4 — Combining String Operations',
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
        objectives: ['Count the total number of vowels (a, e, i, o, u — upper and lower case) in text and store in vowel_count.'],
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
    title: 'Q5 — Boolean Operations',
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
    title: 'Q6 — Numerical Comparisons',
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
          'in_low_bracket — True if salary is $0 to $99,999.',
          'in_medium_bracket — True if salary is $100,000 to $249,999.',
          'in_high_bracket — True if salary is $250,000 or above.',
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
          'is_paid_in_full — True if paid equals due.',
          'is_underpaid — True if paid is less than due.',
          'is_overpaid — True if paid is more than due.',
          'needs_change — True if paid does not equal due.',
        ],
        mechanics: ['== checks equality, != checks inequality.'],
        hints: ['Change the paid variable to see how it affects the boolean values.'],
        codeExamples: ['5 == 5 # True\n5 == 10 # False\n5 != 5 # False\n5 != 10 # True'],
      },
    ],
  },
  {
    id: 'q7',
    title: 'Q7 — Binary and Hexadecimal',
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
    title: 'Q8 — Review',
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status: string | undefined): string {
  switch (status) {
    case 'passed': return 'text-green-500 dark:text-green-400';
    case 'failed': return 'text-red-500 dark:text-red-400';
    default: return 'tc3';
  }
}

function statusIcon(status: string | undefined) {
  switch (status) {
    case 'passed': return <FaCheckCircle className="text-green-500 dark:text-green-400 inline mr-1.5 mb-1" />;
    case 'failed': return <FaTimesCircle className="text-red-500   dark:text-red-400   inline mr-1.5 mb-1" />;
    default: return       <FaCircle      className="text-gray-400  dark:text-gray-600  inline mr-1.5 mb-1 text-xs" />;
  }
}

function statusBorder(status: string | undefined): string {
  switch (status) {
    case 'passed': return 'border-green-400 dark:border-green-600';
    case 'failed': return 'border-red-400 dark:border-red-600';
    default: return 'border-gray-300 dark:border-gray-700';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const router = useRouter();
  const { isLoggedIn, username, token } = useAuth();
  const [submissionStates, setSubmissionStates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [showMechanics, setShowMechanics] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showCodeExamples, setShowCodeExamples] = useState(false);

  const allPartNames = questions.flatMap(q =>
    q.parts.map(p => `${q.id}_${p.id}`)
  );

  useEffect(() => {
    if (!isLoggedIn || !username || !token) {
      setLoading(false);
      return;
    }
    getQuestionSubmissionStatus(username, token, className_val, assignmentName, allPartNames)
      .then(states => {
        setSubmissionStates(states);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isLoggedIn, username, token]);

  const getPartStatus = (qId: string, pId: string): string | undefined => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.resultStatus) return undefined;
    return s.resultStatus;
  };

  const getPartCode = (qId: string, pId: string): string | null => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.code) return null;
    return s.code;
  };

  const getPartMessage = (qId: string, pId: string): string | null => {
    const key = `${qId}_${pId}`;
    const s = submissionStates[key];
    if (!s || !s.resultMessage) return null;
    return s.resultMessage;
  }

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePrint = () => {
    window.print();
  };

  const getQuestionStatus = (q: QuestionData): string | undefined => {
    const partStatuses = q.parts.map(p => getPartStatus(q.id, p.id));
    const allPassed = partStatuses.every(s => s === 'passed');
    const anyFailed = partStatuses.some(s => s === 'failed');
    const anySubmitted = partStatuses.some(s => s !== undefined);
    if (allPassed) return 'passed';
    if (anyFailed) return 'failed';
    if (anySubmitted) return 'in-progress';
    return undefined;
  }; 

  const handleCopyAllCode = () => {
    let allCode = '';
    questions.forEach((q, qi) => {
      q.parts.forEach((p, pi) => {
        const code = getPartCode(q.id, p.id);
        if (code) {
          allCode += `######## Q${qi} - P${pi} - ${getPartStatus(q.id, p.id)} ########\n${code}\n\n`;
        }
      });
    });
    copyToClipboard(allCode.trim(), "Copied All Code!");
  };

  return (
    <>
      <div className="print:hidden">
        <RandomBackground seed={0} density={0.5} doAnimation={false} />
      </div>
      <div className="p-6 max-w-4xl mx-auto mb-20 min-h-screen print:mb-0 print:p-2 bg-white/40 dark:bg-black/40">

        {/* Header */}
        <div className="mb-8 print:mb-4 print:min-h-[70vh]] header title-page">
          <div className="flex items-center gap-4 mb-4 print:min-h-[50vh]">
            <Image
              src="/images/classes/Python-logo-notext.svg"
              alt="Python Logo"
              width={80}
              height={80}
              className="rounded-lg cursor-pointer print:hidden"
              onClick={() => router.push('/classes/python-automation')}
            />
            <div className="bg-white/40 dark:bg-black/40 rounded-lg">
              <h1 className="text-4xl font-bold tc1 print:text-6xl">Ex1: Simple Coding Practice - Overview</h1>
              <p className="tc2 text-lg mt-2 print:text-3xl">Python for Automation and Scripting</p>
              <p className="tc3 text-sm print:text-xl">Unit 0: Foundations of Programming</p>
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-wrap gap-2 mt-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-lg not-active:bg3 border-2 border-[var(--khr)] bg-slate-100 dark:bg-slate-800 active:bg-[var(--khr)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40 active:text-white active:border-white/30 select-none cursor-pointer"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={handleCopyAllCode}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-lg not-active:bg3 border-2 border-[var(--kho)] bg-slate-100 dark:bg-slate-800 active:bg-[var(--kho)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40 active:text-white active:border-white/30 select-none cursor-pointer"

            >
              Copy All Code
            </button>
            <button
              onClick={() => setShowMechanics(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showMechanics
                ? 'bg-[var(--khg)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khg)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Mechanics
            </button>
            <button
              onClick={() => setShowHints(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showHints
                ? 'bg-[var(--khb)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khb)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Hints
            </button>
            <button
              onClick={() => setShowCodeExamples(v => !v)}
              className={`select-none cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${showCodeExamples
                ? 'bg-[var(--khv)] text-white border-white/30'
                : 'bg-slate-100 dark:bg-slate-800 border-[var(--khv)] text-black/80 hover:text-black/40 dark:text-white/80 dark:hover:text-white/40'
                }`}
            >
              Code Examples
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="bg1 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-8 print:hidden">
          <h2 className="text-xl font-bold tc1 mb-4 print:text-lg">Questions</h2>
          {loading ? (
            <p className="tc3 animate-pulse">Loading submission status…</p>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-4 print:gap-x-4 print:gap-y-2">
              {questions.map(q => (
                <div key={q.id} className="w-fit">
                  <button
                    onClick={() => scrollTo(q.id)}
                    className={`font-semibold text-left hover:underline ${statusColor(getQuestionStatus(q))} hover:opacity-70 cursor-pointer select-none`}
                  >
                    {statusIcon(getQuestionStatus(q))}
                    {q.title}
                  </button>
                  <div className="ml-6 mt-1 flex flex-wrap gap-x-4 gap-y-1 flex-col items-start w-fit opacity-80">
                    {q.parts.map(p => {
                      const st = getPartStatus(q.id, p.id);
                      return (
                        <button
                          key={`${q.id}_${p.id}`}
                          onClick={() => scrollTo(`${q.id}_${p.id}`)}
                          className={`text-sm hover:underline ${statusColor(st)} hover:opacity-70 cursor-pointer select-none`}
                        >
                          {statusIcon(st)}
                          {p.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Sections */}
        {questions.map(q => (
          <div
            key={q.id}
            ref={el => { sectionRefs.current[q.id] = el; }}
            className="mb-10 print:mb-6 scroll-mt-6"
          >
            {/* Question header */}
            <div className="flex items-center gap-3 mb-2 print:mb-0 question-header">
              {statusIcon(getQuestionStatus(q))}
              <h2 className="text-2xl font-bold tc1 print:text-xl cursor-pointer select-none hover:underline hover:opacity-70" onClick={() => router.push(`${assignmentPath}/${q.id}`)}>{q.title}</h2>
            </div>
            <p className="tc2 mb-4 print:mb-0 print:text-sm">{q.description}</p>

            {/* Parts */}
            {q.parts.map(p => {
              const partKey = `${q.id}_${p.id}`;
              const st = getPartStatus(q.id, p.id);
              const code = getPartCode(q.id, p.id);
              const message = getPartMessage(q.id, p.id);

              return (
                <div
                  key={partKey}
                  ref={el => { sectionRefs.current[partKey] = el; }}
                  className={`bg2 rounded-lg overflow-hidden p-0 shadow-sm print:shadow-none border-l-4 print:border-none mb-4 scroll-mt-6 question-part print:mb-0 ${statusBorder(st)}`}
                >
                  <div className="p-3 pb-0"> {/* question info*/}
                  {/* Part title — navigates to the question page */}
                  <button
                    onClick={() => router.push(`${assignmentPath}/${q.id}`)}
                    className={`select-none cursor-pointer text-lg font-semibold hover:underline hover:opacity-70 mb-2 text-left ${statusColor(st)} print:text-base`}
                  >
                    {statusIcon(st)}
                    {p.id.toUpperCase()}: {p.title}
                  </button>

                  {/* Objectives */}
                  {p.objectives.length > 0 && (
                      <ul className="ml-4 list-inside mb-1">
                      {p.objectives.map((obj, i) => (
                        <li key={i} className="tc2 text-sm print:text-xs">{obj}</li>
                      ))}
                    </ul>
                  )}

                    {/* Mechanics */}
                    {showMechanics && p.mechanics && p.mechanics.length > 0 && (
                      <div className="mb-1 ml-4">
                      {p.mechanics.map((m, i) => (
                        <p key={i} className="tc3 text-sm italic print:text-xs">{m}</p>
                      ))}
                    </div>
                  )}

                    {/* Hints */}
                    {showHints && p.hints && p.hints.length > 0 && (
                      <div className="mb-1 ml-4">
                      {p.hints.map((h, i) => (
                        <p key={i} className="text-fuchsia-600 dark:text-fuchsia-400 text-sm print:text-xs">{h}</p>
                      ))}
                    </div>
                    )}

                    {/* Code examples */}
                    {showCodeExamples && p.codeExamples && p.codeExamples.length > 0 && (
                      <div className="mb-1">
                      {p.codeExamples.map((c, i) => (
                        <CodeBlock key={i} code={c} language="python" compact className="mb-1 text-sm" />
                      ))}
                    </div>
                    )}
                  </div>

                  {/* Submitted code */}
                  {code ? (
                    <div className="mt-1.5 px-8 border-t-4 print:border-none bg-white/40 dark:bg-gray-800/30 border-gray-500/20 pb-3 pt-2 print:pb-0">
                      <p className={`text-xs font-semibold mb-1 ${st === 'passed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {st === 'passed' ? '✓ ' : '✗ '}{message}
                      </p>
                      <CodeBlock code={code} language="python" className="" />
                    </div>
                  ) : (
                      <p className="tc3 text-xs italic mt-2 print:text-xs p-3">No submission yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        <div className="p-4 px-8 print:hidden">
          <BackToAssignment assignmentPath={assignmentPath} textOverride="Back to Assignment" />
        </div>
      </div>
    </>
  );
}
