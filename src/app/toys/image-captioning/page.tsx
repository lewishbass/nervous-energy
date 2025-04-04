'use client';

import Link from 'next/link';
import LineAnimation from '@/components/backgrounds/LineAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax } from 'better-react-mathjax';
//import { useEffect, useState } from 'react';

export default function ImageCaptioning() {
	
	{/*const [activeSection, setActiveSection] = useState('');
	const [isMenuExpanded, setIsMenuExpanded] = useState(true);

	// Update active section based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			const sections = document.querySelectorAll('section[id]');
			let currentActiveSection = 'image-captioning'; // Default to the first section

			sections.forEach(section => {
				const sectionTop = (section as HTMLElement).offsetTop;
				if (window.scrollY >= sectionTop - 200) {
					currentActiveSection = section.id;
				}
			});

			setActiveSection(currentActiveSection);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Call once on mount

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Toggle menu expanded state
	const toggleMenu = () => {
		setIsMenuExpanded(!isMenuExpanded);
	};*/}

	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					spacing={200}
					seed={456}
					style={{ opacity: 0.5 }}
				/>
			</div>

			{/* Side Navigation Menu }
			<div className={`fixed left-0 top-10 h-full z-20 transition-all duration-600 ${isMenuExpanded ? 'w-48 shadow-lg backdrop-blur-xs' : 'w-18'}`}>
				
				<button
					onClick={toggleMenu}
					className="absolute right-1/2 top-8 transform translate-x-1/2 text-white p-2 rounded-full"
					style={{ transform: !isMenuExpanded ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.6s ease' }}
				>

					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 12h18M3 19h18"
						/>
					</svg>

				</button>

				<div className="mt-20 p-3 tc2">
					{isMenuExpanded && <a href="#image-captioning" className={`overflow-hidden mb-2 text-nowrap tc1 text-lg font-medium block px-3 py-2 rounded-md transition-colors ${activeSection === 'image-captioning' ? 'bg-blue-600/30 text-white' : 'text-white hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>Image Captioning</a>}
					<ul className="space-y-2 text-sm">
						<li>
							<a href="#problem-statement"
								className={`overflow-hidden block text-nowrap px-${!isMenuExpanded ? '0' : '5'} py-2 rounded-md transition-colors ${activeSection === 'problem-statement' ? 'bg-blue-600/30 ' : ' hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>
								{isMenuExpanded ? 'Problem Statement' : 'PS'}
							</a>
						</li>
						<li>
							<a href="#image-preprocessing"
								className={`overflow-hidden block text-nowrap px-${!isMenuExpanded ? '0' : '5'} py-2 rounded-md transition-colors ${activeSection === 'image-preprocessing' ? 'bg-blue-600/30 ' : ' hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>
								{isMenuExpanded ? 'Image Preprocessing' : 'IP'}
							</a>
						</li>
						<li>
							<a href="#text-preprocessing"
								className={`overflow-hidden block text-nowrap px-${!isMenuExpanded ? '0' : '5'} py-2 rounded-md transition-colors ${activeSection === 'text-preprocessing' ? 'bg-blue-600/30 ' : ' hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>
								{isMenuExpanded ? 'Text Preprocessing' : 'TP'}
							</a>
						</li>
						<li>
							<a href="#model-structure"
								className={`overflow-hidden block text-nowrap px-${!isMenuExpanded ? '0' : '5'} py-2 rounded-md transition-colors ${activeSection === 'model-structure' ? 'bg-blue-600/30 ' : ' hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>
								{isMenuExpanded ? 'Model Structure' : 'MS'}
							</a>
						</li>
						<li>
							<a href="#interactive-demo"
								className={`overflow-hidden block text-nowrap px-${!isMenuExpanded ? '0' : '5'} py-2 rounded-md transition-colors ${activeSection === 'interactive-demo' ? 'bg-blue-600/30 ' : ' hover:bg-blue-600/50'} ${!isMenuExpanded ? 'text-center' : ''}`}>
								{isMenuExpanded ? 'Demo' : 'DM'}
							</a>
						</li>
					</ul>
				</div>
			</div>*/}

			{/* Content with slight transparency for background visibility */}
			<div
				className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2 transition-all duration-600"

			>
				<div className="mb-6 flex justify-between items-center">
					<Link
						href="/toys"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Toys
					</Link>

					<div className="flex gap-2">
						<DownloadButton
							relativePath="src/app/toys/image-captioning/page.tsx"
							fileName="image-captioning_page.tsx"
						/>
						<GitHubButton
							relativePath="src/app/toys/image-captioning/"
						/>
					</div>
				</div>

				<h1 id="image-captioning" className="text-4xl font-bold mb-6 tc1">Image Captioning</h1>

				<div className="prose dark:prose-invert max-w-none">
					<p className="tc2 text-lg">
						Brief description of what this page demonstrates.
					</p>

					<section id="problem-statement">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Problem Statement</h2>
						<div className="be">
							[Placeholder text for problem statement section. This would explain the challenge of automatically generating descriptive captions for images, the applications of image captioning technology, and how it bridges computer vision and natural language processing.]

							<div className="eq">
								<MathJax>
									{`\\[\\Large
									\\mathcal{L}(\\theta) = -\\sum_{t=1}^{T} \\log p(y_t | y_{1:t-1}, \\mathbf{I}; \\theta)
								\\]`}
								</MathJax>
							</div>
						</div>
					</section>

					<section id="image-preprocessing">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Image Preprocessing</h2>
						<div className="be">
							[Placeholder text for image preprocessing section. This would cover techniques for preparing image data for the captioning model, including resizing, normalization, augmentation, and feature extraction using pre-trained CNNs.]

							<div className="eq">
								<MathJax>
									{`\\[\\Large
									I_{normalized} = \\frac{I - \\mu}{\\sigma}
								\\]`}
								</MathJax>
							</div>
						</div>
					</section>

					<section id="text-preprocessing">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Text Preprocessing</h2>
						<div className="be">
							[Placeholder text for text preprocessing section. This would explain tokenization, vocabulary building, special tokens like {"<START>"} and {"<END>"}, word embeddings, and handling variable-length sequences.]

							<div className="eq">
								<MathJax>
									{`\\[\\Large
									\\text{embedding}(w) = E \\cdot \\text{onehot}(w) \\in \\mathbb{R}^d
								\\]`}
								</MathJax>
							</div>
						</div>
					</section>

					<section id="model-structure">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Model Structure</h2>
						<div className="be">
							[Placeholder text for model structure section. This would describe the encoder-decoder architecture, attention mechanisms, visual feature extraction, and how the model generates captions sequentially.]

							<div className="eq">
								<MathJax>
									{`\\[\\Large
									h_t = \\text{LSTM}(h_{t-1}, [W_e y_{t-1}, \\text{Attention}(h_{t-1}, \\mathbf{I})])
								\\]`}
								</MathJax>
							</div>
						</div>
					</section>

					<section id="interactive-demo">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
						<div className="be min-w-full">
							<div className="min-w-full">
								{/* <OneStepDemo /> */}
								[Interactive demo placeholder]
							</div>
						</div>
					</section>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Points</h2>
					<ul className="list-disc pl-6 tc2 space-y-4">
						<li>First important point about this topic</li>
						<li>Second important point with additional details</li>
					</ul>
					<div className='mb-100' />
				</div>
			</div>
		</div>
	);
}
