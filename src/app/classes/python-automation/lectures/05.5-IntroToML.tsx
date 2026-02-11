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
	return (
		<LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
			<section className="mb-4">
				<h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
				<ul className="list-disc list-inside tc2 space-y-1">
					<li>Introduction to lists and arrays</li>
					<li>Python lists implementation details</li>
					<li>Creating and initializing lists</li>
					<li>Accessing and modifying list elements</li>
					<li>Python list methods</li>
					<li>Basic list methods (e.g., append, remove)</li>
					<li>Understanding lists as dynamic arrays</li>
				</ul>
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
