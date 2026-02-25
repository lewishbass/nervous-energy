import React from 'react';
import Image from 'next/image';
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
					<li className="lecture-link" onClick={() => scrollToSection('conditional-models')}>Conditional Models</li>
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
					The simplest form of machine learning is fitting a line to a set of data points.
					The only difference between this and modern <span className="lecture-bold">Language</span> and  <span className="lecture-bold">Image</span> generation is the number of dimensions, and the the shape of the line.

				</p>
				<div className="flex justify-center gap-8 flex-wrap mt-8 items-end w-full mb-8">
					<div className="flex-1 max-w-[500px] min-w-[350px] text-center rounded-2xl bg3 overflow-hidden">
						<a href="https://www.geeksforgeeks.org/machine-learning/ml-linear-regression/" target="_blank" rel="noopener noreferrer">
							<Image src="/images/classes/python-automation/observed_value.webp" alt="Observed Value in Linear Regression" width={600} height={400} className="w-full h-auto" />
						</a>
						<div className="text-[0.9em] text-gray-500 m-2 lecture-caption">
							One-dimensional linear regression Source:{" "}
							<a href="https://www.geeksforgeeks.org/machine-learning/ml-linear-regression/" target="_blank" rel="noopener noreferrer" className="tc1 select-none cursor-pointer font-bold">
								GeeksforGeeks
							</a>
						</div>
					</div>
					<div className="flex-1 max-w-[500px] min-w-[350px] text-center rounded-2xl bg3 overflow-hidden">
						<a href="https://rpubs.com/pjozefek/576206" target="_blank" rel="noopener noreferrer">
							<Image src="/images/classes/python-automation/3d_regression.png" alt="3D Regression visualization" width={600} height={400} className="w-full h-auto" />
						</a>
						<div className="text-[0.9em] text-gray-500 m-2 lecture-caption">
							Multi-dimensional linear regression Source:{" "}
							<a href="https://rpubs.com/pjozefek/576206" target="_blank" rel="noopener noreferrer" className="tc1 select-none cursor-pointer font-bold">
								RPubs
							</a>
						</div>
					</div>
				</div>
				<p className="lecture-paragraph">
					A car crash dataset contains two dimensions <span className="lecture-bold">crash speed</span> and <span className="lecture-bold">pedestrian fatality rate</span>.
					Calculating <span className="lecture-bold">correlation</span> between the two would allow us to predict the chance of a fatality given the speed of the crash, which could be used to set speed limits.
				</p>
				<div className="flex justify-center mt-8 mb-8">
					<div className="max-w-[500px] min-w-[350px] text-center rounded-2xl bg3 overflow-hidden">
						<a href="https://www.researchgate.net/figure/Fatality-risk-as-a-function-of-impact-speed-in-vehicle-to-pedestrian-crashes-Rosen-et_fig3_236211005" target="_blank" rel="noopener noreferrer">
							<Image src="/images/classes/python-automation/impact_rate.png" alt="Fatality risk as a function of impact speed" width={600} height={400} className="w-full h-auto" />
						</a>
						<div className="text-[0.9em] text-gray-500 m-2 lecture-caption">
							Fatality rate vs impact speed Source:{" "}
							<a href="https://www.researchgate.net/figure/Fatality-risk-as-a-function-of-impact-speed-in-vehicle-to-pedestrian-crashes-Rosen-et_fig3_236211005" target="_blank" rel="noopener noreferrer" className="tc1 select-none cursor-pointer font-bold">
								ResearchGate
							</a>
						</div>
					</div>
				</div>

			</section>


			<section className="lecture-section mini-scroll" id="conditional-models">
				<h3 className="lecture-section-header">Conditional Models</h3>
				<div className="lecture-header-decorator" />
				{/* Content to be added */}
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
