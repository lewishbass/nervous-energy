'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

interface ClassesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ClassesLecture(props: ClassesLectureProps | null) {
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

  const [typeTab, setTypeTab] = useState<'int' | 'double' | 'string' | 'list'>('int');

  const memoryBits = useMemo(() => Array.from({ length: 256 }, () => Math.round(Math.random())), []);

  // Highlight ranges for each type interpretation
  const typeHighlights: Record<string, number[][]> = {
    int: [[0, 8], [8, 16], [16, 24], [24, 32]],
    double: [[0, 16], [16, 32], [32, 48], [48, 64]],
    string: [[0, 8], [8, 16], [16, 24], [24, 32], [32, 40]],
    list: [[0, 32], [32, 64], [64, 96]],
  };

  const highlightColors = ['border-blue-500', 'border-green-500', 'border-yellow-500', 'border-red-500', 'border-purple-500'];

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Classes and Error Handling</h2>
        <h3 className="tc2 lecture-section-header">Introduction to OOP in Python</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You&apos;ll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('typing-practice')}>Typing Practice</li>
          <li className="lecture-link" onClick={() => scrollToSection('oop')}>Object Oriented Programming</li>
          <li className="lecture-link" onClick={() => scrollToSection('templates-objects')}>Templates and Objects</li>
          <li className="lecture-link" onClick={() => scrollToSection('attributes-methods')}>Attributes and Methods</li>
          <li className="lecture-link" onClick={() => scrollToSection('constructors')}>Constructors</li>
          <li className="lecture-link" onClick={() => scrollToSection('inheritance')}>Inheritance</li>
          <li className="lecture-link" onClick={() => scrollToSection('global-class-attributes')}>Global Class Attributes</li>
          <li className="lecture-link" onClick={() => scrollToSection('dunder-operators')}>Dunder Operators</li>
        </ul>
      </section>

      {/* Typing Practice */}
      <section className="lecture-section mini-scroll" id="typing-practice">
        <h3 className="lecture-section-header">Typing Practice</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://www.keybr.com/" target="_blank" rel="noopener">keybr.com</a>
        </p>
      </section>

      {/* Object Oriented Programming */}
      <section className="lecture-section mini-scroll" id="oop">
        <h3 className="lecture-section-header">Object Oriented Programming</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Computers fundamentally have access to one type of data structure, the list.
          Everything in the computer consists of bytes stored at locations.
          A block of memory is not fundamentally an integer, float, array, string or list,
          but by labeling it with a <span className="lecture-bold">type</span> the computer knows to interpret it in different ways.
        </p>

        {/* Memory grid */}
        <div className="flex justify-center my-4">
          <div className="grid grid-cols-16 gap-0" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
            {memoryBits.slice(0, 256).map((bit, i) => {
              const highlighted = typeHighlights[typeTab].some(([start, end]) => i >= start && i < end);
              const groupIdx = typeHighlights[typeTab].findIndex(([start, end]) => i >= start && i < end);
              const colorClass = groupIdx >= 0 ? highlightColors[groupIdx % highlightColors.length] : '';
              return (
                <div
                  key={i}
                  className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono ${highlighted ? `border-2 ${colorClass} bg-white/10` : 'border border-gray-700/30 opacity-40'}`}
                >
                  {bit}
                </div>
              );
            })}
          </div>
        </div>

        <p className="lecture-paragraph">
          Depending on which type the memory is, the computer knows to treat it differently.
        </p>

        {/* Tab section for int / double / string / list */}
        <div className="mb-4">
          <div className="lecture-tab-container">
            <button className={`lecture-tab ${typeTab === 'int' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setTypeTab('int'); e.stopPropagation(); }}>int</button>
            <button className={`lecture-tab ${typeTab === 'double' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setTypeTab('double'); e.stopPropagation(); }}>double</button>
            <button className={`lecture-tab ${typeTab === 'string' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setTypeTab('string'); e.stopPropagation(); }}>string</button>
            <button className={`lecture-tab ${typeTab === 'list' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setTypeTab('list'); e.stopPropagation(); }}>list</button>
          </div>

          {typeTab === 'int' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph"><span className="lecture-bold">a + b</span> — integer addition</p>
              <table className="lecture-table">
                <thead>
                  <tr>
                    <th className="lecture-table-header"></th>
                    <th className="lecture-table-header">Bit 7</th>
                    <th className="lecture-table-header">Bit 6</th>
                    <th className="lecture-table-header">Bit 5</th>
                    <th className="lecture-table-header">Bit 4</th>
                    <th className="lecture-table-header">Bit 3</th>
                    <th className="lecture-table-header">Bit 2</th>
                    <th className="lecture-table-header">Bit 1</th>
                    <th className="lecture-table-header">Bit 0</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">Carry</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">0</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">a = 5</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">b = 3</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">1</td>
                  </tr>
                  <tr className="">
                    <td className="lecture-table-header">a + b = 8</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">1</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {typeTab === 'double' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph"><span className="lecture-bold">a + b</span> — floating point addition</p>
              <table className="lecture-table">
                <thead>
                  <tr>
                    <th className="lecture-table-header"></th>
                    <th className="lecture-table-header">Sign</th>
                    <th className="lecture-table-header">Exponent</th>
                    <th className="lecture-table-header">Mantissa</th>
                    <th className="lecture-table-header">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">a</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">10000001</td>
                    <td className="lecture-table-cell">01000...</td>
                    <td className="lecture-table-cell">5.0</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">b</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">10000000</td>
                    <td className="lecture-table-cell">10000...</td>
                    <td className="lecture-table-cell">3.0</td>
                  </tr>
                  <tr className="">
                    <td className="lecture-table-header">a + b</td>
                    <td className="lecture-table-cell">0</td>
                    <td className="lecture-table-cell">10000010</td>
                    <td className="lecture-table-cell">00000...</td>
                    <td className="lecture-table-cell">8.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {typeTab === 'string' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph"><span className="lecture-bold">a + b</span> — string concatenation</p>
              <table className="lecture-table">
                <thead>
                  <tr>
                    <th className="lecture-table-header"></th>
                    <th className="lecture-table-header">Byte 0</th>
                    <th className="lecture-table-header">Byte 1</th>
                    <th className="lecture-table-header">Byte 2</th>
                    <th className="lecture-table-header">Byte 3</th>
                    <th className="lecture-table-header">Byte 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">a = &quot;Hi&quot;</td>
                    <td className="lecture-table-cell">0x48 (H)</td>
                    <td className="lecture-table-cell">0x69 (i)</td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">b = &quot;Lo&quot;</td>
                    <td className="lecture-table-cell">0x4C (L)</td>
                    <td className="lecture-table-cell">0x6F (o)</td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                  </tr>
                  <tr className="">
                    <td className="lecture-table-header">a + b = &quot;HiLo&quot;</td>
                    <td className="lecture-table-cell">0x48 (H)</td>
                    <td className="lecture-table-cell">0x69 (i)</td>
                    <td className="lecture-table-cell">0x4C (L)</td>
                    <td className="lecture-table-cell">0x6F (o)</td>
                    <td className="lecture-table-cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {typeTab === 'list' && (
            <div className="lecture-tab-content">
              <p className="lecture-paragraph"><span className="lecture-bold">a + b</span> — list concatenation</p>
              <table className="lecture-table">
                <thead>
                  <tr>
                    <th className="lecture-table-header"></th>
                    <th className="lecture-table-header">Element 0</th>
                    <th className="lecture-table-header">Element 1</th>
                    <th className="lecture-table-header">Element 2</th>
                    <th className="lecture-table-header">Element 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">a = [1, 2]</td>
                    <td className="lecture-table-cell">00000001</td>
                    <td className="lecture-table-cell">00000010</td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">b = [3, 4]</td>
                    <td className="lecture-table-cell">00000011</td>
                    <td className="lecture-table-cell">00000100</td>
                    <td className="lecture-table-cell"></td>
                    <td className="lecture-table-cell"></td>
                  </tr>
                  <tr className="">
                    <td className="lecture-table-header">a + b = [1,2,3,4]</td>
                    <td className="lecture-table-cell">00000001</td>
                    <td className="lecture-table-cell">00000010</td>
                    <td className="lecture-table-cell">00000011</td>
                    <td className="lecture-table-cell">00000100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Objects</span> are a programming construct that allows us to define how we want to label and interpret blocks of memory and how they are affected by different operations.
        </p>
      </section>

      {/* Templates and Objects */}
      <section className="lecture-section mini-scroll" id="templates-objects">
        <h3 className="lecture-section-header">Templates and Objects</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          An <span className="lecture-bold">Object</span> is a set of rules on how to treat a block of memory.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="object example"
          code={`class Dog:
    def bark(self):
        for _ in range(10 // self.age):  # puppies are more barky
            print("Woof!")`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Attributes</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Attribute</th>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Memory Location</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">age</td>
                <td className="lecture-table-cell">int</td>
                <td className="lecture-table-cell">0x00</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">name</td>
                <td className="lecture-table-cell">string</td>
                <td className="lecture-table-cell">0x08</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Functions</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Method</th>
                <th className="lecture-table-header">Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className="lecture-table-cell">bark</td>
                <td className="lecture-table-cell">read the age and print based on the age</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          An <span className="lecture-bold">Instance</span> is a single occurrence of an object, a block of memory that is labeled with the rules of the object.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="creating an instance"
          code={`my_dog = Dog("Fido", 3)`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Class in Memory</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Chunk</th>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">8 bits</td>
                <td className="lecture-table-cell">int</td>
                <td className="lecture-table-cell">3 (age)</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">32 bits</td>
                <td className="lecture-table-cell">string</td>
                <td className="lecture-table-cell">&quot;Fido&quot; (name)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Python has a lot of built in objects, and each variable is an instance of some object type, even simple types like int and string.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Variable</th>
                <th className="lecture-table-header">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">total = 10</code></td>
                <td className="lecture-table-cell">Integer</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">greeting = &quot;Hello&quot;</code></td>
                <td className="lecture-table-cell">String</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">cash = 100.2</code></td>
                <td className="lecture-table-cell">Float</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">numbers = [1, 2, 3]</code></td>
                <td className="lecture-table-cell">List</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          And any operation performed on these variables is a method that is defined by its object type.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Expression</th>
                <th className="lecture-table-header">Under the Hood</th>
                <th className="lecture-table-header">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">1 + 2</code></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">int.__add__(1, 2)</code></td>
                <td className="lecture-table-cell">3</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">&quot;Hello&quot; + &quot;World&quot;</code></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">str.__add__(&quot;Hello&quot;, &quot;World&quot;)</code></td>
                <td className="lecture-table-cell">&quot;HelloWorld&quot;</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">array[1]</code></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">list.__getitem__(array, 1)</code></td>
                <td className="lecture-table-cell">2</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">total * 2</code></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">int.__mul__(total, 2)</code></td>
                <td className="lecture-table-cell">20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Attributes and Methods */}
      <section className="lecture-section mini-scroll" id="attributes-methods">
        <h3 className="lecture-section-header">Attributes and Methods</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Attributes</span> are variables attached to a single instance of an object.
          The object remembers them and can access them to perform operations.
          An attribute of an object can be accessed with dot notation, <code className="lecture-code-inline">my_dog.name</code> → <code className="lecture-code-inline">&quot;Fido&quot;</code>
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Methods</span> are functions attached to an object that can perform actions using its attributes.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="defining and calling a method"
          code={`class Dog:
    def print_age(self):
        print(self.age)

my_dog.print_age()  # prints 3`} />

        <p className="lecture-paragraph">
          Methods are declared using normal <code className="lecture-code-inline">def</code> syntax but they must have <span className="lecture-bold">self</span> as the first parameter, which is how the method can access the attributes of the instance it is called on.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="accessing attributes through self"
          code={`self.breed
self.age
self.name
# ...`} />
      </section>

      {/* Constructors */}
      <section className="lecture-section mini-scroll" id="constructors">
        <h3 className="lecture-section-header">Constructors</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">__init__</code> (using double underscore) is the constructor and required by all classes.
          It is activated by calling the name of the class, followed by parenthesis, containing information.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="constructor example"
          code={`class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

my_dog = Dog("Fido", 3)
# creates an instance of the Dog class, and calls the
# __init__ method to initialize its attributes`} />

        <p className="lecture-paragraph">
          It uses <code className="lecture-code-inline">self.attr_name</code> to declare all the attributes the class will have, then returns the block of memory containing that information to the variable <code className="lecture-code-inline">my_dog</code>.
        </p>
      </section>

      {/* Inheritance */}
      <section className="lecture-section mini-scroll" id="inheritance">
        <h3 className="lecture-section-header">Inheritance</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Classes can <span className="lecture-bold">inherit</span> behavior from other classes, allowing us to reuse code and create more specific types of objects.
          The inheriting class is called the child class, and the class it inherits from is called the parent class.
          The child class calls the parent&apos;s constructor to initialize the attributes of the parent class, then can add its own attributes and methods. <code className="lecture-code-inline">super()</code> is used to call the parent class constructor and methods.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="inheritance example"
          code={`class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed

    def speak(self):
        print(f"{self.name} says Woof!")

my_dog = Dog("Fido", 3, "Labrador")
my_dog.speak()  # Fido says Woof!`} />
      </section>

      {/* Global Class Attributes */}
      <section className="lecture-section mini-scroll" id="global-class-attributes">
        <h3 className="lecture-section-header">Global Class Attributes</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Some variables are shared across all instances of a class, they are called class attributes and are defined directly on the class, not on the instance.
        </p>
        <p className="lecture-paragraph">
          These are useful if you want to count the number of instances of a class, or if you want to have a shared variable that all instances can access and modify.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="counting instances with a class attribute"
          code={`class Dog:
    dog_count = 0

    def __init__(self, name):
        self.name = name
        Dog.dog_count += 1

a = Dog("Fido")
b = Dog("Rex")
print(Dog.dog_count)  # 2`} />

        <CodeBlock className="lecture-codeblock" language="python" caption="shared list across all instances"
          code={`class Dog:
    park = []

    def __init__(self, name):
        self.name = name
        Dog.park.append(self)

fido = Dog("Fido")
rex = Dog("Rex")
print([d.name for d in Dog.park])  # ["Fido", "Rex"]`} />
      </section>

      {/* Dunder Operators */}
      <section className="lecture-section mini-scroll" id="dunder-operators">
        <h3 className="lecture-section-header">Dunder Operators</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          When adding two integers with <code className="lecture-code-inline">+</code>, Python calls the <code className="lecture-code-inline">__add__</code> method of the integer object type, which is a dunder method (double underscore).
        </p>
        <p className="lecture-paragraph">
          By defining dunder methods in our own class, we can specify how it should react to different operations.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="custom dunder methods"
          code={`class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __str__(self):
        return f"({self.x}, {self.y})"

print(Vector2D(1, 2) + Vector2D(3, 4))
# calls __add__ and __str__ to print (4, 6)`} />

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Common Dunder Methods</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Method</th>
                <th className="lecture-table-header">Operator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__add__</code></td>
                <td className="lecture-table-cell">+</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__sub__</code></td>
                <td className="lecture-table-cell">-</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__mul__</code></td>
                <td className="lecture-table-cell">*</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__truediv__</code></td>
                <td className="lecture-table-cell">/</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__eq__</code></td>
                <td className="lecture-table-cell">==</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__lt__</code></td>
                <td className="lecture-table-cell">&lt;</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__gt__</code></td>
                <td className="lecture-table-cell">&gt;</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__str__</code></td>
                <td className="lecture-table-cell">str() / print()</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__repr__</code></td>
                <td className="lecture-table-cell">repr() / debugger</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__len__</code></td>
                <td className="lecture-table-cell">len()</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">__getitem__</code></td>
                <td className="lecture-table-cell">[]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </LectureTemplate>
  );
}

interface ClassesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function ClassesLectureIcon(props: ClassesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Classes" summary="Introduction to OOP in python" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ClassesLecture, ClassesLectureIcon };
