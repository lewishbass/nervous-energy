'use client';
import React, { useEffect, useState } from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

interface InterfacesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function InterfacesLecture(props: InterfacesLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  const [pathTab, setPathTab] = useState<'windows' | 'macos' | 'linux'>('windows');

  // 3/25/2026 8 pm EST (UTC-5) = 2026-03-26T01:00:00Z
  const UNLOCK_TIME = new Date('2026-03-26T01:00:00Z');
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
    setSolutionsUnlocked(new Date() >= UNLOCK_TIME);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">CLI and GUI Interfaces</h2>
        <h3 className="tc2 lecture-section-header">Create User Interfaces for Your Python Programs</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-disc list-inside tc2 space-y-1">
          <li><span className="lecture-link" onClick={() => scrollToSection('sys-argv')}>Command Line Arguments with sys.argv</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('argparse')}>Parsing Parameters with argparse</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('optional-arguments')}>Optional Arguments</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('input-validation')}>User Input Validation</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('adding-scripts-to-path')}>Adding Scripts to Path</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('tkinter')}>GUI Interfaces with Tkinter</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('flask')}>Web Interfaces with Flask</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('exercise-1')}>Exercise 1 - Line Count CLI Application</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('exercise-2')}>Exercise 2 - Web Interface with Flask</span></li>
          <li><span className="lecture-link" onClick={() => scrollToSection('exercise-3')}>Exercise 3 - GUI Application with Tkinter</span></li>
        </ul>
      </section>


      {/*
      add formatting and tables to the lecture
      stick closely to the outline, and do not add any code snippets unless prompted
      \b for bold the following word
      line breaks after each line in the outline
      this lecture is either rendered in scroll mode or slideshow mode, in slideshow mode, the sections are displayed one at a time in fullscreen, and all content should be scaled based on vw
      "" quotes to emphasize code or commands
      */}

      {/* Command Line Arguments with sys.argv */}
      <section className="lecture-section mini-scroll" id="sys-argv">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Command Line Arguments with sys.argv</h3>
        <div className="lecture-header-decorator" />

        <div className="lecture-paragraph">
          Say we have a Python script <span className="lecture-bold">curve_grades.py</span> that reads a file containing student grades and applies a curve.<br />If we want to run this script many times for many different files, we would have to open the script, change the filename variable, save it, and run it each time.
        </div>

        <CodeBlock className="lecture-codeblock" language="bash" caption="running the script via the command line"
          code={`python curve_grades.py`} />

        <div className="lecture-paragraph">
          This is not very efficient. Instead, we can use command line arguments to pass the desired filename to the script each time we run it.
        </div>

        <CodeBlock className="lecture-codeblock" language="bash" caption="running the script with an argument"
          code={`python curve_grades.py quiz1.json`} />

        <div className="lecture-paragraph">
          The <span className="lecture-bold">sys</span> module provides a list called <span className="lecture-bold">argv</span> that contains the command line arguments passed to the script.
        </div>

        <CodeBlock className="lecture-codeblock" language="python"
          code={`import sys

for i, arg in enumerate(sys.argv):
    print(f"Arg-{i}: {arg}")`} />

        <div className="lecture-paragraph">
          Each element in the <span className="lecture-bold">sys.argv</span> list is a string, with spaces separating each argument. The first element (<span className="lecture-bold">sys.argv[0]</span>) is always the name of the script being run, and the subsequent elements are the arguments passed to the script.
        </div>

        <CodeBlock className="lecture-codeblock" language="bash" caption="the first sys.argv element is the script name"
          code={`python curve_grades.py quiz1.json

Output:
Arg-0: curve_grades.py
Arg-1: quiz1.json`} />

        <div className="lecture-paragraph">
          As many arguments as needed can be passed to the script, and they will be stored in the <span className="lecture-bold">sys.argv</span> list in the order they were passed.
        </div>

        <CodeBlock className="lecture-codeblock" language="bash" caption="sys.argv stores all passed arguments in a list"
          code={`python curve_grades.py quiz1.json quiz2.json quiz3.json homework1.json

Output:
Arg-0: curve_grades.py
Arg-1: quiz1.json
Arg-2: quiz2.json
Arg-3: quiz3.json
Arg-4: homework1.json`} />
      </section>

      {/* Parsing Parameters with argparse */}
      <section className="lecture-section mini-scroll" id="argparse">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Parsing Parameters with argparse</h3>
        <div className="lecture-header-decorator" />
        <div className="lecture-paragraph">
          <span className="lecture-bold">We</span> know what command line arguments to supply the program and what the program does because we wrote the program.<br />
          But if our friend <span className="lecture-bold">Joe</span> sees how useful our script is and wants to use it, and we don&apos;t want to have to walk him through how it works every time he has a question.
        </div>
        <div className="lecture-paragraph">
          The <span className="lecture-bold">argparse</span> module provides a tool to automatically decode arguments and display helpful usage messages for anyone who runs the script.
        </div>
        <CodeBlock className="lecture-codeblock" language="python" caption="setting up argparse to parse the positional filename argument"
          code={`import argparse

parser = argparse.ArgumentParser(description="A script that adds curves to student grades.")
parser.add_argument("filename", help="the name of the file to process, must be a .json file")
args = parser.parse_args()`} />
        <div className="lecture-paragraph">
          The resulting args are stored in the <span className="lecture-bold">args</span> variable as an object with attributes corresponding to each argument defined in the parser.
        </div>
        <CodeBlock className="lecture-codeblock" language="bash"
          code={`python curve_grades.py quiz1.json`} />
        <CodeBlock className="lecture-codeblock" language="python"
          code={`print(args.filename) # quiz1.json`} />
        <div className="lecture-paragraph">
          If someone runs the script without providing the required <span className="lecture-bold">filename</span> argument, argparse automatically prints a clear error:
        </div>
        <CodeBlock className="lecture-codeblock" language="bash" caption="error when required argument is missing"
          code={`usage: curve_grades.py [-h] filename
curve_grades.py: error: the following arguments are required: filename`} />
        <div className="lecture-paragraph">
          Running the script with <span className="lecture-bold">-h</span> or <span className="lecture-bold">--help</span> prints a description of the script and all its arguments:
        </div>
        <CodeBlock className="lecture-codeblock" language="bash" caption="help message generated by argparse"
          code={`A script that adds curves to student grades.

positional arguments:
  filename    the name of the file to process, must be a .json file`} />
      </section>

      {/* Optional Arguments */}
      <section className="lecture-section mini-scroll" id="optional-arguments">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Optional Arguments</h3>
        <div className="lecture-header-decorator" />
        <div className="lecture-paragraph">
          Sometimes we want to provide additional functionality that is not always needed. For example, we might want to let <span className="lecture-bold">Joe</span> specify the amount of the curve to apply, but fall back to a <span className="lecture-bold">default value</span> of 5 points if they don&apos;t.
        </div>
        <div className="lecture-paragraph">
          The argparse module lets us define optional arguments using the <span className="lecture-bold">add_argument</span> method with a short flag (e.g. <span className="lecture-bold">-c</span>) and a long flag (e.g. <span className="lecture-bold">--curve</span>), along with a default value.
        </div>
        <CodeBlock className="lecture-codeblock" language="python" caption="defining an optional argument"
          code={`parser.add_argument("-c", "--curve", default=5, help="the amount of points to add to each grade")`} />
        <div className="lecture-paragraph">
          The script can now be run with or without the optional curve argument:
        </div>
        <CodeBlock className="lecture-codeblock" language="bash" caption="optional argument usage"
          code={`python curve_grades.py quiz1.json
python curve_grades.py quiz1.json -c 10
python curve_grades.py quiz1.json --curve 15`} />
        <div className="lecture-paragraph">
          The generated help message now includes the optional argument:
        </div>
        <CodeBlock className="lecture-codeblock" language="bash" caption="updated help message"
          code={`A script that adds curves to student grades.

options:
  -h, --help            show this help message and exit
  -c CURVE, --curve CURVE
                        the amount of points to add to each grade`} />
        <div className="lecture-paragraph">
          If <span className="lecture-bold">Joe</span> does not supply the optional argument, the script uses the <span className="lecture-bold">default value</span> automatically.
        </div>
      </section>

      {/* User Input Validation */}
      <section className="lecture-section mini-scroll" id="input-validation">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>User Input Validation</h3>
        <div className="lecture-header-decorator" />
        <div className="lecture-paragraph">
          <span className="lecture-bold">Joe</span> now has a general understanding of what the script does and how to use it, but has no deeper knowledge of how it works internally.
          This guarantees that they will attempt to use it in strange and unexpected ways:
        </div>
        <CodeBlock className="lecture-codeblock" language="bash" caption="common misuses"
          code={`python curve_grades.py quiz1.json -c twenty   # string instead of integer
python curve_grades.py quiz1.json -c -5        # negative curve value
python curve_grades.py quiz1.json quiz1        # missing file extension`} />
        <div className="lecture-paragraph">
          If we don&apos;t communicate every error in a clear and helpful way, they will get frustrated and stop using our script.
          The argparse module lets us enforce that a supplied argument is of a specific <span className="lecture-bold">type</span>, and automatically reports a helpful error if <span className="lecture-bold">Joe</span> provides an invalid value.
        </div>
        <CodeBlock className="lecture-codeblock" language="python" caption="enforcing the argument type"
          code={`parser.add_argument("-c", "--curve", type=int, default=5, help="the amount of points to add to each grade")`} />
        <CodeBlock className="lecture-codeblock" language="bash" caption="automatic error for the wrong type"
          code={`python curve_grades.py quiz1.json -c twenty
curve_grades.py: error: argument -c/--curve: invalid int value: 'twenty'`} />
        <div className="lecture-paragraph">
          We can also add our own validation logic for cases argparse can&apos;t handle automatically, using <span className="lecture-bold">parser.error()</span> to print a message and exit cleanly:
        </div>
        <CodeBlock className="lecture-codeblock" language="python" caption="check for common misuses and report how to fix them"
          code={`import os

if '.' not in args.filename:
    for file in os.listdir():
        if file == args.filename + '.json':
            args.filename += '.json'
            break
    else:
        parser.error("could not find a .json file with that name")

if not args.filename.endswith('.json'):
    parser.error("the filename must be a .json file")

if args.filename not in os.listdir():
    parser.error("the specified file does not exist in the current directory")

if args.curve < 0:
    parser.error("the curve value cannot be negative")`} />
      </section>

      {/* Adding Scripts to Path */}
      <section className="lecture-section mini-scroll" id="adding-scripts-to-path">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Adding Scripts to Path</h3>
        <div className="lecture-header-decorator" />
        <div className="lecture-paragraph">
          <span className="lecture-bold">Joe</span> is now running the script all the time, but still has to type the <span className="lecture-bold">full path</span> to the script every time, which is inconvenient.
        </div>
        <div className="lecture-paragraph">
          The <span className="lecture-bold">PATH</span> is a list of directories that the operating system searches when you type a command in the terminal.
          By placing our script in one of those directories, it can be run from <span className="lecture-bold">anywhere</span> without specifying its full path.
        </div>
        <div className="lecture-tab-container">
          {(['windows', 'macos', 'linux'] as const).map(tab => (
            <span
              key={tab}
              className={`lecture-tab ${pathTab === tab ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={() => setPathTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          ))}
        </div>
        <div className="lecture-tab-content">
          {pathTab === 'windows' && (
            <>
              <div className="lecture-paragraph">
                On Windows, create a dedicated folder for your scripts (e.g. <span className="lecture-bold">C:\Users\Joe\Scripts</span>), copy your script there, then add that folder to the <span className="lecture-bold">PATH</span> environment variable.
              </div>
              <CodeBlock className="lecture-codeblock" language="bash" caption="1. copy the script to your scripts folder"
                code={`copy curve_grades.py C:\\Users\\Joe\\Scripts\\`} />
              <div className="lecture-paragraph">
                Open <span className="lecture-bold">System Properties</span> → <span className="lecture-bold">Environment Variables</span> → select <span className="lecture-bold">Path</span> under &quot;System variables&quot; → <span className="lecture-bold">Edit</span> → <span className="lecture-bold">New</span> → enter <span className="lecture-bold">C:\Users\Joe\Scripts</span>.
              </div>
              <div className="lecture-paragraph">
                Restart your terminal and you can now run the script by name from anywhere:
              </div>
              <CodeBlock className="lecture-codeblock" language="bash" caption="running the script from any directory"
                code={`python curve_grades.py quiz1.json`} />
            </>
          )}
          {pathTab === 'macos' && (
            <>
              <div className="lecture-paragraph">
                On macOS, add a <span className="lecture-bold">shebang line</span> to the top of your script, make it executable, and place it in a directory on your PATH such as <span className="lecture-bold">/usr/local/bin</span>.
              </div>
              <CodeBlock className="lecture-codeblock" language="python" caption="1. add a shebang as the first line of curve_grades.py"
                code={`#!/usr/bin/env python3`} />
              <CodeBlock className="lecture-codeblock" language="bash" caption="2. make the script executable and move it to /usr/local/bin"
                code={`chmod +x curve_grades.py
sudo mv curve_grades.py /usr/local/bin/curve_grades`} />
              <div className="lecture-paragraph">
                You can now run the script from any directory without the <span className="lecture-bold">python</span> prefix:
              </div>
              <CodeBlock className="lecture-codeblock" language="bash" caption="running the script from any directory"
                code={`curve_grades quiz1.json`} />
            </>
          )}
          {pathTab === 'linux' && (
            <>
              <div className="lecture-paragraph">
                On Linux, the process is the same as macOS. Add a shebang, make the script executable, then place or symlink it into <span className="lecture-bold">~/bin</span> or <span className="lecture-bold">/usr/local/bin</span>.
              </div>
              <CodeBlock className="lecture-codeblock" language="python" caption="1. add a shebang as the first line of curve_grades.py"
                code={`#!/usr/bin/env python3`} />
              <CodeBlock className="lecture-codeblock" language="bash" caption="2. create ~/bin, make the script executable, and move it there"
                code={`mkdir -p ~/bin
chmod +x curve_grades.py
mv curve_grades.py ~/bin/curve_grades`} />
              <CodeBlock className="lecture-codeblock" language="bash" caption="3. ensure ~/bin is on your PATH (add to ~/.bashrc or ~/.zshrc)"
                code={`export PATH="$HOME/bin:$PATH"`} />
              <div className="lecture-paragraph">
                Restart your terminal (or run <span className="lecture-bold">source ~/.bashrc</span>) and run the script from anywhere:
              </div>
              <CodeBlock className="lecture-codeblock" language="bash" caption="running the script from any directory"
                code={`curve_grades quiz1.json`} />
            </>
          )}
        </div>
      </section>

      {/* GUI Interfaces with Tkinter */}
      <section className="lecture-section mini-scroll" id="tkinter">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>GUI Interfaces with Tkinter</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Tkinter</span> is a built-in Python library for creating graphical user interfaces (GUIs).
          It provides a simple way to create windows, buttons, text fields, and other common GUI elements.
        </p>
        <p className="lecture-paragraph">
          Your GUI can contain <span className="lecture-bold">fields</span> to pass information to the program, <span className="lecture-bold">buttons</span> to trigger actions, and <span className="lecture-bold">displays</span> to show output or results.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="example of a tkinter app layout"
          code={`import tkinter as tk
from tkinter import scrolledtext

def search_files():
    # Dummy search function
    pass

# ── Window ─────────────────────────
root = tk.Tk()
root.title("File Search")
root.geometry("750x450")

# ── Search bar ─────────────────────
frame_top = tk.Frame(root)
frame_top.pack(fill=tk.X, padx=10, pady=10)

tk.Label(frame_top, text="Search Term:").pack(side=tk.LEFT)

entry_search = tk.Entry(frame_top)
entry_search.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(5, 5))
entry_search.bind("<Return>", lambda e: search_files())   # Enter key triggers search

btn_search = tk.Button(frame_top, text="Search", command=search_files)
btn_search.pack(side=tk.LEFT)

# ── Output area ────────────────────
output = scrolledtext.ScrolledText(root, wrap=tk.WORD, font=("Courier", 10))
output.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

root.mainloop()`} />

        <p className="lecture-paragraph">
          Items are added to the root node and bound to functions.
          The <code className="lecture-code-inline">mainloop()</code> keeps the window open and responsive to user interactions, and calls the appropriate functions when buttons are clicked or input is entered.
        </p>
      </section>

      {/* Web Interfaces with Flask */}
      <section className="lecture-section mini-scroll" id="flask">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Web Interfaces with Flask</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Flask</span> is an alternative way to implement GUIs by creating a web server that serves HTML to the user, then using forms and JavaScript to send user input back to the server and display results.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="flask click counter"
          code={`from flask import Flask

app = Flask(__name__)
count = 0

@app.route("/")
def index():
    return f"""
    <h1>Clicks: <span id="c">{count}</span></h1>
    <button onclick="fetch('/click',{{method:'POST'}})
    .then(r=>r.text()).then(t=>document.getElementById('c').textContent=t)">
      Click me!
    </button>
    """

@app.route("/click", methods=["POST"])
def click():
    global count
    count += 1
    return str(count)

if __name__ == "__main__":
    app.run(debug=True)`} />
      </section>



      {/* Exercise 1 */}
      <section className="lecture-section mini-scroll" id="exercise-1">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 1 — Line Count CLI Application</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Build a CLI tool to count the total number of lines of text across all files in a directory.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Import the <code className="lecture-code-inline">argparse</code> module and create a parser object.
            <CodeBlock className="lecture-codeblock" language="python" caption="import and init parser"
              code={`import argparse\n\nparser = argparse.ArgumentParser(description="Count lines in a directory")`} />
          </li>
          <li className="lecture-exercise-item">
            Add the <code className="lecture-code-inline">directory_name</code> argument to the parser with a description.
            <CodeBlock className="lecture-codeblock" language="python" caption="adding a positional argument"
              code={`parser.add_argument( add arugment name, help= add argument description string)`} />
          </li>
          <li className="lecture-exercise-item">
            Use <code className="lecture-code-inline">os.path.isdir()</code> to check if the provided directory name is a valid directory, and <code className="lecture-code-inline">parser.error()</code> to report an error if it is not.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`if not os.path.isdir(# add your code):\n    parser.error(# add your error message here)`} />
          </li>
          <li className="lecture-exercise-item">
            Use <code className="lecture-code-inline">os.listdir()</code> to get a list of all files in the directory, and <code className="lecture-code-inline">os.path.isfile()</code> to filter out only the files.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`for file in os.listdir(# your code here):`} />
          </li>
          <li className="lecture-exercise-item">
            For each file, open it, read the contents, and count the number of line breaks.
            <CodeBlock className="lecture-codeblock" language="python" caption="open file and count lines"
              code={`with open(# your code here) as f:\n    contents = f.read()\n    line_count = contents.count('\\n') + 1`} />
          </li>
          <li className="lecture-exercise-item">Add the line count for this file to the running total.</li>
          <li className="lecture-exercise-item">Print the total line count after processing all files.</li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="solution"
              code={`import argparse\nimport os\n\nparser = argparse.ArgumentParser(description="Count lines in a directory")\nparser.add_argument("directory_name", help="the directory to count lines in")\nargs = parser.parse_args()\n\nif not os.path.isdir(args.directory_name):\n    parser.error(f\"{args.directory_name} is not a valid directory\")\n\ntotal_lines = 0\nfor file in os.listdir(args.directory_name):\n    filepath = os.path.join(args.directory_name, file)\n    if os.path.isfile(filepath):\n        try:\n            with open(filepath, "r") as f:\n                contents = f.read()\n                total_lines += contents.count('\\n') + 1\n        except:\n            pass  # skip binary or unreadable files\n\nprint(f"Total lines: {total_lines}")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 25, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 2 */}
      <section className="lecture-section mini-scroll" id="exercise-2">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 2 — Web Interface with Flask</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Build a simple message board web application using Flask where users can submit messages and see a list of all submitted messages.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Install the <code className="lecture-code-inline">flask</code> module using pip.
            <CodeBlock className="lecture-codeblock" language="bash"
              code={`pip install flask`} />
          </li>
          <li className="lecture-exercise-item">
            Import the Flask module and create a Flask app instance.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`from flask import Flask, request\napp = Flask(__name__)`} />
          </li>
          <li className="lecture-exercise-item">
            Create a global list variable to store submitted messages.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`messages = []`} />
          </li>
          <li className="lecture-exercise-item">
            Define a route for the home page that displays an HTML page with a section to display past messages, a text field, a submit button, and a refresh button.
            <CodeBlock className="lecture-codeblock" language="python" caption="home page route"
              code={`@app.route("/")\ndef index():\n    return """\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Message Board</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: system-ui, sans-serif; background: #f8f9fa; display: flex; justify-content: center; padding: 40px 20px; }\n    .card { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); width: 100%; max-width: 560px; padding: 28px; }\n    h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 20px; color: #111; }\n    #messages { min-height: 120px; max-height: 340px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }\n    .msg { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-size: 0.95rem; color: #333; }\n    .empty { color: #aaa; font-size: 0.9rem; text-align: center; padding: 24px 0; }\n    .row { display: flex; gap: 8px; }\n    input { flex: 1; padding: 10px 14px; border: 1px solid #dde1e7; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.15s; }\n    input:focus { border-color: #6366f1; }\n    button { padding: 10px 18px; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer; transition: background 0.15s; }\n    .btn-send { background: #6366f1; color: white; }\n    .btn-send:hover { background: #4f46e5; }\n    .btn-refresh { background: #f1f5f9; color: #555; border: 1px solid #dde1e7; }\n    .btn-refresh:hover { background: #e2e8f0; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Message Board</h1>\n    <div id="messages"><div class="empty">No messages yet.</div></div>\n    <div class="row">\n      <input id="msg-input" type="text" placeholder="Type a message..." />\n      <button class="btn-send" onclick="sendMessage()">Send</button>\n      <button class="btn-refresh" onclick="refreshMessages()">Refresh</button>\n    </div>\n  </div>\n  <script>\n    function renderMessages(html) {\n      document.getElementById("messages").innerHTML = html || '<div class="empty">No messages yet.</div>';\n    }\n    function sendMessage() {\n      const input = document.getElementById("msg-input");\n      const body = new URLSearchParams({ message: input.value });\n      fetch("/submit", { method: "POST", body })\n        .then(r => r.text()).then(renderMessages);\n      input.value = "";\n    }\n    function refreshMessages() {\n      fetch("/refresh").then(r => r.text()).then(renderMessages);\n    }\n    document.getElementById("msg-input").addEventListener("keydown", e => {\n      if (e.key === "Enter") sendMessage();\n    });\n  </script>\n</body>\n</html>\n"""`} />
          </li>
          <li className="lecture-exercise-item">
            Define this function to format messages for returning.
            <CodeBlock className="lecture-codeblock" language="python" caption="render helper" code={`def render_messages():
    html = ""
    for m in messages:
        html += f'<div style="padding:8px 12px;margin:6px 0;background:#f4f4f5;border-radius:8px">{m}</div>'
    return html`} />
          </li>
          <li className="lecture-exercise-item">
            Define a route to handle message submission that accepts POST requests, retrieves the submitted message from the form data, appends it to the messages list, and returns the updated list.
            <CodeBlock className="lecture-codeblock" language="python" caption="submit route"
              code={`@app.route("/submit", methods=["POST"])\ndef submit():\n    message = request.form.get("message")\n    # add your code here`} />
          </li>
          <li className="lecture-exercise-item">
            Define a route to handle refreshing messages that returns the current list of messages as a response.
            <CodeBlock className="lecture-codeblock" language="python" caption="refresh route"
              code={`@app.route("/refresh", methods=["GET"])\ndef refresh():\n    # add code to update message list`} />
          </li>
          <li className="lecture-exercise-item">
            Run the Flask app.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`if __name__ == "__main__":\n    app.run()`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="solution"
              code={`from flask import Flask, request\n\napp = Flask(__name__)\nmessages = []\n\n@app.route("/")\ndef index():\n    msg_html = ""\n    for m in messages:\n        msg_html += f'<div style="padding:8px 12px;margin:6px 0;background:#f4f4f5;border-radius:8px">{m}</div>'\n    return f\"\"\"\n    <!DOCTYPE html>\n    <html>\n    <head><title>Message Board</title></head>\n    <body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:0 20px">\n      <h1 style="font-weight:700">Message Board</h1>\n      <div id="messages">{msg_html}</div>\n      <form style="display:flex;gap:8px;margin-top:16px"\n            onsubmit="fetch('/submit',{{method:'POST',body:new URLSearchParams(new FormData(this))}})\n            .then(r=>r.text()).then(t=>document.getElementById('messages').innerHTML=t);return false;">\n        <input name="message" placeholder="Type a message..."\n               style="flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px" />\n        <button type="submit"\n                style="padding:8px 20px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer">\n          Send\n        </button>\n      </form>\n      <button onclick="fetch('/refresh').then(r=>r.text()).then(t=>document.getElementById('messages').innerHTML=t)"\n              style="margin-top:8px;padding:6px 16px;border:1px solid #ddd;border-radius:8px;cursor:pointer">\n        Refresh\n      </button>\n    </body>\n    </html>\n    \"\"\"\n\n@app.route("/submit", methods=["POST"])\ndef submit():\n    message = request.form.get("message")\n    if message:\n        messages.append(message)\n    return render_messages()\n\n@app.route("/refresh", methods=["GET"])\ndef refresh():\n    return render_messages()\n\ndef render_messages():\n    html = ""\n    for m in messages:\n        html += f'<div style="padding:8px 12px;margin:6px 0;background:#f4f4f5;border-radius:8px">{m}</div>'\n    return html\n\nif __name__ == "__main__":\n    app.run()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 25, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 3 */}
      <section className="lecture-section mini-scroll" id="exercise-3">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 3 — GUI Application with Tkinter</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Build a simple GUI application using Tkinter that allows the user to control a virtual robot. Have buttons for up/down, left/right, and a display that shows the current x, y coordinates of the robot.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Import the <code className="lecture-code-inline">tkinter</code> module and create a root window.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import tkinter as tk\nroot = tk.Tk()`} />
          </li>
          <li className="lecture-exercise-item">
            Create a label widget to display the robot&apos;s coordinates and pack it into the root window.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`label = tk.Label(root, text="(0, 0)")\nlabel.pack()`} />
          </li>
          <li className="lecture-exercise-item">
            Initialize variables to store the robot&apos;s current x and y coordinates.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`x, y = 0, 0`} />
          </li>
          <li className="lecture-exercise-item">
            Define a function to update the label text with the current coordinates.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`def update_label(x, y):\n    label.config(text=f"({x}, {y})")`} />
          </li>
          <li className="lecture-exercise-item">
            Define four functions for moving up, down, left, and right that update the robot&apos;s coordinates and call the update function.
            <CodeBlock className="lecture-codeblock" language="python" caption="example: move up function"
              code={`def move_up():\n    global y\n    y += 1\n    update_label(x, y)`} />
          </li>
          <li className="lecture-exercise-item">
            Add four buttons for controlling the robot, each bound to the corresponding movement function, and pack them into the root window.
            <CodeBlock className="lecture-codeblock" language="python" caption="example: up button"
              code={`btn_up = tk.Button(root, text="Up", command=move_up)\nbtn_up.pack()`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="solution"
              code={`import tkinter as tk\n\nroot = tk.Tk()\nroot.title("Robot Controller")\n\nx, y = 0, 0\n\nlabel = tk.Label(root, text="(0, 0)", font=("Courier", 24))\nlabel.pack(pady=20)\n\ndef update_label():\n    label.config(text=f"({x}, {y})")\n\ndef move_up():\n    global y\n    y += 1\n    update_label()\n\ndef move_down():\n    global y\n    y -= 1\n    update_label()\n\ndef move_left():\n    global x\n    x -= 1\n    update_label()\n\ndef move_right():\n    global x\n    x += 1\n    update_label()\n\nframe = tk.Frame(root)\nframe.pack(pady=10)\n\nbtn_up = tk.Button(frame, text="Up", width=8, command=move_up)\nbtn_up.grid(row=0, column=1)\n\nbtn_left = tk.Button(frame, text="Left", width=8, command=move_left)\nbtn_left.grid(row=1, column=0)\n\nbtn_right = tk.Button(frame, text="Right", width=8, command=move_right)\nbtn_right.grid(row=1, column=2)\n\nbtn_down = tk.Button(frame, text="Down", width=8, command=move_down)\nbtn_down.grid(row=2, column=1)\n\nroot.mainloop()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 25, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>
    </LectureTemplate>
  );
}

interface InterfacesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function InterfacesLectureIcon(props: InterfacesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="CLI and GUI Interfaces" summary="Create user interfaces for your Python programs." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { InterfacesLecture, InterfacesLectureIcon };
