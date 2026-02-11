'use client';
import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';
import next from 'next';
import { FaArrowRight, FaArrowRotateRight } from 'react-icons/fa6';

const scTable = [
  { char: 'NUL', desc: 'null' },
  { char: 'SOH', desc: 'start of heading' },
  { char: 'STX', desc: 'start of text' },
  { char: 'ETX', desc: 'end of text' },
  { char: 'EOT', desc: 'end of transmission' },
  { char: 'ENQ', desc: 'enquiry' },
  { char: 'ACK', desc: 'acknowledge' },
  { char: 'BEL', desc: 'bell' },
  { char: 'BS', desc: 'backspace' },
  { char: 'HT', desc: 'horizontal tab' },
  { char: 'LF', desc: 'line feed' },
  { char: 'VT', desc: 'vertical tab' },
  { char: 'FF', desc: 'form feed' },
  { char: 'CR', desc: 'carriage return' },
  { char: 'SO', desc: 'shift out' },
  { char: 'SI', desc: 'shift in' },
  { char: 'DLE', desc: 'data link escape' },
  { char: 'DC1', desc: 'device control 1' },
  { char: 'DC2', desc: 'device control 2' },
  { char: 'DC3', desc: 'device control 3' },
  { char: 'DC4', desc: 'device control 4' },
  { char: 'NAK', desc: 'negative acknowledge' },
  { char: 'SYN', desc: 'synchronous idle' },
  { char: 'ETB', desc: 'end of transmission block' },
  { char: 'CAN', desc: 'cancel' },
  { char: 'EM', desc: 'end of medium' },
  { char: 'SUB', desc: 'substitute' },
  { char: 'ESC', desc: 'escape' },
  { char: 'FS', desc: 'file separator' },
  { char: 'GS', desc: 'group separator' },
  { char: 'RS', desc: 'record separator' },
  { char: 'US', desc: 'unit separator' },
];


