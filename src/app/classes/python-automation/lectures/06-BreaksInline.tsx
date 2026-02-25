'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock, AnimatedCodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';

interface BreakIteratorsInlineLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function BreaksInlineLecture(props: BreakIteratorsInlineLectureProps | null) {
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

  const [inlineTab, setInlineTab] = useState<'if' | 'for'>('if');

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>Break, Inline & More</h2>
        <h3 className="tc2 lecture-section-header">Manipulate loops with advanced techniques</h3>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('break-statement')}>Break</li>
          <li className="lecture-link" onClick={() => scrollToSection('continue-statement')}>Continue</li>
          <li className="lecture-link" onClick={() => scrollToSection('pass-statement')}>Pass</li>
          <li className="lecture-link" onClick={() => scrollToSection('inline-if')}>Inline If</li>
          <li className="lecture-link" onClick={() => scrollToSection('inline-for')}>Inline For</li>
          <li className="lecture-link" onClick={() => scrollToSection('match-case')}>Match Case</li>
          <li className="lecture-link" onClick={() => scrollToSection('loop-else')}>Loop Else</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="break-statement">
        <h3 className="lecture-section-header">Break</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <a className="lecture-link" href="https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements" target="_blank" rel="noopener">break</a> statement <span className='lecture-bold'>immediately exits</span> the innermost loop it's inside of. Execution continues with the first statement after the loop. This is useful when you've found what you're looking for and don't need to check the remaining items.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="break exits the loop early"
          lines={[1, 2, 3, 5, 2, 3, 5, 2, 3, 4, 6, 7, 8, 9]} scrollMode="onClick"
          code={`numbers = [4, 7, 2, 9, 1, 5]
for num in numbers:
    if num == 2:
        break
    print(num)
# Output:
# 4
# 7`} />

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">break</code> is commonly used with <code className="lecture-code-inline">while True</code> loops to create loops that exit based on a condition checked <span className="lecture-bold">inside</span> the loop body, rather than in the loop header:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="break to exit an infinite loop" 
          code={`while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == "quit":
        break
    print(f"You entered: {user_input}")`} />

        <p className="lecture-paragraph">
          In <span className="lecture-bold">nested loops</span>, <code className="lecture-code-inline">break</code> only exits the <span className="lecture-bold">innermost</span> loop:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="break only exits the inner loop"
          lines={[1, 2, 3, 5, 2, 3, 5, 2, 3, 4, 6]} scrollMode="onClick"
          code={`for i in range(3):
    for j in range(5):
        if j == 2:
            break       # only breaks the inner loop
        print(f"({i},{j})", end=" ")
    print()             # still runs for each outer iteration
#
# Output:
# (0,0) (0,1)
# (1,0) (1,1)
# (2,0) (2,1)`} />
      </section>

      <section className="lecture-section mini-scroll" id="continue-statement">
        <h3 className="lecture-section-header">Continue</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <a className="lecture-link" href="https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements" target="_blank" rel="noopener">continue</a> statement <span className="lecture-bold">skips the rest of the current iteration</span> and jumps back to the top of the loop for the next iteration. Unlike <code className="lecture-code-inline">break</code>, the loop keeps running.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="continue skips odd numbers"
          lines={[1, 2, 4, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 2, 4, 1, 2, 3, 5, 6, 7, 8, 9, 10]} scrollMode="onClick"
          code={`for i in range(6):
    if i % 2 == 1:    # if i is odd
        continue       # skip to next iteration
    print(i)
#
# Output:
# 0
# 2
# 4`} />

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">continue</code> is useful for filtering out unwanted values without deeply nesting your code inside <code className="lecture-code-inline">if</code> blocks:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="using nested if statements"
          code={`data = [12, -3, 0, 45, None, 7, -1, 22]
for value in data:
    if value is not None:
        if value > 0:
            print(f"Processing: {value}")`}  />

        <CodeBlock className="lecture-codeblock" language="python" caption="continue for cleaner filtering"
          code={`data = [12, -3, 0, 45, None, 7, -1, 22]
for value in data:
    if value is None:
        continue          # skip missing data
    if value <= 0:
        continue          # skip non-positive values
    print(f"Processing: {value}")
`} />
      </section>

      <section className="lecture-section mini-scroll" id="pass-statement">
        <h3 className="lecture-section-header">Pass</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <a className="lecture-link" href="https://docs.python.org/3/tutorial/controlflow.html#pass-statements" target="_blank" rel="noopener">pass</a> statement does <span className="lecture-bold">absolutely nothing</span>. It exists because Python requires at least one statement in every code block
          
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pass does nothing"
          code={`print("Pass does ...")\npass\npass\nprint("NOTHING!!")`} />
        <p className="lecture-paragraph">
            Use it as a placeholder when you haven't written the implementation yet.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pass as a placeholder"
          code={`# Skeleton code - fill in later
def calculate_tax(income):
    pass  # TODO: implement tax calculation

class DatabaseConnection:
    pass  # TODO: implement database connection

for i in range(10):
    if i == 5:
        pass  # TODO: handle special case
    else:
        print(i)`} />

        <p className="lecture-paragraph">
          Without <code className="lecture-code-inline">pass</code>, empty blocks would cause a <code className="lecture-code-inline text-red-500">SyntaxError</code>. Think of it as a way to say "I know this block is empty and that's intentional."
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="using pass to avoid syntax errors"
          code={`while time.now() < end_time:
    pass`} />

        
      </section>

      <section className="lecture-section mini-scroll" id="inline-if">
        <h3 className="lecture-section-header">Inline If (Ternary Operator)</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python supports a compact <a className="lecture-link" href="https://docs.python.org/3/reference/expressions.html#conditional-expressions" target="_blank" rel="noopener">conditional expression</a> (also called the <span className="lecture-bold">ternary operator</span>) that lets you write simple if-else logic in a single line. The syntax is:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="inline if syntax"
          code={`value_if_true if condition else value_if_false`} />

        <p className="lecture-paragraph">
          This is especially useful for simple assignments and return values:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="inline if examples"
          code={`age = 20

# Traditional if-else
if age >= 18:
    status = "adult"
else:
    status = "minor"

# Inline if - same result, one line
status = "adult" if age >= 18 else "minor"
print(status)  # "adult"`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Tip:</span> Only use inline ifs for simple, short expressions. If the logic requires more than two branches or is hard to read at a glance, use a regular <code className="lecture-code-inline">if/elif/else</code> block instead.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="inline-for">
        <h3 className="lecture-section-header">Inline For (List Comprehensions)</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" target="_blank" rel="noopener">List comprehensions</a> provide a concise way to create lists by applying an expression to each item in an iterable; all in a single line:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="list comprehension syntax"
          code={`new_list = [expression for item in iterable]
new_list = [expression for item in iterable if condition]`} />

        <p className="lecture-paragraph">
          They replace the common pattern of creating an empty list, looping, and appending:
        </p>
        
        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${inlineTab === 'if' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setInlineTab('if'); e.stopPropagation(); }}
            >
              Traditional Loop
            </button>
            <button
              className={`lecture-tab ${inlineTab === 'for' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setInlineTab('for'); e.stopPropagation(); }}
            >
              List Comprehension
            </button>
          </div>

          {inlineTab === 'if' && (
            <div className='lecture-tab-content'>
              <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="building a list with a loop"
                lines={[1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4, 5]} scrollMode="onClick"
                code={`squares = []
for x in range(5):
    squares.append(x ** 2)
print(squares)
# [0, 1, 4, 9, 16]`} />
            </div>
          )}

          {inlineTab === 'for' && (
            <div className='lecture-tab-content'>
              <CodeBlock className="lecture-codeblock" language="python" caption="same result with list comprehension"
                code={`squares = [x ** 2 for x in range(5)]
print(squares)
# [0, 1, 4, 9, 16]`} />
            </div>
          )}
        </div>

        <p className="lecture-paragraph">
          You can add an optional <code className="lecture-code-inline">if</code> clause to filter elements:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="list comprehension with filtering"
          code={`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Only even numbers, squared
even_squares = [x ** 2 for x in numbers if x % 2 == 0]
print(even_squares)  # [4, 16, 36, 64, 100]

# Combining inline if with inline for
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
print(labels)  # ['even', 'odd', 'even', 'odd', 'even']`} />

        <p className="lecture-paragraph">
          They are also useful for performing operations on on lists of data without needing to write a full loop:
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="list comprehensions for filtering"
          code={`a = [1, -5, 3, -2, 8, 0]\npositive = [x for x in a if x > 0]\nprint(positive)  # [1, 3, 8]`} />
        
        <CodeBlock className="lecture-codeblock" language="python" caption="list comprehensions for transforming data"
          code={`names = ["Alice", "Bob", "Charlie"]\nlengths = [len(name) for name in names]\nprint(lengths)  # [5, 3, 7]`} />

        <p className="lecture-paragraph">
          The same syntax works for creating <span className="lecture-bold">dictionaries</span> and <span className="lecture-bold">sets</span>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="dict and set comprehensions"
          code={`# Dictionary comprehension
word = "hello"
char_positions = {char: i for i, char in enumerate(word)}
print(char_positions)  # {'h': 0, 'e': 1, 'l': 3, 'o': 4}

# Set comprehension (removes duplicates automatically)
sentence = "the quick brown fox jumps over the lazy dog"
unique_lengths = {len(word) for word in sentence.split()}
print(unique_lengths)  # {3, 4, 5}`} />
      </section>

      <section className="lecture-section mini-scroll" id="match-case">
        <h3 className="lecture-section-header">Match Case</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python 3.10 introduced <a className="lecture-link" href="https://docs.python.org/3/tutorial/controlflow.html#match-statements" target="_blank" rel="noopener">structural pattern matching</a> with the <span className="lecture-bold">match</span>/<span className="lecture-bold">case</span> statement. It works similarly to <span className="lecture-bold">switch</span> statements in other languages but is significantly more powerful.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="basic match-case"
          lines={[1, 2, 3, 4, 6, 8, 9, 12, 13]} scrollMode="onClick"
          code={`command = "quit"
#
match command:
    case "start":
        print("Starting the program...")
    case "stop":
        print("Stopping the program...")
    case "quit":
        print("Exiting...")
    case _:
        print(f"Unknown command: {command}")
# Output: Exiting...`} />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">_</code> (underscore) acts as a <span className="lecture-bold">wildcard</span> that matches anything, similar to a final <code className="lecture-code-inline">else</code> in an if-elif chain.
        </p>

        <p className="lecture-paragraph">
          <code className="lecture-code-inline">match</code> can also destructure and match against <span className="lecture-bold">patterns</span>, making it far more powerful than a simple value comparison:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pattern matching with structure"
          code={`def describe_point(point):
    match point:
        case (0, 0):
            return "Origin"
        case (x, 0):
            return f"On the x-axis at x={x}"
        case (0, y):
            return f"On the y-axis at y={y}"
        case (x, y):
            return f"Point at ({x}, {y})"
        case _:
            return "Not a valid point"

print(describe_point((0, 0)))    # Origin
print(describe_point((5, 0)))    # On the x-axis at x=5
print(describe_point((3, 7)))    # Point at (3, 7)`} />

        <p className="lecture-paragraph">
          You can add <span className="lecture-bold">guards</span> (extra conditions) to cases using <code className="lecture-code-inline">if</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="match-case with guards"
          code={`def classify_age(age):
    match age:
        case n if n < 0:
            return "Invalid age"
        case n if n < 13:
            return f"Child - age {n}"
        case n if n < 18:
            return f"Teenager - age {n}"
        case n if n < 65:
            return f"Adult - age {n}"
        case _:
            return f"Senior - age {n}"

print(classify_age(8))   # Child
print(classify_age(25))  # Adult
print(classify_age(70))  # Senior`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Note:</span> <code className="lecture-code-inline">match</code>/<code className="lecture-code-inline">case</code> requires <span className="lecture-bold">Python 3.10+</span>. For earlier versions, use <code className="lecture-code-inline">if/elif/else</code> chains or dictionary dispatch patterns.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="loop-else">
        <h3 className="lecture-section-header">Loop Else</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python has a unique feature: you can attach an <a className="lecture-link" href="https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops" target="_blank" rel="noopener">else clause</a> to both <code className="lecture-code-inline">for</code> and <code className="lecture-code-inline">while</code> loops. The <code className="lecture-code-inline">else</code> block runs <span className="lecture-bold">only if the loop completed normally</span> - that is, it did <span className="lecture-bold">not</span> exit via a <code className="lecture-code-inline">break</code>.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="loop else - no break triggered"
          lines={[1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4, 5, 6, 7, 8, 9]} scrollMode="onClick"
          code={`numbers = [2, 4, 6, 8, 10]
for num in numbers:
    if num % 2 == 1:
        break
else:
    print("All numbers are even!")
#
# Output:
# All numbers are even!`} />

        <p className="lecture-paragraph">
          If a <code className="lecture-code-inline">break</code> <span className="lecture-bold">is</span> triggered, the <code className="lecture-code-inline">else</code> block is skipped entirely:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="loop else - break triggered, else skipped"
          lines={[1, 2, 3, 2, 3, 2, 4, 5, 6, 7]} scrollMode="onClick"
          code={`numbers = [2, 4, 5, 8, 10]
for num in numbers:
    if num % 2 == 1:
        break
else:
    print("All numbers are even!")
# No output - the else block was skipped because break fired on 5`} />

        <p className="lecture-paragraph">
          This is most commonly used for <span className="lecture-bold">search patterns</span> where you want to know if a search completed without finding a match:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="practical use - searching for an item"
          code={`def find_negative(numbers):
    for num in numbers:
        if num < 0:
            print(f"Found negative number: {num}")
            break
    else:
        print("No negative numbers found.")

find_negative([3, 7, 2, 9])     # No negative numbers found.
find_negative([3, 7, -2, 9])    # Found negative number: -2`} />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">else</code> clause also works with <code className="lecture-code-inline">while</code> loops:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="while-else - checking prime numbers"
          lines={[1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 6, 7, 8, 9]} scrollMode="onClick"
          code={`n = 7
i = 2
while i * i <= n:
    if n % i == 0:
        print(f"{n} is not prime (divisible by {i})")
        break
    i += 1
else:
    print(f"{n} is prime!")
# Output: 7 is prime!`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold"></span> Think of <code className="lecture-code-inline">else</code> on a loop as meaning all <code className="lecture-code-inline">if</code> statements with <code className="lecture-code-inline">breaks</code> in a loop were never triggered, so the final <code className="lecture-code-inline">else</code> block runs.
        </p>
      </section>

    </LectureTemplate>
  );
}


interface BreakIteratorsInlineLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function BreaksInlineLectureIcon(props: BreakIteratorsInlineLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Break, Iterators & Inline" summary="Manipulate loops with advanced techniques. break, continue, for/while patterns" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { BreaksInlineLecture, BreaksInlineLectureIcon };
