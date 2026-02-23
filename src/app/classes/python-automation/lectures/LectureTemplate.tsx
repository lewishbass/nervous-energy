// Template for Lecture notes
// Exports four different types of components
//  - list item: inline display in list of lectures
//  - card: detailed display in lectures tab
//  - scrollable view: content arranged in bloc post style
//  - fullscreen slideshow view: content in animated slideshow view

// Idea: This should be an easy way to manage all my lectures
//   Lectures implement this template with children as eahc section of the lecture
//   contains links to relevant exercises, interactive elements, dynamic content

import React, { useEffect } from 'react';
import RandomBackground from '@/components/backgrounds/RandomBackground';


interface LectureTemplateProps {
	style?: React.CSSProperties;
	className?: string;
	children: React.ReactNode;
	image?: string | string[];
	displayMode?: 'scrollable' | 'slideshow';
	exitFSCallback?: () => void;
}


const LectureTemplate: React.FC<LectureTemplateProps> = ({
	style,
	className = '',
	children,
	displayMode = 'scrollable',
	exitFSCallback
}) => {

	const [currentSlideIndex, setCurrentSlideIndex] = React.useState<number>(0);

	const nextSlide = () => {
		// Logic to go to the next slide
		// This is a placeholder implementation
		if (currentSlideIndex >= React.Children.count(children) - 1) {
			// If at the end, exit fullscreen mode
			if (exitFSCallback) {
				exitFSCallback();
				setCurrentSlideIndex(0);
			}
			return;
		}
		setCurrentSlideIndex((prevIndex) => (prevIndex + 1));
	}
	const lastSlide = () => {
		if (currentSlideIndex <= 0) {
			return;
		}
		setCurrentSlideIndex((prevIndex) => (prevIndex - 1));
	}


	useEffect(() => {
		if (displayMode === 'scrollable') return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight' || e.key === ' ') {
				nextSlide();
			} else if (e.key === 'ArrowLeft' || e.key === 'Space') {
				lastSlide();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [displayMode, currentSlideIndex, exitFSCallback]);


	if (displayMode === 'scrollable') {
		// Render as a scrollable view
		return (
			<div className={`${className} scrollview`} style={style}>
				{React.Children.map(children, (child, index) => (
					<React.Fragment key={index}>
						{child}
						{index > 0 && index < React.Children.count(children) - 1 && <div className="w-full min-h-[6px] opacity-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500/0 rounded-full mb-6" />}
					</React.Fragment>
				))}
			</div>
		);
	} else if (true || displayMode === 'slideshow') {
		// Render as a fullscreen slideshow view
		return (
			<div className={`${className} select-none fixed max-w-[100vw] max-h-[100vh] min-w-[100vw] min-h-[100vh] inset-0 z-[70] slideshow bg1`} style={style} onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
				<RandomBackground seed={currentSlideIndex} density={1} />
				{React.Children.toArray(children)[currentSlideIndex]}
			</div>
		);
	}
}

interface LectureIconProps {
	title: string;
	summary: string;
	style?: React.CSSProperties;
	className?: string;
	image?: string | string[];
	displayMode?: 'list' | 'card' | 'table';
	onClick?: () => void;
}
const LectureIcon: React.FC<LectureIconProps> = ({
	title,
	summary,
	style,
	className = '',
	image,
	displayMode = 'card',
	onClick
}) => {
	if (displayMode === 'list') {
		// Render as a simple list item
		return (
			<div onClick={onClick} className={`lecture-list-item ${className} bg-gray-300/10 hover:bg-gray-300/25 dark:hover:bg-gray-300/15 flex items-center p-5 cursor-pointer transition-colors duration-300`} style={style}>
				<div className="flex-1 min-w-0">
					<h3 className="text-base font-semibold tc2 mb-0.5 truncate">{title}</h3>
					<p className="tc3 text-xs line-clamp-1">{summary}</p>
				</div>
			</div>
		);
	} else if (displayMode === 'card') {
		// Render as a detailed card
		return (
			<div onClick={onClick} className={`lecture-card p-5 rounded-xl bg-gray-300/15 hover:bg-gray-300/25 dark:hover:bg-gray-300/20 hover:shadow-md dark:shadow-white/15 transition-all duration-200 cursor-pointer ${className}`} style={style}>
				<h2 className="text-xl font-semibold tc2 mb-2">{title}</h2>
				<p className="tc3 text-sm mb-4">{summary}</p>
			</div>
		);
	} else if (displayMode === 'table') {
		// minimal text entry for use in tables
		return (
			<span onClick={onClick} className={`${className}`} style={style} title={summary}>{title}</span>
		);
	}
}

export { LectureIcon, LectureTemplate };