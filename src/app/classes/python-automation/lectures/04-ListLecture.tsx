'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';
import { FaArrowRotateRight } from 'react-icons/fa6';

interface ListLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ListLecture(props: ListLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  const listLength = 6;

  const refreshList = () => {
    const numList = Array.from({ length: listLength }, () => Math.floor(Math.random() * 100).toString());
    const sampleStrings = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'lime', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli fruit', 'watermelon'];
    const stringList = Array.from({ length: listLength }, () => sampleStrings[Math.floor(Math.random() * sampleStrings.length)]);
    const listList = Array.from({ length: listLength }, () => {
      return '[' + Array.from({ length: 3 }, () => Math.floor(Math.random() * 100).toString()).join(', ') + ']';
    });

    const r = Math.floor(Math.random() * 4);

    if (r === 0) return numList;
    else if (r === 1) return stringList;
    else if (r === 2) return listList;
    else {
      const combinedList = [...numList, ...stringList, ...listList];
      const mixedList = Array.from({ length: listLength }, () => combinedList[Math.floor(Math.random() * combinedList.length)]);
      return mixedList;
    }
  }
  const [listItems, setListItems] = useState<string[]>(() => refreshList());
  const memoryArrayExample = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>Lists and Arrays</h2>
        <h3 className="tc2 lecture-section-header">Storing and manipulating collections of data</h3>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('introduction')}>Introduction to Lists</li>
          <li className="lecture-link" onClick={() => scrollToSection('creating-lists')}>Initializing Lists</li>
          <li className="lecture-link" onClick={() => scrollToSection('accessing-elements')}>Accessing and Modifying Elements</li>
          <li className="lecture-link" onClick={() => scrollToSection('slicing-indexing')}>Slicing and Indexing</li>
          <li className="lecture-link" onClick={() => scrollToSection('list-methods')}>Python List Methods</li>
          <li className="lecture-link" onClick={() => scrollToSection('list-comprehensions')}>List Comprehensions</li>
          <li className="lecture-link" onClick={() => scrollToSection('numpy-arrays')}>Lists vs NumPy Arrays</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="introduction">
        <h3 className="lecture-section-header">Introduction to Lists</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-bold" href="https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" target="_blank" rel="noopener">list</a> is a collection of ordered values that can be of any data type. They are one of the most versatile and commonly used data structures in Python.
        </p>
        <div className="border-2 border-gray-500/50 rounded-xl mx-auto mb-2">
        <table className="lecture-table">
          <tbody>
            <tr className="lecture-table-row">
              {listItems.map((item, index) => (
                <td key={index} className="lecture-table-cell pl-2">{index}</td>
              ))}
            </tr>
            <tr className="">
              {listItems.map((item, index) => (
                <td key={index} className="lecture-table-cell text-nowrap text-ellipsis overflow-hidden pl-2">{item.padEnd(3, '\u00A0')}</td>
              ))}
            </tr>
          </tbody>
          </table>
        </div>
        <div className="tc3 mx-auto w-fit mb-4 flex items-center gap-2 lecture-text">
          <FaArrowRotateRight className="lecture-text cursor-pointer text-sm tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform select-none" onClick={(e) => { setListItems(refreshList()); e.stopPropagation(); }} />
          
          List index start at 0 and end at len(list) - 1</div>
        <p className="lecture-paragraph">
          Lists are <span className="lecture-bold">mutable</span>, meaning you can change their contents after creation, unlike strings or tuples which are immutable.
        </p>
        <p className="lecture-paragraph">
          In lower level languages like <a className="lecture-link" href="https://en.wikipedia.org/wiki/Array_data_structure#In_C_and_C++" target="_blank" rel="noopener">C/C++</a>, arrays are fixed-size and represent adjacent blocks of memory, pre-allocated to hold a fixed number of elements of a fixed size.
        </p>
        <div className="w-full flex justify-center mb-2 flex-col items-center">
          <div className="flex flex-col gap-4 md:flex-row">
            <CodeBlock language='c' caption="allocating an array in c" code={`int size = 2;\nint* pointer = (int*)malloc(size * sizeof(int));\n*(pointer+2) = 0; // set last value in list to 0`} />
            <div className="relative max-h-60  rounded-lg border-2 border-gray-300/40 overflow-hidden">
              <table className="lecture-table rounded-lg overflow-hidden">
                <thead className="sticky top-0 z-10 bg2">
                  <tr>
                    <th className="w-0 text-left px-2 py-1">Address</th>
                    <th className="w-0 text-left px-2 py-1">Memory</th>
                  </tr>
                </thead>
                <tbody className="consolas tc2">
                  {memoryArrayExample.map((byte, index) =>
                    <tr key={index} className="lecture-table-row">
                      <td className={`px-2 py-1 font-bold ${index <= 2 && index >= 1 ? 'bg-blue-500/40' : ''} ${index == 2 ? 'border-b-3 border-white' : ''} ${index == 1 ? 'border-t-3 border-white' : ''}`}>{`x${(index+20).toString(16).padStart(2, '0').toUpperCase()}`}</td>
                      <td className={`px-2 py-1 tc3 ${index <= 2 && index >= 1 ? 'bg-blue-500/40' : ''} ${index == 2 ? 'border-b-3 border-white' : ''} ${index == 1 ? 'border-t-3 border-white' : ''}`}>x{byte.toString(2).padStart(8, '0').toUpperCase()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <span className="lecture-text tc3 mt-1">Array consisting of consecutive bytes in memory</span>
        </div>
        <p className="lecture-paragraph">
           Python lists are <span className="lecture-bold">dynamically allocated</span>, so their size can be changed at runtime, and types can be mixed. Internally. Python lists are implemented as arrays of pointers to objects, allowing for this flexibility but with some overhead compared to lower-level arrays.
        </p>
        
      </section>

      <section className="lecture-section mini-scroll" id="creating-lists">
        <h3 className="lecture-section-header">Initializing Lists</h3>
        <div className="lecture-header-decorator" />
        <CodeBlock className="lecture-codeblock"
          code={`# Empty list
empty = []
also_empty = list()

# List with initial values
numbers = [1, 2, 3, 4, 5]

# Using range to create a list
range_list = list(range(10))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Creating a list of repeated values
zeros = [0] * 5  # [0, 0, 0, 0, 0]

# Nested lists (2D arrays)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`}
          language="python"
          caption="different ways to create lists"
        />
      </section>

      <section className="lecture-section mini-scroll" id="accessing-elements">
        <h3 className="lecture-section-header">Accessing and Modifying Elements</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The square bracket operators <code className="lecture-code">[]</code>,following a list access the item at that index. Lists use <span className="lecture-bold">zero-based indexing</span>, meaning the first element is at index 0.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`fruits = ["apple", "banana", "cherry", "date", "elderberry"]
print(fruits[0])   # "apple" - first element
fruits[1] = "blueberry"  # Replace "banana" with "blueberry"`}
          language="python"
          caption="accessing and modifying list elements"
        />
        <p className="lecture-paragraph">
          You can also use negative indices to access elements starting from the end:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="reverse indexing" code={`colors = ["red", "green", "blue", "yellow", "purple"]
print(colors[len(colors) - 1])  # "purple" - last element
print(colors[-1])  # "purple" - last element
colors[-2] = "orange"  # Replace "yellow" with "orange"`} />
        <p className="lecture-paragraph">
          Trying to access an index outside the bounds of the list will raise an <code className="lecture-code-inline text-red-500">IndexError</code>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="index out of bounds error" code={`my_list = [1, 2, 3]
print(my_list[3])  # IndexError: list index out of range
print(my_list[-4])  # IndexError: list index out of range`} />
        <p className="lecture-paragraph">
          Use the <span className="lecture-bold">modulo</span> <code className="lecture-code-inline">%</code> operator to wrap around indices and <code className="lecture-code-inline">len(list)</code> function to avoid index out of bounds errors:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="using modulo to wrap around indices" code={`my_list = [10, 20, 30, 40, 50]
index = 7
wrapped_index = index % len(my_list)  # 7 % 5 = 2
print(my_list[wrapped_index])  # 30`} />
        <p className="lecture-paragraph">
          This allows you to access elements in a circular manner without raising an error.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="slicing-indexing">
        <h3 className="lecture-section-header">Slicing</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <span className="lecture-bold">slicing</span> operator <code className="lecture-code-inline">[start:end:step]</code> allows you to extract or modify portions of a list. If one of the parameters is omitted, it defaults to the start or end of the list, or a step of 1. The item at the <code className="lecture-code-inline">end</code> index is <span className="lecture-bold">not</span> included in the slice.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Basic slicing: list[start:end]
print(numbers[2:5])    # [2, 3, 4] - elements in 2 <= index < 5
print(numbers[:3])     # [0, 1, 2] - first three elements
print(numbers[7:])     # [7, 8, 9] - from index 7 to end
print(numbers[-3:])    # [7, 8, 9] - last three elements

# Slicing with step: list[start:end:step]
print(numbers[::2])    # [0, 2, 4, 6, 8] - every second element
print(numbers[1::2])   # [1, 3, 5, 7, 9] - every second element starting from index 1
print(numbers[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] - reverse the list`}
          language="python"
          caption="list slicing operations"
        />
      </section>

      <section className="lecture-section mini-scroll" id="list-methods">
        <h3 className="lecture-section-header">Python List Methods</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python provides many built-in methods for working with lists:
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Common List Methods</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header"> + </td>
                <td className="lecture-table-cell">combine lists</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst1 + lst2</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">len()</td>
                <td className="lecture-table-cell">Get number of elements in the list</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">n = len(lst)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.append(x)</td>
                <td className="lecture-table-cell">Add an element to the end</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.append(5)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.insert(i, x)</td>
                <td className="lecture-table-cell">Insert element at position i</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.insert(0, 'first')</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.remove(x)</td>
                <td className="lecture-table-cell">Remove first occurrence of x</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.remove('a')</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.pop(i)</td>
                <td className="lecture-table-cell">Remove and return element at position i</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">val = lst.pop()</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.index(x)</td>
                <td className="lecture-table-cell">Return index of first occurrence of x</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">i = lst.index('b')</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.count(x)</td>
                <td className="lecture-table-cell">Count occurrences of x</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">n = lst.count(5)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.sort()</td>
                <td className="lecture-table-cell">Sort the list in place</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.sort()</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">.reverse()</td>
                <td className="lecture-table-cell">Reverse the list in place</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.reverse()</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">.extend(lst2)</td>
                <td className="lecture-table-cell">Append all elements from lst2</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">lst.extend([1,2,3])</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock className="lecture-codeblock"
          code={`numbers = [3, 1]
            
# Adding elements
numbers = numbers + [4, 1]  # [3, 1, 4, 1]
numbers.append(5)        # [3, 1, 4, 1, 5]
numbers.insert(0, 8)     # [8, 3, 1, 4, 1, 5]

# Removing elements
numbers.remove(1)        # Finds and removes first 1: [8, 3, 4, 1, 5]
last = numbers.pop()     # Removes and returns 5: [8, 3, 4, 1]
first = numbers.pop(0)   # Removes and returns 8: [3, 4, 1]

# Sorting and reversing
numbers.sort()           # [1, 3, 4]
numbers.reverse()        # [4, 3, 1]

# Searching
index = numbers.index(4)   # 0
count = numbers.count(1)   # 1

# Length
length = len(numbers)    # 3`}
          language="python"
          caption="using list methods"
        />
        <p className="lecture-paragraph">
          These methods are optimized by Python and should be preferred over manual implementations using loops for better performance and readability.
        </p>
        <CodeBlock className="lecture-codeblock" language='python' caption="performance comparison of list methods vs manual loops" code={`import time

n = 10_000_000
# Timing manual loop to count items in list
my_list = list(range(n))
start = time.time()
count = 0
for item in my_list:
    if item == 0:
        count += 1
end = time.time()
print("Manual loop count time:", end - start) # 0.812s

# Timing built-in list.count() method
my_list = list(range(n))
start = time.time()
count = my_list.count(0)
end = time.time()
print("List.count() time:", end - start) # 0.130s`}/>


      </section>

      <section className="lecture-section mini-scroll" id="numpy-arrays">
        <h3 className="lecture-section-header">Lists vs NumPy Arrays</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy arrays</a> behave closer to traditional <span className="lecture-bold">C</span>/<span className="lecture-bold">C++</span> arrays. They are less flexible than python lists, but perform much better on large datasets and intense calculations. NumPy provides a suite of built in, optimized <span className="lecture-bold">Linear Algebra</span> functions.
        </p>

        <div className="flex gap-4 w-full flex-col md:flex-row justify-center mb-4">
          <div className="flex-grow">
            <table className="lecture-table">
              <thead>
                <tr>
                  <th className="lecture-table-header"></th>
                  <th className="lecture-table-header text-left pb-2">Python Lists</th>
                  <th className="lecture-table-header text-left pb-2">NumPy Arrays</th>
                </tr>
              </thead>
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">Flexibility</td>
                  <td className="lecture-table-cell">Can mix data types</td>
                  <td className="lecture-table-cell">Homogeneous data types</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">Performance</td>
                  <td className="lecture-table-cell">Slower for numerical operations</td>
                  <td className="lecture-table-cell">Optimized for numerical operations</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">Operations</td>
                  <td className="lecture-table-cell">Requires loops for element-wise ops</td>
                  <td className="lecture-table-cell">Vectorized operations built-in</td>
                </tr>
                <tr>
                  <td className="lecture-table-header">Changing Size</td>
                  <td className="lecture-table-cell">Can grow or shrink dynamically</td>
                  <td className="lecture-table-cell">Fixed size, requires creating new arrays to resize</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="lecture-paragraph">
          Use Python lists when you need flexibility with mixed data types or when working with small datasets. Use NumPy arrays for numerical computations, large datasets, or when performance matters.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`import numpy as np

# Python list
py_list = [1, 2, 3, 4, 5]
# Element-wise operations require loops
doubled = [x * 2 for x in py_list]

# NumPy array
np_array = np.array([1, 2, 3, 4, 5])
# Fixed data type (all integers)
print(np_array.dtype)  # int64
# Element-wise operations are vectorized
doubled = np_array * 2  # Much faster!

# NumPy provides many mathematical functions
mean = np.mean(np_array)
std = np.std(np_array)
sum_vals = np.sum(np_array)

# Multi-dimensional arrays
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(matrix.shape)  # (3, 3)
print(matrix[0, 1])  # Access element at row 0, column 1: 2`}
          language="python"
          caption="comparing lists and NumPy arrays"
        />

        
      </section>

    </LectureTemplate>
  );
}

interface ListLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function ListLectureIcon(props: ListLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Lists and Arrays" summary="Learn about creating, manipulating, and using lists in Python." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ListLecture, ListLectureIcon };
