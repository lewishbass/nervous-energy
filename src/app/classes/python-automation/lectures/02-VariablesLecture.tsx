'use client';
import React from 'react';
import Image from 'next/image';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';

import { FaArrowRight, FaArrowRotateRight } from 'react-icons/fa6';

interface VariablesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function VariablesLecture(props: VariablesLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  const randomBinary = (len: number = 8) => {
    const a = [];
    for (let i = 0; i < len; i++) {
      a.push(Math.floor(Math.random() * 2));
    }
    return a;
  }

  const [binaryExample, setBinaryExample] = useState<number[]>(randomBinary(8));

  const [floatSign, setFloatSign] = useState<number>(Math.floor(randomBinary(1)[0]));
  const [floatExponent, setFloatExponent] = useState<number[]>(randomBinary(8));
  const [floatMantissa, setFloatMantissa] = useState<number[]>(randomBinary(23));

  const [floatValue, setFloatValue] = useState<number>(0.1);


  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const memoryArrayExample = [];
  for (let i = 0; i < 64; i++) {
    memoryArrayExample.push(Math.floor(Math.random() * 256).toString(2).padStart(8, '0'));
  }

  const floatFormulaText = (sign: number, exponent: number[], mantissa: number[]): string => {
    if (exponent.every(bit => bit === 1)) {
      if (mantissa.every(bit => bit === 0)) return sign === 1 ? '-inf' : '+inf';
      else return 'NaN';
    }
    const exponentValue = exponent.reduce((acc, bit, index) => acc + (bit === 1 ? 2 ** (exponent.length - 1 - index) : 0), 0) - 127;
    let mantissaValue = mantissa.reduce((acc, bit, index) => acc + (bit === 1 ? 2 ** (-(index + 1)) : 0), 0) + 1;
    if (exponent.every(bit => bit === 0) && mantissa.every(bit => bit === 0)) mantissaValue = 0; // handle zero case
    const totalValue = (sign === 1 ? -1 : 1) * mantissaValue * (2 ** exponentValue);
    return `${sign === 1 ? '-1' : '+1'} x ${mantissaValue.toFixed(7)} x 2 ^ ${exponentValue.toFixed(0).padStart(4, '\u00A0')} = ${totalValue.toExponential(5).padStart(12, '\u00A0')}`;
  }

  const floatError = (num: number): string => {
    const float32 = new Float32Array(1);
    float32[0] = num;
    return float32[0].toFixed(9);
  }





  return (
    <LectureTemplate
      displayMode={displayMode}
      className={className}
      style={style}
      exitFSCallback={exitFSCallback}
    >
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>Variables and Data Types</h2>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('how-computers-store-data')}>How Computers Store Data</li>
          <li className="lecture-link" onClick={() => scrollToSection('integers')}>Integers</li>
          <li className="lecture-link" onClick={() => scrollToSection('floats')}>Floats</li>
          <li className="lecture-link" onClick={() => scrollToSection('booleans')}>Booleans</li>
          <li className="lecture-link" onClick={() => scrollToSection('basic-expressions')}>Basic Expressions</li>
          <li className="lecture-link" onClick={() => scrollToSection('duck-typing')}>Python Duck Typing</li>
          <li className="lecture-link" onClick={() => scrollToSection('type-conversion')}>Type Conversion</li>
          <li className="lecture-link" onClick={() => scrollToSection('naming-conventions')}>Variable Naming Conventions</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="how-computers-store-data">
        <h3 className="lecture-section-header">How Computers Store Data</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Computers store and process all their data in the form of <span className="lecture-bold">binary</span>. A <span className="lecture-bold">bit</span> is the smallest unit of data, representing a single binary value (0 or 1). A <span className="lecture-bold">byte</span> is the smallest addressable unit of memory, consisting of 8 bits.
        </p>
        <p className="lecture-paragraph">
          Tables of bytes are stored in the computer's memory, information is stored and retrieved from these tables by referencing a location in memory.
        </p>


        <div className="w-fit mx-auto mb-4">
          <div className="relative max-h-60 overflow-y-scroll mini-scroll rounded-lg border-2 border-gray-300/40">
            <table className="lecture-table">
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
                    <td className="px-2 py-1 tc3">{byte}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="tc3 w-full text-center lecture-paragraph ">memory table</div>
        </div>


        <p className="lecture-paragraph">
          A <span className="lecture-bold">variable</span> is a shorthand the computer uses to remember a specific location in memory.
          When you declare a new variable, the computer allocates some space in its memory to associate with that variable name.
          The size of this allocation depends on the type of variable, and its location can be referenced and passed between functions.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`x = 42  # Store the integer 42 in a variable named x
print(x)  # Output: 42
x = x+1  # Update the value of x to 43
print(x)  # Output: 43`}
          language="python"
          caption="creating and using a variable"
        />
      </section>

      <section className="lecture-section mini-scroll" id="integers">
        <h3 className="lecture-section-header">Integers (int)</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          An <a className="lecture-link" href="http://mathfoundations.lti.cs.cmu.edu/class2/integers.html" target="_blank" rel="noopener ">integer</a> is a whole number with no decimal point.
          Computers represent integers in a <a className="lecture-link" href="https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/A_Cool_Brisk_Walk_Through_Discrete_Mathematics_(Davies)/07%3A_Counting/7.4%3A_Binary_(base_2)" target='_blank' rel="noopener ">base 2</a>, compared to our normal <span className="lecture-bold">base 10</span>. From right to left, where digits in base 10 increased in value 10x (10, 10, 100...), digits in base 2 increase in value 2x (1, 2, 4, 8...).
        </p>
        {/* Binary to Decimal toy */}
        <div className="w-full flex flex-col md:flex-row justify-center align-center items-center gap-4">
          <div className="p-3 rounded-lg border-2 border-gray-300/40 md:self-start">
            <div className='lecture-text font-bold flex gap-[0.5vw] items-center justify-center w-full text-nowrap'>
              Binary Input
              <FaArrowRotateRight className="lecture-text cursor-pointer text-sm tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform" onClick={(e) => { setBinaryExample(randomBinary()); e.stopPropagation(); }} />

            </div>
            <p className='lecture-text consolas'>{binaryExample.join('')}</p>
          </div>
          <div className="w-fit">
            <div className="relative rounded-lg border-2 border-gray-300/40 p-1">
              <table className="lecture-table">
                <tbody className="consolas tc2">
                  {/*<tr className=" text-right">
                    <td className="px-2 py-1 font-bold">value</td>
                    {binaryExample.map((bit, index) =>
                      <td className="px-2 py-1">{`${(2 ** (binaryExample.length - 1 - index)).toFixed(0).padStart(3, '\u00A0')}`}</td>
                    )}
                  </tr>*/}
                  <tr className=" text-right">
                    <td className="px-2 py-1 font-bold">bit</td>
                    {binaryExample.map((bit, index) =>
                      <td className="px-2 py-1 cursor-pointer select-none hover:bg-gray-500/20 transition-all duration-300 rounded-lg" onClick={(e) => { setBinaryExample(prev => prev.map((b, i) => i === index ? 1 - b : b)); e.stopPropagation(); }} >{`${bit}`}</td>
                    )}
                  </tr>
                  <tr className=" text-right">
                    <td className="px-2 py-1 font-bold">value</td>
                    {binaryExample.map((bit, index) =>
                      <td className="px-2 py-1 transition-opacity duration-300" style={{ opacity: bit === 1 ? 1 : 0.3 }}>{`${(2 ** (binaryExample.length - 1 - index)).toFixed(0).padStart(3, '\u00A0')}`}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 rounded-lg border-2 border-gray-300/40 md:self-start min-w-60">
            <p className='lecture-text font-bold w-full text-center'>Total</p>
            <p className='lecture-text consolas text-right'>{binaryExample.map((bit, index) => bit == 1 ? (2 ** (binaryExample.length - 1 - index)).toFixed(0) + '+' : '').join('').slice(0, -1)}={binaryExample.reduce((acc, bit, index) => acc + (bit == 1 ? 2 ** (binaryExample.length - 1 - index) : 0), 0).toFixed(0).padStart(3, '\u00A0')}</p>
          </div>
        </div>
        <div className="tc3 w-full text-center lecture-paragraph ">converting from binary to decimal</div>

        <ul className="list-outside list-disc tc2 space-y-2 ml-4 lecture-text">
          <li >Stereotypical <span className="lecture-bold">ints</span> have 8 bits with possible values from 0 to 255, but modern languages tend to use 32 or 64 bits.</li>
          <li>Python uses its own <a className="lecture-link" href="https://docs.python.org/3/library/stdtypes.html#typesnumeric" target="_blank" rel="noopener ">integer representation</a>. When numbers exceed the limits of fixed-size integers, it automatically converts them to a <a href="https://levelup.gitconnected.com/how-python-represents-integers-using-bignum-f8f0574d0d6b" className="lecture-link" rel="noopener">Big Int</a> with use dynamic memory to represent arbitrary large values.</li>
          <li ><span className="lecture-bold">Signed ints</span> dedicate 1 bit to represent if the number is positive, an 8-bit signed int represents values from -128 to 127.</li>
          <li> Most signed ints are stored using <a className="lecture-link" href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" rel="noopener ">two's complement</a> which make arithmetic calculations faster.</li>
          <li ><a className="lecture-link" href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank" rel="noopener ">Hexadecimal</a> (base 16) is used as a compact way to represent integers (in 4 bit chunks) <br /> (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D E, F)</li>
          <li>Little and Big <a className="lecture-link" href="https://en.wikipedia.org/wiki/Endianness" target="_blank" rel="noopener ">Endianness</a> swap which direction bytes are ordered in memory.</li>
        </ul>
      </section>

      <section className="lecture-section mini-scroll" id="floats">
        <h3 className="lecture-section-header">Floats (float)</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://www.h-schmidt.net/FloatConverter/IEEE754.html" target='_blank' rel='noopener'>Float</a> refers to the <a className="lecture-link" href="https://www.geeksforgeeks.org/computer-organization-architecture/ieee-standard-754-floating-point-numbers/" target="_blank" rel="noopener">IEEE 754</a> standard for floating point number representation. While integers represent whole numbers, floats represent <a className='lecture-link' href="https://www.cs.cmu.edu/~bhiksha/courses/math.11691/fall2015/class2/rationals.html" target="_blank" rel="noopener">real numbers</a> that can have fractional parts, using decimal points.
        </p>
        <p className="lecture-paragraph">
          Like scientific <span className="opacity-50">(&plusmn;a x 10<sup>b</sup>)</span> notation, they break a number down into its sign <span className="opacity-50">(+/-)</span>, magnitude <span className="opacity-50">(x10<sup>b</sup>)</span> and value <span className="opacity-50">(a)</span> using a <span className="lecture-bold">sign bit</span>, <span className="lecture-bold">exponent</span>, and the <span className="lecture-bold">mantissa</span>.
        </p>

        {/*float toy*/}
        <div className="w-full flex flex-col md:flex-row justify-center mb-4 align-center items-center gap-4">
          <div className="p-3 rounded-lg border-2 border-gray-300/40 md:self-start">
            <div className='lecture-text font-bold flex gap-[0.5vw] items-center justify-center w-full text-nowrap'>
              Binary Input
              <FaArrowRotateRight className="lecture-text cursor-pointer text-sm tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform" onClick={(e) => { setFloatSign(randomBinary(1)[0]); setFloatExponent(randomBinary(8)); setFloatMantissa(randomBinary(23)); e.stopPropagation(); }} />

            </div>
            <p className='lecture-text consolas w-full text-center'>{floatSign}-{floatExponent}-{floatMantissa}</p>
          </div>
          <div className="p-3 rounded-lg border-2 border-gray-300/40 md:self-start">
            <p className='lecture-text font-bold w-full text-center'>Total</p>
            <p className='lecture-text consolas w-full text-center'>{floatFormulaText(floatSign, floatExponent, floatMantissa)}</p>
          </div>

        </div>

        <div className="w-full flex lg:flex-row flex-col items-center justify-center mb-4 align-center gap-4">
          <div className="w-full lg:w-auto flex md:flex-row flex-col items-center justify-center align-center gap-4">
            <div className="w-fit">
              <div className="relative rounded-lg border-2 border-gray-300/40 p-1">
                <table className="lecture-table">
                  <tbody className="consolas tc2">
                    <tr className=" text-right">
                      <td className="px-2 py-1 font-bold">bit</td>
                      {
                        <td className="px-2 py-1 cursor-pointer select-none hover:bg-gray-500/20 transition-all duration-300 rounded-lg" onClick={(e) => { setFloatSign(1 - floatSign); e.stopPropagation(); }} >{floatSign}</td>
                      }
                    </tr>
                    <tr className=" text-right">
                      <td className="px-2 py-1 font-bold">value</td>
                      {
                        <td className="px-2 py-1 transition-opacity duration-300" >{floatSign ? '-1' : '+1'}</td>
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="tc3 w-full text-center lecture-paragraph ">sign</div>
            </div>
            <div className="w-fit">
              <div className="relative rounded-lg border-2 border-gray-300/40 p-1">
                <table className="lecture-table">
                  <tbody className="consolas tc2">
                    <tr className=" text-right">
                      <td className="px-2 py-1 font-bold">bit</td>
                      {floatExponent.map((bit, index) =>
                        <td className="px-2 py-1 cursor-pointer select-none hover:bg-gray-500/20 transition-all duration-300 rounded-lg" onClick={(e) => { setFloatExponent(prev => prev.map((b, i) => i === index ? 1 - b : b)); e.stopPropagation(); }} >{`${bit}`}</td>
                      )}
                    </tr>
                    <tr className=" text-right">
                      <td className="px-2 py-1 font-bold">value</td>
                      {floatExponent.map((bit, index) =>
                        <td className="px-2 py-1 transition-opacity duration-300" style={{ opacity: bit === 1 ? 1 : 0.3 }}>{`${(2 ** (floatExponent.length - 1 - index)).toFixed(0).padStart(3, '\u00A0')}`}</td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="tc3 w-full text-center lecture-paragraph ">exponent</div>
            </div>
          </div>
          <div className="w-fit">
            <div className="relative rounded-lg border-2 border-gray-300/40 p-1">
              <table className="lecture-table">
                <tbody className="consolas tc2">
                  <tr className=" text-right">
                    <td className="px-2 py-1 font-bold">bit</td>
                    {floatMantissa.map((bit, index) =>
                      <td className="px-1 py-1 cursor-pointer select-none hover:bg-gray-500/20 transition-all duration-300 rounded-lg" onClick={(e) => { setFloatMantissa(prev => prev.map((b, i) => i === index ? 1 - b : b)); e.stopPropagation(); }} >{`${bit}`}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tc3 w-full text-center lecture-paragraph ">mantissa</div>
          </div>
        </div>
        {/*Float toy end*/}
        <p className="lecture-paragraph">
          Floats have <span className="lecture-bold">limited precision</span> and some numbers that can be expressed simply as a base 10 decimal (e.g. 0.1) are much more complex as base 2 decimals, and run up against the limits of float precision.
        </p>

        <div className="w-full flex justify-center mb-4 align-center gap-4">
          <input type="number" step="0.1" value={floatValue} onChange={(e) => setFloatValue(parseFloat(e.target.value))} className="rounded-lg border-2 border-gray-300/40 p-2 w-48 text-center lecture-text" />
          <FaArrowRight className="self-center lecture-text" />
          <p className="lecture-text consolas h-fit self-center w-48">{floatError(floatValue)}</p>
        </div>
        <div className="tc3 w-full text-center lecture-paragraph opacity-75">floating point error</div>

        <p className="lecture-paragraph">
          The <span className="lecture-bold">double</span> datatype uses twice as many bits for the exponent and mantissa, Python uses these by default.
          <br />
          For precise decimal arithmetic, the <a className="lecture-link" href="https://docs.python.org/3/library/decimal.html" target="_blank" rel="noopener ">decimal</a> module provides arbitrary precision decimal arithmetic.
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="booleans">
        <h3 className="lecture-section-header">Booleans (bool)</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Booleans represent truth values: <span className="lecture-bold">True</span> or <span className="lecture-bold">False</span>. They're essential for decision-making in programs.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`is_raining = True
is_sunny = False`}
          language="python"
        />
        <p className="lecture-paragraph">
          Comparisons between variables can result in boolean values, and these boolean values can be combined to make complex logical decisions.
        </p>
        <div className="flex gap-4 w-full flex-col md:flex-row justify-center mb-4">
          <div className="flex-grow">
            <span className="lecture-link">Boolean Comparisons</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">==</td>
                  <td className="lecture-table-cell">Equal to</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">!=</td>
                  <td className="lecture-table-cell">Not equal to</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">{'<'}</td>
                  <td className="lecture-table-cell">Less than</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">{'>'}</td>
                  <td className="lecture-table-cell">Greater than</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">{'<='}</td>
                  <td className="lecture-table-cell">Less than or equal to</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">{'>='}</td>
                  <td className="lecture-table-cell">Greater than or equal to</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex-grow">
            <span className="lecture-link">Boolean Operators</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">and</td>
                  <td className="lecture-table-cell">Logical AND</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">or</td>
                  <td className="lecture-table-cell">Logical OR</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">not</td>
                  <td className="lecture-table-cell">Logical NOT</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex-grow" >
            <span className="lecture-link">Boolean Operators Continued</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">a, b</td>
                  <td className="lecture-table-cell">0, 0</td>
                  <td className="lecture-table-cell">0, 1</td>
                  <td className="lecture-table-cell">1, 1</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">or</td>
                  <td className="lecture-table-cell">0</td>
                  <td className="lecture-table-cell">1</td>
                  <td className="lecture-table-cell">1</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header">and</td>
                  <td className="lecture-table-cell">0</td>
                  <td className="lecture-table-cell">0</td>
                  <td className="lecture-table-cell">1</td>
                </tr>
                <tr className="">
                  <td className="lecture-table-header">xor</td>
                  <td className="lecture-table-cell">0</td>
                  <td className="lecture-table-cell">1</td>
                  <td className="lecture-table-cell">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <CodeBlock className="lecture-codeblock"
          code={`is_picnic_weather = ( is_sunny and not is_raining )
is_picnic_time = ( hour > 10 and hour < 18 )
in_picnic = ( ( location == 'park' ) and is_picnic_weather and is_picnic_time )`}
          language="python"
        />
      </section>

      <section className="lecture-section mini-scroll" id="basic-expressions">
        <h3 className="lecture-section-header">Basic Expressions</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python supports standard arithmetic operations and follows the order of operations <span className="opacity-50">(PEMDAS)</span>.
        </p>

        <div className="mb-4">
          <span className="lecture-link">Arithmetic Operators</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">+</td>
                <td className="lecture-table-cell">Addition</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 + 3 = 8</code></td>
                <td className="lecture-table-header">-</td>
                <td className="lecture-table-cell">Subtraction</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 - 3 = 2</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">*</td>
                <td className="lecture-table-cell">Multiplication</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 * 3 = 15</code></td>
                <td className="lecture-table-header">/</td>
                <td className="lecture-table-cell">Division</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 / 2 = 2.5</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">//</td>
                <td className="lecture-table-cell">Floor Division</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 // 2 = 2</code></td>
                <td className="lecture-table-header">%</td>
                <td className="lecture-table-cell">Modulus (Remainder)</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 % 2 = 1</code></td>
              </tr>
              <tr>
                <td className="lecture-table-header">**</td>
                <td className="lecture-table-cell">Exponentiation</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">5 ** 2 = 25</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock className="lecture-codeblock"
          code={`# Order of operations
result = 2 + 3 * 4  # 14, not 20
result_with_parens = (2 + 3) * 4  # 20

# Mixing integers and floats
mixed = 10 + 3.5  # 13.5 (result is a float)`}
          language="python"
          caption="expression examples"
        />
        <p className="lecture-paragraph">
          When in doubt, use parentheses to ensure order, they cost nothing, and can save you frustrating debugs later on!
        </p>
      </section>

      <section className="lecture-section mini-scroll" id="duck-typing">
        <h3 className="lecture-section-header">Python Duck Typing</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <em>"If it walks like a duck and quacks like a duck, it's a duck."</em><br />
          Python uses <a className="lecture-link" href="https://en.wikipedia.org/wiki/Duck_typing" target="_blank" rel="noopener ">duck typing</a>, where a variable's type can change dynamically at runtime, and the language focuses on whether an object can perform the required operations rather than what type it is.
        </p>
        <p className="lecture-paragraph">
          You don't need to declare variable types explicitly. Python infers the type based on the value assigned.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`x = 42        # x is an integer
x = "hello"   # Now x is a string
x = 3.14      # Now x is a float

# Python is dynamically typed, but strongly typed
y = "5" + 3   # TypeError: can't concatenate str and int`}
          language="python"
          caption="dynamic typing in Python"
        />
      </section>

      <section className="lecture-section mini-scroll" id="type-conversion">
        <h3 className="lecture-section-header">Type Conversion</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          You can explicitly convert between types using built-in functions:
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`# String to integer
age_str = "25"
age = int(age_str)  # 25

# Integer to float
count = 10
count_float = float(count)  # 10.0

# Float to integer (truncates decimal)
pi = 3.14159
pi_int = int(pi)  # 3

# Integer to string
num = 42
num_str = str(num)  # "42"

# String to boolean
bool("hello")  # True (non-empty strings are True)
bool("")       # False (empty strings are False)
bool(0)        # False
bool(42)       # True (non-zero numbers are True)`}
          language="python"
          caption="type conversion examples"
        />
      </section>

      <section className="lecture-section mini-scroll" id="naming-conventions">
        <h3 className="lecture-section-header">Variable Naming Conventions</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Follow these rules and conventions for naming variables:
        </p>

        <div className="mb-6 mt-6">
          <table className="lecture-table w-full">
            <thead>
              <tr>
                <th className="lecture-table-header">Rule (Required)</th>
                <th className="lecture-table-header"><span className="text-green-600 dark:text-green-400">Valid</span></th>
                <th className="lecture-table-header"><span className="text-red-600 dark:text-red-400">Invalid</span></th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Must start with a letter or underscore</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">name</code>, <code className="lecture-code-inline">_age</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">123abc</code>, <code className="lecture-code-inline">-temp</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Can contain letters, numbers, and underscores</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">user_name</code>, <code className="lecture-code-inline">count2</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">user-name</code>, <code className="lecture-code-inline">count@</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Case-sensitive</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">age</code>, <code className="lecture-code-inline">Age</code></td>
                <td className="lecture-table-cell p-3"><span className="opacity-50">N/A</span></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell p-3">Cannot use Python keywords</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">condition</code>, <code className="lecture-code-inline">loop_count</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">if</code>, <code className="lecture-code-inline">for</code>, <code className="lecture-code-inline">while</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <table className="lecture-table w-full">
            <thead>
              <tr>
                <th className="lecture-table-header">Convention (Recommended)</th>
                <th className="lecture-table-header"><span className="text-green-600 dark:text-green-400">Good</span></th>
                <th className="lecture-table-header"><span className="text-red-600 dark:text-red-400">Bad</span></th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Use <code className="lecture-code-inline">snake_case</code> for variable names</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">user_age</code>, <code className="lecture-code-inline">total_count</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">userage</code>, <code className="lecture-code-inline">TotalCount</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Use <code className="lecture-code-inline">camelCase</code> for function names</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">removeOutliers</code>, <code className="lecture-code-inline">fitLine</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">removeoutliers</code>, <code className="lecture-code-inline">FitLine</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Use descriptive names</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">average_temp</code>, <code className="lecture-code-inline">user_count</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">t</code>, <code className="lecture-code-inline">x</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Use <code className="lecture-code-inline">UPPER_CASE</code> for global constants</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">MAX_SIZE = 100</code>, <code className="lecture-code-inline">PI = 3.14</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">max_size = 100</code>, <code className="lecture-code-inline">ITERATION_COUNT</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Only use single letter variables for loops or math formulas</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">for i in range(10):</code>, <code className="lecture-code-inline">y = m*x + b</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">count = i</code>, <code className="lecture-code-inline">temperature = t</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell p-3">Only capitalize Structure Types</td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">class MyClass:</code></td>
                <td className="lecture-table-cell p-3"><code className="lecture-code-inline">class myclass:</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell p-3" colSpan={3}>BE CONSISTENT!!! Legible code is the gift you give your future self.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

    </LectureTemplate>
  );
}

interface VariablesLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function VariablesLectureIcon(props: VariablesLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon
      title="Variables and Data Types"
      summary="Learn the fundamentals of variables and data types in Python."
      displayMode={displayMode}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}

export { VariablesLecture, VariablesLectureIcon };
