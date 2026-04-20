import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface IntroGradientDescentLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function IntroGradientDescentLecture(props: IntroGradientDescentLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>The concept of gradient descent and optimization</li>
          <li>Understanding cost functions and loss minimization</li>
          <li>Implementing gradient descent from scratch</li>
          <li>Variants: Batch, Stochastic, and Mini-batch GD</li>
          <li>Application to linear and logistic regression</li>
          <li>Learning rates and convergence</li>
        </ul>
      </section>
    </LectureTemplate>
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
