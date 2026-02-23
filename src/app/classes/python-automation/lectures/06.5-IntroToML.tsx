import React from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';

interface IntroToMLLectureProps {
	displayMode?: 'scrollable' | 'slideshow';
	className?: string;
	style?: React.CSSProperties;
	exitFSCallback?: () => void;
}

function IntroToMLLecture(props: IntroToMLLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	return (
		<LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
			<section className="lecture-section mini-scroll">
				<h2 className={`tc1 lecture-big-title`}>Introduction to Machine Learning</h2>
				<h3 className="tc2 lecture-section-header">A high and low level look at ML fundamentals</h3>
			</section>

			<section className="lecture-section mini-scroll" id="sections-overview">
				<h3 className="lecture-section-header">What You'll Learn</h3>
				<div className="lecture-header-decorator" />
				<ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
					<li className="lecture-link" onClick={() => scrollToSection('linear-regression')}>Linear Regression</li>
					<li className="lecture-link" onClick={() => scrollToSection('next-token-prediction')}>Next Token Prediction</li>
					<li className="lecture-link" onClick={() => scrollToSection('matrix-operations')}>Matrix Operations</li>
					<li className="lecture-link" onClick={() => scrollToSection('least-squares')}>Least Squares</li>
					<li className="lecture-link" onClick={() => scrollToSection('derivatives')}>Derivatives</li>
					<li className="lecture-link" onClick={() => scrollToSection('gradients')}>Gradients</li>
					<li className="lecture-link" onClick={() => scrollToSection('attention-mechanism')}>Attention Mechanism</li>
					<li className="lecture-link" onClick={() => scrollToSection('llms')}>LLMs</li>
				</ul>
			</section>

			<section className="lecture-section mini-scroll" id="linear-regression">
				<h3 className="lecture-section-header">Linear Regression</h3>
				<div className="lecture-header-decorator" />
				<p className="lecture-paragraph">
					The simplest for of machine learning is fitting a line to a set of data points.
					The only difference between this and modern Language and Image generation is the number of dimensions, and the the shape of the line.
				</p>
				<p className="lecture-paragraph">
					Linear regression is 
				</p>
			</section>

			<section className="lecture-section mini-scroll" id="next-token-prediction">
				<h3 className="lecture-section-header">Next Token Prediction</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="matrix-operations">
				<h3 className="lecture-section-header">Matrix Operations</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="least-squares">
				<h3 className="lecture-section-header">Least Squares</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="derivatives">
				<h3 className="lecture-section-header">Derivatives</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="gradients">
				<h3 className="lecture-section-header">Gradients</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="attention-mechanism">
				<h3 className="lecture-section-header">Attention Mechanism</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>

			<section className="lecture-section mini-scroll" id="llms">
				<h3 className="lecture-section-header">LLMs</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
			</section>
		</LectureTemplate>
	);
}

interface IntroToMLLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function IntroToMLLectureIcon(props: IntroToMLLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
	return (
		<LectureIcon title="Intro To ML" summary="A brief look at Machine Learning from high and low levels." displayMode={displayMode} className={className} style={style} onClick={onClick} />
	);
}

export { IntroToMLLecture, IntroToMLLectureIcon };
