'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock, AnimatedCodeBlock } from '@/components/CodeBlock';

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

  // seq:      lines 1 2 3 4 5 (repeat)
  // branching: lines 1 2 3 6 7 (the if-true path, skipping else branch)
  // looping:  lines 1, then 2 3 4 × 3, then 5 6 7 8
  const SEQ_LINES = [1, 2, 3, 4, 5];
  const BRANCH_LINES = [1, 2, 3, 6, 7, 8];
  const LOOP_LINES = [1, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 5, 6, 7, 8, 9];

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
              <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="sequential execution"
                lines={SEQ_LINES} scrollMode="onHover"
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
              <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="branching execution"
                lines={BRANCH_LINES} scrollMode="onHover"
                code={`temperature = 35
if temperature > 30:
    print("It's hot outside!")     # This runs
else:
    print("It's not too hot.")     # This is skipped
print("Also it's raining")
print("have a nice day!")`} />
            </div>
          )}

          {flowTab === 'looping' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                The program repeats a block of code multiple times, either a fixed number of times or until a condition is met.
              </p>
              <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="looping execution"
                lines={LOOP_LINES} scrollMode="onHover"
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
          Python uses <span className="lecture-bold">indentation</span> to separate code into blocks, the standard indentation is 4 spaces or one tab.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="indentation defines code blocks"
          code={`if True:
    print("This is inside the if block")    # 4 spaces of indentation
    print("So is this")                     # same level = same block
print("This is outside the if block")       # back to base level`} />
        <p className="lecture-paragraph">
          Most of the time, your editor will automatically standardize this for you, but mixing tabs and space can cause an <code className="lecture-code-inline text-red-500">IndentationError</code>.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="indentation error example"
          code={`# This will cause an error:
if True:
    print("task1")
   print("task2")
    print("task3")`} />
      </section>

      <section className="lecture-section mini-scroll" id="if-statements">
        <h3 className="lecture-section-header">If Statements</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          An <code className="lecture-code-inline">if</code> statement the boolean value of an expression and executes the following block of code only if the expression is <code className="lecture-code-inline">True</code>.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="basic if statement" lines={[1, 2, 4, 5, 6]} scrollMode="onClick"
          code={`age = 15
if age >= 18:
    print("You are an adult.")
if age < 18:
    print("You are a child.")`} />

        <p className="lecture-paragraph">
          An <code className="lecture-code-inline">else</code> statement immediately following an  <code className="lecture-code-inline">if</code> block executes when the  condition is <code className="lecture-code-inline">False</code>:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="if-else statement" lines={[1, 2, 4, 5, 6]} scrollMode="onClick"
          code={`age=15
if age >= 18:
    print("You are an adult.")
else:
    print("You are a child.")`} />

        <p className="lecture-paragraph">
          Use <code className="lecture-code-inline">elif</code> <span className="opacity-50">(else if)</span> to chain multiple conditions. Python evaluates them top to bottom and executes the <span className="lecture-bold">first</span> branch whose condition is <code className="lecture-code-inline">True</code>, then skips the rest:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="if-elif-else chain" lines={[1, 2, 3, 5, 7, 8, 13, 14]} scrollMode="onClick"
          code={`score = 75
# 
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
#
print(f"Your grade is: {grade}")  # Your grade is: C`} />


      </section>

      <section className="lecture-section mini-scroll" id="while-loops">
        <h3 className="lecture-section-header">While Loops</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <code className="lecture-code-inline">while</code> loop repeats a block of code <span className="lecture-bold">as long as</span> the condition is <code className="lecture-code-inline">True</code>. The condition is checked <span className="lecture-bold">before</span> each iteration, if it's <code className="lecture-code-inline">False</code> from the start, the loop body never executes.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="basic while loop" lines={[1, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 5, 6, 7, 8, 9]} scrollMode="onClick"
          code={`countdown = 5
while countdown > 0:
    print(countdown)
    countdown -= 1    # Don't forget to update the condition!
print("Liftoff!")
# Output: 5 4 3 2 1 Liftoff!`} />

        <p className="lecture-paragraph">
          If the condition never becomes <code className="lecture-code-inline">False</code>, you create an <span className="lecture-bold">infinite loop</span>. You can use the break command <code className="lecture-code-inline">Ctrl+C</code> in the terminal to kill programs stuck in this loop.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="infinite loop — avoid this!" lines={[1, 2]} scrollMode="onClick"
          code={`while True:
    print("Help, I'm stuck!")`} />

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
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="basic for loop with a list" lines={[1, 2, 3, 2, 3, 2, 3, 4, 5, 6, 7, 8]} scrollMode="onClick"
          code={`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# Output:
# apple
# banana
# cherry`} />
        <p className="lecture-paragraph">
          you can iterate over strings character by character:
          </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="for loop with a string"
          code={`message = "Hello"
for char in message:
    print(char, end="-")
# Output: H-e-l-l-o-`} />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">range()</code> function generates a sequence of numbers and is commonly used for repeating an action a specific number of times. By default it starts aat 0 and counts up to but not including the stop value, but you can also specify a different start and a step value <code className="lecture-code-inline">range(start, stop, step)</code>:
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
      </section>

      <section className="lecture-section mini-scroll" id="fors-with-iterators">
        <h3 className="lecture-section-header">Iterators</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
           All for loops work using <span className="lecture-bold">iterators</span>, which are objects that <span className='lecture-bold'>yield</span> values one at a time, and then progress to the next value based on user defined code.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="simple iterator" lines={[6, 7, 8, 3, 8, 9, 8, 4, 8, 9, 8, 5, 8, 9, 10, 11, 12]} scrollMode="onClick"
          code={`# Create an iterator from a list
def my_iterator():
    yield 1
    yield 20
    yield 300
#
# Use the iterator in a for loop
for item in my_iterator():
    print(item, end=" ")
# Output:
# 1 20 300`} />
        <p className="lecture-paragraph">
          <span className="lecture-bold">range</span> is an iterator that yields a sequence of numbers. <span className="lecture-bold">arrays</span> automatically create an iterator that yields each element. <span className="lecture-bold">strings</span> create an iterator that yields each character.
        </p>
        <p className="lecture-paragraph">
          Python provides some built-in iterators that can be used to combine or enhance for loops.
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
        <CodeBlock className="lecture-codeblock" language="python" caption="enumerate()-index and value"
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
        <CodeBlock className="lecture-codeblock" language="python" caption="zip()-pairing multiple lists"
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
            <code className="lecture-code-inline">.items()</code> is used to iterate over key-value pairs in a dictionary:
          </p>
          <CodeBlock className="lecture-codeblock" language="python" caption=".items()-iterating over a dictionary"
          code={`scores = {"Alice": 85, "Bob": 92, "Charlie": 78}
for name, score in scores.items():
    print(f"{name}: {score}")`}
          />

        <p className="lecture-paragraph">
          you can also manually create iterators using <code className="lecture-code-inline">iter()</code> and access elements using <code className="lecture-code-inline">next()</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="manual iterator creation"
          code={`numbers = [1, 2, 3]
iterator = iter(numbers)
print(next(iterator))  # Output: 1
print(next(iterator))  # Output: 2
print(next(iterator))  # Output: 3
print(next(iterator))  # Throws StopIteration error
`} />
      <p className="lecture-paragraph">
        <code className="lecture-code-inline">.next()</code> throws a <code className="lecture-code-inline text-red-500">StopIteration</code> exception when there are no more elements to yield, which is how for loops know when to stop iterating.
      </p>
      <p className="lecture-paragraph">
        Iterators are powerful because they allow you to create custom looping behavior and work with data that doesn't fit in memory all at once (large ML datasets).
      </p>
      </section>

      <section className="lecture-section mini-scroll" id="nested-loops">
        <h3 className="lecture-section-header">Nested Loops</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Nesting</span> loops inside each other allows you to produce more complicated patterns and work with 2d data.
          The inner loop runs through its entire range, then the outer loop moves to its next iteration.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="basic nested loop" lines={[1, 2, 3, 2, 3, 2, 3, 4, 1, 2, 3, 2, 3, 2, 3, 4, 1, 2, 3, 2, 3, 2, 3, 4, 5, 6, 7, 8, 9, 10]} scrollMode="onClick"
          code={`for row in range(1, 4):
    for col in range(1, 4):
        print(row, "", col, " ", end="")
    print()  # New line after each row
#
# Output:
# 1 1   1 2   1 3
# 2 1   2 2   2 3
# 3 1   3 2   3 3`} />

        <p className="lecture-paragraph">
          Nested loops are essential for working with <span className="lecture-bold">2D lists</span> (matrices) and images:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="iterating over an image and darkening colors" 
          code={`for x in img.width:
    for y in img.height:
        img[y, x] = img[y, x]*0.5`} />

        <p className="lecture-paragraph">
          Nested loops can be used to <span className="lecture-bold">compare</span> a list against itself:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="comparing elements in a list"
          code={`names = ["Alice", "Bob", "Charlie", "David", "Christopher"]
for i, name1 in enumerate(names):
    for j, name2 in enumerate(names):
        if i != j: # dont compare names at the same index
            if name1[0] == name2[0]: # check if first letters match
                print(f"{name1} and {name2} have the same initial.")`}/>

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Performance note:</span> Nested loops multiply the number of iterations. A loop of <code className="lecture-code-inline">n</code> inside a loop of <code className="lecture-code-inline">m</code> runs <code className="lecture-code-inline">n × m</code> times. Three levels deep with 100 iterations each would be 1,000,000 operations. Keep nesting shallow when possible.
        </p>

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
