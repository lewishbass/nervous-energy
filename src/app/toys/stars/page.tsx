'use client';

import Link from 'next/link';
import SquareAnimation from '@/components/backgrounds/SquareAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import StarsGameComponent from './StarsGameComponent';
import { MathJax } from 'better-react-mathjax';
import '@/styles/toggles.css';
import '@/styles/buttons.css';
import { useState, useRef, useEffect } from 'react';
import { StarsGameRef } from './StarsGameComponent';

export default function StarsPage() {
	const [blockHelp, setBlockHelp] = useState<boolean | null>(null);
	const [starHelp, setStarHelp] = useState<boolean | null>(null);
	const [showHints, setShowHints] = useState<boolean | null>(null);
	const gameRef = useRef<StarsGameRef>(null);

	const demo1Ref = useRef<StarsGameRef>(null);
	const demo2Ref = useRef<StarsGameRef>(null);
	const demo1Container = useRef<HTMLDivElement>(null);
	const demo2Container = useRef<HTMLDivElement>(null);
	const [demo1Playing, setDemo1Playing] = useState(false);
	const [demo2Playing, setDemo2Playing] = useState(false);
	const demo1Timeout = useRef<NodeJS.Timeout | null>(null);
	const demo2Timeout = useRef<NodeJS.Timeout | null>(null);

	const toClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Text copied to clipboard:', text);
		}
		).catch((err) => {
			console.error('Error copying text to clipboard:', err);
		});
	};

	useEffect(() => {
		// Load state from localStorage on component mount
		const storedBlockHelp = localStorage.getItem('blockHelp');
		const storedStarHelp = localStorage.getItem('starHelp');
		const storedShowHints = localStorage.getItem('showHints');

		if (storedBlockHelp !== null && JSON.parse(storedBlockHelp) != null && blockHelp == null) {
			console.log('Loading blockHelp from localStorage:', storedBlockHelp, ' -> ', JSON.parse(storedBlockHelp));
			setBlockHelp(JSON.parse(storedBlockHelp));
		}
		if (storedStarHelp !== null && JSON.parse(storedStarHelp) != null && starHelp == null) {
			console.log('Loading starHelp from localStorage:', storedStarHelp, ' -> ', JSON.parse(storedStarHelp));
			setStarHelp(JSON.parse(storedStarHelp));
		}
		if (storedShowHints !== null && JSON.parse(storedShowHints) != null && showHints == null) {
			console.log('Loading showHints from localStorage:', storedShowHints, ' -> ', JSON.parse(storedShowHints));
			setShowHints(JSON.parse(storedShowHints));
		}

		// Save state to localStorage whenever it changes
		localStorage.setItem('blockHelp', JSON.stringify(blockHelp));
		localStorage.setItem('starHelp', JSON.stringify(starHelp));
		localStorage.setItem('showHints', JSON.stringify(showHints));
		
		
	}, [blockHelp, starHelp, showHints]);

	// Demo animations
	const playDemo1Animation = () => {
		if (!demo1Playing || !demo1Ref.current) return;
		
		demo1Ref.current.resetGame();
		
		demo1Timeout.current = setTimeout(() => {
			if (!demo1Playing) return;
			demo1Ref.current?.toggleCell(0, 1, true);
			demo1Timeout.current = setTimeout(() => {
				if (!demo1Playing) return;

				demo1Ref.current?.toggleCell(0, 0, false);
				demo1Ref.current?.toggleCell(0, 2, false);
				demo1Ref.current?.toggleCell(0, 3, false);
				demo1Ref.current?.toggleCell(1, 1, false);
				demo1Ref.current?.toggleCell(2, 1, false);
				demo1Ref.current?.toggleCell(3, 1, false);
				demo1Ref.current?.toggleCell(1, 0, false);
				demo1Ref.current?.toggleCell(1, 2, false);

				demo1Timeout.current = setTimeout(() => {
					if (!demo1Playing) return;
					demo1Ref.current?.resetGame();
				
					// Restart animation
					demo1Timeout.current = setTimeout(() => {
						playDemo1Animation();
					}, 1500);
				}, 1000);
			}, 250);
		}, 500);
	};

	const playDemo2Animation = () => {
		if (!demo2Playing || !demo2Ref.current) return;
		
		demo2Ref.current.resetGame();
		
		demo2Timeout.current = setTimeout(() => {
			if (!demo2Playing) return;
			demo2Ref.current?.toggleCell(0, 1, false);
			
			demo2Timeout.current = setTimeout(() => {
				if (!demo2Playing) return;
				demo2Ref.current?.toggleCell(1, 1, false);
				
				demo2Timeout.current = setTimeout(() => {
					if (!demo2Playing) return;
					demo2Ref.current?.toggleCell(2, 1, false);
					
					demo2Timeout.current = setTimeout(() => {
						if (!demo2Playing) return;
						demo2Ref.current?.toggleCell(3, 1, true);
						demo2Timeout.current = setTimeout(() => {
							// Restart animation
							demo2Timeout.current = setTimeout(() => {
								demo2Ref.current?.resetGame();
								playDemo2Animation();
							}, 1500);
						}, 1000);
					}, 250);
				}, 1000);
			}, 1000);
		}, 500);
	};

	// Cleanup function for animation timeouts
	const cleanupAnimations = () => {
		if (demo1Timeout.current) {
			clearTimeout(demo1Timeout.current);
			demo1Timeout.current = null;
		}
		if (demo2Timeout.current) {
			clearTimeout(demo2Timeout.current);
			demo2Timeout.current = null;
		}
	};

	// Set up IntersectionObserver to detect when demos are visible
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.target === demo1Container.current) {
					if (entry.isIntersecting && !demo1Playing) {
						setDemo1Playing(true);
					} else if (!entry.isIntersecting && demo1Playing) {
						setDemo1Playing(false);
					}
				} else if (entry.target === demo2Container.current) {
					if (entry.isIntersecting && !demo2Playing) {
						setDemo2Playing(true);
					} else if (!entry.isIntersecting && demo2Playing) {
						setDemo2Playing(false);
					}
				}
			});
		}, { threshold: 0.5 });

		if (demo1Container.current) observer.observe(demo1Container.current);
		if (demo2Container.current) observer.observe(demo2Container.current);

		return () => {
			if (demo1Container.current) observer.unobserve(demo1Container.current);
			if (demo2Container.current) observer.unobserve(demo2Container.current);
			observer.disconnect();
			cleanupAnimations();
		};
	}, []);

	// Start/stop animations when playing state changes
	useEffect(() => {
		if (demo1Playing) {
			playDemo1Animation();
		} else if (demo1Timeout.current) {
			clearTimeout(demo1Timeout.current);
			demo1Timeout.current = null;
		}
	}, [demo1Playing]);

	useEffect(() => {
		if (demo2Playing) {
			playDemo2Animation();
		} else if (demo2Timeout.current) {
			clearTimeout(demo2Timeout.current);
			demo2Timeout.current = null;
		}
	}, [demo2Playing]);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			cleanupAnimations();
		};
	}, []);

	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<SquareAnimation radiusRange={[80, 160]} seed={789} style={{ opacity: 0.5 }} />
			</div>

			{/* Page content */}
			<div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm tc2">
				<div className="mb-6 flex justify-between items-center">
					<Link
						href="/toys"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 transition-all duration-200 shadow-md bg-blue-500"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Toys
					</Link>
					<div className="flex gap-2">
						<DownloadButton relativePath="src/app/toys/stars/page.tsx" fileName="stars_page.tsx" />
						<GitHubButton relativePath="src/app/toys/stars/" />
					</div>
				</div>

				<h1 className="text-4xl font-bold mb-6 tc1">Stars</h1>

				<div className="prose dark:prose-invert mb-8">
					<p className="text-lg tc2">
						One star per row column and box, no adjacent stars.
					</p>
					{/* Stars Game Component */}
					<div className="p-6 flex flex-col items-center">
						<div className="max-w-[30vw] ">
						<StarsGameComponent
							ref={gameRef}
							size={6}
							autoBlock={blockHelp || false}
							autoStar={starHelp || false}
								showError={showHints || false}
								showMessages={true}
							/>
							</div>

						{/* Toggle switches for help features */}
						<div className="mt-4 flex flex-wrap gap-4 justify-center button-group">
							{/* Game control buttons */}
							<div className="button-group py-3">
								<button
									onClick={() => gameRef.current?.resetGame()}
									className="control-button button-secondary"
								>
									Reset
								</button>
								<button
									onClick={() => gameRef.current?.generateNewPuzzle()}
									className="control-button button-primary"
								>
									New Puzzle
								</button>
							</div>
							<div className="toggle-container-vertical">
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={blockHelp || false}
										onChange={() => setBlockHelp(!blockHelp)}
									/>
									<span className="toggle-slider"></span>
								</label>
								<span className="toggle-label">Auto-Block</span>
							</div>

							<div className="toggle-container-vertical">
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={starHelp || false}
										onChange={() => setStarHelp(!starHelp)}
									/>
									<span className="toggle-slider"></span>
								</label>
								<span className="toggle-label">Auto-Star</span>
							</div>
							<div className="toggle-container-vertical">
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={showHints || false}
										onChange={() => setShowHints(!showHints)}
									/>
									<span className="toggle-slider"></span>
								</label>
								<span className="toggle-label">Show Hints</span>
							</div>
						</div>
					</div>


					<div className="text-lg tc2">
						A solved puzzel has:
						<ul className="list-none list-inside tc3">
							<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('One star per row')}>
								- One star per row
							</li>
							<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('One star per column')}>
								- One star per column
							</li>
							<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('One star per box')}>
								- One star per box
							</li>
							<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('No adjacent stars')}>
								- No adjacent stars
							</li>
						</ul>
					</div>
				</div>

				{/* Explination */}
				<h2 className="text-2xl font-bold mb-4 tc1">Automatic Solver</h2>

				<div className="be">
					<p>
						Given a square puzzle board of size <MathJax inline>{`\\(n\\)`}</MathJax>, it will consist of <MathJax inline>{`\\(4*n\\)`}</MathJax> groups of cells, each requiring exactly one star.
					</p>
					<p>
						Each time a star is placed, it falls in exactaly <MathJax inline>{`\\(4\\)`}</MathJax> groups: 
					</p>
					<ul className="list-none list-inside tc3">
						<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('Row')}>
							- Row
						</li>
						<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('Column')}>
							- Column
						</li>
						<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('Box')}>
							- Group
						</li>
						<li className="ml-3 hover:ml-4 active:ml-5 active:opacity-80 cursor-pointer select-none transition-all" onClick={() => toClipboard('Adjacent')}>
							- Adjacent
						</li>
					</ul>
					{/*<div className="eq"> equation teplate
						<MathJax>
							{`\\[\\Large
								L(w): \\mathbb{R} \\rightarrow \\mathbb{R} \\
							\\]`}
						</MathJax>
					</div>*/}
					<p className="mb-4">
						The squares in these groups can then be marked off as blocked.
						Similarly, when every square in a group except one is blocked, the last square must be a star.
						By iteratively blocking squares and placing stars, a position can be generated that is the parent of all valid solutions.
					</p>
					<div className="w-full flex justify-center space-x-6 mb-4 items-center">
						<div ref={demo1Container} className="max-w-90 overflow-hidden">
							<StarsGameComponent
								ref={demo1Ref}
								size={4}
								autoBlock={false}
								autoStar={false}
								showError={false}
								customBoard={Array(4).fill(Array(4).fill(0))}
								enable={false}
							/>
						</div>
						<div ref={demo2Container} className="max-w-90 overflow-hidden">
							<StarsGameComponent
								ref={demo2Ref}
								size={4}
								autoBlock={false}
								autoStar={false}
								showError={false}
								customBoard={Array(4).fill(Array(4).fill(0))}
								enable={false}
							/>
						</div>

					</div>
					<p >
						This is not guarenteed to find all solutions, since it lacks the ability to do more than surface reasoning.
						To combat this, a thurough depth-first search in implemented using recursion to find all possible solutions.
						
					</p>
					<div className="eq">
						<MathJax>
							{`\\[\\Large
								w_{t+1} = w_t - \\frac{dL}{dw}(w_t) \\
							\\]`}
						</MathJax>
					</div>
					Assuming that there is a single global extreme <MathJax inline>{`\\(f(w_*)\\)`}</MathJax>, how do you determine the optimal learning rate:
					<div className="eq">
						<MathJax>
							{`\\[ \\Large \\quad \\eta_* \\text{st:} \\quad w_t+ \\eta_* \\frac{dL}{dw}(w_t) = w_* \\]`}
						</MathJax>
					</div>
					that allows you to reach the global extreme in one step?
				</div>
			</div>
		</div>
	);
}