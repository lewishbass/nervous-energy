'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';

interface FlowControlLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FlowControlLecture(props: FlowControlLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const [flowTab, setFlowTab] = useState<'sequential' | 'branching' | 'looping'>('sequential');

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>If, Else, For, While</h2>
        <h3 className="tc2 lecture-section-header">Controlling program flow with conditionals and loops</h3>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('program-flow')}>Program Flow</li>
          <li className="lecture-link" onClick={() => scrollToSection('if-statements')}>If Statements</li>
          <li className="lecture-link" onClick={() => scrollToSection('while-loops')}>While Loops</li>
          <li className="lecture-link" onClick={() => scrollToSection('for-loops')}>For Loops</li>
          <li className="lecture-link" onClick={() => scrollToSection('fors-with-iterators')}>Fors with Iterators</li>
          <li className="lecture-link" onClick={() => scrollToSection('nested-loops')}>Nested Loops</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="program-flow">
        <h3 className="lecture-section-header">Program Flow</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          By default, Python executes code <span className="lecture-bold">sequentially</span> — one line after another, top to bottom. <span className="lecture-bold">Flow control</span> statements allow you to change this behavior by making decisions, repeating actions, or skipping sections of code based on conditions.
        </p>
        <p className="lecture-paragraph">
          There are three fundamental flow patterns in programming:
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${flowTab === 'sequential' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFlowTab('sequential'); e.stopPropagation(); }}
            >
              Sequential
            </button>
            <button
              className={`lecture-tab ${flowTab === 'branching' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFlowTab('branching'); e.stopPropagation(); }}
            >
              Branching
            </button>
            <button
              className={`lecture-tab ${flowTab === 'looping' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFlowTab('looping'); e.stopPropagation(); }}
            >
              Looping
            </button>
          </div>

          {flowTab === 'sequential' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                Code runs line by line, in order. This is the default behavior.
              </p>
              <CodeBlock className="lecture-codeblock" language="python" caption="sequential execution"
                code={`x = 10
y = 20
z = x + y
print(z)  # 30`} />
            </div>
          )}

          {flowTab === 'branching' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                The program chooses which path to take based on a condition. Only one branch executes.
              </p>
              <CodeBlock className="lecture-codeblock" language="python" caption="branching execution"
                code={`temperature = 35
if temperature > 30:
    print("It's hot outside!")     # This runs
else:
    print("It's not too hot.")     # This is skipped`} />
            </div>
          )}

          {flowTab === 'looping' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                The program repeats a block of code multiple times, either a fixed number of times or until a condition is met.
              </p>
              <CodeBlock className="lecture-codeblock" language="python" caption="looping execution"
                code={`count = 0
while count < 3:
    print("Count is:", count)
    count += 1
# Output:
# Count is: 0
# Count is: 1
# Count is: 2`} />
            </div>
          )}
        </div>

        <p className="lecture-paragraph">
          Python uses <span className="lecture-bold">indentation</span> (whitespace at the beginning of a line) to define code blocks, rather than curly braces <code className="lecture-code-inline">{'{}'}</code> like C, Java, or JavaScript. This means consistent indentation is <span className="lecture-bold">required</span> — mixing tabs and spaces or using inconsistent indentation will cause an <code className="lecture-code-inline text-red-500">IndentationError</code>.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="indentation defines code blocks"
          code={`if True:
    print("This is inside the if block")    # 4 spaces of indentation
    print("So is this")                     # same level = same block
print("This is outside the if block")       # back to base level`} />
        <p className="lecture-paragraph">
          The standard convention is to use <span className="lecture-bold">4 spaces</span> per indentation level. Most editors can be configured to insert spaces when you press Tab.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="if-statements">
        <h3 className="lecture-section-header">If Statements</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          An <code className="lecture-code-inline">if</code> statement evaluates a boolean expression and executes the indented block of code only if the expression is <code className="lecture-code-inline">True</code>.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="basic if statement"
          code={`age = 20

if age >= 18:
    print("You are an adult.")`} />

        <p className="lecture-paragraph">
          Use <code className="lecture-code-inline">else</code> to define a block that runs when the condition is <code className="lecture-code-inline">False</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="if-else statement"
          code={`age = 15

if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")`} />

        <p className="lecture-paragraph">
          Use <code className="lecture-code-inline">elif</code> <span className="opacity-50">(else if)</span> to chain multiple conditions. Python evaluates them top to bottom and executes the <span className="lecture-bold">first</span> branch whose condition is <code className="lecture-code-inline">True</code>, then skips the rest:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="if-elif-else chain"
          code={`score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")  # Your grade is: B`} />

        <p className="lecture-paragraph">
          Conditions can be combined using <code className="lecture-code-inline">and</code>, <code className="lecture-code-inline">or</code>, and <code className="lecture-code-inline">not</code> operators:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="compound conditions"
          code={`temperature = 22
is_sunny = True
is_weekend = False

if is_sunny and temperature > 20:
    print("Great weather for a walk!")

if is_weekend or temperature > 25:
    print("Consider going to the beach!")

if not is_weekend:
    print("It's a weekday.")`} />

        <p className="lecture-paragraph">
          Python also supports a <span className="lecture-bold">ternary</span> (inline) conditional expression for simple assignments:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="ternary conditional expression"
          code={`age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # "adult"

# Equivalent to:
if age >= 18:
    status = "adult"
else:
    status = "minor"`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Truthy and Falsy values:</span> Python treats certain values as <code className="lecture-code-inline">False</code> in boolean contexts. Everything else is <code className="lecture-code-inline">True</code>.
        </p>
        <div className="flex gap-4 w-full flex-col md:flex-row justify-center mb-4">
          <div className="flex-grow">
            <span className="lecture-link">Falsy Values</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">False</td>
                  <td className="lecture-table-cell">Boolean false</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">None</td>
                  <td className="lecture-table-cell">Null value</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">0, 0.0</td>
                  <td className="lecture-table-cell">Zero numbers</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">"", '', """"""</td>
                  <td className="lecture-table-cell">Empty strings</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">[], {'{}'}, ()</td>
                  <td className="lecture-table-cell">Empty collections</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex-grow">
            <span className="lecture-link">Truthy Values</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">True</td>
                  <td className="lecture-table-cell">Boolean true</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">Any non-zero number</td>
                  <td className="lecture-table-cell">1, -5, 3.14</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">Non-empty strings</td>
                  <td className="lecture-table-cell">"hello", "0", " "</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">Non-empty collections</td>
                  <td className="lecture-table-cell">[1], {'{"a": 1}'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <CodeBlock className="lecture-codeblock" language="python" caption="truthy and falsy values in practice"
          code={`my_list = [1, 2, 3]

# Instead of:
if len(my_list) > 0:
    print("List has items")

# You can write:
if my_list:
    print("List has items")

# Checking for None
result = None
if result is None:
    print("No result yet")`} />
      </section>

      <section className="lecture-section mini-scroll" id="while-loops">
        <h3 className="lecture-section-header">While Loops</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <code className="lecture-code-inline">while</code> loop repeats a block of code <span className="lecture-bold">as long as</span> the condition is <code className="lecture-code-inline">True</code>. The condition is checked <span className="lecture-bold">before</span> each iteration — if it's <code className="lecture-code-inline">False</code> from the start, the loop body never executes.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="basic while loop"
          code={`countdown = 5
while countdown > 0:
    print(countdown)
    countdown -= 1    # Don't forget to update the condition!
print("Liftoff!")
# Output: 5 4 3 2 1 Liftoff!`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Warning:</span> If the condition never becomes <code className="lecture-code-inline">False</code>, you create an <span className="lecture-bold">infinite loop</span>. You can stop an infinite loop with <code className="lecture-code-inline">Ctrl+C</code> in the terminal.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="infinite loop — avoid this!"
          code={`# This will run forever!
# while True:
#     print("Help, I'm stuck!")`} />

        <p className="lecture-paragraph">
          Sometimes infinite loops are <span className="lecture-bold">intentional</span> — for example, a game loop or a server waiting for connections. Use the <code className="lecture-code-inline">break</code> statement to exit a loop early:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="using break to exit a loop"
          code={`while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == "quit":
        print("Goodbye!")
        break
    print(f"You entered: {user_input}")`} />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">continue</code> statement skips the rest of the current iteration and jumps back to the condition check:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="using continue to skip iterations"
          code={`i = 0
while i < 10:
    i += 1
    if i % 3 == 0:
        continue        # Skip multiples of 3
    print(i, end=" ")
# Output: 1 2 4 5 7 8 10`} />

        <p className="lecture-paragraph">
          While loops can also have an optional <code className="lecture-code-inline">else</code> block that executes when the condition becomes <code className="lecture-code-inline">False</code> (but <span className="lecture-bold">not</span> when the loop is exited via <code className="lecture-code-inline">break</code>):
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="while-else pattern"
          code={`attempts = 0
max_attempts = 3

while attempts < max_attempts:
    password = input("Enter password: ")
    if password == "secret":
        print("Access granted!")
        break
    attempts += 1
else:
    # Only runs if the loop completed without break
    print("Too many failed attempts. Account locked.")`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">When to use while loops:</span> Use <code className="lecture-code-inline">while</code> when you don't know in advance how many iterations you need — for example, reading user input until a valid response is given, or processing data until a condition is met.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="for-loops">
        <h3 className="lecture-section-header">For Loops</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <code className="lecture-code-inline">for</code> loop iterates over a <span className="lecture-bold">sequence</span> (such as a list, string, or range), executing the loop body once for each element. Unlike <code className="lecture-code-inline">while</code> loops, <code className="lecture-code-inline">for</code> loops are used when you know (or can determine) how many iterations are needed.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="basic for loop with a list"
          code={`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# Output:
# apple
# banana
# cherry`} />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">range()</code> function generates a sequence of numbers and is commonly used for repeating an action a specific number of times:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="for loop with range()"
          code={`# range(stop) — 0 to stop-1
for i in range(5):
    print(i, end=" ")   # 0 1 2 3 4

# range(start, stop) — start to stop-1
for i in range(2, 6):
    print(i, end=" ")   # 2 3 4 5

# range(start, stop, step)
for i in range(0, 20, 5):
    print(i, end=" ")   # 0 5 10 15

# Counting backwards
for i in range(10, 0, -2):
    print(i, end=" ")   # 10 8 6 4 2`} />

        <p className="lecture-paragraph">
          You can iterate over strings character by character:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="iterating over a string"
          code={`message = "Hello"
for char in message:
    print(char, end="-")
# Output: H-e-l-l-o-`} />

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">break</code> and <code className="lecture-code-inline">continue</code> work the same way in <code className="lecture-code-inline">for</code> loops:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="break and continue in for loops"
          code={`# Find the first even number in a list
numbers = [1, 3, 7, 8, 12, 15]
for num in numbers:
    if num % 2 == 0:
        print(f"First even number: {num}")  # 8
        break

# Print only odd numbers
for num in range(10):
    if num % 2 == 0:
        continue
    print(num, end=" ")  # 1 3 5 7 9`} />

        <p className="lecture-paragraph">
          For loops also support an <code className="lecture-code-inline">else</code> block, which runs after the loop finishes <span className="lecture-bold">without</span> hitting a <code className="lecture-code-inline">break</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="for-else pattern — searching for a value"
          code={`target = 7
numbers = [1, 3, 5, 9, 11]

for num in numbers:
    if num == target:
        print(f"Found {target}!")
        break
else:
    print(f"{target} not found in the list.")
# Output: 7 not found in the list.`} />
      </section>

      <section className="lecture-section mini-scroll" id="fors-with-iterators">
        <h3 className="lecture-section-header">Fors with Iterators</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python provides several built-in functions that produce <span className="lecture-bold">iterators</span> — objects that yield values one at a time. These are commonly paired with <code className="lecture-code-inline">for</code> loops to make iteration more expressive and Pythonic.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Common Iterator Functions</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">enumerate()</td>
                <td className="lecture-table-cell">Yields index-value pairs</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">zip()</td>
                <td className="lecture-table-cell">Pairs elements from multiple sequences</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">reversed()</td>
                <td className="lecture-table-cell">Iterates in reverse order</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">sorted()</td>
                <td className="lecture-table-cell">Iterates in sorted order</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">.items()</td>
                <td className="lecture-table-cell">Iterates over dictionary key-value pairs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">enumerate()</code> is used when you need both the <span className="lecture-bold">index</span> and the <span className="lecture-bold">value</span> of each element:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="enumerate() — index and value"
          code={`fruits = ["apple", "banana", "cherry"]

# Without enumerate (manual index tracking)
i = 0
for fruit in fruits:
    print(f"{i}: {fruit}")
    i += 1

# With enumerate (cleaner and preferred)
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Output:
# 0: apple
# 1: banana
# 2: cherry`} />

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">zip()</code> combines multiple sequences element-by-element. It stops at the shortest sequence:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="zip() — pairing multiple lists"
          code={`names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]
grades = ["B", "A", "C"]

for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score} ({grade})")

# Output:
# Alice: 85 (B)
# Bob: 92 (A)
# Charlie: 78 (C)`} />

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">reversed()</code> and <code className="lecture-code-inline">sorted()</code> let you control iteration order without modifying the original sequence:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="reversed() and sorted()"
          code={`numbers = [3, 1, 4, 1, 5, 9, 2]

# Iterate in reverse
for num in reversed(numbers):
    print(num, end=" ")  # 2 9 5 1 4 1 3

# Iterate in sorted order
for num in sorted(numbers):
    print(num, end=" ")  # 1 1 2 3 4 5 9

# Sorted descending
for num in sorted(numbers, reverse=True):
    print(num, end=" ")  # 9 5 4 3 2 1 1

# Original list is unchanged
print(numbers)  # [3, 1, 4, 1, 5, 9, 2]`} />

        <p className="lecture-paragraph">
          Iterating over <span className="lecture-bold">dictionaries</span> using <code className="lecture-code-inline">.items()</code>, <code className="lecture-code-inline">.keys()</code>, and <code className="lecture-code-inline">.values()</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="iterating over dictionaries"
          code={`student = {"name": "Alice", "age": 20, "major": "Physics"}

# Iterate over keys (default behavior)
for key in student:
    print(key)  # name, age, major

# Iterate over values
for value in student.values():
    print(value)  # Alice, 20, Physics

# Iterate over key-value pairs
for key, value in student.items():
    print(f"{key}: {value}")
# name: Alice
# age: 20
# major: Physics`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">List comprehensions</span> are a compact way to create lists using a for loop in a single line:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="list comprehensions"
          code={`# Standard loop
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension (equivalent, more concise)
squares = [x ** 2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With a condition (filter)
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# With transformation
names = ["alice", "bob", "charlie"]
capitalized = [name.upper() for name in names]
# ["ALICE", "BOB", "CHARLIE"]`} />
      </section>

      <section className="lecture-section mini-scroll" id="nested-loops">
        <h3 className="lecture-section-header">Nested Loops</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <span className="lecture-bold">nested loop</span> is a loop inside another loop. The inner loop completes all of its iterations for <span className="lecture-bold">each</span> iteration of the outer loop. This is useful for working with multi-dimensional data, grids, or combinations.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="basic nested loop — multiplication table"
          code={`for row in range(1, 4):
    for col in range(1, 4):
        print(f"{row * col:4d}", end="")
    print()  # New line after each row

# Output:
#    1   2   3
#    2   4   6
#    3   6   9`} />

        <p className="lecture-paragraph">
          Nested loops are essential for working with <span className="lecture-bold">2D lists</span> (matrices):
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="iterating over a 2D list"
          code={`matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access every element
for row in matrix:
    for element in row:
        print(element, end=" ")
    print()

# Access with indices
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        print(f"matrix[{i}][{j}] = {matrix[i][j]}")`} />

        <p className="lecture-paragraph">
          Nested loops can be used to generate <span className="lecture-bold">combinations</span> and <span className="lecture-bold">patterns</span>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="generating combinations"
          code={`colors = ["red", "green", "blue"]
sizes = ["S", "M", "L"]

# All combinations of color and size
for color in colors:
    for size in sizes:
        print(f"{color}-{size}", end="  ")
    print()

# Output:
# red-S  red-M  red-L
# green-S  green-M  green-L
# blue-S  blue-M  blue-L`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Performance note:</span> Nested loops multiply the number of iterations. A loop of <code className="lecture-code-inline">n</code> inside a loop of <code className="lecture-code-inline">m</code> runs <code className="lecture-code-inline">n × m</code> times. Three levels deep with 100 iterations each would be 1,000,000 operations. Keep nesting shallow when possible.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="break only exits the innermost loop"
          code={`for i in range(3):
    for j in range(3):
        if j == 1:
            break           # Only breaks out of the inner loop
        print(f"({i}, {j})", end=" ")
    print()

# Output:
# (0, 0)
# (1, 0)
# (2, 0)`} />

        <p className="lecture-paragraph">
          To break out of multiple levels, use a <span className="lecture-bold">flag variable</span> or move the nested loops into a <span className="lecture-bold">function</span> and use <code className="lecture-code-inline">return</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="breaking out of nested loops with a function"
          code={`def findValue(matrix, target):
    """Search a 2D matrix for a target value and return its position"""
    for i, row in enumerate(matrix):
        for j, val in enumerate(row):
            if val == target:
                return (i, j)      # Exits both loops immediately
    return None                    # Not found

data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
position = findValue(data, 5)
print(position)  # (1, 1)`} />

        <p className="lecture-paragraph">
          Nested <span className="lecture-bold">list comprehensions</span> can flatten or transform multi-dimensional data:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="nested list comprehensions"
          code={`matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Flatten a 2D list into 1D
flat = [val for row in matrix for val in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Create a 2D list with comprehension
grid = [[i * j for j in range(1, 4)] for i in range(1, 4)]
# [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Transpose a matrix (swap rows and columns)
transposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]`} />
      </section>

    </LectureTemplate>
  );
}

interface FlowControlLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function FlowControlLectureIcon(props: FlowControlLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="If, Else, For, While" summary="Controlling program flow with conditionals and loops." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FlowControlLecture, FlowControlLectureIcon };
