'use client';
import React, { useState, useEffect } from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import { LectureEquation } from './lecture-components/LectureEquation';
import { LecturePlot } from './lecture-components/LecturePlot';
import { LimitExample } from './lecture-components/LimitExample';
import { SecantExample } from './lecture-components/SecantExample';
import { TangentExample } from './lecture-components/TangentExample';
import { DerivationSteps } from './lecture-components/DerivationSteps';
import { GradientDescent1D } from './lecture-components/GradientDescent1D';
import { GradientField2D } from './lecture-components/GradientField2D';
import { GradientDescent2D } from './lecture-components/GradientDescent2D';
import { LossLandscape } from './lecture-components/LossLandscape';
import { SimulatedAnnealing } from './lecture-components/SimulatedAnnealing';
import { FaArrowRight } from 'react-icons/fa6';

interface IntroGradientDescentLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function IntroGradientDescentLecture(props: IntroGradientDescentLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  // 5/15/2026 8 pm EST (UTC-5) = 2026-05-16T01:00:00Z
  const UNLOCK_TIME = new Date('2026-05-16T01:00:00Z');
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);

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
        <h2 className="tc1 lecture-big-title">Intro to Gradient Descent</h2>
        <h3 className="tc2 lecture-section-header">Derivatives, Gradients, and Optimization</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('intro-to-limits')}>Intro to Limits</li>
          <li className="lecture-link" onClick={() => scrollToSection('slope-between-points')}>Slope Between Points</li>
          <li className="lecture-link flex items-center" onClick={() => scrollToSection('slope-as-dx-to-0')}>
            Slope as dx <FaArrowRight className='mx-1' /> 0
          </li>
          <li className="lecture-link" onClick={() => scrollToSection('derivatives-and-properties')}>Derivatives and Properties</li>
          <li className="lecture-link" onClick={() => scrollToSection('1d-gradient-descent')}>1D Gradient Descent</li>
          <li className="lecture-link" onClick={() => scrollToSection('2d-gradient-fields')}>2D Gradient Fields</li>
          <li className="lecture-link" onClick={() => scrollToSection('2d-gradient-descent')}>2D Gradient Descent</li>
          <li className="lecture-link" onClick={() => scrollToSection('gradient-of-loss')}>Gradient of the Loss Function</li>
          <li className="lecture-link" onClick={() => scrollToSection('local-minimums')}>Local Minimums and Simulated Annealing</li>
          <li className="lecture-link" onClick={() => scrollToSection('normalization')}>Normalization</li>
          <li className="lecture-link" onClick={() => scrollToSection('gradients-pytorch')}>Gradients with PyTorch</li>
        </ul>
      </section>


      {/* Instructions
      add styling and structure to the following lecture
      do not add any new content beyond what is included
      add tables, lists, and formatting as specified
      styles are in lecture.css, in scroll mode it is rendered normally, but in slideshow mode, each individual section is rendered in full screen, so all content should change to be scaled by vw
      \b to bold following word

      add mathjax to all equations using the LectureEquation component e.g.
      <LectureEquation title="Preservation of Addition">
        <MathJax inline>{'\\( f(x + y) = f(x) + f(y) \\)'}</MathJax>
        <span> text in equation block</span>
      </LectureEquation>

      use lecture-components/LecturePlot.tsx to add plots when specified
      */}

      {/* Intro to Limits */}
      <section className="lecture-section mini-scroll" id="intro-to-limits">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Intro to Limits</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          For a well-behaved function it is straightforward to evaluate it at any point.
          For example, <MathJax inline>{'\\(f(x) = x^2\\)'}</MathJax> is defined everywhere:
          plugging in <MathJax inline>{'\\(x = 2\\)'}</MathJax> gives
          <MathJax inline>{'\\(f(2) = 2^2 = 4\\)'}</MathJax>.
        </p>

        <LecturePlot
          lines={[{ label: 'f(x) = x²', fn: (x) => x * x, color: '#6366f1' }]}
          xDomain={[-3, 3]}
          yDomain={[-1, 9]}
          points={[{ x: 2, y: 4, label: '(2, 4)', color: '#10b981' }]}
          xLabel="x" yLabel="f(x)"
          caption="f(x) = x² is defined for all x. The green dot marks the evaluation point (2, 4)."
          height={280}
          displayMode={displayMode}
        />

        <p className="lecture-paragraph">
          But some functions have <span className="lecture-bold">holes</span> — points where they are technically undefined.
          Consider:
        </p>

        <LectureEquation>
          <MathJax>{'\\[ f(x) = \\frac{x^2 - 4}{x - 2} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          At <MathJax inline>{'\\(x = 2\\)'}</MathJax> the denominator is zero, so
          <MathJax inline>{'\\(f(2)\\)'}</MathJax> is undefined.
          Yet everywhere else we can factor and simplify:
        </p>

        <LectureEquation title="Simplification">
          <MathJax>{'\\[ \\frac{x^2 - 4}{x - 2} = \\frac{(x-2)(x+2)}{x-2} = x + 2 \\quad (x \\neq 2) \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          As <MathJax inline>{'\\(x\\)'}</MathJax> gets arbitrarily close to 2 from either side,
          the output gets arbitrarily close to 4. This is exactly what a <span className="lecture-bold">limit</span> captures.
        </p>

        <LecturePlot
          lines={[{
            label: 'f(x) = (x²−4)/(x−2)',
            fn: (x) => Math.abs(x - 2) < 1e-9 ? NaN : (x * x - 4) / (x - 2),
            color: '#6366f1',
          }]}
          xDomain={[-1, 5]}
          yDomain={[0, 7]}
          points={[{ x: 2, y: 4, label: 'hole at (2, 4)', color: '#f59e0b', hole: true }]}
          xLabel="x" yLabel="f(x)"
          caption="The function equals x + 2 for all x ≠ 2. The amber dot marks the hole — f(2) is undefined — but the curve approaches 4 from both sides."
          height={280}
          displayMode={displayMode}
        />

        <p className="lecture-paragraph">
          Even though <MathJax inline>{'\\(f(2)\\)'}</MathJax> is undefined, we write:
        </p>

        <LectureEquation title="Limit notation">
          <MathJax>{'\\[ \\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = 4 \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          The <span className="lecture-bold">formal (ε–δ) definition</span> makes this precise:
        </p>

        <LectureEquation title="ε–δ definition of a limit">
          <MathJax>{'\\[ \\lim_{x \\to a} f(x) = L \\iff \\forall\\, \\varepsilon > 0,\\; \\exists\\, \\delta > 0 \\text{ such that } 0 < |x - a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          In plain English: no matter how thin an <span className="text-amber-400 font-semibold">ε-band</span> you draw
          around <MathJax inline>{'\\(L\\)'}</MathJax>, you can always find a
          <span className="text-indigo-400 font-semibold"> δ-window</span> around
          <MathJax inline>{'\\(a\\)'}</MathJax> such that every point of the function inside
          that window lands inside the band.
        </p>

        <p className="lecture-paragraph">
          The interactive plot below demonstrates this for
          <MathJax inline>{'\\(\\displaystyle\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1\\)'}</MathJax>.
          Drag the <span className="text-amber-400 font-semibold">ε slider</span> to shrink the band;
          the smallest valid <span className="text-indigo-400 font-semibold">δ</span> updates automatically.
          Scroll to zoom in and watch both bands tighten around the limit point.
        </p>

        <LimitExample
          fn={(x) => Math.abs(x) < 1e-10 ? NaN : Math.sin(x) / x}
          limitPoint={0}
          limitValue={1}
          fnLabel="sin(x) / x"
        />

      </section>

      {/* Slope Between Points */}
      <section className="lecture-section mini-scroll" id="slope-between-points">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Slope Between Points</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Consider the total population of squirrels in a forest over 100 days. The population passes through three distinct phases:
        </p>

        <ul className="lecture-list">
          <li className="lecture-list-item">
            <span className="lecture-bold">Phase 1 — Exponential growth:</span> The population starts small, but grows rapidly as squirrels reproduce. If each squirrel has two offspring per year the population doubles annually, producing a steep upward curve.
          </li>
          <li className="lecture-list-item">
            <span className="lecture-bold">Phase 2 — Linear growth:</span> As the forest fills up, squirrels begin to compete for food and nesting sites. The growth rate slows and the curve straightens into a roughly linear rise.
          </li>
          <li className="lecture-list-item">
            <span className="lecture-bold">Phase 3 — Steady state:</span> Eventually resources are consumed as fast as they are produced. New births barely outpace deaths and the population levels off near its maximum — the <span className="lecture-bold">carrying capacity</span>.
          </li>
        </ul>

        <LecturePlot
          lines={[{
            label: 'Squirrel population',
            fn: (t) => 1000 / (1 + Math.exp(-0.12 * (t - 50))),
            color: '#6366f1',
          }]}
          xDomain={[0, 100]}
          yDomain={[0, 1100]}
          xLabel="Day"
          yLabel="Population"
          caption="Squirrel population modelled by a logistic (sigmoid) curve: f(t) = 1000 / (1 + e^(−0.12(t−50))). f(0) ≈ 2, f(100) ≈ 997."
          height={280}
          displayMode={displayMode}
        />

        <p className="lecture-paragraph">
          If we want to know <span className="lecture-bold">how much</span> the population changed between two days
          <MathJax inline>{'\\(t_0\\)'}</MathJax> and <MathJax inline>{'\\(t_1\\)'}</MathJax>, we simply subtract:
        </p>

        <LectureEquation title="Change in population">
          <MathJax>{'\\[ \\Delta\\text{pop} = f(t_1) - f(t_0) \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          But that alone does not tell us <span className="lecture-bold">how fast</span> the population is growing — a change of 200 squirrels over 2 days is very different from the same change over 50 days.
          The <span className="lecture-bold">rate of change</span> between two points divides the change in population by the elapsed time:
        </p>

        <LectureEquation title="Average rate of change (slope of secant line)">
          <MathJax>{'\\[ \\text{rate} = \\frac{\\Delta\\text{pop}}{\\Delta t} = \\frac{f(t_1) - f(t_0)}{t_1 - t_0} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          Geometrically, this is the <span className="lecture-bold">slope of the secant line</span> — the straight line drawn through the two points on the curve.
          It tells us the average number of squirrels added per day between <MathJax inline>{'\\(t_0\\)'}</MathJax> and <MathJax inline>{'\\(t_1\\)'}</MathJax>.
        </p>

        <p className="lecture-paragraph">
          Drag the two dots below to explore how the secant slope changes across different parts of the curve.
          Notice how steep the secant is during Phase 1, how it flattens through Phase 2, and how it approaches zero in Phase 3.
        </p>

        <SecantExample displayMode={displayMode} />

      </section>

      {/* Slope as dx → 0 */}
      <section className="lecture-section mini-scroll" id="slope-as-dx-to-0">
        <h3 className="lecture-section-header flex items-center" onClick={() => scrollToSection('sections-overview')}>
          Slope as dx <FaArrowRight className='mx-2' /> 0
        </h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          When calculating the rate of change between two points, as the points get closer and closer together, the secant line approaches a new line called the <span className="lecture-bold">tangent line</span>.
          The slope of this tangent line at a single point captures the <span className="lecture-bold">instantaneous rate of change</span> of the function at that point.
        </p>

        <p className="lecture-paragraph">
          Mathematically, this is the <span className="lecture-bold">limit</span> of the secant slope as the two points merge:
        </p>

        <LectureEquation title="Definition of the Derivative">
          <MathJax>{'\\[ f\'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          Drag the slider below toward <MathJax inline>{'\\(\\Delta x = 0\\)'}</MathJax> and watch the dashed amber secant collapse onto the green tangent line.
          The readout shows how the secant slope converges to the true derivative <MathJax inline>{'\\(f\'(x_0)\\)'}</MathJax>.
        </p>

        <TangentExample displayMode={displayMode} />

        <p className="lecture-paragraph">
          This limit exists for most smooth functions and is called the <span className="lecture-bold">derivative</span>.
          Three common notations all mean the same thing:
        </p>

        <table className="lecture-table">
          <thead>
            <tr>
              <th>Notation</th>
              <th>Read as</th>
              <th>Origin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><MathJax inline>{'\\(f\'(x)\\)'}</MathJax></td>
              <td>"f prime of x"</td>
              <td>Lagrange, early 1700s — used while working on celestial mechanics</td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(\\dfrac{df}{dx}\\)'}</MathJax></td>
              <td>"d f d x"</td>
              <td>Leibniz, late 1600s — inspired by an infinitesimally small Δx divided by Δy; common in physics and engineering</td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(\\dot{y}\\)'}</MathJax></td>
              <td>"y dot"</td>
              <td>Newton, late 1600s — a dot above the variable denoting the derivative with respect to time; used in mechanics and differential equations</td>
            </tr>
          </tbody>
        </table>

        <p className="lecture-paragraph">
          The <span className="lecture-bold">sign</span> of the derivative tells us the direction of change at that point:
        </p>

        <div className={`flex gap-4 my-4 justify-center ${displayMode === 'slideshow' ? 'flex-col items-center' : 'flex-wrap'}`}>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[220px] max-w-s'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = x²', fn: (x) => x * x, color: '#6366f1' },
                { label: "f'(1) = 2  (tangent)", fn: (x) => 2 * x - 1, color: '#10b981', dash: '6 4', strokeWidth: 1.8 },
              ]}
              xDomain={[-0.5, 2.5]}
              yDomain={[-1, 4]}
              points={[{ x: 1, y: 1, color: '#f59e0b' }]}
              xLabel="x" yLabel="f(x)"
              caption="Positive derivative at x = 1: function is increasing."
              height={220}
              displayMode={displayMode}
            />
          </div>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[220px] max-w-s'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = x²', fn: (x) => x * x, color: '#6366f1' },
                { label: "f'(−1) = −2 (tangent)", fn: (x) => -2 * x - 1, color: '#ef4444', dash: '6 4', strokeWidth: 1.8 },
              ]}
              xDomain={[-2.5, 0.5]}
              yDomain={[-1, 4]}
              points={[{ x: -1, y: 1, color: '#f59e0b' }]}
              xLabel="x" yLabel="f(x)"
              caption="Negative derivative at x = −1: function is decreasing."
              height={220}
              displayMode={displayMode}
            />
          </div>
        </div>

        <p className="lecture-paragraph">
          When the derivative is <span className="lecture-bold">zero</span>, the tangent is horizontal. This can signal a local maximum, a local minimum, or a <span className="lecture-bold">saddle point</span>, depending on the surrounding behavior.
        </p>

        <div className={`flex gap-4 my-4 justify-center ${displayMode === 'slideshow' ? 'flex-col items-center' : 'flex-wrap'}`}>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[200px] max-w-s'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = −x²', fn: (x) => -x * x, color: '#6366f1' },
                { label: "f'(0) = 0 (tangent)", fn: (_x) => 0, color: '#10b981', dash: '6 4', strokeWidth: 1.8 },
              ]}
              xDomain={[-2, 2]}
              yDomain={[-3, 1.5]}
              points={[{ x: 0, y: 0, color: '#f59e0b' }]}
              xLabel="x" yLabel="f(x)"
              caption="Local maximum — f′= 0 and curve opens down."
              height={200}
              displayMode={displayMode}
            />
          </div>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[200px] max-w-s'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = x²', fn: (x) => x * x, color: '#6366f1' },
                { label: "f'(0) = 0 (tangent)", fn: (_x) => 0, color: '#10b981', dash: '6 4', strokeWidth: 1.8 },
              ]}
              xDomain={[-2, 2]}
              yDomain={[-0.5, 3]}
              points={[{ x: 0, y: 0, color: '#f59e0b' }]}
              xLabel="x" yLabel="f(x)"
              caption="Local minimum — f′= 0 and curve opens up."
              height={200}
              displayMode={displayMode}
            />
          </div>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[200px] max-w-s'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = x³', fn: (x) => x * x * x, color: '#6366f1' },
                { label: "f'(0) = 0 (tangent)", fn: (_x) => 0, color: '#10b981', dash: '6 4', strokeWidth: 1.8 },
              ]}
              xDomain={[-2, 2]}
              yDomain={[-3, 3]}
              points={[{ x: 0, y: 0, color: '#f59e0b' }]}
              xLabel="x" yLabel="f(x)"
              caption="Saddle point — f′= 0 but neither a max nor a min."
              height={200}
              displayMode={displayMode}
            />
          </div>
        </div>

      </section>

      {/* Derivatives and Properties */}
      <section className="lecture-section mini-scroll" id="derivatives-and-properties">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Derivatives and Properties</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Calculating derivatives for simple functions can be done using the limit definition, but for more complicated functions this quickly becomes unwieldy.
          Below are three foundational derivations — expand each one to see the steps.
        </p>

        {/* ── Derivation cards ── */}
        <DerivationSteps
          displayMode={displayMode}
          examples={[
            {
              title: 'Constant  f(x) = c',
              prompt: <span className="tc2">Find <MathJax inline>{'\\(\\frac{d}{dx}[c]\\)'}</MathJax></span>,
              color: 'indigo',
              steps: [
                {
                  label: 'Step 1 — apply the limit definition',
                  content: <MathJax>{'\\[ \\frac{d}{dx}[c] = \\lim_{\\Delta x \\to 0} \\frac{c - c}{\\Delta x} \\]'}</MathJax>,
                },
                {
                  label: 'Step 2 — simplify',
                  content: <MathJax>{'\\[ = \\lim_{\\Delta x \\to 0} \\frac{0}{\\Delta x} = \\lim_{\\Delta x \\to 0} 0 \\]'}</MathJax>,
                },
                {
                  label: 'Result',
                  content: <><MathJax>{'\\[ \\frac{d}{dx}[c] = 0 \\]'}</MathJax><p className="opacity-60 text-xs mt-1">A horizontal line has zero slope everywhere.</p></>,
                },
              ],
            },
            {
              title: 'Linear  f(x) = ax',
              prompt: <span className="tc2">Find <MathJax inline>{'\\(\\frac{d}{dx}[ax]\\)'}</MathJax></span>,
              color: 'violet',
              steps: [
                {
                  label: 'Step 1 — apply the limit definition',
                  content: <MathJax>{'\\[ \\frac{d}{dx}[ax] = \\lim_{\\Delta x \\to 0} \\frac{a(x + \\Delta x) - ax}{\\Delta x} \\]'}</MathJax>,
                },
                {
                  label: 'Step 2 — expand and cancel',
                  content: <MathJax>{'\\[ = \\lim_{\\Delta x \\to 0} \\frac{ax + a\\,\\Delta x - ax}{\\Delta x} = \\lim_{\\Delta x \\to 0} \\frac{a\\,\\Delta x}{\\Delta x} \\]'}</MathJax>,
                },
                {
                  label: 'Result',
                  content: <><MathJax>{'\\[ \\frac{d}{dx}[ax] = a \\]'}</MathJax><p className="opacity-60 text-xs mt-1">The slope of a straight line is its coefficient.</p></>,
                },
              ],
            },
            {
              title: 'Quadratic  f(x) = x²',
              prompt: <span className="tc2">Find <MathJax inline>{'\\(\\frac{d}{dx}[x^2]\\)'}</MathJax></span>,
              color: 'emerald',
              steps: [
                {
                  label: 'Step 1 — apply the limit definition',
                  content: <MathJax>{'\\[ \\frac{d}{dx}[x^2] = \\lim_{\\Delta x \\to 0} \\frac{(x + \\Delta x)^2 - x^2}{\\Delta x} \\]'}</MathJax>,
                },
                {
                  label: 'Step 2 — expand the numerator',
                  content: <MathJax>{'\\[ = \\lim_{\\Delta x \\to 0} \\frac{x^2 + 2x\\,\\Delta x + (\\Delta x)^2 - x^2}{\\Delta x} \\]'}</MathJax>,
                },
                {
                  label: 'Step 3 — cancel and take the limit',
                  content: <MathJax>{'\\[ = \\lim_{\\Delta x \\to 0} \\frac{2x\\,\\Delta x + (\\Delta x)^2}{\\Delta x} = \\lim_{\\Delta x \\to 0} (2x + \\Delta x) \\]'}</MathJax>,
                },
                {
                  label: 'Result',
                  content: <MathJax>{'\\[ \\frac{d}{dx}[x^2] = 2x \\]'}</MathJax>,
                },
              ],
            },
          ]}
        />

        {/* ── Common derivative rules table ── */}
        <p className="lecture-paragraph">
          These derivations generalise into a set of rules you can apply directly, without going back to the limit every time:
        </p>

        <table className="lecture-table">
          <thead>
            <tr>
              <th>Function <MathJax inline>{'\\(f(x)\\)'}</MathJax></th>
              <th>Derivative <MathJax inline>{'\\(f\'(x)\\)'}</MathJax></th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><MathJax inline>{'\\(ax\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(a\\)'}</MathJax></td>
              <td>Slope of a line is its coefficient</td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(x^a\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(ax^{a-1}\\)'}</MathJax></td>
              <td>Power rule — bring the exponent down, reduce it by 1</td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(n^x\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(n^x \\ln n\\)'}</MathJax></td>
              <td>Exponential — special case <MathJax inline>{'\\(e^x\\)'}</MathJax> gives <MathJax inline>{'\\(e^x\\)'}</MathJax></td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(\\ln x\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(\\dfrac{1}{x}\\)'}</MathJax></td>
              <td>Natural log; <MathJax inline>{'\\(x > 0\\)'}</MathJax></td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(\\sin x\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(\\cos x\\)'}</MathJax></td>
              <td>Trig functions cycle through four derivatives</td>
            </tr>
            <tr>
              <td><MathJax inline>{'\\(\\cos x\\)'}</MathJax></td>
              <td><MathJax inline>{'\\(-\\sin x\\)'}</MathJax></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* plots of each function vs its derivative */}
        <div className={`flex gap-4 my-4 justify-center ${displayMode === 'slideshow' ? 'flex-col items-center' : 'flex-wrap'}`}>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[220px] max-w-xs'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = x²', fn: (x) => x * x, color: '#6366f1' },
                { label: "f'(x) = 2x", fn: (x) => 2 * x, color: '#10b981', dash: '6 4' },
              ]}
              xDomain={[-3, 3]} yDomain={[-1, 9]}
              xLabel="x" yLabel="y"
              caption="Power rule: d/dx[x²] = 2x"
              height={220} displayMode={displayMode}
            />
          </div>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[220px] max-w-xs'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = eˣ', fn: (x) => Math.exp(x), color: '#f59e0b' },
                { label: "f'(x) = eˣ", fn: (x) => Math.exp(x), color: '#ef4444', dash: '6 4' },
              ]}
              xDomain={[-3, 3]} yDomain={[-0.5, 8]}
              xLabel="x" yLabel="y"
              caption="eˣ is its own derivative."
              height={220} displayMode={displayMode}
            />
          </div>
          <div className={displayMode === 'slideshow' ? 'w-full max-w-xl' : 'flex-1 min-w-[220px] max-w-xs'}>
            <LecturePlot
              lines={[
                { label: 'f(x) = sin(x)', fn: (x) => Math.sin(x), color: '#6366f1' },
                { label: "f'(x) = cos(x)", fn: (x) => Math.cos(x), color: '#10b981', dash: '6 4' },
              ]}
              xDomain={[-7, 7]} yDomain={[-1.5, 1.5]}
              xLabel="x" yLabel="y"
              caption="d/dx[sin x] = cos x — the derivative leads the function by 90°."
              height={220} displayMode={displayMode}
            />
          </div>
        </div>

        {/* ── Combination rules ── */}
        <p className="lecture-paragraph">
          These rules can be combined using three key composition rules to differentiate
          arbitrarily complex expressions:
        </p>

        <LectureEquation title="Chain Rule">
          <MathJax>{"\\[ \\frac{d}{dx}[f(g(x))] = f'(g(x))\\cdot g'(x) \\]"}</MathJax>
          <span className="lecture-equation-note">Differentiate the outer function, leave the inner alone, then multiply by the derivative of the inner.</span>
        </LectureEquation>

        <LectureEquation title="Product Rule">
          <MathJax>{"\\[ \\frac{d}{dx}[f(x)\\,g(x)] = f'(x)\\,g(x) + f(x)\\,g'(x) \\]"}</MathJax>
          <span className="lecture-equation-note">Derivative of first times second, plus first times derivative of second.</span>
        </LectureEquation>

        <LectureEquation title="Quotient Rule">
          <MathJax>{"\\[ \\frac{d}{dx}\\!\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)\\,g(x) - f(x)\\,g'(x)}{[g(x)]^2} \\]"}</MathJax>
          <span className="lecture-equation-note">Low d-high minus high d-low, over the square of what's below.</span>
        </LectureEquation>

        {/* ── Worked example: x · sin(x²) ── */}
        <p className="lecture-paragraph mt-4">
          Complex derivatives can be broken down and solved piece by piece.
          Let's find <MathJax inline>{'\\(\\dfrac{d}{dx}\\bigl[x\\sin(x^2)\\bigr]\\)'}</MathJax>:
        </p>

        <DerivationSteps
          displayMode={displayMode}
          examples={[
            {
              title: 'd/dx[x·sin(x²)]',
              prompt: <span className="tc2">Recognize the outer structure is a <span className="lecture-bold">product</span>: <MathJax inline>{'\\(u \\cdot v\\)'}</MathJax></span>,
              color: 'violet',
              steps: [
                {
                  label: 'Step 1 — Identify structure',
                  content: <><MathJax>{'\\[ u = x, \\quad v = \\sin(x^2) \\]'}</MathJax><p className="opacity-60 text-xs mt-1">We'll need the product rule.</p></>,
                },
                {
                  label: 'Step 2 — Differentiate each part',
                  content: <div className="space-y-1">
                    <MathJax>{'\\[ u\' = 1 \\]'}</MathJax>
                    <p className="text-xs opacity-60 uppercase tracking-wider font-semibold">For v, apply the chain rule to sin(x²)</p>
                    <MathJax>{'\\[ \\frac{d}{dx}[\\sin(x^2)] = \\cos(x^2) \\cdot 2x \\]'}</MathJax>
                    <MathJax>{'\\[ v\' = 2x\\cos(x^2) \\]'}</MathJax>
                  </div>,
                },
                {
                  label: 'Step 3 — Apply product rule',
                  content: <><MathJax>{'\\[ 1 \\cdot \\sin(x^2) + x \\cdot 2x\\cos(x^2) \\]'}</MathJax><MathJax>{'\\[ = \\sin(x^2) + 2x^2\\cos(x^2) \\]'}</MathJax></>,
                },
                {
                  label: 'Result',
                  content: <><MathJax>{'\\[ \\frac{d}{dx}\\bigl[x\\sin(x^2)\\bigr] = \\sin(x^2) + 2x^2\\cos(x^2) \\]'}</MathJax><p className="opacity-60 text-xs mt-1">Product rule + chain rule applied together.</p></>,
                },
              ],
            },
          ]}
        />

        {/* visual verification */}
        <LecturePlot
          lines={[
            { label: 'f(x) = x·sin(x²)', fn: (x) => x * Math.sin(x * x), color: '#6366f1' },
            { label: "f'(x) = sin(x²) + 2x²cos(x²)", fn: (x) => Math.sin(x * x) + 2 * x * x * Math.cos(x * x), color: '#10b981', dash: '6 4' },
          ]}
          xDomain={[-3, 3]}
          yDomain={[-4, 4]}
          xLabel="x" yLabel="y"
          caption="Indigo: f(x) = x·sin(x²).  Green dashed: f′(x) = sin(x²) + 2x²cos(x²). Where f is flat the derivative crosses zero, and where f rises steeply the derivative is large and positive."
          height={280}
          displayMode={displayMode}
        />

      </section>

      {/* 1D Gradient Descent */}
      <section className="lecture-section mini-scroll" id="1d-gradient-descent">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>1D Gradient Descent</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          The derivative of a function tells us the direction of the slope at any point.
          If we want to find the <span className="lecture-bold">minimum</span> of a function, we can
          iteratively take small steps in the direction of the <span className="lecture-bold">negative derivative</span> — downhill.
          This is the core idea behind <span className="lecture-bold">gradient descent</span>.
        </p>

        <LectureEquation title="Gradient Descent Update Rule">
          <MathJax>{'\\[ x_{n+1} = x_n - \\eta\\, f\'(x_n) \\]'}</MathJax>
          <span className="lecture-equation-note">
            <MathJax inline>{'\\(\\eta\\)'}</MathJax> (eta) is the <span className="lecture-bold">learning rate</span> — a small positive number that controls the step size.
            Too large and the steps overshoot the minimum; too small and convergence is slow.
          </span>
        </LectureEquation>

        <p className="lecture-paragraph">
          At each step, the algorithm evaluates the derivative at the current position, then moves opposite to it:
        </p>

        <ul className="lecture-list">
          <li className="lecture-list-item">
            <span className="lecture-bold">f′(x) &gt; 0</span> — the function is increasing, so we step left (<MathJax inline>{'\\(x\\)'}</MathJax> decreases).
          </li>
          <li className="lecture-list-item">
            <span className="lecture-bold">f′(x) &lt; 0</span> — the function is decreasing, so we step right (<MathJax inline>{'\\(x\\)'}</MathJax> increases).
          </li>
          <li className="lecture-list-item">
            <span className="lecture-bold">f′(x) = 0</span> — we have reached a <span className="lecture-bold">critical point</span>; the algorithm stops moving.
          </li>
        </ul>

        <p className="lecture-paragraph">
          The interactive plot below uses{' '}
          <MathJax inline>{'\\(f(x) = x^4/4 - x^2\\)'}</MathJax>,
          which has two local minima at <MathJax inline>{'\\(x = \\pm\\sqrt{2}\\)'}</MathJax>.
          The <span className="text-amber-400 font-semibold">amber dot</span> is the current point,
          the <span className="text-amber-400 font-semibold">dashed amber line</span> is the tangent,
          and the <span className="text-emerald-400 font-semibold">green arrow</span> shows the next gradient step.
          Press <span className="lecture-bold">Step</span> to advance one iteration, or <span className="lecture-bold">Run</span> to animate.
          Adjust η to see how the learning rate affects convergence.
        </p>

        <GradientDescent1D displayMode={displayMode} />

        <p className="lecture-paragraph">
          Notice that which minimum the algorithm converges to depends on the starting point —
          starting on the right of <MathJax inline>{'\\(x = 0\\)'}</MathJax> leads to
          <MathJax inline>{'\\(+\\sqrt{2}\\)'}</MathJax>, while starting on the left leads to
          <MathJax inline>{'\\(-\\sqrt{2}\\)'}</MathJax>.
          A very large learning rate can cause the steps to overshoot and oscillate or diverge entirely.
        </p>

      </section>

      {/* 2D Gradient Fields */}
      <section className="lecture-section mini-scroll" id="2d-gradient-fields">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>2D Gradient Fields</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Gradient descent on a single variable is useful, but most real problems involve functions with
          <span className="lecture-bold"> many variables</span>.
          To extend the idea, we need to know how the function changes in each direction independently.
          This is captured by the <span className="lecture-bold">partial derivative</span>.
        </p>

        <p className="lecture-paragraph">
          Consider extending the 1D function{' '}
          <MathJax inline>{'\\(f(x) = x^4/4 - x^2\\)'}</MathJax> to two dimensions:
        </p>

        <LectureEquation>
          <MathJax>{'\\[ f(x, y) = \\frac{x^4}{4} - x^2 + \\frac{y^2}{2} \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          A <span className="lecture-bold">partial derivative</span> measures the rate of change with respect to one variable
          while holding all others constant.  It uses the symbol <MathJax inline>{'\\(\\partial\\)'}</MathJax>
          ("del" or "partial") instead of <MathJax inline>{'\\(d\\)'}</MathJax>:
        </p>

        <div className={`flex gap-4 my-2 justify-center ${displayMode === 'slideshow' ? 'flex-col items-center' : 'flex-wrap'}`}>
          <LectureEquation title="Partial w.r.t. x  (treat y as constant)" className="flex-1">
            <MathJax>{'\\[ \\frac{\\partial f}{\\partial x} = x^3 - 2x \\]'}</MathJax>
            <span className="lecture-equation-note">Differentiate each term in x normally; the <MathJax inline>{'\\(y^2/2\\)'}</MathJax> term vanishes.</span>
          </LectureEquation>
          <LectureEquation title="Partial w.r.t. y  (treat x as constant)" className="flex-1">
            <MathJax>{'\\[ \\frac{\\partial f}{\\partial y} = y \\]'}</MathJax>
            <span className="lecture-equation-note">Only the <MathJax inline>{'\\(y^2/2\\)'}</MathJax> term contributes; the <MathJax inline>{'\\(x\\)'}</MathJax> terms vanish.</span>
          </LectureEquation>
        </div>

        <p className="lecture-paragraph">
          The <span className="lecture-bold">gradient</span> <MathJax inline>{'\\(\\nabla f\\)'}</MathJax> is a vector that stacks all partial derivatives together:
        </p>

        <LectureEquation title="Gradient Vector">
          <MathJax>{'\\[ \\nabla f = \\begin{bmatrix} \\dfrac{\\partial f}{\\partial x} \\\\[6pt] \\dfrac{\\partial f}{\\partial y} \\end{bmatrix} = \\begin{bmatrix} x^3 - 2x \\\\ y \\end{bmatrix} \\]'}</MathJax>
          <span className="lecture-equation-note">
            The gradient always points in the direction of <span className="lecture-bold">steepest ascent</span>.
            Negating it gives the direction of steepest descent.
          </span>
        </LectureEquation>

        <p className="lecture-paragraph">
          The interactive visualization below shows the heatmap of
          <MathJax inline>{'\\(f(x,y) = x^4/4 - x^2 + y^2/2\\)'}</MathJax> (dark = low, bright = high).
          The small <span className="opacity-70">white arrows</span> show the gradient direction at a grid of points,
          and the <span className="text-amber-400 font-semibold">amber arrow</span> shows the gradient at the draggable point.
          The dashed green circles mark the two minima at <MathJax inline>{'\\((\\pm\\sqrt{2},\\, 0)\\)'}</MathJax>.
          Drag the point to explore the gradient field.
        </p>

        <GradientField2D />

        <p className="lecture-paragraph">
          Notice that the gradient is zero exactly at the two minima — the arrows vanish there.
          Near a minimum, all the arrows in the field converge toward it.
          At the saddle point near <MathJax inline>{'\\((0, 0)\\)'}</MathJax>,
          the gradient is zero in the x-direction but not in y — the function is flat along x yet still curved in y.
        </p>

      </section>

      {/* 2D Gradient Descent */}
      <section className="lecture-section mini-scroll" id="2d-gradient-descent">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>2D Gradient Descent</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Gradient descent extends naturally to multiple dimensions.
          Instead of updating a single variable, we update every variable simultaneously by subtracting
          their respective partial derivatives, each scaled by the learning rate:
        </p>

        <LectureEquation title="2D Gradient Descent Update Rule">
          <MathJax>{'\\[ \\begin{bmatrix} x_{n+1} \\\\ y_{n+1} \\end{bmatrix} = \\begin{bmatrix} x_n \\\\ y_n \\end{bmatrix} - \\eta\\, \\nabla f(x_n, y_n) = \\begin{bmatrix} x_n - \\eta\\,\\dfrac{\\partial f}{\\partial x} \\\\ y_n - \\eta\\,\\dfrac{\\partial f}{\\partial y} \\end{bmatrix} \\]'}</MathJax>
          <span className="lecture-equation-note">
            Each component is updated independently using its own partial derivative.
            This generalises to any number of dimensions — including the millions of parameters in a neural network.
          </span>
        </LectureEquation>

        <p className="lecture-paragraph">
          For our function <MathJax inline>{'\\(f(x,y) = x^4/4 - x^2 + y^2/2\\)'}</MathJax>, each step becomes:
        </p>

        <LectureEquation>
          <MathJax>{'\\[ x_{n+1} = x_n - \\eta\\,(x_n^3 - 2x_n) \\qquad y_{n+1} = y_n - \\eta\\, y_n \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          The interactive plot below shows the descent path on the same heatmap.
          Press <span className="lecture-bold">Step</span> to take one gradient step, or <span className="lecture-bold">Run</span> to animate.
          The <span className="text-emerald-400 font-semibold">green trail</span> traces the path taken toward a minimum.
          Try different learning rates — a high η overshoots and oscillates, while a low η descends smoothly but slowly.
          Click the map <em>before</em> stepping to reposition the starting point.
        </p>

        <GradientDescent2D />

        <p className="lecture-paragraph">
          Observe that the path curves toward whichever minimum is nearest to the starting point.
          The saddle at <MathJax inline>{'\\((0,0)\\)'}</MathJax> is unstable — a point placed exactly there will not move,
          but any small perturbation will send it toward one of the two minima.
        </p>

      </section>

      {/* Gradient of the Loss Function */}
      <section className="lecture-section mini-scroll" id="gradient-of-loss">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Gradient of the Loss Function</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          <strong>Gradient descent</strong> is a powerful, general-purpose optimization algorithm used to find the minimum of a function.
          In <strong>machine learning</strong>, our goal is to build a model — a function — that closely matches our data and generalizes well to new examples.
          We achieve this by defining a <strong>loss function</strong> that scores how poorly the model is performing, then <strong>minimizing that loss</strong> using gradient descent.
        </p>

        <p className="lecture-paragraph">
          The most common loss function is <strong>Mean Squared Error (MSE)</strong>:
        </p>

        <LectureEquation title="Mean Squared Error Loss">
          <MathJax>{'\\[ \\mathcal{L}(\\mathbf{w}) = \\frac{1}{N} \\sum_{i=1}^{N} \\bigl(y_i - \\hat{y}_i\\bigr)^2 \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          where <MathJax inline>{'\\(y_i\\)'}</MathJax> are the true labels and{' '}
          <MathJax inline>{'\\(\\hat{y}_i\\)'}</MathJax> are the model&rsquo;s predictions.
          The loss is large when predictions are far from the truth, and zero only when every prediction is perfect.
        </p>

        <p className="lecture-paragraph">
          For a simple linear model <MathJax inline>{'\\(\\hat{y} = m x\\)'}</MathJax> with a single parameter <MathJax inline>{'\\(m\\)'}</MathJax>,
          the loss as a function of <MathJax inline>{'\\(m\\)'}</MathJax> is a <strong>parabola</strong> — convex and guaranteed to have exactly one global minimum.
          The gradient of the loss with respect to <MathJax inline>{'\\(m\\)'}</MathJax> is:
        </p>

        <LectureEquation title="Gradient of MSE w.r.t. slope m">
          <MathJax>{'\\[ \\frac{\\partial \\mathcal{L}}{\\partial m} = \\frac{-2}{N} \\sum_{i=1}^{N} x_i \\bigl(y_i - m x_i\\bigr) \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          The interactive plot below shows both the data and the regression line on the left, and the loss curve <MathJax inline>{'\\(\\mathcal{L}(m)\\)'}</MathJax> on the right.
          The yellow residual lines show the individual errors contributing to the loss.
          Press <strong>Step</strong> or <strong>Run</strong> to watch gradient descent minimize the loss by adjusting the slope.
          Try a high learning rate to see it overshoot.
        </p>

        <LossLandscape />

        <p className="lecture-paragraph">
          Each <strong>trainable parameter</strong> in a model adds another dimension to the loss landscape.
          A neural network may have millions of parameters — each one is an axis over which we minimize the loss,
          and gradient descent updates all of them simultaneously at every training step.
        </p>

      </section>

      {/* Local Minimums and Simulated Annealing */}
      <section className="lecture-section mini-scroll" id="local-minimums">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Local Minimums and Simulated Annealing</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Because gradient descent always follows the slope <em>downward</em>, it can get trapped in a
          {' '}<strong>local minimum</strong> — a point that is lower than all nearby points, but not the global lowest.
          In complex loss landscapes with many valleys, gradient descent may converge to a suboptimal solution
          depending entirely on where it starts.
        </p>

        <LecturePlot
          lines={[
            {
              label: 'f(x) — multi-modal loss',
              fn: (x) => 0.08 * x ** 2 - 1.5 * Math.cos(1.8 * x) - 0.4 * Math.cos(4.5 * x),
              color: '#6366f1',
            },
          ]}
          xDomain={[-6, 6]}
          yDomain={[-2.5, 3]}
          points={[
            { x: 0, y: -1.9, label: 'global min ≈ (0, −1.9)', color: '#10b981' },
            { x: -3.5, y: -0.2, label: 'local min', color: '#f59e0b', hole: true },
            { x:  3.5, y: -0.2, label: 'local min', color: '#f59e0b', hole: true },
          ]}
          xLabel="x" yLabel="f(x)"
          caption="A multi-modal function with several local minima (amber, open) and one global minimum (green). Standard gradient descent may stop at any of them depending on the starting point."
          height={260}
          displayMode={displayMode}
        />

        <p className="lecture-paragraph">
          <strong>Simulated annealing</strong> is a technique inspired by metallurgy — the process of heating metal and
          then slowly cooling it so that atoms settle into a low-energy crystal structure.
          In optimization, a <strong>temperature</strong> parameter controls how much randomness is injected at each step.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            At <strong>high temperature</strong>: large random proposals are made, and even uphill moves are sometimes accepted.
            This allows the optimizer to escape local minima and <em>explore</em> the landscape broadly.
          </li>
          <li className="lecture-exercise-item">
            As temperature <strong>cools</strong>: proposals shrink and uphill moves become increasingly unlikely.
            The optimizer transitions from exploration to <em>exploitation</em> — refining its position near a minimum.
          </li>
          <li className="lecture-exercise-item">
            An uphill move to proposal <MathJax inline>{'\\(x\'\\)'}</MathJax> is accepted with probability{' '}
            <MathJax inline>{'\\(e^{-\\Delta f / T}\\)'}</MathJax>, where{' '}
            <MathJax inline>{'\\(\\Delta f = f(x\')-f(x) > 0\\)'}</MathJax> and <MathJax inline>{'\\(T\\)'}</MathJax> is the current temperature.
          </li>
        </ul>

        <p className="lecture-paragraph">
          Toggle between <strong>Gradient Descent</strong> and <strong>Simulated Annealing</strong> below to compare their behavior
          on the same multi-modal landscape. Blue dots are accepted moves; red dots are rejected proposals.
          Notice how annealing can escape traps that gradient descent cannot.
        </p>

        <SimulatedAnnealing />

        <p className="lecture-paragraph">
          Modern deep learning optimizers like <strong>Adam</strong> and <strong>RMSProp</strong> don&rsquo;t use simulated annealing directly,
          but address the same problem through <strong>momentum</strong> and <strong>adaptive learning rates</strong>.
          Momentum accumulates velocity across steps, helping the optimizer roll through shallow local minima.
          Learning rate schedules — starting large and decaying over time — serve a similar role to the cooling schedule in annealing.
        </p>

      </section>

      {/* Normalization */}
      <section className="lecture-section mini-scroll" id="normalization">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Normalization</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          When features have very different scales — say one column ranges 0–1 and another 0–1,000,000 —
          the loss landscape becomes a long, narrow valley.
          Gradient descent must use a tiny learning rate to avoid overshooting the steep axis,
          which makes convergence along the shallow axis painfully slow.
          <strong>Normalization</strong> rescales features so gradient descent travels more evenly in every direction.
        </p>

        <LecturePlot
          lines={[
            {
              label: 'Unnormalized — steep loss curve',
              fn: (w) => Math.min(200 * (w - 1) ** 2 + 0.5, 12),
              color: '#ef4444',
              dash: '6 3',
            },
            {
              label: 'Normalized — balanced loss curve',
              fn: (w) => 2 * (w - 1) ** 2 + 0.5,
              color: '#10b981',
            },
          ]}
          xDomain={[-2, 4]}
          yDomain={[0, 12]}
          xLabel="weight w" yLabel="Loss"
          caption="Without normalization (red dashed), the loss is extremely steep — a step size that works in one direction explodes in another. After normalization (green), the landscape is balanced and gradient descent converges quickly."
          height={260}
          displayMode={displayMode}
        />

        <p className="lecture-paragraph">
          The two most common feature-scaling methods are:
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            <strong>Min-Max Normalization</strong> — rescales each feature to [0, 1]:
            <LectureEquation>
              <MathJax>{'\\[ x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}} \\]'}</MathJax>
            </LectureEquation>
            Simple and interpretable, but sensitive to outliers — one extreme value compresses everything else into a tiny range.
          </li>
          <li className="lecture-exercise-item">
            <strong>Z-Score Standardization</strong> — rescales each feature to mean 0 and standard deviation 1:
            <LectureEquation>
              <MathJax>{'\\[ x_{\\text{std}} = \\frac{x - \\mu}{\\sigma} \\]'}</MathJax>
            </LectureEquation>
            More robust to outliers. Most values land in [−3, 3] regardless of the original scale.
          </li>
        </ul>

        <p className="lecture-paragraph">
          Deep learning introduces a third technique — <strong>Batch Normalization</strong> — which normalizes
          the activations <em>inside</em> the network, not just the inputs.
          At each layer, activations are re-centered and rescaled across the current mini-batch,
          then passed through learned scale (<MathJax inline>{'\\(\\gamma\\)'}</MathJax>) and shift
          (<MathJax inline>{'\\(\\beta\\)'}</MathJax>) parameters:
        </p>

        <LectureEquation title="Batch Normalization">
          <MathJax>{'\\[ \\hat{x}_i = \\frac{x_i - \\mu_{\\mathcal{B}}}{\\sqrt{\\sigma^2_{\\mathcal{B}} + \\epsilon}}, \\qquad y_i = \\gamma\\,\\hat{x}_i + \\beta \\]'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          Batch normalization dramatically stabilizes and accelerates training by keeping activations
          in a healthy range at every layer, and reduces sensitivity to the choice of initial learning rate.
        </p>

        <p className="lecture-paragraph">
          Beyond scaling inputs or activations, we can also penalize the <em>weights themselves</em> to prevent
          overfitting. These penalties — called <strong>regularization</strong> — add an extra term to the loss
          function that discourages large weights:
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            <strong>L1 Regularization (Lasso)</strong> — adds the sum of <em>absolute</em> weight values to the loss:
            <LectureEquation title="L1 Regularization">
              <MathJax>{'\\[ \\mathcal{L}_{\\text{L1}} = \\mathcal{L} + \\lambda \\sum_i |w_i| \\]'}</MathJax>
            </LectureEquation>
            The gradient of <MathJax inline>{'\\(|w_i|\\)'}</MathJax> is just{' '}
            <MathJax inline>{'\\(\\text{sign}(w_i)\\)'}</MathJax>, so every weight is pulled toward zero by a
            constant amount each step. Weights that aren't useful are driven all the way to <strong>exactly zero</strong>,
            producing <em>sparse</em> solutions — many weights become exactly 0, which can act as automatic feature selection.
          </li>
          <li className="lecture-exercise-item">
            <strong>L2 Regularization (Ridge / Weight Decay)</strong> — adds the sum of <em>squared</em> weight values to the loss:
            <LectureEquation title="L2 Regularization">
              <MathJax>{'\\[ \\mathcal{L}_{\\text{L2}} = \\mathcal{L} + \\lambda \\sum_i w_i^2 \\]'}</MathJax>
            </LectureEquation>
            The gradient is <MathJax inline>{'\\(2\\lambda w_i\\)'}</MathJax>, so large weights are penalized more
            strongly than small ones. This shrinks all weights smoothly toward zero without making any of them
            exactly zero — the result is a dense solution with small, well-distributed weights.
            In PyTorch, L2 regularization is usually applied via the <span className="lecture-code-inline">weight_decay</span> argument
            of the optimizer rather than by modifying the loss directly.
          </li>
        </ul>

        <p className="lecture-paragraph">
          The hyperparameter <MathJax inline>{'\\(\\lambda\\)'}</MathJax> controls the trade-off:
          a larger <MathJax inline>{'\\(\\lambda\\)'}</MathJax> applies heavier regularization and keeps weights
          small (reducing overfitting but risking underfitting), while a smaller{' '}
          <MathJax inline>{'\\(\\lambda\\)'}</MathJax> lets the model fit the data more closely.
        </p>

        <LectureEquation title="Combined Loss (L1 + L2 = Elastic Net)">
          <MathJax>{'\\[ \\mathcal{L}_{\\text{EN}} = \\mathcal{L} + \\lambda_1 \\sum_i |w_i| + \\lambda_2 \\sum_i w_i^2 \\]'}</MathJax>
        </LectureEquation>

      </section>

      {/* Gradients with PyTorch */}
      <section className="lecture-section mini-scroll" id="gradients-pytorch">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Gradients with PyTorch</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          PyTorch's <strong>autograd</strong> engine automatically computes gradients for you.
          Every tensor can track the operations applied to it; calling{' '}
          <span className="lecture-code-inline">.backward()</span> then walks the computation graph
          in reverse and deposits gradients into the <span className="lecture-code-inline">.grad</span> attribute
          of each leaf tensor that has <span className="lecture-code-inline">requires_grad=True</span>.
        </p>

        <span className="lecture-section-header">Example 1 — Computing a Simple Gradient</span>
        <p className="lecture-paragraph">
          Let's compute <MathJax inline>{'\\(\\frac{d}{dx}(x^2)\\)'}</MathJax> at{' '}
          <MathJax inline>{'\\(x = 3\\)'}</MathJax>. The answer is{' '}
          <MathJax inline>{'\\(2x = 6\\)'}</MathJax>.
        </p>
        <CodeBlock
          className="lecture-codeblock"
          filename="ex1_simple_grad.py"
          language="python"
          code={`import torch

x = torch.tensor(3.0, requires_grad=True)  # scalar leaf tensor

y = x ** 2           # builds the computation graph: y = x²

y.backward()         # compute dy/dx

print(x.grad)        # tensor(6.)  ← 2 * 3 = 6`}
        />

        <span className="lecture-section-header">Example 2 — Gradient of a Vector Function</span>
        <p className="lecture-paragraph">
          Autograd also handles vector inputs.
          Here we compute the gradient of{' '}
          <MathJax inline>{'\\(f(\\mathbf{x}) = \\sum x_i^2\\)'}</MathJax>,
          which is <MathJax inline>{'\\(\\nabla f = 2\\mathbf{x}\\)'}</MathJax>.
        </p>
        <CodeBlock
          className="lecture-codeblock"
          filename="ex2_vector_grad.py"
          language="python"
          code={`import torch

x = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)

f = (x ** 2).sum()   # f = x₀² + x₁² + x₂²  (scalar output required for .backward())

f.backward()

print(x.grad)        # tensor([2., 4., 6.])  ← 2*[1, 2, 3]`}
        />

        <span className="lecture-section-header">Example 3 — Gradient Descent by Hand</span>
        <p className="lecture-paragraph">
          We can drive gradient descent manually using the gradient PyTorch computes.
          Below we minimize <MathJax inline>{'\\(f(x) = (x - 5)^2\\)'}</MathJax>,
          which has its minimum at <MathJax inline>{'\\(x = 5\\)'}</MathJax>.
        </p>
        <CodeBlock
          className="lecture-codeblock"
          filename="ex3_manual_gd.py"
          language="python"
          code={`import torch

x = torch.tensor(0.0, requires_grad=True)  # start far from minimum
lr = 0.1  # learning rate

for step in range(20):
    loss = (x - 5) ** 2        # forward pass

    loss.backward()            # compute gradient
    with torch.no_grad():      # update x without tracking the update itself
        x -= lr * x.grad
    x.grad.zero_()             # clear gradient for next step

    if step % 5 == 0:
        print(f"step {step:2d}  x={x.item():.4f}  loss={loss.item():.4f}")

# step  0  x=1.0000  loss=25.0000
# step  5  x=3.6902  loss= 1.8644
# step 10  x=4.6763  loss= 0.1053
# step 15  x=4.9065  loss= 0.0087`}
        />

        <span className="lecture-section-header">Example 4 — Using an Optimizer</span>
        <p className="lecture-paragraph">
          In practice you never update weights manually — PyTorch optimizers handle the{' '}
          <span className="lecture-code-inline">-= lr * grad</span> step (and more sophisticated variants like
          momentum or adaptive learning rates) for you.
        </p>
        <CodeBlock
          className="lecture-codeblock"
          filename="ex4_optimizer.py"
          language="python"
          code={`import torch
import torch.optim as optim

x = torch.tensor(0.0, requires_grad=True)

optimizer = optim.SGD([x], lr=0.1)  # Stochastic Gradient Descent

for step in range(20):
    optimizer.zero_grad()            # clear previous gradients
    loss = (x - 5) ** 2             # forward pass
    loss.backward()                  # compute gradients
    optimizer.step()                 # x -= lr * x.grad

print(f"x = {x.item():.4f}")        # x ≈ 5.0`}
        />

        <span className="lecture-section-header">Example 5 — Training a Linear Model</span>
        <p className="lecture-paragraph">
          Putting it all together: fit a simple linear model{' '}
          <MathJax inline>{'\\(\\hat{y} = wx + b\\)'}</MathJax> to
          noisy data using mean-squared-error loss and the Adam optimizer.
          Adam adapts the learning rate individually for each parameter — it's the most popular
          optimizer for deep learning.
        </p>
        <CodeBlock
          className="lecture-codeblock"
          filename="ex5_linear_model.py"
          language="python"
          code={`import torch
import torch.optim as optim

torch.manual_seed(0)

# --- Data: y = 3x + 2 + noise ---
X = torch.linspace(-1, 1, 100)
y = 3 * X + 2 + 0.3 * torch.randn(100)

# --- Model parameters (learnable) ---
w = torch.tensor(0.0, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)

optimizer = optim.Adam([w, b], lr=0.05)

# --- Training loop ---
for epoch in range(200):
    optimizer.zero_grad()

    y_pred = w * X + b               # forward pass
    loss = ((y_pred - y) ** 2).mean()  # MSE loss

    loss.backward()                  # backward pass
    optimizer.step()                 # update w and b

    if epoch % 50 == 0:
        print(f"epoch {epoch:3d}  loss={loss.item():.4f}  w={w.item():.3f}  b={b.item():.3f}")

# epoch   0  loss=5.3001  w=0.066  b=0.046
# epoch  50  loss=0.1049  w=2.698  b=1.916
# epoch 100  loss=0.0917  w=2.978  b=1.998
# epoch 150  loss=0.0916  w=2.999  b=2.000
# True: w=3.000  b=2.000`}
        />

        <p className="lecture-paragraph">
          The pattern is always the same: <strong>zero gradients → forward pass → compute loss →
          backward pass → optimizer step</strong>. This loop scales from a single linear model all the
          way up to billion-parameter neural networks — only the model definition changes.
        </p>

      </section>

    </LectureTemplate>
    </MathJaxContext>
  );
}

interface IntroGradientDescentLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function IntroGradientDescentLectureIcon(props: IntroGradientDescentLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Intro to Gradient Descent" summary="Learn the fundamental optimization algorithm for machine learning." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { IntroGradientDescentLecture, IntroGradientDescentLectureIcon };