interface BackgroundLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function BagLecture(props: BackgroundLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  const [memoryArrayExample, setMemoryArrayExample] = useState(() => new Array(4).fill(0).map(() => Math.floor(Math.random() * 256)));
  const [pointerMemoryArrayExample, setPointerMemoryArrayExample] = useState(() => new Array(4).fill(0).map(() => Math.floor(Math.random() * 256)));
  const [varIndex, setVarIndex] = useState(() => Math.floor(Math.random() * 4));
  const pointerIndex = memoryArrayExample[varIndex];
  
  const refreshMemory = () => {
    const newMemory = new Array(4).fill(0).map(() => Math.floor(Math.random() * 256));
    setMemoryArrayExample(newMemory);
    const newPointerMemory = new Array(4).fill(0).map(() => Math.floor(Math.random() * 256));
    setPointerMemoryArrayExample(newPointerMemory);
    setVarIndex(Math.floor(Math.random() * newMemory.length));
  };
  
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const [commentTab, setCommentTab] = useState<'python' | 'jupyter'>('python');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>Strings, Functions, Classes and Pointers</h2>
        <h3 className="tc2 lecture-section-header">Brief Intro for Essential Python concepts that we will cover in more detail later</h3>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('comments')}>Comments</li>
          <li className="lecture-link" onClick={() => scrollToSection('chars')}>Characters</li>
          <li className="lecture-link" onClick={() => scrollToSection('strings')}>Strings</li>
          <li className="lecture-link" onClick={() => scrollToSection('functions')}>Functions</li>
          <li className="lecture-link" onClick={() => scrollToSection('scope')}>Scope</li>
          <li className="lecture-link" onClick={() => scrollToSection('classes-objects')}>Classes and Objects</li>
          <li className="lecture-link" onClick={() => scrollToSection('pointers-references')}>Pointers and References</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="comments">
        <h3 className="lecture-section-header">Comments</h3>
        <div className="lecture-header-decorator" />
        
        <p className="lecture-paragraph">
          Even with clean code, it can be difficult to remember the intent behind sections. Python ignores all text on a line that comes after a <span className="lecture-bold">#</span> symbol.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="No idea whats going on here"
          code={`x = p0.x + windSpeed * time + (v0.x - windSpeed) * (1 - exp(-drag*time)) / drag
y = p0.y + gravity/drag * time + (v0.y - gravity/drag) * (1 - exp(-drag*time)) / drag`} />

        <CodeBlock className="lecture-codeblock" language="python" caption="Much easier to understand and debug"
          code={`# Calculate position based on initial conditions and time
# pos = initial position + (terminal velocity) + 
#      (initial velocity - terminal velocity) * (1 - exp(-drag*time)) / drag
x = p0.x + windSpeed * time + (v0.x - windSpeed) * (1 - exp(-drag*time)) / drag
y = p0.y + gravity/drag * time + (v0.y - gravity/drag) * (1 - exp(-drag*time)) / drag`} />
        <p className="lecture-paragraph">
          Multiline comments can be created using triple quotes <code className="lecture-code-inline">"""</code> or <code className="lecture-code-inline">'''</code>, but these are typically used for <a className="lecture-link" href="https://peps.python.org/pep-0257/" target="_blank" rel="noopener">docstrings</a> <span className="opacity-50">(documentation strings)</span> rather than general comments.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="Using docstrings for multi-line comments"
          code={`def example_function():
    """
    This function does something important.
    It takes no parameters and returns nothing.
    """
    pass`} />
        <p className="lecture-paragraph">
          Sections of code can be temporarily removed for testing purposes by commenting them out:
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${commentTab === 'python' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setCommentTab('python'); e.stopPropagation(); }}
            >
              Python
            </button>
            <button
              className={`lecture-tab ${commentTab === 'jupyter' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setCommentTab('jupyter'); e.stopPropagation(); }}
            >
              Jupyter
            </button>
          </div>

          {commentTab === 'python' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                Fetching cat images from an API
              </p>
              <CodeBlock className="lecture-codeblock" language="bash" caption="installing Python Image Library (PIL) via pip" code={`pip install pillow`} />
              <CodeBlock className="lecture-codeblock" language="python" caption="Commenting out code for testing"
                code={`import requests
from PIL import Image
from io import BytesIO

# get random image url from cat api
# image_url = requests.get('https://api.thecatapi.com/v1/images/search').json()[0]['url']
# print(image_url)

# for testing, use a fixed image url
image_url = 'https://lewisbass.org/images/pets/kuiper_c.jpg'

# fetch image from url and display it
image_data = requests.get(image_url)
img = Image.open(BytesIO(image_data.content))
img.show()`} />
            </div>
          )}

          {commentTab === 'jupyter' && (
            <div className='lecture-tab-content'>
              <p className="lecture-paragraph">
                Fetching cat images from an API
              </p>
              {/*<CodeBlock className="lecture-codeblock" language="jupyter" caption="using pip through jupyter" code={`# install Python Image Library (PIL)
%pip install pillow`} />*/}
              <CodeBlock className="lecture-codeblock" language="jupyter" caption="importing libraries for image display" code={`import requests
from IPython.display import Image
`} />
              <CodeBlock className="lecture-codeblock" language="jupyter" caption="commenting out code for testing" code={`# get random image url from cat api
# image_url = requests.get('https://api.thecatapi.com/v1/images/search').json()[0]['url']

# for testing, use a fixed image url
image_url = 'https://lewisbass.org/images/pets/kuiper_c.jpg'

print(image_url)

# fetch image from url and display it
Image(url=image_url, height=400)
`} />
            </div>
          )}
        </div>
        
      </section>

      <section className="lecture-section mini-scroll" id="chars">
        <h3 className="lecture-section-header">Characters</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://cs.smu.ca/~porter/csc/ref/ascii.html" target='blank' rel='noopener'>char</a> is a single byte of information the computer interprets as a text character. It does this based off the <a className="lecture-link" href="https://cs.smu.ca/~porter/csc/ref/ascii.html" target='blank' rel='noopener'>ASCII</a> <span className="opacity-50">(American Standard Code for Information Interchange)</span> character encoding standard.
        </p>
        
          <div className="lecture-bold mb-2">ASCII Control Characters</div>

            <div className="flex flex-row gap-4 overflow-y-scroll max-h-100 min-h-100 w-full rounded-lg mini-scroll">
            <table className="lecture-table">
              <thead>
                <tr className="lecture-table-row">
                  <th className="lecture-table-header w-fit">Hex</th>
                  <th className="lecture-table-header w-fit">Chr</th>
                  <th className="lecture-table-header w-fit"></th>
                </tr>
              </thead>
              <tbody>
                {scTable.map((item, index) => (
                  <tr key={index} className={`${index < scTable.length - 1 ? 'lecture-table-row compact' : ''} ${index % 2 === 0 ? 'bg-gray-500/10' : ''}`}>
                    <td className="lecture-table-cell compact pl-2 w-fit">{`${index.toString(16).toUpperCase().padStart(2, '0')}`}</td>
                    <td className="lecture-table-cell compact w-fit">{item.char}</td>
                    <td className="lecture-table-cell compact w-fit text-nowrap">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Array.from({ length: 3 }, (_, c) => (
              <table className="lecture-table">
                <thead>
                  <tr className="lecture-table-row">
                    <th className="lecture-table-header w-fit">Hex</th>
                    <th className="lecture-table-header w-fit">Chr</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 32 }, (_, index) => {
                    const i = index + 32 * (c + 1);
                    return (
                      <tr key={i} className={`${index < 31 ? 'lecture-table-row compact' : ''} ${index % 2 === 0 ? 'bg-gray-500/10' : ''}`}>
                        <td className="lecture-table-cell compact pl-2 w-fit">{`${i.toString(16).toUpperCase().padStart(2, '0')}`}</td>
                        <td className="lecture-table-cell compact w-fit">{i == 32 ? 'Space' : i == 127 ? 'DEL' : String.fromCharCode(i)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}
          </div>
        <p className="lecture-paragraph">
          This set was originally designed for interacting with terminals so some of them <span className="opacity-50">(BEL, DEL, BS, TAB)</span> represent actions rather than characters.
        </p>

        <p className="lecture-paragraph">
          Python doesn't have a separate char type, instead it uses strings of length 1 to represent characters.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`char_a = 'a'         # typically represented using single quotes
char_a = chr(0x61)        # using the chr() function with ASCII code, 0x is hexadecimal prefix3333
char_newline = '\\n'  # newline character
char_tab = '\\t'      # tab character
char_return = '\\r'   # carriage return character`}
          language="python"
          caption="creating characters in Python"
        />
        
      </section>

      <section className="lecture-section mini-scroll" id="strings">
        <h3 className="lecture-section-header">Strings</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <span className="lecture-bold">string</span> is a sequence of characters used to represent text. In Python, strings are immutable, meaning once created, they cannot be changed in place.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`message = "Hello, World!"
name = 'Python'
print(len(name))  # prints length of the string : 6

multiline = """This is a
multi-line string
with triple quotes."""

multiline2 = "This is a multi-line string \\n with a newline character."`}
          language="python"
          caption="creating and accessing strings"
        />


        <div className="mb-4">
          <span className="lecture-link">Built In String Operations</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">+</td>
                <td className="lecture-table-cell">Concatenation</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">"Hello" + " World" = "Hello World"</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">*</td>
                <td className="lecture-table-cell">Repetition</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">"Ha" * 3 = "HaHaHa"</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">in</td>
                <td className="lecture-table-cell">Membership</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">"lo" in "Hello" = True</code></td>
              </tr>
            </tbody>
          </table>
        </div>


      </section>      

      <section className="lecture-section mini-scroll" id="functions">
        <h3 className="lecture-section-header">Functions</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A <a className="lecture-link" href="https://www.geeksforgeeks.org/python/python-functions/" target='_blank' rel="noopener">function</a> is a reusable block of code that performs a specific task. They help organize code, avoid repetition, and compartmentalize your program
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`# Basic function definition
import time
from datetime import datetime

def printTime():
    """Prints the current time in HH:MM:SS format"""
    time = datetime.now().strftime("%H:%M:%S")
    print(f"The current time is: {time}")

# Calling the function
printTime()
time.sleep(1)
printTime()`}
          language="python"
          caption="defining and calling a function"
        />

        <p className="lecture-paragraph">
          Functions can return values using the <code className="lecture-code-inline">return</code> statement:
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`
from datetime import datetime
START_TIME = datetime.now().timestamp()
# timestamp represents seconds since jan 1, 1970, 0:00:00 UTC
# 32 bit timestamps will overflow on jan 19, 2038, 3:14:07 UTC
# if we had just used 64 bit timestamps we would have until 292 billion years from now

def runTime():
    """Returns the elapsed time since the program started in seconds"""
    current_time = datetime.now().timestamp()
    delta = current_time - START_TIME
    return delta

# do some tasks
# calculate some values
print("This program took ", runTime(), " seconds to run.")`}
          language="python"
          caption="function with return value"
        />

        <p className="lecture-paragraph">
          Functions can also take parameters, which are values passed into the function to customize its behavior:
        </p>
        
        <CodeBlock className="lecture-codeblock"
          code={`def slopeIntercept(m, x, b):
    """Returns the y value based on slope-intercept form y = mx + b"""
    return m * x + b

slope = 2
intercept = 3
print("f(0) =", slopeIntercept(slope, 0, intercept))
print("f(1) =", slopeIntercept(slope, 1, intercept))
`}
          language="python"
          caption="function with parameters and return value"
        />

        <h3 className="lecture-section-header py-4">When To Use Functions</h3>
        <table className="lecture-table overflow-hidden rounded-xl bg-gray-500/5">
          <thead>
            <tr className="lecture-table-row">
              <th className="lecture-table-header max-w-[50%]">Incorrect</th>
              <th className="lecture-table-header max-w-[50%]">Correct</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="pl-8 py-2 text-left">Repetition</th>
              <th className="pl-8 py-2 text-left"></th>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-text text-red-500 dark:text-red-400 align-top max-w-[200px]">
                Copying and pasting the same code multiple times.
                <div className="px-1 ">
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`with open('somefile.txt', 'a') as file:
    time_string = datetime.now().isoformat() 
    file.write(time_string + ' : ' + 'program started\\n')
      
result = True and False

with open('somefile.txt', 'a') as file:
    time_string = datetime.now().isoformat() 
    file.write(time_string + ' : ' + 'task 1 result ' + str(result) + '\\n')
      
 with open('somefile.txt', 'a') as file:
    time_string = datetime.now().isoformat() 
    file.write(time_string + ' : ' + 'program finished\\n')`} />
                </div>
              </td>
              <td className="lecture-text dark:text-green-400 align-top max-w-[200px]">
                Defining a function and calling it whenever needed.
                <div className='px-1'>
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`def logToFile(message):
    with open('somefile.txt', 'a') as file:
        time_string = datetime.now().isoformat()
        file.write(time_string + ' : ' + message + '\\n')

logToFile("program started")

result = True and False

logToFile("task 1 result " + str(result))
logToFile("program finished")`} />
                </div>
              </td>
            </tr>

            <tr>
              <th className="pl-8 py-2 text-left">Complexity</th>
              <th className="pl-8 py-2 text-left"></th>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-text text-red-500 dark:text-red-400 align-top max-w-[200px]">
                Writing long, complex code blocks.
                <div className="px-1">
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`# Process user data all in one place
user_data = input("Enter name,age,email: ")
parts = user_data.split(',')
name = parts[0].strip().title()
age = int(parts[1].strip())
email = parts[2].strip().lower()
if '@' not in email or '.' not in email.split('@')[1]:
    print("Invalid email")
else:
    if age < 0 or age > 150:
        print("Invalid age")
    else:
        print(f"User: {name}, {age}, {email}")`} />
                </div>
              </td>
              <td className="lecture-text dark:text-green-400 align-top max-w-[200px]">
                Breaking down tasks into smaller functions.
                <div className='px-1'>
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`def validate_email(email):
    return '@' in email and '.' in email.split('@')[1]

def validate_age(age):
    return 0 <= age <= 150

def parse_user_input(data):
    parts = data.split(',')
    return parts[0].strip().title(), int(parts[1].strip()), parts[2].strip().lower()

user_data = input("Enter name,age,email: ")
name, age, email = parse_user_input(user_data)

if validate_email(email) and validate_age(age):
    print(f"User: {name}, {age}, {email}")`} />
                </div>
              </td>
            </tr>
            <tr>
              <th className="pl-8 py-2 text-left">Organization</th>
              <th className="pl-8 py-2 text-left"></th>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-text text-red-500 dark:text-red-400 align-top max-w-[200px]">
                All code in a single block without clear structure.
                <div className="px-1">
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`# Generate report
data = [23, 45, 12, 67, 34, 89, 21]
total = sum(data)
avg = total / len(data)
max_val = max(data)
min_val = min(data)
print(f"Total: {total}")
print(f"Average: {avg:.2f}")
print(f"Maximum: {max_val}")
print(f"Minimum: {min_val}")`} />
                </div>
              </td>
              <td className="lecture-text dark:text-green-400 align-top max-w-[200px]">
                Using functions to organize code into logical sections.
                <div className='px-1'>
                  <CodeBlock compact className="lecture-codeblock-compact mt-2" language='Python' code={`def calculate_stats(data):
    return {
        'total': sum(data),
        'avg': sum(data) / len(data),
        'max': max(data),
        'min': min(data)
    }

def print_report(stats):
    print(f"Total: {stats['total']}")
    print(f"Average: {stats['avg']:.2f}")
    print(f"Maximum: {stats['max']}")
    print(f"Minimum: {stats['min']}")

data = [23, 45, 12, 67, 34, 89, 21]
stats = calculate_stats(data)
print_report(stats)`} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
      </section>

      <section className="lecture-section mini-scroll" id="classes-objects">
        <h3 className="lecture-section-header">Classes and Objects</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-bold" href="https://www.geeksforgeeks.org/dsa/introduction-of-object-oriented-programming/" target='_black' rel="noopener">Object-oriented programming</a> is a programming paradigm that organizes code around objects and classes. A <span className="lecture-bold">class</span> is a blueprint for creating objects, and an <span className="lecture-bold">object</span> is an instance of a class.
        </p>
        <p className="lecture-paragraph">
          Classes contain <span className="lecture-bold">attributes</span> (variables and data) and a <span className="lecture-bold">constructor</span> method <code className="lecture-code-inline">__init__</code> <span className="opacity-50">(double underscores)</span> that initializes the object's state when it's created.
        </p>
        <p className="lecture-paragraph">
          Attributes are accessed using the dot <code className="lecture-code-inline">.</code> operator on an object instance.
        </p>

        <CodeBlock className="lecture-codeblock"
          code={`import math

class Robot:
		# constructor method to initialize the robot's attributes
		# __init__ is a special method in Python that is called when an object is created
		def __init__(self, name):
				self.name = name
				self.x = 0
				self.y = 0
				self.facing = math.pi/2	# Facing north (90 degrees in radians)
				self.speed = 1.0

# Create a robot instance, calls the constructor method
nestor = Robot("Nestor")
print("Name:", nestor.name)
print("Position:", (nestor.x, nestor.y))

# Move the robot forward
nestor.x += math.cos(nestor.facing) * nestor.speed
nestor.y += math.sin(nestor.facing) * nestor.speed

print("New Position:", (nestor.x, nestor.y))`}
          language="python"
          caption="class with attributes and a constructor"
        />

        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">self</code> parameter represents the instance of the class and is used to access instance variables and methods.
        </p>

        <p className="lecture-paragraph">
          Classes also contain <span className="lecture-bold">methods</span>, which are functions defined within a class that operate on the object's data.
        </p>
        <p className="lecture-paragraph">
          Methods are accessed using the dot <code className="lecture-code-inline">.</code> operator on an object instance, followed by the parenthesis containing any arguments. The <code className="lecture-code-inline">self</code> parameter representing the object instance is automatically passed to the method when called on an instance, so you don't need to provide it as an argument.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`import math

class Robot:
		# constructor method to initialize the robot's attributes
		# __init__ is a special method in Python that is called when an object is created
		def __init__(self, name):
				self.name = name
				self.x = 0
				self.y = 0
				self.facing = math.pi/2	# Facing north (90 degrees in radians)
				self.speed = 1.0

		def move_forward(self):
				self.x += math.cos(self.facing) * self.speed
				self.y += math.sin(self.facing) * self.speed


# Create a robot instance, calls the constructor method
nestor = Robot("Nestor")
print("Name:", nestor.name)
print("Position:", (nestor.x, nestor.y))

# Move the robot forward
nestor.move_forward()

print("New Position:", (nestor.x, nestor.y))`}
          language="python"
          caption="class with attributes, a constructor, and a method"
        />
      </section>

      

      <section className="lecture-section mini-scroll" id="pointers-references">
        <h3 className="lecture-section-header">Pointers and References</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          In low-level languages like C and C++, <span className="lecture-bold">pointers</span> are references to specific memory addresses.
          Passing a just the location of a variable to a function is much more efficient than copying large data structures.
          It also allows the function to modify the variable's value and have that change persist outside the function.
        </p>
        <div className="w-full flex justify-center mb-2">
          <div className='lecture-text font-bold flex gap-[0.5vw] items-center justify-center w-full text-nowrap'>
            Pointer Illustration
            <FaArrowRotateRight className="lecture-text cursor-pointer text-sm tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform select-none" onClick={(e) => { refreshMemory(); e.stopPropagation(); }} />
          </div>
        </div>
        <div className="flex gap-4 w-full justify-center mb-4">
          <div className="relative max-h-60">
            <table className="lecture-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-0 text-left px-2 py-1"></th>
                  <th className="w-0 text-left px-2 py-1">&nbsp;</th>
                </tr>
              </thead>
              <tbody className="consolas tc2">
                {memoryArrayExample.map((byte, index) =>
                  <tr key={index} className="border-b-2 border-gray-500/0">
                    <td className="px-2 py-1 tc3 text-nowrap text-right">{index == varIndex ? 'var' : '\u00A0'}</td>
                    <td className="px-2 py-1 tc3 text-nowrap text-right">{index == varIndex ? <FaArrowRight className="ml-auto mt-1" /> : '\u00A0'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                    <td className="px-2 py-1 font-bold">{`x${index.toString(16).padStart(2, '0').toUpperCase()}`}</td>
                    <td className="px-2 py-1 tc3">x{byte.toString(16).padStart(2, '0').toUpperCase()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="relative max-h-60">
            <table className="lecture-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-0 text-left px-2 py-1">&nbsp;</th>
                </tr>
              </thead>
              <tbody className="consolas tc2">
                {memoryArrayExample.map((byte, index) =>
                  <tr key={index} className="border-b-2 border-gray-500/0">
                    <td className="px-2 py-1 tc3 text-nowrap text-right">{index == varIndex ? <FaArrowRight className="ml-auto mt-1" /> : '\u00A0'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="relative max-h-60 rounded-lg border-2 border-gray-300/40 overflow-hidden">
            <table className="lecture-table rounded-lg overflow-hidden">
              <thead className="sticky top-0 z-10 bg2">
                <tr>
                  <th className="w-0 text-left px-2 py-1">Address</th>
                  <th className="w-0 text-left px-2 py-1">Memory</th>
                </tr>
              </thead>
              <tbody className="consolas tc2">
                {pointerMemoryArrayExample.map((byte, index) =>
                  <tr key={index} className="lecture-table-row">
                    <td className="px-2 py-1 font-bold">{`x${(index+pointerIndex-varIndex).toString(16).padStart(2, '0').toUpperCase()}`}</td>
                    <td className="px-2 py-1 tc3">{byte.toString(2).padStart(8, '0')}</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>

        <p className="lecture-paragraph">
          In Python, variables are <span className="lecture-bold">references</span> to objects in memory, not the objects themselves. When you assign a variable, you're creating a reference to an object.
        </p>

        <CodeBlock className="lecture-codeblock"
          code={`def increment(x):
    x = x + 1  # This creates a new INT object and reassigns x to it
num = 0
increment(num)
print(num)  # Output: 0 - num is unchanged!`}
          language="python"
          caption="pass by value"
        />

        <CodeBlock className="lecture-codeblock"
          code={`def increment(lst):
    lst[0] = lst[0] + 1  # Modifies the list object that lst references
my_list = [5]
increment(my_list)
print(my_list)  # Output: [6] - my_list is modified!`}
          language="python"
          caption="pass by reference"
        />

        <p className="lecture-paragraph">
          This behavior differs between <span className="lecture-bold">mutable</span> and <span className="lecture-bold">immutable</span> types:
        </p>

        <div className="flex gap-4 w-full flex-col md:flex-row justify-center mb-4">
          <div className="flex-grow">
            <span className="lecture-link">Mutable Types</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">list</td>
                  <td className="lecture-table-cell">Can be modified</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">dict</td>
                  <td className="lecture-table-cell">Can be modified</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">set</td>
                  <td className="lecture-table-cell">Can be modified</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex-grow">
            <span className="lecture-link">Immutable Types</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">int, float, bool</td>
                  <td className="lecture-table-cell">Cannot be modified</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">str</td>
                  <td className="lecture-table-cell">Cannot be modified</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">tuple</td>
                  <td className="lecture-table-cell">Cannot be modified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

       
      </section>

    </LectureTemplate>
  );
}

interface BackgroundLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function BagLectureIcon(props: BackgroundLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Strings, Functions, Classes and Pointers" summary="Brief Intro for Essential Python concepts that we will cover in more detail later" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { BagLecture, BagLectureIcon };
