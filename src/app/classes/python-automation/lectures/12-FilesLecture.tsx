'use client';
import React, { useEffect } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

const toHex = (a: any, b: number = 2): string => {
  const num = typeof a === 'number' ? a : a.charCodeAt(0);
  return '0x' + num.toString(16).padStart(b, '0');
}

interface MemoryVisualizerTableProps {
  top: string[] | number[];
  bottom: string[] | number[];
  caption?: string;
  displayMode?: 'scrollable' | 'slideshow';
}

function MemoryVisualizerTable({ top, bottom, caption, displayMode = 'scrollable' }: MemoryVisualizerTableProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center my-4 w-full ${displayMode}`}>
      {caption && <span className="mb-2 lecture-small tc3">{caption}</span>}
      <div className="flex flex-row">
        {top.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="tc2 font-mono px-1 lecture-small">{toHex(index)}</span>
            <div className={`px-3 py-1 text-center font-mono tc1 ${displayMode === 'slideshow' ? 'lecture-text' : 'text-sm'}`}>{String(value)}</div>
            <div className={`px-3 py-1 border border-gray-500/50 text-center font-mono tc2 bg-white/5 lecture-small`}>{String(bottom[index])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FilesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FilesLecture(props: FilesLectureProps | null) {
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

  return (
    <MathJaxContext>
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Files and I/O</h2>
        <h3 className="tc2 lecture-section-header">Reading, Writing, and Working with Files in Python</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You&apos;ll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('various')}>Various</li>
          <li className="lecture-link" onClick={() => scrollToSection('opening-file-modes')}>Opening Files</li>
          <li className="lecture-link" onClick={() => scrollToSection('with-statements')}>with Statements</li>
          <li className="lecture-link" onClick={() => scrollToSection('reading-writing-files')}>Reading and Writing Files</li>
          <li className="lecture-link" onClick={() => scrollToSection('file-types')}>File Types</li>
          <li className="lecture-link" onClick={() => scrollToSection('csv')}>CSV</li>
          <li className="lecture-link" onClick={() => scrollToSection('json')}>JSON</li>
          <li className="lecture-link" onClick={() => scrollToSection('pickle')}>Pickle</li>
          <li className="lecture-link" onClick={() => scrollToSection('text-encoding')}>Text Encoding</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-1')}>Exercise 1</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-2')}>Exercise 2</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-3')}>Exercise 3</li>
        </ul>
      </section>

      {/* Various */}
      <section className="lecture-section mini-scroll" id="various">
        <h3 className="lecture-section-header">Various</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Visit this link to practice typing:
          <a className="ml-1 lecture-link-blue" href="https://www.keybr.com/" target="_blank" rel="noopener">keybr.com</a>
        </p>
      </section>

      {/* Opening File Modes */}
      <section className="lecture-section mini-scroll" id="opening-file-modes">
        <h3 className="lecture-section-header">Opening Files</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          In Python, files are opened using the built-in <code className="lecture-code-inline">open()</code> function, which takes a filename and a mode as arguments.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="open todo_list.txt to read from it"
          code={`f = open("todo_list.txt")`} />

        <p className="lecture-paragraph">
          This creates a file object linking your program to a file in the operating system.
          It searches for the file in the <span className="lecture-bold">current working directory</span>, where your program is running.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="get current working directory, where python looks for files by default"
          code={`import os\nprint(  os.getcwd()  )`} />

        <p className="lecture-paragraph">
          Files have to be opened in a specific mode, depending on what you want to do with them:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Mode</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">&apos;r&apos;</code></td>
                <td className="lecture-table-cell">Read mode - opens the file for reading (default)</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">&apos;w&apos;</code></td>
                <td className="lecture-table-cell">Write mode - opens the file for writing (creates a new file or overwrites an existing file)</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">&apos;a&apos;</code></td>
                <td className="lecture-table-cell">Append mode - opens the file for writing but preserves existing content (creates a new file if it doesn&apos;t exist)</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">&apos;x&apos;</code></td>
                <td className="lecture-table-cell">Exclusive creation mode - creates a new file but raises an error if the file already exists</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Opening a file in write mode <span className="lecture-bold">will erase everything</span> in the file if it already exists, so be careful when using it.
        </p>
        <CodeBlock className="lecture-codeblock" language="python"
          code={`# open a file for writing\nf = open("todo_list.txt", "w")\n\n# open a file for reading\nf = open("todo_list.txt", "r")`} />

        <p className="lecture-paragraph">
          Once you are done with the file you have to close it, to signal to the operating system to store it permanently on the disk, and allow others to access it.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="close the file to save changes and free up system resources"
          code={`f.close()`} />
      </section>

      {/* with Statements */}
      <section className="lecture-section mini-scroll" id="with-statements">
        <h3 className="lecture-section-header">with Statements</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          If you try to open a file that doesn&apos;t exist or is in a different folder, the program will raise a <code className="lecture-code-inline text-red-400">FileNotFoundError</code> and crash.
        </p>
        <p className="lecture-paragraph">
          If your program crashes or exits while the file is open, it can accidentally leave the file open, which can cause errors:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header text-nowrap">Risk</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header text-nowrap">Data Loss</td>
                <td className="lecture-table-cell">Data written to the file in temporary memory is not saved permanently</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header text-nowrap">File Locks</td>
                <td className="lecture-table-cell">The file can only be accessed by one program at a time, so leaving it open can prevent you from editing it later</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header text-nowrap">Leaks</td>
                <td className="lecture-table-cell">The open file consumes resources even when not in use, keeping many files open can slow your program dramatically</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline"><span className="tc1 font-bold">with</span> function <span className="tc1 font-bold">as</span> variable</code> statement is a special syntax that ensures the resource is properly released after the block is exited.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="the with statement ensures that the file is closed and resources are freed, even if an error occurs within the block"
          code={`with open("todo_list.txt", "r") as f:\n    content = f.read()`} />

        <p className="lecture-paragraph">
          Like <code className="lecture-code-inline">iterators</code> and <code className="lecture-code-inline">generators</code>, <code className="lecture-code-inline">context manager</code> protocols are objects that are guaranteed to have certain methods, in this case <code className="lecture-code-inline">__enter__</code> and <code className="lecture-code-inline">__exit__</code>, which the <code className="lecture-code-inline">with</code> statement uses to open and close the file.
        </p>
      </section>

      {/* Reading and Writing Files */}
      <section className="lecture-section mini-scroll" id="reading-writing-files">
        <h3 className="lecture-section-header">Reading and Writing Files</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Once the file is open, you can read from it:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Method</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">file.read()</code></td>
                <td className="lecture-table-cell">Read the entire file as a single string</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">file.readline()</code></td>
                <td className="lecture-table-cell">Read the next line of the file as a string</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">file.readlines()</code></td>
                <td className="lecture-table-cell">Read the entire file as a list of lines</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Reading large files all at once can be inefficient - it requires Python to load all the data from the disk into RAM, and then create a giant string.
          Reading one line at a time is more memory efficient; Python only stores one line in memory at a time, and can process huge files that may not fit in memory.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="read entire file content and print it"
          code={`content = f.read()\nprint(content)`} />
        <CodeBlock className="lecture-codeblock" language="python" caption="read file line by line - when readline() reaches the end of the file, it returns an empty string, which is falsy, and breaks the loop"
          code={`line = f.readline()\nwhile line:\n    print(line)\n    line = f.readline()`} />

        <p className="lecture-paragraph">
          Files can also be treated as iterators, and plugged directly into a for loop:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="read file using a for loop"
          code={`for line in f:\n    print(line)`} />

        <p className="lecture-paragraph">
          When a file is opened in write mode or append mode, you can write to it using the <code className="lecture-code-inline">write()</code> method, which takes a string as an argument and writes it to the file at the current position of the file cursor.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="write a line to the file - remember to include newline characters if you want to write multiple lines"
          code={`f = open("results.txt", "w")\nf.write("12489 total\\n")`} />

        <p className="lecture-paragraph">
          This will overwrite any existing content in the file. If you want to preserve the existing content and add to it, you can open the file in append mode:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="open the file in append mode to add a new line without erasing existing content"
          code={`f = open("todo.txt", "a")\nf.write("Buy milk\\n")`} />
      </section>

      {/* File Types */}
      <section className="lecture-section mini-scroll" id="file-types">
        <h3 className="lecture-section-header">File Types</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Files are stored and read from the disk in different structures.
          The most basic way is to encode the data as text, storing each character as a byte:
        </p>

        <MemoryVisualizerTable displayMode={displayMode} top={['H', 'e', 'l', 'l', 'o']} bottom={['H', 'e', 'l', 'l', 'o'].map(toHex)} caption="storing text as bytes" />

        <p className="lecture-paragraph">
          This allows for the easy inspection of most files using text editors, and many modern file formats encode their data as text:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Format</th>
                <th className="lecture-table-header">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">HTML</td>
                <td className="lecture-table-cell">Website structure</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Python</td>
                <td className="lecture-table-cell">Program source code</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">SVG</td>
                <td className="lecture-table-cell">Vector images</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Some more complicated files are just disguised directories, that store many files and folders inside them, but still use text encoding for their internal files:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Extension</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.app</code></td>
                <td className="lecture-table-cell">Application bundle on macOS, contains the executable and all resources</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.docx</code></td>
                <td className="lecture-table-cell">Microsoft Word document - actually a zip file containing XML files and media</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.xlsx</code></td>
                <td className="lecture-table-cell">Microsoft Excel spreadsheet - also a zip file with XML and media</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Storing data as text is great for readability and portability, but is not very efficient for storage space or speed, especially for large files, because it requires encoding and decoding the data to and from text.
        </p>
        <p className="lecture-paragraph">
          When you only want to store numbers, this leaves a lot of unused characters:
        </p>

        <MemoryVisualizerTable displayMode={displayMode} top={['3', '1', '4', '1', '5']} bottom={['3', '1', '4', '1', '5'].map(toHex)} caption="storing numbers as text - each digit takes a full byte" />
        <MemoryVisualizerTable displayMode={displayMode} caption={"storing numbers in binary format - much more compact"} top={[Math.floor(31415 / 128), 31415 % 128]} bottom={[Math.floor(31415 / 128), 31415 % 128].map(toHex)} />

        <p className="lecture-paragraph">
          Binary files store the data in this raw format, and require special mutually understood protocols to encode and decode the data, but are much more efficient:
        </p>
        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Category</th>
                <th className="lecture-table-header">Formats</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Images</td>
                <td className="lecture-table-cell">PNG, JPEG, GIF</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Audio</td>
                <td className="lecture-table-cell">MP3, WAV, FLAC</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Video</td>
                <td className="lecture-table-cell">MP4, MKV, AVI</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Executables</td>
                <td className="lecture-table-cell">.exe, ELF</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          To read binary data in Python, you can open the file in binary mode by adding <code className="lecture-code-inline">&apos;b&apos;</code> to the mode string:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="open a file in binary mode for reading"
          code={`f = open("image.png", "rb")`} />
      </section>

      {/* CSV */}
      <section className="lecture-section mini-scroll" id="csv">
        <h3 className="lecture-section-header">CSV</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">CSV</span> (Comma Separated Values) is a common file format for storing tabular data, where each line represents a row and columns are separated by commas.
        </p>
        <CodeBlock className="lecture-codeblock" language="csv" caption="example CSV data"
          code={`Name,Age,City,Income,Phone,Email\nAlice,30,New York,75000,555-0101,alice@mail.com\nBob,25,Chicago,62000,555-0102,bob@mail.com\nCharlie,35,San Francisco,95000,555-0103,charlie@mail.com`} />

        <p className="lecture-paragraph">
          These files are very structured - they depend on the user to have some knowledge of the data&apos;s structure.
          Python has a built-in <code className="lecture-code-inline">csv</code> module for reading and writing CSV files:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="write and read a CSV file using the csv module - the lineterminator argument ensures correct line endings"
          code={`import csv\n\nwith open("csv_test.csv", "w") as f:\n    writer = csv.writer(f, lineterminator='\\n')\n    for row in a:\n        writer.writerow(row)\n\nwith open("csv_test.csv", "r") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)`} />

        <p className="lecture-paragraph">
          However, in this example, the types of the data are not preserved. If <code className="lecture-code-inline">a</code> is a matrix of numbers, when we write it to a CSV file and read it back, all the values will be strings, and we would have to convert them back to numbers manually.
          This is not hard, but requires you to know what is in the dataset, and can be frustrating for large datasets with many columns.
        </p>

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">pandas</code> module is a popular third-party library for data analysis that provides powerful tools for working with structured data, including CSV files. It can automatically infer the types of the data and preserve them when reading and writing, making it much easier to work with tabular data in Python.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pandas automatically interprets the read CSV as numbers"
          code={`import pandas as pd\ndf = pd.DataFrame(a)\ndf.to_csv("pandas_test.csv", index=False)\n\ndf2 = pd.read_csv("pandas_test.csv")`} />

        <p className="lecture-paragraph">
          If you <span className="lecture-bold">wanted</span> to store a bunch of strings of numbers, pandas will still automatically convert them to numbers when it reads the CSV file.
        </p>
      </section>

      {/* JSON */}
      <section className="lecture-section mini-scroll" id="json">
        <h3 className="lecture-section-header">JSON</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          <span className="lecture-bold">JSON</span> (JavaScript Object Notation) has a more flexible and robust structure than CSV.
          It uses a hierarchical structure of nested objects and arrays, which can represent more complex data than the flat structure of CSV.
          It also has built-in support for preserving data types, so when you read a JSON file, the numbers will be read as numbers, strings as strings, booleans as booleans, and nulls as nulls, without any extra work required from the user.
        </p>
        <div className="mb-4 mx-auto">
          <span className="lecture-small tc3">Supported JSON types</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-orange-600 dark:text-orange-300">string</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">&quot;hello&quot;</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-yellow-600 dark:text-yellow-300">int</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">42</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-green-600 dark:text-green-300">float</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">3.14</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-blue-600 dark:text-blue-300">boolean</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">true / false</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-purple-600 dark:text-purple-300">null</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">null</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="text-red-600 dark:text-red-300">array</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">[1, 2, 3]</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><span className="text-cyan-600 dark:text-cyan-300">object</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">{'{\"key\": \"value\"}'}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Python&apos;s built-in <code className="lecture-code-inline">json</code> module can be used to read and write JSON files. It uses the <code className="lecture-code-inline">json.dumps()</code> and <code className="lecture-code-inline">json.loads()</code> functions to convert between Python objects and JSON strings, and the <code className="lecture-code-inline">json.dump()</code> and <code className="lecture-code-inline">json.load()</code> functions to read and write JSON files directly.
        </p>
        <CodeBlock className="lecture-codeblock" language="python"
          code={`import json\n\nmixed_dict = {\n    "name": "Alice",\n    "age": 30,\n    "is_student": False,\n    "scores": [85, 92, 78],\n    "address": {\n        "street": "123 Main St",\n        "city": "Anytown",\n        "zip": "12345"\n    }\n}\nresult = json.dumps(mixed_dict)`} />

        <CodeBlock className="lecture-codeblock" language="json" caption="storing a complex nested data structure in JSON format"
          code={`{\n  "name": "Alice",\n  "age": 30,\n  "is_student": false,\n  "scores": [\n    85,\n    92,\n    78\n  ],\n  "address": {\n    "street": "123 Main St",\n    "city": "Anytown",\n    "zip": "12345"\n  }\n}`} />

        <CodeBlock className="lecture-codeblock" language="python"
          code={`json.loads(result)`} />

        <p className="lecture-paragraph">
          On load, JSON is guaranteed to preserve the types of the data, so the age will be read back as a number, <code className="lecture-code-inline">is_student</code> as a boolean, and <code className="lecture-code-inline">scores</code> as a list of numbers, without any extra work required from the user.
        </p>

        <p className="lecture-paragraph">
          JSON is commonly used to pass information between different programs, especially in web development.
          Information about a user&apos;s login token and what data they are requesting is often passed as JSON between the frontend and backend of a web application, and many web APIs use JSON as their primary data format for sending and receiving data.
        </p>

        <p className="lecture-paragraph">
          It is less memory efficient than binary formats, but its flexibility and ease of use make it a popular choice for many applications.
        </p>
      </section>

      {/* Pickle */}
      <section className="lecture-section mini-scroll" id="pickle">
        <h3 className="lecture-section-header">Pickle</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          While <span className="lecture-bold">JSON</span> accounts for more types than CSV, it is still fairly limited.
          <span className="lecture-bold"> Pickle</span> takes advantage of Python&apos;s dynamic typing and can serialize and deserialize almost any Python object.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pickle can serialize functions, classes, and many other complex Python objects that JSON cannot handle"
          code={`import pickle\n\ndef add(a, b):\n    return a + b\n\npickle.dumps(add)`} />

        <p className="lecture-paragraph">
          The <span className="lecture-bold">pickling</span> or <span className="lecture-bold">serialization</span> process turns your object into a byte stream instead of a text representation. This allows it to preserve the full structure and types of the data, but it is not human readable, and can only be read by Python.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="pickle can serialize custom classes and their instances, preserving their structure and data"
          code={`class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def greet(self):\n        print(f"Hello, my name is {self.name} and I am {self.age} years old.")\n\npickle.dumps(Person)\npickle.dumps(Person("Bob", 25))`} />

        <p className="lecture-paragraph">
          Pickle is very powerful, and useful for distributing complex data structures like machine learning models, whose internal structure has a set of behaviors as well as the associated weights and biases.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="a deserialized object retains its full functionality, including methods and behaviors, not just its data"
          code={`s = pickle.dumps(Person("Bob", 25))\np = pickle.loads(s)\nprint(p.greet())`} />
      </section>

      {/* Text Encoding */}
      <section className="lecture-section mini-scroll" id="text-encoding">
        <h3 className="lecture-section-header">Text Encoding</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The standard <span className="lecture-bold">ASCII</span> encoding is a table that maps a value from 0 to 127 to a specific character. This allows for the storage of basic English text, but is very limited and cannot represent characters from other languages, emojis, or many special characters.
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Unicode</span> is a standard that assigns a unique code point to every character in every language.
          It includes sections for different languages and scripts, as well as symbols, punctuation, emojis, and many other characters. It can represent over a million different characters, and is designed to be backwards compatible with ASCII, so the first 128 code points in Unicode are the same as ASCII.
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">UTF-8</span> is a popular encoding that can represent all Unicode characters using a variable number of bytes. It is the most common encoding for text files on the web and in modern applications.
        </p>
      </section>

      {/* Exercise 1 */}
      <section className="lecture-section mini-scroll" id="exercise-1">
        <h3 className="lecture-section-header">Exercise 1</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Download the following data and calculate the average and standard deviation of the scores, then calculate each person&apos;s percentile and write the results to a new file in a nicely formatted way.
        </p>

        <a className="lecture-link-blue lecture-text inline-block mb-4" href="/images/classes/python-automation/exercise1_scores.csv" download>
          Download exercise1_scores.csv
        </a>

        <ul className="list-disc list-inside tc2 space-y-2 ml-4 mb-4 lecture-text w-full">
          <li>Download the data file.</li>
          <li>Move the data file to your working directory (use <code className="lecture-code-inline">os.getcwd()</code> to find the current directory).</li>
          <li>Load the CSV file using the <code className="lecture-code-inline">csv</code> module.</li>
            <li>Calculate the average and standard deviation of the scores:
              <div className="w-full flex flex-col items-center justify-center">
            <div className="lecture-equation my-2 w-full">
              <MathJax>{'\\[ \\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i \\]'}</MathJax>
                </div>
            <div className="lecture-equation my-2">
              <MathJax>{'\\[ \\sigma = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2} \\]'}</MathJax>
                </div>

              </div>
          </li>
          <li>Calculate each person&apos;s percentile using the formula:
            <div className="lecture-equation my-2">
              <MathJax>{'\\[ \\text{percentile} = \\frac{\\text{number of scores below } x}{n} \\times 100 \\]'}</MathJax>
            </div>
          </li>
          <li>Write the results to a new file called <code className="lecture-code-inline">results.txt</code> in the following format:
            <CodeBlock className="lecture-codeblock mt-2" language="text"
              code={`Name: Alice, Score: 85, Percentile: 70.5%\nName: Bob, Score: 92, Percentile: 90.2%\n...`} />
          </li>
        </ul>
      </section>

      {/* Exercise 2 */}
      <section className="lecture-section mini-scroll" id="exercise-2">
        <h3 className="lecture-section-header">Exercise 2</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Download this JSON file containing a binary tree, inspect its structure, and write a function to traverse the tree in order and add the values to a new array in order. Then write a function to serialize the tree back into JSON format and save it to a new file.
        </p>

        <a className="lecture-text lecture-link-blue inline-block mb-4" href="/images/classes/python-automation/exercise2_tree.json" download>
          Download exercise2_tree.json
        </a>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Download the JSON file.</li>
          <li>Move the JSON file to your working directory.</li>
          <li>Load the JSON file using the <code className="lecture-code-inline">json</code> module.</li>
          <li>Inspect the structure of the data to understand how the binary tree is represented.</li>
          <li>Write a function to traverse the tree in order (left, root, right) and add the values to a new array in order.</li>
          <li>Serialize the tree back into JSON format and save it to a new file called <code className="lecture-code-inline">tree_output.json</code>.</li>
        </ul>
      </section>

      {/* Exercise 3 */}
      <section className="lecture-section mini-scroll" id="exercise-3">
        <h3 className="lecture-section-header">Exercise 3</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Create a simple command-line to-do list application that allows the user to add, view, and delete tasks, and saves the tasks to a file so they persist between runs of the program.
        </p>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Use the <code className="lecture-code-inline">input()</code> command to get user data.</li>
          <li>Prompt the user to add, remove, or view tasks.</li>
          <li>If adding, open the file in append mode, and write the task on a new line.</li>
          <li>If viewing, open the file in read mode, and print each line as a task.</li>
          <li>If deleting, read all the tasks into a list, prompt the user for the number of the task to delete, remove it from the list, and write the updated list back to the file in write mode.</li>
        </ul>
      </section>
    </LectureTemplate>
    </MathJaxContext>
  );
}

interface FilesLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function FilesLectureIcon(props: FilesLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Opening and Editing Files" summary="Master file I/O operations in Python." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FilesLecture, FilesLectureIcon };
