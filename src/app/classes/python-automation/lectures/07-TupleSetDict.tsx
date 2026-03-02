'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock, AnimatedCodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

interface TupleSetDictLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function TupleSetDict(props: TupleSetDictLectureProps | null) {
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

  const [stackQueueTab, setStackQueueTab] = useState<'stack' | 'queue'>('stack');

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Tuples, Sets, and Dictionaries</h2>
        <h3 className="tc2 lecture-section-header">Beyond lists — more ways to organize your data</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('lists-review')}>Lists Review</li>
          <li className="lecture-link" onClick={() => scrollToSection('tuples')}>Tuples</li>
          <li className="lecture-link" onClick={() => scrollToSection('sets')}>Sets</li>
          <li className="lecture-link" onClick={() => scrollToSection('dictionaries')}>Dictionaries</li>
          <li className="lecture-link" onClick={() => scrollToSection('stacks-queues')}>Stacks and Queues</li>
          <li className="lecture-link" onClick={() => scrollToSection('program-stack')}>Program Stack</li>
          <li className="lecture-link" onClick={() => scrollToSection('linked-lists')}>Linked Lists</li>
        </ul>
      </section>

      {/* ── Lists Review ── */}
      <section className="lecture-section mini-scroll" id="lists-review">
        <h3 className="lecture-section-header">Lists Review</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <span className="lecture-bold">list</span> is an ordered, mutable collection of values. Lists are created with square brackets and support indexing, slicing, and a rich set of built-in methods.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="creating and using lists"
          code={`# Creating lists
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# Accessing elements
print(fruits[0])    # "apple"
print(fruits[-1])   # "cherry"

# Modifying elements (lists are mutable)
fruits[1] = "blueberry"
print(fruits)       # ["apple", "blueberry", "cherry"]

# Common operations
fruits.append("date")
fruits.remove("apple")
print(len(fruits))  # 3`} />

        <p className="lecture-paragraph">
          Lists are the most flexible built-in data structure, but Python provides other collection types that are better suited for specific situations. Understanding <span className="lecture-bold">when</span> to use each type is just as important as knowing <span className="lecture-bold">how</span> to use them.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Python Collection Types at a Glance</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Ordered</th>
                <th className="lecture-table-header">Mutable</th>
                <th className="lecture-table-header">Duplicates</th>
                <th className="lecture-table-header">Syntax</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">List</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">[1, 2, 3]</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Tuple</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">(1, 2, 3)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Set</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✓ (add/remove)</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">{'{1, 2, 3}'}</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">Dict</td>
                <td className="lecture-table-cell">✓ (3.7+)</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">Keys: ✗</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">{'{k: v}'}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Tuples ── */}
      <section className="lecture-section mini-scroll" id="tuples">
        <h3 className="lecture-section-header">Tuples</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences" target="_blank" rel="noopener">tuple</a> is an <span className="lecture-bold">ordered, immutable</span> sequence. Once created, its elements cannot be changed, added, or removed. Tuples are defined with parentheses <code className="lecture-code-inline">()</code> or simply with commas.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="creating tuples"
          code={`# With parentheses
coordinates = (3, 7)
rgb = (255, 128, 0)

# Without parentheses (comma creates the tuple)
point = 4, 5
print(type(point))  # <class 'tuple'>

# Single-element tuple requires a trailing comma
single = (42,)
not_a_tuple = (42)   # This is just an int!

# From a list
my_tuple = tuple([1, 2, 3])

# Empty tuple
empty = ()
also_empty = tuple()`} />

        <p className="lecture-paragraph">
          Accessing elements works exactly like lists — square brackets with zero-based indexing:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="accessing tuple elements"
          code={`colors = ("red", "green", "blue", "yellow")
print(colors[0])     # "red"
print(colors[-1])    # "yellow"
print(colors[1:3])   # ("green", "blue") - slicing returns a new tuple`} />

        <p className="lecture-paragraph">
          Because tuples are <span className="lecture-bold">immutable</span>, attempting to modify them raises a <code className="lecture-code-inline text-red-500">TypeError</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="tuples are immutable"
          code={`colors = ("red", "green", "blue")
colors[0] = "pink"  # TypeError: 'tuple' object does not support item assignment`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Tuple unpacking</span> lets you assign each element to a separate variable in a single statement:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="tuple unpacking"
          lines={[1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14]} scrollMode="onClick"
          code={`# Basic unpacking
point = (10, 20, 30)
x, y, z = point
print(x)  # 10
print(y)  # 20

# Using * to capture remaining elements
first, *rest = (1, 2, 3, 4, 5)
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

# Swapping variables (uses tuple packing/unpacking)
a, b = 5, 10
a, b = b, a   # a=10, b=5`} />

        <p className="lecture-paragraph">
          Tuples can be <span className="lecture-bold">concatenated</span> with <code className="lecture-code-inline">+</code> and <span className="lecture-bold">repeated</span> with <code className="lecture-code-inline">*</code>, which create <span className="lecture-bold">new</span> tuples:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="tuple concatenation and repetition"
          code={`a = (1, 2)
b = (3, 4)
combined = a + b       # (1, 2, 3, 4)
repeated = a * 3       # (1, 2, 1, 2, 1, 2)`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Built-in Tuple Methods</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.count(x)</td>
                <td className="lecture-table-cell">Count occurrences of x</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">(1,2,1).count(1)  # 2</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.index(x)</td>
                <td className="lecture-table-cell">Index of first occurrence of x</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">(1,2,3).index(2)  # 1</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">len()</td>
                <td className="lecture-table-cell">Number of elements</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">len((1,2,3))  # 3</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">in</td>
                <td className="lecture-table-cell">Membership test</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">2 in (1,2,3)  # True</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">When to use tuples:</span> Use tuples for data that should <span className="lecture-bold">not change</span> — coordinates, RGB colors, database records, function return values, and dictionary keys. Tuples are also slightly faster and use less memory than lists.
        </p>
      </section>

      {/* ── Sets ── */}
      <section className="lecture-section mini-scroll" id="sets">
        <h3 className="lecture-section-header">Sets</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://docs.python.org/3/tutorial/datastructures.html#sets" target="_blank" rel="noopener">set</a> is an <span className="lecture-bold">unordered</span> collection of <span className="lecture-bold">unique</span> elements. Sets automatically remove duplicates and do not support indexing or slicing.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="creating sets"
          code={`# With curly braces
fruits = {"apple", "banana", "cherry"}

# With the set() constructor
numbers = set([1, 2, 2, 3, 3, 3])
print(numbers)  # {1, 2, 3} - duplicates removed

# From a string (unique characters)
chars = set("hello")
print(chars)  # {'h', 'e', 'l', 'o'}

# Empty set (NOT {} - that creates an empty dict!)
empty = set()`} />

        <p className="lecture-paragraph">
          Sets are <span className="lecture-bold">unordered</span>, so elements have no index. You <span className="lecture-bold">cannot</span> access items by position, but you <span className="lecture-bold">can</span> add and remove elements:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="modifying sets"
          code={`colors = {"red", "green", "blue"}

# Adding elements
colors.add("yellow")
colors.add("red")       # No effect - already exists
print(colors)            # {"red", "green", "blue", "yellow"}

# Removing elements
colors.remove("green")   # Raises KeyError if not found
colors.discard("pink")   # Does nothing if not found (safer)

print(len(colors))       # 3`} />

        <p className="lecture-paragraph">
          The real power of sets comes from <span className="lecture-bold">set operations</span>, which mirror mathematical set theory:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="set operations"
          code={`a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Union - all elements from both sets
print(a | b)        # {1, 2, 3, 4, 5, 6}
print(a.union(b))   # same

# Intersection - elements in both sets
print(a & b)              # {3, 4}
print(a.intersection(b))  # same

# Difference - elements in a but not in b
print(a - b)              # {1, 2}
print(a.difference(b))    # same

# Symmetric difference - elements in either but not both
print(a ^ b)                         # {1, 2, 5, 6}
print(a.symmetric_difference(b))     # same`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Use cases:</span> Sets are ideal for removing duplicates, membership testing (<code className="lecture-code-inline">in</code> is very fast on sets), and computing intersections or differences between groups.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="practical set use cases"
          code={`# Fast duplicate removal
names = ["Alice", "Bob", "Alice", "Charlie", "Bob"]
unique_names = list(set(names))
print(unique_names)  # ["Alice", "Bob", "Charlie"] (order may vary)

# Fast membership testing
valid_users = {"alice", "bob", "charlie"}
user = "alice"
if user in valid_users:     # O(1) lookup vs O(n) for lists
    print("Access granted")

# Finding common elements
my_courses = {"Math", "Physics", "CS", "English"}
your_courses = {"CS", "Art", "English", "History"}
shared = my_courses & your_courses
print(shared)  # {"CS", "English"}`} />
      </section>

      {/* ── Dictionaries ── */}
      <section className="lecture-section mini-scroll" id="dictionaries">
        <h3 className="lecture-section-header">Dictionaries</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://docs.python.org/3/tutorial/datastructures.html#dictionaries" target="_blank" rel="noopener">dictionary</a> stores data as <span className="lecture-bold">key-value pairs</span>. Keys must be unique and immutable (strings, numbers, tuples). Values can be anything. Dictionaries are ordered by insertion order as of Python 3.7.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="creating dictionaries"
          code={`# With curly braces
student = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science"
}

# With the dict() constructor
config = dict(host="localhost", port=8080, debug=True)

# From a list of tuples
pairs = dict([("a", 1), ("b", 2), ("c", 3)])

# Empty dictionary
empty = {}
also_empty = dict()`} />

        <p className="lecture-paragraph">
          Access values using their <span className="lecture-bold">key</span> in square brackets, or use <code className="lecture-code-inline">.get()</code> for safe access that returns a default instead of raising an error:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="accessing and modifying dictionaries"
          lines={[1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19]} scrollMode="onClick"
          code={`student = {"name": "Alice", "age": 20, "major": "CS"}
#
# Accessing values
print(student["name"])           # "Alice"
print(student.get("gpa", 0.0))  # 0.0 (key doesn't exist, returns default)
print(student["gpa"])            # KeyError!
#
# Modifying values
student["age"] = 21              # Update existing key
#
# Adding new key-value pairs
student["gpa"] = 3.8             # Add new key
#
# Removing key-value pairs
del student["major"]             # Remove by key
gpa = student.pop("gpa")        # Remove and return value
print(student)                   # {"name": "Alice", "age": 21"}`} />

        <p className="lecture-paragraph">
          Keys must be <span className="lecture-bold">unique</span>. Assigning to an existing key overwrites its value:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="duplicate keys overwrite"
          code={`data = {"a": 1, "b": 2, "a": 99}
print(data)  # {"a": 99, "b": 2} - first "a" was overwritten`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Common Dictionary Methods</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.keys()</td>
                <td className="lecture-table-cell">Returns all keys</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.values()</td>
                <td className="lecture-table-cell">Returns all values</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.items()</td>
                <td className="lecture-table-cell">Returns all key-value pairs as tuples</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.get(k, default)</td>
                <td className="lecture-table-cell">Returns value for key k, or default if missing</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.pop(k)</td>
                <td className="lecture-table-cell">Removes and returns value for key k</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.update(dict2)</td>
                <td className="lecture-table-cell">Merges dict2 into the dictionary</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">in</td>
                <td className="lecture-table-cell">Check if a key exists</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Iterating</span> over dictionaries with <code className="lecture-code-inline">for</code> loops:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="iterating over dictionaries"
          code={`scores = {"Alice": 95, "Bob": 82, "Charlie": 91}

# Iterate over keys (default)
for name in scores:
    print(name)

# Iterate over values
for score in scores.values():
    print(score)

# Iterate over key-value pairs
for name, score in scores.items():
    print(f"{name}: {score}")

# Dictionary comprehension
letter_grades = {name: ("A" if s >= 90 else "B") for name, s in scores.items()}
print(letter_grades)  # {"Alice": "A", "Bob": "B", "Charlie": "A"}`} />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Use cases:</span> Dictionaries are perfect for lookup tables, configuration objects, JSON data, counting occurrences, and grouping related data by a key.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="counting word frequency with a dictionary"
          code={`text = "the cat sat on the mat the cat"
word_count = {}
for word in text.split():
    word_count[word] = word_count.get(word, 0) + 1
print(word_count)
# {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}`} />
      </section>

      {/* ── Stacks and Queues ── */}
      <section className="lecture-section mini-scroll" id="stacks-queues">
        <h3 className="lecture-section-header">Stacks and Queues</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Stacks and queues are abstract data structures that define <span className="lecture-bold">rules</span> for how elements are added and removed. They can be implemented using Python lists.
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${stackQueueTab === 'stack' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setStackQueueTab('stack'); e.stopPropagation(); }}
            >
              Stack (LIFO)
            </button>
            <button
              className={`lecture-tab ${stackQueueTab === 'queue' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setStackQueueTab('queue'); e.stopPropagation(); }}
            >
              Queue (FIFO)
            </button>
          </div>

          {stackQueueTab === 'stack' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph">
                A <span className="lecture-bold">stack</span> follows <span className="lecture-bold">Last In, First Out (LIFO)</span> — the most recently added element is the first to be removed. Think of a stack of plates: you add to the top and remove from the top.
              </p>
              <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="stack using a list"
                lines={[1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]} scrollMode="onClick"
                code={`stack = []
stack.append("A")   # push
stack.append("B")   # push
stack.append("C")   # push
print(stack)         # ["A", "B", "C"]
#
top = stack.pop()    # pop - removes "C" (last in)
print(top)           # "C"
print(stack)         # ["A", "B"]
#
# Peek at the top without removing
print(stack[-1])     # "B"`} />
              <p className="lecture-paragraph">
                <span className="tc1 font-semibold">Use cases:</span> Undo/redo history, browser back button, expression evaluation, depth-first search.
              </p>
            </div>
          )}

          {stackQueueTab === 'queue' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph">
                A <span className="lecture-bold">queue</span> follows <span className="lecture-bold">First In, First Out (FIFO)</span> — the first element added is the first to be removed. Think of a line at a store: the first person in line is served first.
              </p>
              <CodeBlock className="lecture-codeblock" language="python" caption="queue using collections.deque"
                code={`from collections import deque

queue = deque()
queue.append("A")     # enqueue
queue.append("B")     # enqueue
queue.append("C")     # enqueue
print(queue)           # deque(["A", "B", "C"])

first = queue.popleft()  # dequeue - removes "A" (first in)
print(first)              # "A"
print(queue)              # deque(["B", "C"])`} />
              <p className="lecture-paragraph">
                <span className="tc1 font-semibold">Note:</span> Using <code className="lecture-code-inline">list.pop(0)</code> for queues works but is <span className="lecture-bold">slow</span> (O(n)) because all elements must shift. <code className="lecture-code-inline">collections.deque</code> provides O(1) operations on both ends.
              </p>
              <p className="lecture-paragraph">
                <span className="tc1 font-semibold">Use cases:</span> Task scheduling, print queues, breadth-first search, message buffers.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Program Stack ── */}
      <section className="lecture-section mini-scroll" id="program-stack">
        <h3 className="lecture-section-header">Program Stack</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Every running program uses an internal <span className="lecture-bold">call stack</span> to keep track of function calls. When a function is called, a new <span className="lecture-bold">frame</span> is pushed onto the stack containing the function's local variables and its return address. When the function returns, its frame is popped off.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="visualizing the call stack"
          lines={[1, 2, 4, 5, 7, 8, 10, 11, 12, 8, 5, 2, 13, 14, 15, 16, 17, 18, 19]} scrollMode="onClick"
          code={`def greet(name):
    message = create_message(name)    # push create_message frame
    return message

def create_message(name):
    greeting = format_greeting(name)  # push format_greeting frame
    return greeting

def format_greeting(name):
    return f"Hello, {name}!"          # returns, pops frame
#
# Call stack when format_greeting runs:
#   ┌─────────────────────────┐
#   │ format_greeting(name)   │  ← top of stack (current)
#   │ create_message(name)    │
#   │ greet(name)             │
#   │ <module>                │  ← bottom of stack
#   └─────────────────────────┘
print(greet("Alice"))  # "Hello, Alice!"`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Recursion</span> is when a function calls itself. Each recursive call pushes a new frame onto the stack. A <span className="lecture-bold">base case</span> is required to stop the recursion; without one, the stack overflows.
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="recursion and the call stack"
          lines={[1, 2, 3, 4, 5, 8, 2, 3, 4, 5, 8, 2, 3, 4, 5, 8, 2, 3, 8, 5, 5, 5, 9, 10, 11, 12, 13, 14]} scrollMode="onClick"
          code={`def factorial(n):
    if n <= 1:
        return 1                # base case
    else:
        return n * factorial(n - 1)  # recursive case
#
# Call stack for factorial(4):
#   factorial(1) → returns 1
#   factorial(2) → returns 2 * 1 = 2
#   factorial(3) → returns 3 * 2 = 6
#   factorial(4) → returns 4 * 6 = 24
#
print(factorial(4))  # 24`} />

        <p className="lecture-paragraph">
          Python has a default <span className="lecture-bold">recursion limit</span> of 1000 calls. Exceeding it raises a <code className="lecture-code-inline text-red-500">RecursionError</code>. You can check or change this limit:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="recursion limit"
          code={`import sys
print(sys.getrecursionlimit())    # 1000
sys.setrecursionlimit(5000)       # increase if needed (use with caution)`} />
      </section>

      {/* ── Linked Lists ── */}
      <section className="lecture-section mini-scroll" id="linked-lists">
        <h3 className="lecture-section-header">Linked Lists</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://en.wikipedia.org/wiki/Linked_list" target="_blank" rel="noopener">linked list</a> is a data structure where each element (<span className="lecture-bold">node</span>) contains a value and a <span className="lecture-bold">pointer</span> (reference) to the next node. Unlike arrays/lists, elements are not stored in contiguous memory — they are linked together through references.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="defining a linked list node"
          code={`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None     # pointer to the next node

# Creating nodes and linking them
a = Node("A")
b = Node("B")
c = Node("C")

a.next = b    # A → B
b.next = c    # B → C
# Result: A → B → C → None`} />

        <p className="lecture-paragraph">
          To <span className="lecture-bold">traverse</span> a linked list, start at the head and follow <code className="lecture-code-inline">.next</code> pointers until you reach <code className="lecture-code-inline">None</code>:
        </p>
        <AnimatedCodeBlock className="lecture-codeblock" language="python" caption="traversing a linked list"
          lines={[1, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 5, 6, 7]} scrollMode="onClick"
          code={`current = a            # start at the head
while current is not None:
    print(current.value, end=" → ")
    current = current.next
print("None")
#
# Output: A → B → C → None`} />

        <p className="lecture-paragraph">
          The key advantage of linked lists is that <span className="lecture-bold">inserting and removing</span> elements in the middle is <span className="lecture-bold">O(1)</span> once you have a reference to the node — you just update pointers instead of shifting all subsequent elements like a regular list:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="inserting into a linked list"
          code={`# Insert "X" between A and B
# Before: A → B → C
x = Node("X")
x.next = a.next    # X → B
a.next = x          # A → X
# After:  A → X → B → C

# Remove X from the list
# Before: A → X → B → C
a.next = x.next     # A → B
# After:  A → B → C`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Lists vs Linked Lists</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Operation</th>
                <th className="lecture-table-header">Python List</th>
                <th className="lecture-table-header">Linked List</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Access by index</td>
                <td className="lecture-table-cell">O(1) — fast</td>
                <td className="lecture-table-cell">O(n) — must traverse</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Insert/delete at middle</td>
                <td className="lecture-table-cell">O(n) — shift elements</td>
                <td className="lecture-table-cell">O(1) — update pointers</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Append to end</td>
                <td className="lecture-table-cell">O(1)</td>
                <td className="lecture-table-cell">O(n) or O(1) with tail pointer</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">Memory</td>
                <td className="lecture-table-cell">Contiguous, cache-friendly</td>
                <td className="lecture-table-cell">Scattered, extra pointer overhead</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Use cases:</span> Linked lists shine when you need frequent insertions and deletions in the middle of a collection without the cost of copying or shifting data — for example, implementing undo histories, playlists, or memory allocators. In practice, Python's built-in <code className="lecture-code-inline">list</code> and <code className="lecture-code-inline">collections.deque</code> cover most needs, but understanding linked lists is fundamental to computer science and will appear in more advanced data structures like trees and graphs.
        </p>
      </section>

    </LectureTemplate>
  );
}

interface TupleSetDictIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function TupleSetDictIcon(props: TupleSetDictIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Tuples, Sets, and Dictionaries" summary="Intro to un-ordered data structures, stacks, queues, and linked lists." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { TupleSetDict, TupleSetDictIcon };
