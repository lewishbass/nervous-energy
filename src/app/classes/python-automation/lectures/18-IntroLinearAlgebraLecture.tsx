'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MathJaxContext } from 'better-react-mathjax';
import { MathJax } from 'better-react-mathjax';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import { LectureEquation } from './lecture-components/LectureEquation';
import { LecturePlot } from './lecture-components/LecturePlot';
import { LeastSquares } from './lecture-components/LeastSquares';


interface IntroLinearAlgebraLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function IntroLinearAlgebraLecture(props: IntroLinearAlgebraLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  // 5/1/2026 8 pm EST (UTC-5) = 2026-05-02T01:00:00Z
  const UNLOCK_TIME = new Date('2026-05-02T01:00:00Z');
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const toggleCard = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
		event.preventDefault();
		event.stopPropagation();
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('prismjs').then(() => {
        if (typeof window !== 'undefined' && (window as any).Prism) {
          (window as any).Prism.highlightAll();
        }
      });
    }
    setSolutionsUnlocked(new Date() >= UNLOCK_TIME);
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
        <h2 className="tc1 lecture-big-title">Introduction to Linear Algebra</h2>
        <h3 className="tc2 lecture-section-header">Master Vectors, Matrices, and Linear Transformations</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('systems-of-equations')}>Systems of Equations</li>
          <li className="lecture-link" onClick={() => scrollToSection('applications-systems-equations')}>Applications of Systems of Equations</li>
          <li className="lecture-link" onClick={() => scrollToSection('vector-fundamentals')}>Vector fundamentals</li>
          <li className="lecture-link" onClick={() => scrollToSection('vector-operations')}>Vector operations</li>
          <li className="lecture-link" onClick={() => scrollToSection('matrix-basics')}>Matrix Basics</li>
          <li className="lecture-link" onClick={() => scrollToSection('applications-matrix-math')}>Applications of Matrix Math</li>
          <li className="lecture-link" onClick={() => scrollToSection('linear-regression')}>Linear Regression</li>
          <li className="lecture-link" onClick={() => scrollToSection('numpy-intro')}>Introduction to NumPy for linear algebra</li>
          <li className="lecture-link" onClick={() => scrollToSection('practical-applications')}>Practical applications in data science</li>
					</ul>
      </section>

      {/* Systems of Equations */}
      <section className="lecture-section mini-scroll" id="systems-of-equations">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Systems of Equations</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Linear Equations</span> preserve addition and scalar multiplication. A function <span className="lecture-equation-inline"><MathJax inline>{'\\( f \\)'}</MathJax></span> is linear if it satisfies these two properties:
        </p>

        <LectureEquation title="Preservation of Addition">
          <MathJax inline>{'\\( f(x + y) = f(x) + f(y) \\)'}</MathJax>
        </LectureEquation>

        <LectureEquation title="Preservation of Scalar Multiplication">
          <MathJax inline>{'\\( f(ax) = af(x) \\)'}</MathJax>
        </LectureEquation>

				<p className="lecture-paragraph">
					A <span className="lecture-bold">system of linear equations</span> is a collection of linear equations involving the same set of variables. For example:
					</p>
				
				<LectureEquation>
					<MathJax inline>{'\\( \\begin{cases} 2x + 3y = 5 \\\\ 4x - y = 11 \\end{cases} \\)'}</MathJax>
				</LectureEquation>

				<p className="lecture-paragraph">
					We can visualize both equations as lines on the same graph. The <span className="lecture-bold">solution</span> is the point where the lines intersect — both equations are satisfied simultaneously.
				</p>

				<LecturePlot
					lines={[
						{
							label: '2x + 3y = 5',
							fn: (x) => (5 - 2 * x) / 3,
							color: '#6366f1',
						},
						{
							label: '4x − y = 11',
							fn: (x) => 4 * x - 11,
							color: '#f59e0b',
						},
					]}
					xDomain={[-1, 5]}
					yDomain={[-2, 2]}
					points={[
						{
							x: 19 / 7,
							y: -1 / 7,
							label: `(${(19 / 7).toFixed(2)}, ${(-1 / 7).toFixed(2)})`,
							color: '#10b981',
						},
					]}
					xLabel="x"
					yLabel="y"
					caption="The intersection point (≈ 2.71, −0.14) is the unique solution to the system."
					height={400}
					/>
					
					<p className="lecture-paragraph">
						This system represents a <span className="lecture-bold">2D</span> system of equations
						<ul className="lecture-exercise-list">
							<li className="lecture-exercise-item"><span className="lecture-bold">x</span> — dimension 1</li>
							<li className="lecture-exercise-item"><span className="lecture-bold">y</span> — dimension 2</li>
						</ul>
						Where we try to find x and y values that satisfy both equations simultaneously.<br /><br/>

						The point where they intersect represents the unique solution to the system of equations.<br /> Systems of linear equation can have
						<ul className="lecture-exercise-list">
							<li className="lecture-exercise-item"><span className="lecture-bold">one unique solution</span> (like our example)</li>
							<li className="lecture-exercise-item"><span className="lecture-bold">infinitely many solutions</span> (when the lines coincide)</li>
							<li className="lecture-exercise-item"><span className="lecture-bold">no solution</span> (when the lines are parallel)</li>
						</ul>
						
					</p>

					<p className="lecture-paragraph">
						In higher dimensions, solutions to individual equations are one dimension lower than the number of variables:
						<table className="lecture-table mt-2">
							<thead>
								<tr className="lecture-table-row">
									<th className="lecture-table-header ml-100">Dimension</th>
									<th className="lecture-table-header">Space</th>
									<th className="lecture-table-header">Solution type</th>
									<th className="lecture-table-header">Example</th>
								</tr>
							</thead>
							<tbody>
								<tr className="lecture-table-row">
									<td className="lecture-table-cell"><span className="lecture-bold">1D</span></td>
									<td className="lecture-table-cell">line</td>
									<td className="lecture-table-cell"><span className="lecture-bold">point</span> (0D)</td>
									<td className="lecture-table-cell lecture-code-inline font-mono">x = 1</td>
								</tr>
								<tr className="lecture-table-row">
									<td className="lecture-table-cell"><span className="lecture-bold">2D</span></td>
									<td className="lecture-table-cell">plane</td>
									<td className="lecture-table-cell"><span className="lecture-bold">line</span> (1D)</td>
									<td className="lecture-table-cell lecture-code-inline font-mono">x + y = 1</td>
								</tr>
								<tr className="lecture-table-row">
									<td className="lecture-table-cell"><span className="lecture-bold">3D</span></td>
									<td className="lecture-table-cell">volume</td>
									<td className="lecture-table-cell"><span className="lecture-bold">plane</span> (2D)</td>
									<td className="lecture-table-cell lecture-code-inline font-mono">x + y + z = 1</td>
								</tr>
								<tr className="lecture-table-row">
									<td className="lecture-table-cell"><span className="lecture-bold">nD</span></td>
									<td className="lecture-table-cell">n-space</td>
									<td className="lecture-table-cell"><span className="lecture-bold">hyperplane</span> (n−1D)</td>
									<td className="lecture-table-cell lecture-code-inline font-mono">x₁ + … + xₙ = 1</td>
								</tr>
							</tbody>
						</table>
						the solution to these high dimension systems is the intersection of hyperplanes.

					</p>
      </section>

      {/* Applications of Systems of Equations */}
      <section className="lecture-section mini-scroll" id="applications-systems-equations">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Applications of Systems of Equations</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
						<span className="lecture-bold">Systems of equations</span> are used to find solutions where multiple conditions must be satisfied simultaneously.
					</p><br />
					<p className="lecture-paragraph">
						<span className="lecture-section-header">Chemistry</span><br />
						When modeling a chemical reaction, the reactants and products must balance.<br /><br />
						When propane burns, it reacts with Oxygen in the atmosphere to produce carbon dioxide and water.
					</p>
						{/* C₃H₈ + O₂ → CO₂ + H₂O  reaction without numbers for example*/}
					<p className="lecture-paragraph">
						The <span className="lecture-bold">Dimensions</span> are the amount of each molecule consumed or produced.<br />
						The <span className="lecture-bold">Constraints</span> is the rule of <span className="lecture-bold">conservation of mass</span> — the amount of Carbon, Hydrogen, and Oxygen atoms must be the same on both sides of the equation.
					</p><br />
					{/* xC₃H₈ + yO₂ → zCO₂ + wH₂O  reaction with variables for coefficients */}
					<p className="lecture-paragraph">
						The equation for each element can be written as a linear equation:<br />
					</p>

					<LectureEquation>
						<MathJax inline>{`\\( x\\text{C}_3\\text{H}_8 + y\\text{O}_2 \\to z\\text{CO}_2 + w\\text{H}_2\\text{O} \\)`}</MathJax>
					</LectureEquation>

					<p className="lecture-paragraph">
						Using the conservation of mass principle, we can set up a system of equations for each element:
					</p>

					<LectureEquation title="System of Linear Equations (by element)">
						<MathJax inline>{`\\( \\begin{align*}
\\text{Carbon:}   \\quad & 3x &  &=  z & \\\\
\\text{Hydrogen:} \\quad & 8x &  &=   & 2w \\\\
\\text{Oxygen:}   \\quad &  & 2y &=  2z + & w &
\\end{align*} \\)`}</MathJax>
					</LectureEquation>

					<p className="lecture-paragraph">
						Rearranging to standard form:
					</p>

					<LectureEquation>
						<MathJax inline>{`\\( \\begin{align*}
3&x &  & - z & &= 0 \\\\
8&x & & & - 2w &= 0 \\\\
& & 2y & - 2z & -w  &= 0
\\end{align*} \\)`}</MathJax>
					</LectureEquation>
					<p className="lecture-paragraph">
						This system has <span className="lecture-bold">infinitely many solutions</span><br />
						The <span className="lecture-bold">trivial solution</span> is when all variables are zero.<br />
						and the <span className="lecture-bold">general solution</span> 
					</p>
					<LectureEquation title="General Solution">
						<MathJax inline>{`\\( \\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\to 3\\text{CO}_2 + 4\\text{H}_2\\text{O} \\)`}</MathJax>
					</LectureEquation>
					
					<p className="lecture-paragraph">
						There are infinitely many solutions, but they are all scalar multiples of the general solution, representing the same chemical reaction in different proportions or reversed. 
					</p>

					<span className="lecture-section-header">Electronics</span><br />
					All electronic circuits must satisfy
					<ul className="lecture-exercise-list">
						<li className="lecture-exercise-item"><span className="lecture-bold">Kirchhoff's Current Law</span> — the total current entering a junction equals the total current leaving.</li>
						<li className="lecture-exercise-item"><span className="lecture-bold">Kirchhoff's Voltage Law</span> — the total voltage around any closed loop in a circuit must equal zero.</li>
					</ul>
					<p className="lecture-paragraph">
						In addition, they must satisfy the constraints of the components used 
						<ul className="lecture-exercise-list">
							<li className="lecture-exercise-item"><span className="lecture-bold">Resistors</span> — voltage drop across a resistor is proportional to the current through it (Ohm's Law: V = IR).</li>
							<li className="lecture-exercise-item"><span className="lecture-bold">Capacitors</span> — current through a capacitor is proportional to the rate of change of voltage across it (I = C dV/dt).</li>
							<li className="lecture-exercise-item"><span className="lecture-bold">Inductors</span> — voltage across an inductor is proportional to the rate of change of current through it (V = L dI/dt).</li>
						</ul>
					</p>

					<div className="relative w-full aspect-[3/2] max-w-[400px] mx-auto rounded-lg overflow-hidden shadow-lg hidden sm:block p-4">
												<Image
													src="/images/classes/python-automation/c1.svg"
													alt="Guido van Rossum - Creator of Python"
													fill
													className="object-cover"
												/>
											</div>

					<p className="lecture-paragraph">
						The <span className="lecture-bold">Dimensions</span> are the voltage and current in the circuit
						The <span className="lecture-bold">Constraints</span> are the rules imposed by Kirchhoff's laws and the characteristics of the circuit components.
					</p><br />
					

      </section>

      {/* Vector Fundamentals */}
      <section className="lecture-section mini-scroll" id="vector-fundamentals">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Vector fundamentals</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
						<span className="lecture-bold">Vectors</span> are quantities with both magnitude and direction.<br />
						Points in N - dimensional <span className="lecture-bold">Euclidean Space</span> are all vectors. <span className="opacity-60">e.g. (x, y, z) in 3D space, (x, y) in 2D space</span>
				</p>
				<p className="lecture-paragraph">
						Vectors satisfy
				</p>
				<ul className="lecture-exercise-list">
						<li className="lecture-exercise-item"><span className="lecture-bold">Associativity</span> — <MathJax inline >{"\\((\\vec{a} + \\vec{b}) + \\vec{c} = \\vec{a} + (\\vec{b} + \\vec{c})\\)"}</MathJax></li>
						<li className="lecture-exercise-item"><span className="lecture-bold">Commutativity</span> — <MathJax inline >{"\\(\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}\\)"}</MathJax></li>
						<li className="lecture-exercise-item"><span className="lecture-bold">Identity vector</span> — <MathJax inline >{"\\(\\vec{v} + \\vec{0} = \\vec{v}\\)"}</MathJax></li>
						<li className="lecture-exercise-item"><span className="lecture-bold">Inverse vector</span> — <MathJax inline >{"\\(\\vec{v} + (-\\vec{v}) = \\vec{0}\\)"}</MathJax></li>
						<li className="lecture-exercise-item"><span className="lecture-bold">Scalar multiplication</span> — <MathJax inline >{"\\(a(\\vec{v} + \\vec{w}) = a\\vec{v} + a\\vec{w}\\)"}</MathJax>, <MathJax inline >{"\\((a + b)\\vec{v} = a\\vec{v} + b\\vec{v}\\)"}</MathJax>, <MathJax inline >{"\\(a(b\\vec{v}) = (ab)\\vec{v}\\)"}</MathJax>, <MathJax inline >{"\\(1\\vec{v} = \\vec{v}\\)"}</MathJax></li>
					</ul>
					<p className="lecture-paragraph">
						Vectors can represent points in our <span className="lecture-bold">Linear Systems of Equations</span>.
						For example, the solution to the chemistry problem can be represented as a vector of the coefficients of each molecule:
					</p>
					<LectureEquation>
						<MathJax inline>{`\\( \\begin{bmatrix} -\\text{C}_3 \\text{H}_8 \\\\ -\\text{O}_2 \\\\ \\text{CO}_2 \\\\ \\text{H}_2\\text{O} \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 5 \\\\ 3 \\\\ 4 \\end{bmatrix} \\)`}</MathJax>
					</LectureEquation>
        {/* Content will be added here */}
      </section>

      {/* Vector Operations */}
      <section className="lecture-section mini-scroll" id="vector-operations">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Vector operations</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Vector operations</span> are fundamental tools for manipulating vectors in linear algebra and applications like computer graphics, physics, and machine learning.
        </p>

        <table className="lecture-table mt-4 w-full">
          <thead>
            <tr className="lecture-table-row">
              <th className="lecture-table-cell lecture-bold">Operation</th>
              <th className="lecture-table-cell lecture-bold">Description</th>
              <th className="lecture-table-cell lecture-bold">Formula / Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Addition</span></td>
              <td className="lecture-table-cell">Add corresponding components of two vectors</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(\\vec{a} + \\vec{b} = \\begin{bmatrix} a_1 + b_1 \\\\ a_2 + b_2 \\\\ a_3 + b_3 \\end{bmatrix}\\)"}</MathJax></td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Subtraction</span></td>
              <td className="lecture-table-cell">Subtract corresponding components of two vectors</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(\\vec{a} - \\vec{b} = \\begin{bmatrix} a_1 - b_1 \\\\ a_2 - b_2 \\\\ a_3 - b_3 \\end{bmatrix}\\)"}</MathJax></td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Scalar Multiplication</span></td>
              <td className="lecture-table-cell">Multiply each component by a scalar (constant)</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(c\\vec{a} = \\begin{bmatrix} ca_1 \\\\ ca_2 \\\\ ca_3 \\end{bmatrix}\\)"}</MathJax></td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Dot Product</span></td>
              <td className="lecture-table-cell">Multiply corresponding components and sum the results; produces a scalar</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3\\)"}</MathJax></td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Magnitude</span></td>
              <td className="lecture-table-cell">Length or norm of a vector</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(\\|\\vec{a}\\| = \\sqrt{a_1^2 + a_2^2 + a_3^2}\\)"}</MathJax></td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><span className="lecture-bold">Normalization</span></td>
              <td className="lecture-table-cell">Scale a vector to unit length (magnitude = 1)</td>
              <td className="lecture-table-cell lecture-code-inline"><MathJax inline>{"\\(\\hat{\\vec{a}} = \\frac{\\vec{a}}{\\|\\vec{a}\\|}\\)"}</MathJax></td>
            </tr>
          </tbody>
        </table>

        <div className="lecture-paragraph mt-4">
          <span className="lecture-bold">Examples:</span> Consider these vectors:
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="rounded-lg border-2 border-indigo-400/50 bg-indigo-500/10 p-4 flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Vector A</p>
              <div className="text-center">
                <MathJax inline>{"\\(\\vec{a} = \\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix}\\)"}</MathJax>
              </div>
            </div>
            <div className="rounded-lg border-2 border-violet-400/50 bg-violet-500/10 p-4 flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Vector B</p>
              <div className="text-center">
                <MathJax inline>{"\\(\\vec{b} = \\begin{bmatrix} 4 \\\\ 5 \\\\ 6 \\end{bmatrix}\\)"}</MathJax>
              </div>
            </div>
          </div>
        </div>

        <div className="lecture-vec-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 w-full">

          {/* ── Row 1: Indigo — Basic Arithmetic ── */}

          {/* Card 0: Addition */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-indigo-500/20 border-b border-indigo-500/30">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Addition</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(\\vec{a} + \\vec{b}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 0)} className="self-start text-xs px-3 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/40 text-indigo-400 transition-colors cursor-pointer">
                {revealedCards.has(0) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(0) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — add component-wise</p>
                  <MathJax inline>{"\\(\\begin{bmatrix} 1+4 \\\\ 2+5 \\\\ 3+6 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(= \\begin{bmatrix} 5 \\\\ 7 \\\\ 9 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 1: Subtraction */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-indigo-500/20 border-b border-indigo-500/30">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Subtraction</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(\\vec{a} - \\vec{b}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 1)} className="self-start text-xs px-3 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/40 text-indigo-400 transition-colors cursor-pointer">
                {revealedCards.has(1) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(1) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — subtract component-wise</p>
                  <MathJax inline>{"\\(\\begin{bmatrix} 1-4 \\\\ 2-5 \\\\ 3-6 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(= \\begin{bmatrix} -3 \\\\ -3 \\\\ -3 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Scalar Multiplication */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-indigo-500/20 border-b border-indigo-500/30">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Scalar Multiplication</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(2\\vec{a}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 2)} className="self-start text-xs px-3 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/40 text-indigo-400 transition-colors cursor-pointer">
                {revealedCards.has(2) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(2) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — multiply each component by scalar c = 2</p>
                  <MathJax inline>{"\\(2 \\cdot \\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 2 \\times 1 \\\\ 2 \\times 2 \\\\ 2 \\times 3 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(= \\begin{bmatrix} 2 \\\\ 4 \\\\ 6 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 2: Violet — Products ── */}

          {/* Card 3: Dot Product */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-violet-500/20 border-b border-violet-500/30">
              <span className="text-violet-400 text-xs font-bold uppercase tracking-wider">Dot Product</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(\\vec{a} \\cdot \\vec{b}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 3)} className="self-start text-xs px-3 py-1 rounded-md bg-violet-500/20 hover:bg-violet-500/40 border border-violet-500/40 text-violet-400 transition-colors cursor-pointer">
                {revealedCards.has(3) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(3) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — multiply corresponding components</p>
                  <MathJax inline>{"\\(1 \\times 4 = 4,\\quad 2 \\times 5 = 10,\\quad 3 \\times 6 = 18\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — sum the products</p>
                  <MathJax inline>{"\\(4 + 10 + 18 = 32\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\vec{a} \\cdot \\vec{b} = 32\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Cross Product */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-violet-500/20 border-b border-violet-500/30">
              <span className="text-violet-400 text-xs font-bold uppercase tracking-wider">Cross Product</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(\\vec{a} \\times \\vec{b}\\)"}</MathJax> <span className="opacity-50">(3D only)</span></p>
              <button onClick={(e) => toggleCard(e, 4)} className="self-start text-xs px-3 py-1 rounded-md bg-violet-500/20 hover:bg-violet-500/40 border border-violet-500/40 text-violet-400 transition-colors cursor-pointer">
                {revealedCards.has(4) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(4) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — apply the formula</p>
                  <MathJax inline>{"\\(\\begin{bmatrix} a_2 b_3 - a_3 b_2 \\\\ a_3 b_1 - a_1 b_3 \\\\ a_1 b_2 - a_2 b_1 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — substitute values</p>
                  <MathJax inline>{"\\(\\begin{bmatrix} 2(6)-3(5) \\\\ 3(4)-1(6) \\\\ 1(5)-2(4) \\end{bmatrix} = \\begin{bmatrix} 12-15 \\\\ 12-6 \\\\ 5-8 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(= \\begin{bmatrix} -3 \\\\ 6 \\\\ -3 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 5: Angle Between */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-violet-500/20 border-b border-violet-500/30">
              <span className="text-violet-400 text-xs font-bold uppercase tracking-wider">Angle Between</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find angle <MathJax inline>{"\\(\\theta\\)"}</MathJax> between <MathJax inline>{"\\(\\vec{a}\\)"}</MathJax> and <MathJax inline>{"\\(\\vec{b}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 5)} className="self-start text-xs px-3 py-1 rounded-md bg-violet-500/20 hover:bg-violet-500/40 border border-violet-500/40 text-violet-400 transition-colors cursor-pointer">
                {revealedCards.has(5) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(5) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — recall formula</p>
                  <MathJax inline>{"\\(\\cos\\theta = \\dfrac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{a}\\|\\,\\|\\vec{b}\\|}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — compute magnitudes</p>
                  <MathJax inline>{"\\(\\|\\vec{a}\\| = \\sqrt{14},\\quad \\|\\vec{b}\\| = \\sqrt{77}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 3 — substitute (a·b = 32)</p>
                  <MathJax inline>{"\\(\\cos\\theta = \\dfrac{32}{\\sqrt{14}\\cdot\\sqrt{77}} = \\dfrac{32}{\\sqrt{1078}} \\approx 0.974\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\theta = \\arccos(0.974) \\approx 12.9°\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 3: Teal — Norms / Geometry ── */}

          {/* Card 6: Magnitude */}
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-teal-500/20 border-b border-teal-500/30">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Magnitude</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find <MathJax inline>{"\\(\\|\\vec{a}\\|\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 6)} className="self-start text-xs px-3 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 text-teal-400 transition-colors cursor-pointer">
                {revealedCards.has(6) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(6) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — square each component</p>
                  <MathJax inline>{"\\(1^2 = 1,\\quad 2^2 = 4,\\quad 3^2 = 9\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — sum</p>
                  <MathJax inline>{"\\(1 + 4 + 9 = 14\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\|\\vec{a}\\| = \\sqrt{14} \\approx 3.742\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 7: Normalization */}
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-teal-500/20 border-b border-teal-500/30">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Normalization</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find unit vector <MathJax inline>{"\\(\\hat{\\vec{a}}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 7)} className="self-start text-xs px-3 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 text-teal-400 transition-colors cursor-pointer">
                {revealedCards.has(7) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(7) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — compute magnitude</p>
                  <MathJax inline>{"\\(\\|\\vec{a}\\| = \\sqrt{14} \\approx 3.742\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — divide each component by magnitude</p>
                  <MathJax inline>{"\\(\\hat{\\vec{a}} = \\dfrac{1}{\\sqrt{14}}\\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\approx \\begin{bmatrix} 0.267 \\\\ 0.535 \\\\ 0.802 \\end{bmatrix},\\quad \\|\\hat{\\vec{a}}\\| = 1 \\checkmark\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 8: Distance */}
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-teal-500/20 border-b border-teal-500/30">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Distance</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find <MathJax inline>{"\\(d(\\vec{a},\\,\\vec{b}) = \\|\\vec{a}-\\vec{b}\\|\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 8)} className="self-start text-xs px-3 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 text-teal-400 transition-colors cursor-pointer">
                {revealedCards.has(8) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(8) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — compute difference</p>
                  <MathJax inline>{"\\(\\vec{a}-\\vec{b} = \\begin{bmatrix} 1-4 \\\\ 2-5 \\\\ 3-6 \\end{bmatrix} = \\begin{bmatrix} -3 \\\\ -3 \\\\ -3 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — find magnitude of the difference</p>
                  <MathJax inline>{"\\(\\sqrt{(-3)^2+(-3)^2+(-3)^2} = \\sqrt{27} = 3\\sqrt{3}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(d \\approx 5.196\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 4: Amber — Projections & Combinations ── */}

          {/* Card 9: Scalar Projection */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-amber-500/20 border-b border-amber-500/30">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Scalar Projection</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find <MathJax inline>{"\\(\\text{comp}_{\\vec{b}}(\\vec{a})\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 9)} className="self-start text-xs px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-400 transition-colors cursor-pointer">
                {revealedCards.has(9) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(9) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — formula</p>
                  <MathJax inline>{"\\(\\text{comp}_{\\vec{b}}(\\vec{a}) = \\dfrac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{b}\\|}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — substitute (a·b = 32, |b| = √77)</p>
                  <MathJax inline>{"\\(= \\dfrac{32}{\\sqrt{77}}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\approx 3.648\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 10: Vector Projection */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-amber-500/20 border-b border-amber-500/30">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Vector Projection</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Find <MathJax inline>{"\\(\\text{proj}_{\\vec{b}}(\\vec{a})\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 10)} className="self-start text-xs px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-400 transition-colors cursor-pointer">
                {revealedCards.has(10) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(10) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — formula</p>
                  <MathJax inline>{"\\(\\text{proj}_{\\vec{b}}(\\vec{a}) = \\dfrac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{b}\\|^2}\\,\\vec{b}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — substitute (a·b = 32, |b|² = 77)</p>
                  <MathJax inline>{"\\(= \\dfrac{32}{77}\\begin{bmatrix} 4 \\\\ 5 \\\\ 6 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(\\approx \\begin{bmatrix} 1.662 \\\\ 2.078 \\\\ 2.494 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

          {/* Card 11: Linear Combination */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-amber-500/20 border-b border-amber-500/30">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Linear Combination</span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="tc2 text-sm">Compute <MathJax inline>{"\\(2\\vec{a} - 3\\vec{b}\\)"}</MathJax></p>
              <button onClick={(e) => toggleCard(e, 11)} className="self-start text-xs px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-400 transition-colors cursor-pointer">
                {revealedCards.has(11) ? '▲ Hide' : '▼ Reveal'}
              </button>
              {revealedCards.has(11) && (
                <div className="rounded-lg bg-black/20 p-3 space-y-2 text-sm tc2">
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 1 — scale each vector</p>
                  <MathJax inline>{"\\(2\\vec{a} = \\begin{bmatrix} 2 \\\\ 4 \\\\ 6 \\end{bmatrix},\\quad 3\\vec{b} = \\begin{bmatrix} 12 \\\\ 15 \\\\ 18 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Step 2 — subtract component-wise</p>
                  <MathJax inline>{"\\(\\begin{bmatrix} 2-12 \\\\ 4-15 \\\\ 6-18 \\end{bmatrix}\\)"}</MathJax>
                  <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">Result</p>
                  <MathJax inline>{"\\(= \\begin{bmatrix} -10 \\\\ -11 \\\\ -12 \\end{bmatrix}\\)"}</MathJax>
                </div>
              )}
            </div>
          </div>

				</div>
					
					<p className="lecture-paragraph mt-6">
						The dot product is particularly important, because it is the basis for <span className="lecture-bold">Matrix Multiplication</span><br />
						{/* dot product example */}
						<LectureEquation title="Dot product format">
							<MathJax>{'\\[ \\begin{bmatrix} 1 & 2 & 3 \\end{bmatrix} \\cdot \\begin{bmatrix} 7 \\\\ 8 \\\\ 9 \\end{bmatrix} = \\begin{bmatrix} 1\\cdot7 + 2\\cdot8 + 3\\cdot9 \\end{bmatrix} = \\begin{bmatrix} 50 \\end{bmatrix} \\]'}</MathJax>
							<MathJax>{'\\[ \\begin{bmatrix} 4 & 8 & 4 & 2 \\end{bmatrix} \\cdot \\begin{bmatrix} 7 \\\\ 8 \\\\ 9 \\\\ 10 \\end{bmatrix} = \\begin{bmatrix} 4\\cdot7 + 8\\cdot8 + 4\\cdot9 + 2\\cdot10 \\end{bmatrix} = \\begin{bmatrix} 150 \\end{bmatrix} \\]'}</MathJax>

							<MathJax>{'\\[ \\begin{bmatrix} 6 & 2	 \\end{bmatrix} \\cdot \\begin{bmatrix} 5 \\\\ 8 \\end{bmatrix} = \\begin{bmatrix} 6\\cdot5 + 2\\cdot8 \\end{bmatrix} = \\begin{bmatrix} 46 \\end{bmatrix} \\]'}</MathJax>
						</LectureEquation>
						It can be used to apply the results of our <span className="lecture-bold">Systems of Linear Equations</span> to the initial equations.<br />
						<LectureEquation >
							<MathJax >{`\\( \\begin{bmatrix} -\\text{C}_3 \\text{H}_8 & -\\text{O}_2 & \\text{CO}_2 & \\text{H}_2\\text{O} \\end{bmatrix} \\cdot \\begin{bmatrix} 1 \\\\ 5 \\\\ 3 \\\\ 4 \\end{bmatrix}  = -\\text{C}_3\\text{H}_8 - 5\\text{O}_2 + 3\\text{CO}_2 + 4\\text{H}_2\\text{O} \\)`}</MathJax>
						</LectureEquation>
					</p>
      </section>


      {/* Matrix Basics */}
      <section className="lecture-section mini-scroll" id="matrix-basics">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Matrix Basics</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
						<span className="lecture-bold">Matrices</span> are vectors of vectors — 2D arrays that can represent systems of equations.<br />
						If a single linear equation can be represented as the dot product of two vectors
						<LectureEquation>
							<MathJax>{'\\[   \\quad \\begin{bmatrix} 2 & 3 & -1 \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} = 5 \\qquad \\implies \\qquad 2x + 3y - z = 5 \\quad\\]'}</MathJax>
						</LectureEquation>
						then a system of linear equations can be represented as the product of a matrix and a vector
						<LectureEquation>
							<MathJax>{'\\[ \\begin{bmatrix} 2 & 3 & -1 \\\\ 1 & -4 & 2 \\\\ -3 & 0 & 5 \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ -2 \\\\ 7 \\end{bmatrix} \\]'}</MathJax>
							<MathJax>{'\\[ \\implies \\begin{cases} 2x + 3y - z = 5 \\\\\\ x - 4y + 2z = -2 \\\\\\ -3x + 5z = 7 \\end{cases} \\]'}</MathJax>
						</LectureEquation>
					</p>
					<p className="lecture-paragraph">
						The right hand vector is multiplied against each column in order, and the result is stored in that row of the output vector.
						<LectureEquation title ="Matrix-vector multiplication">
							<MathJax>{'\\[ \\begin{bmatrix} x_{0,0} & x_{0,1} & x_{0,2} \\\\ x_{1,0} & x_{1,1} & x_{1,2} \\\\ x_{2,0} & x_{2,1} & x_{2,2} \\end{bmatrix} \\cdot \\begin{bmatrix} y_0 \\\\ y_1 \\\\ y_2 \\end{bmatrix} = \\begin{bmatrix} x_{0,0}y_0 + x_{0,1}y_1 + x_{0,2}y_2 \\\\ x_{1,0}y_0 + x_{1,1}y_1 + x_{1,2}y_2 \\\\ x_{2,0}y_0 + x_{2,1}y_1 + x_{2,2}y_2 \\end{bmatrix} \\]'}</MathJax>
						</LectureEquation>
					</p>

					<p className="lecture-paragraph">
						The <span className="lecture-bold">Identity Matrix</span> <MathJax inline>{"\\(I\\)"}</MathJax> is a special matrix that acts as the multiplicative identity in matrix multiplication.
						<LectureEquation title="Identity matrix">
							<MathJax>{'\\[ I = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} \\]'}</MathJax>
						</LectureEquation>
					</p>

      </section>


      {/* Applications of Matrix Math */}
				<section className="lecture-section mini-scroll" id="applications-matrix-math">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Applications of Matrix Math</h3>
				<div className="lecture-header-decorator" />
					
				<span className="lecture-section-header">Inverses</span><br />
        <p className="lecture-paragraph">
						The most common use of <span className="lecture-bold">Matrix mathematics</span> is in the solving of systems of linear equations.<br/>
						Now that we can write our <span className="lecture-bold">System of Linear Equations</span> as a matrix
						<LectureEquation>
							<MathJax>{'\\[ \\begin{bmatrix} 3 & 0 & -1 \\\\ 8 & 0 & 0 \\\\ 0 & 2 & -2 \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix}  = \\begin{bmatrix} 5 \\\\3 \\\\ 6 \\end{bmatrix} \\]'}</MathJax>
							<MathJax>{'\\[ \\implies A \\cdot \\vec{x} = \\vec{b} \\]'}</MathJax>
						</LectureEquation>
						to solve for <MathJax inline>{"\\(\\vec{x}\\)"}</MathJax>, we want to isolate <MathJax inline>{"\\(\\vec{x}\\)"}</MathJax> by turning <MathJax inline>{"\\(A\\)"}</MathJax> into the identity matrix <MathJax inline>{"\\(I\\)"}</MathJax>.<br />
						This is done using the <span className="lecture-bold">Inverse Matrix</span> <MathJax inline>{"\\(A^{-1}\\)"}</MathJax> such that
						<LectureEquation>
							<MathJax>{'\\[ A^{-1} \\cdot A = I \\]'}</MathJax>
							<MathJax>{'\\[ A^{-1} \\cdot A \\cdot \\vec{x} = A^{-1} \\cdot \\vec{b} \\]'}</MathJax>
							<MathJax>{'\\[ I \\cdot \\vec{x} = A^{-1} \\cdot \\vec{b} \\]'}</MathJax>
							<MathJax>{'\\[ \\vec{x} = A^{-1} \\cdot \\vec{b} \\]'}</MathJax>
						</LectureEquation>
						However, not all matrices have inverses, and the methods for finding them can be computationally expensive.
					</p>
					
					<span className="lecture-section-header">Transformations</span><br />
					<p className="lecture-paragraph">
						In computer graphics, individual points for a 3D model are stored as vectors.<br />
						When a player in 3D video game looks around, the entire game world needs to be rotated around the player to create the illusion of movement.<br />
						This rotation in 3D space can be done by multiplying every point vector by a single <span className="lecture-bold">Rotation Matrix</span> R.<br />
						<LectureEquation>
							<MathJax>{'\\[ \\vec{p}_{\\text{rotated}} = R \\cdot \\vec{p}_{\\text{original}} \\]'}</MathJax>
							<MathJax>{'\\[ R_x = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\theta & -\\sin\\theta \\\\ 0 & \\sin\\theta & \\cos\\theta \\end{bmatrix} \\qquad R_y = \\begin{bmatrix} \\cos\\theta & 0 & \\sin\\theta \\\\ 0 & 1 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta \\end{bmatrix} \\qquad R_z = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} \\]'}</MathJax>
							<MathJax>{'\\[ R = R_z \\cdot R_y \\cdot R_x \\]'}</MathJax>
						</LectureEquation>
						This can also be applied as scaling matrices
						<LectureEquation>
							<MathJax>{'\\[ S = \\begin{bmatrix} s_x & 0 & 0 \\\\ 0 & s_y & 0 \\\\ 0 & 0 & s_z \\end{bmatrix} \\]'}</MathJax>
						</LectureEquation>
						and translation matrices (using homogeneous coordinates)
						<LectureEquation>
							<MathJax>{'\\[ T = \\begin{bmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\]'}</MathJax>
						</LectureEquation>
						to create complex transformations by multiplying the appropriate matrices together.
					</p>

					

      </section>

      {/* Linear Regression */}
      <section className="lecture-section mini-scroll" id="linear-regression">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Linear Regression</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Linear regression</span> finds the best-fitting line (or hyperplane) through a dataset by minimizing the total squared distance between each data point and the predicted value — a technique called <span className="lecture-bold">Ordinary Least Squares (OLS)</span>.
        </p>

        <p className="lecture-paragraph">
          Given <MathJax inline>{'\\(n\\)'}</MathJax> data points, we model the relationship as:
        </p>

        <LectureEquation title="Linear Model">
          <MathJax>{'\\[ \\hat{y} = \\beta_0 + \\beta_1 x \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          We stack the data into a <span className="lecture-bold">design matrix</span> <MathJax inline>{'\\(X\\)'}</MathJax> — each row is one observation, with a leading 1 to absorb the intercept:
        </p>

        <LectureEquation title="Matrix Form">
          <MathJax>{'\\[ X = \\begin{bmatrix} 1 & x_1 \\\\ 1 & x_2 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{bmatrix}, \\quad \\vec{\\beta} = \\begin{bmatrix} \\beta_0 \\\\ \\beta_1 \\end{bmatrix}, \\quad \\vec{y} = \\begin{bmatrix} y_1 \\\\ y_2 \\\\ \\vdots \\\\ y_n \\end{bmatrix} \\qquad \\Rightarrow \\qquad \\hat{\\vec{y}} = X\\vec{\\beta} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          We want <MathJax inline>{'\\(\\vec{\\beta}\\)'}</MathJax> that minimizes the <span className="lecture-bold">sum of squared residuals</span>:
        </p>

        <LectureEquation title="Least Squares Objective">
          <MathJax>{'\\[ \\min_{\\vec{\\beta}} \\|\\vec{y} - X\\vec{\\beta}\\|^2 \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          Setting the gradient to zero gives the <span className="lecture-bold">Normal Equations</span> — a closed-form matrix solution:
        </p>

        <LectureEquation title="Normal Equations (OLS solution)">
          <MathJax>{'\\[ X^\\top X \\vec{\\beta} = X^\\top \\vec{y} \\]'}</MathJax>
          <MathJax>{'\\[ \\vec{\\beta} = (X^\\top X)^{-1} X^\\top \\vec{y} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          The matrix <MathJax inline>{'\\((X^\\top X)^{-1} X^\\top\\)'}</MathJax> is the <span className="lecture-bold">Moore–Penrose pseudoinverse</span> of <MathJax inline>{'\\(X\\)'}</MathJax>.
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Example:</span> predicting exam score from hours studied. Applying the OLS formula to 10 data points gives <MathJax inline>{'\\(\\hat{y} = 5.0x + 47.2\\)'}</MathJax>.
        </p>

        <LecturePlot
          lines={[
            {
              label: 'ŷ = 5.0x + 47.2',
              fn: (x) => 5.0 * x + 47.2,
              color: '#6366f1',
              strokeWidth: 2,
            },
          ]}
          xDomain={[0, 11]}
          yDomain={[40, 105]}
          points={[
            { x: 1,  y: 50,  color: '#f59e0b' },
            { x: 2,  y: 55,  color: '#f59e0b' },
            { x: 3,  y: 65,  color: '#f59e0b' },
            { x: 4,  y: 70,  color: '#f59e0b' },
            { x: 5,  y: 72,  color: '#f59e0b' },
            { x: 6,  y: 78,  color: '#f59e0b' },
            { x: 7,  y: 82,  color: '#f59e0b' },
            { x: 8,  y: 88,  color: '#f59e0b' },
            { x: 9,  y: 92,  color: '#f59e0b' },
            { x: 10, y: 95,  color: '#f59e0b' },
          ]}
          xLabel="Hours studied"
          yLabel="Score"
          caption="Amber dots: observed (hours, score) pairs. Indigo line: OLS best-fit ŷ = 5.0x + 47.2, computed via β̂ = (XᵀX)⁻¹Xᵀy."
          height={380}
        />

        <p className="lecture-paragraph">
          The vertical distance from each amber dot to the indigo line is called a <span className="lecture-bold">residual</span>. OLS minimizes the sum of all squared residuals simultaneously — which is why it produces the unique best-fit line.
        </p>

        <p className="lecture-paragraph mt-4">
          Explore it interactively below — drag points, add new ones, and toggle features to see how the fit changes in real time.
        </p>
        <LeastSquares className="mt-2 mb-4" />
      </section>

      {/* Introduction to NumPy for linear algebra */}
      <section className="lecture-section mini-scroll" id="numpy-intro">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Introduction to NumPy for linear algebra</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">NumPy</span> is Python's primary library for numerical computing. Its core data structure, the <span className="lecture-bold">ndarray</span>, represents both vectors and matrices and supports vectorised operations that run in compiled C — orders of magnitude faster than pure Python loops.
        </p>

        <span className="lecture-section-header">Creating Arrays</span>
        <CodeBlock
          filename="numpy_arrays.py"
          language="python"
          code={`import numpy as np

# Vectors (1-D arrays)
v     = np.array([1, 2, 3])        # from a list
zeros = np.zeros(4)                # [0. 0. 0. 0.]
ones  = np.ones(3)                 # [1. 1. 1.]
range_ = np.arange(0, 10, 2)      # [0 2 4 6 8]

# Matrices (2-D arrays)
A = np.array([[1, 2], [3, 4]])    # 2×2 matrix
I = np.eye(3)                     # 3×3 identity matrix
Z = np.zeros((3, 3))              # 3×3 zero matrix

print(v.shape)   # (3,)
print(A.shape)   # (2, 2)`}
        />

        <span className="lecture-section-header">Vector & Matrix Operations</span>
        <p className="lecture-paragraph">
          NumPy operators (<span className="lecture-code-inline">+</span>, <span className="lecture-code-inline">*</span>, …) work <span className="lecture-bold">element-wise</span>. Use <span className="lecture-code-inline">@</span> (or <span className="lecture-code-inline">np.dot</span>) for the dot product and matrix multiplication.
        </p>
        <CodeBlock
          filename="numpy_operations.py"
          language="python"
          code={`import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Vector operations
print(a + b)               # [5 7 9]    — element-wise addition
print(a - b)               # [-3 -3 -3] — element-wise subtraction
print(2 * a)               # [2 4 6]    — scalar multiplication
print(a @ b)               # 32         — dot product
print(np.linalg.norm(a))   # 3.742      — magnitude

# Matrix operations
print(A @ B)               # matrix multiplication
print(A.T)                 # transpose
print(np.linalg.det(A))    # determinant  → -2.0
print(np.linalg.inv(A))    # inverse matrix`}
        />

        <span className="lecture-section-header">Solving Systems of Equations</span>
        <p className="lecture-paragraph">
          <span className="lecture-code-inline">np.linalg.solve</span> solves <MathJax inline>{'\\(A\\vec{x} = \\vec{b}\\)'}</MathJax> using LU decomposition — more numerically stable than computing <MathJax inline>{'\\(A^{-1}\\)'}</MathJax> explicitly.
        </p>
        <CodeBlock
          filename="numpy_solve.py"
          language="python"
          code={`import numpy as np

# Solve:  2x + 3y = 5
#         4x -  y = 11
A = np.array([[2,  3],
              [4, -1]], dtype=float)
b = np.array([5, 11], dtype=float)

x = np.linalg.solve(A, b)
print(x)                         # [2.714  -0.143]

# Verify
print(np.allclose(A @ x, b))     # True`}
        />

        <span className="lecture-section-header">Linear Regression with NumPy</span>
        <p className="lecture-paragraph">
          The OLS formula <MathJax inline>{'\\(\\vec{\\beta} = (X^\\top X)^{-1} X^\\top \\vec{y}\\)'}</MathJax> maps directly to NumPy. <span className="lecture-code-inline">np.linalg.lstsq</span> is the numerically robust version — it handles overdetermined, underdetermined, and rank-deficient systems.
        </p>
        <CodeBlock
          filename="linear_regression.py"
          language="python"
          code={`import numpy as np

hours  = np.array([1, 2, 3, 4, 5, 6, 7, 8,  9, 10], dtype=float)
scores = np.array([50, 55, 65, 70, 72, 78, 82, 88, 92, 95], dtype=float)

# Design matrix: column of 1s (intercept) + feature column
X = np.column_stack([np.ones(len(hours)), hours])

# Method 1 — closed-form normal equations
beta = np.linalg.inv(X.T @ X) @ X.T @ scores
print(beta)   # [47.2, 5.0]  →  score ≈ 47.2 + 5.0 × hours

# Method 2 — numerically stable least squares (preferred)
beta_stable, _, _, _ = np.linalg.lstsq(X, scores, rcond=None)
print(f"Intercept: {beta_stable[0]:.2f}")   # 47.20
print(f"Slope:     {beta_stable[1]:.2f}")   # 5.00

# Predict a new value
x_new = np.array([1, 6.5])
print(f"Predicted score for 6.5 hrs: {x_new @ beta_stable:.1f}")  # 79.7`}
        />
      </section>

      {/* Practical applications in data science */}
      <section className="lecture-section mini-scroll" id="practical-applications">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Practical applications in data science</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Linear algebra</span> is the mathematical backbone of modern data science and machine learning. Every major algorithm ultimately reduces to matrix operations.
        </p>

        <span className="lecture-section-header">Principal Component Analysis (PCA)</span>
        <p className="lecture-paragraph">
          PCA reduces a dataset's dimensionality while preserving as much variance as possible. It finds the axes (<span className="lecture-bold">principal components</span>) along which the data varies most, using <span className="lecture-bold">eigendecomposition</span> of the covariance matrix.
        </p>
        <LectureEquation title="PCA — Eigendecomposition">
          <MathJax>{'\\[ \\Sigma = \\frac{1}{n-1} X^\\top X \\qquad (\\text{covariance matrix}) \\]'}</MathJax>
          <MathJax>{'\\[ \\Sigma \\vec{v} = \\lambda \\vec{v} \\qquad (\\text{eigenvectors and eigenvalues}) \\]'}</MathJax>
          <MathJax>{'\\[ X_{\\text{reduced}} = X \\cdot V_k \\qquad (\\text{project onto top-}k\\text{ components}) \\]'}</MathJax>
        </LectureEquation>
        <CodeBlock
          filename="pca.py"
          language="python"
          code={`import numpy as np

# X: n_samples × n_features, mean-centred
X = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9],
              [1.9, 2.2], [3.1, 3.0], [2.3, 2.7]])
X -= X.mean(axis=0)          # centre the data

# Covariance matrix
cov = (X.T @ X) / (len(X) - 1)

# Eigendecomposition — eigenvectors are the principal components
eigenvalues, eigenvectors = np.linalg.eigh(cov)
idx = np.argsort(eigenvalues)[::-1]   # sort by descending variance
eigenvectors = eigenvectors[:, idx]

# Project onto the top-1 principal component
X_reduced = X @ eigenvectors[:, :1]
print("Original shape:", X.shape)    # (6, 2)
print("Reduced shape: ", X_reduced.shape)  # (6, 1)`}
        />

        <span className="lecture-section-header">Neural Networks</span>
        <p className="lecture-paragraph">
          Every layer of a neural network is a matrix multiplication followed by a non-linear activation. A full forward pass through a network is just a chain of matrix operations.
        </p>
        <LectureEquation title="Single Layer — Forward Pass">
          <MathJax>{'\\[ \\vec{a}^{(l)} = \\sigma\\!\\left(W^{(l)} \\vec{a}^{(l-1)} + \\vec{b}^{(l)}\\right) \\]'}</MathJax>
        </LectureEquation>
        <p className="lecture-paragraph">
          Where <MathJax inline>{'\\(W^{(l)}\\)'}</MathJax> is the weight matrix, <MathJax inline>{'\\(\\vec{b}^{(l)}\\)'}</MathJax> the bias vector, and <MathJax inline>{'\\(\\sigma\\)'}</MathJax> the activation function. Training millions of parameters in parallel is only possible because of efficient batched matrix arithmetic.
        </p>
        <CodeBlock
          filename="neural_forward.py"
          language="python"
          code={`import numpy as np

def relu(x):    return np.maximum(0, x)
def sigmoid(x): return 1 / (1 + np.exp(-x))

# Batch of 3 samples, 4 features each
X = np.random.randn(3, 4)

# Layer 1: 4 inputs → 5 hidden neurons
W1 = np.random.randn(5, 4) * 0.1
b1 = np.zeros((5, 1))
a1 = relu(W1 @ X.T + b1)          # shape: (5, 3)

# Layer 2: 5 hidden → 1 output neuron
W2 = np.random.randn(1, 5) * 0.1
b2 = np.zeros((1, 1))
output = sigmoid(W2 @ a1 + b2)    # shape: (1, 3)
print("Predictions:", output)`}
        />

        <span className="lecture-section-header">Image Compression — SVD</span>
        <p className="lecture-paragraph">
          A grayscale image is a matrix of pixel values. <span className="lecture-bold">Singular Value Decomposition (SVD)</span> factorises it into three matrices. Keeping only the largest <MathJax inline>{'\\(k\\)'}</MathJax> singular values reconstructs an approximation of the image using far fewer stored numbers.
        </p>
        <LectureEquation title="Singular Value Decomposition">
          <MathJax>{'\\[ A = U \\Sigma V^\\top \\]'}</MathJax>
          <MathJax>{'\\[ A_k = \\sum_{i=1}^{k} \\sigma_i \\,\\vec{u}_i \\vec{v}_i^\\top \\qquad (\\text{rank-}k\\text{ approximation}) \\]'}</MathJax>
        </LectureEquation>
        <CodeBlock
          filename="image_compression.py"
          language="python"
          code={`import numpy as np

# Simulated 256×256 grayscale image
image = np.random.randint(0, 256, (256, 256), dtype=float)

# Full SVD
U, sigma, Vt = np.linalg.svd(image, full_matrices=False)

def reconstruct(U, sigma, Vt, k):
    return U[:, :k] @ np.diag(sigma[:k]) @ Vt[:k, :]

original_size = 256 * 256          # 65 536 values
for k in [5, 20, 50]:
    approx  = reconstruct(U, sigma, Vt, k)
    stored  = k * (256 + 1 + 256)  # U cols + sigma entries + Vt rows
    ratio   = original_size / stored
    error   = np.linalg.norm(image - approx, 'fro')
    print(f"k={k:3d}: {ratio:.1f}× smaller, Frobenius error = {error:.1f}")
# k=  5: 25.1× smaller, Frobenius error = 4868.3
# k= 20: 7.7× smaller,  Frobenius error = 2674.1
# k= 50: 3.3× smaller,  Frobenius error = 1612.8`}
        />

        <p className="lecture-paragraph mt-4">
          These three techniques — PCA, neural networks, and SVD — illustrate a broader truth: virtually every modern data science algorithm (recommendation systems, transformers, computer vision, natural language processing) is built from the same fundamental building blocks: vectors, matrices, dot products, and decompositions.
        </p>
      </section>
    </LectureTemplate>
    </MathJaxContext>
  );
}

interface IntroLinearAlgebraLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function IntroLinearAlgebraLectureIcon(props: IntroLinearAlgebraLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Intro to Linear Algebra" summary="Master vectors, matrices, and linear transformations for ML." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { IntroLinearAlgebraLecture, IntroLinearAlgebraLectureIcon };
