// /reseme
// This is the resume page

'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import Discussion from '@/components/messages/Discussion';


export default function ResumePage() {
	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<TriangleAnimation
					radiusRange={[300, 1200]}
					seed={456}
					style={{ opacity: 0.5 }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2 pb-200">
				{/*<div className="mb-6 flex justify-between items-center">
					<Link
						href="/"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Home
					</Link>

					<div className="flex gap-2">
						<DownloadButton
							relativePath="src/app/resume/page.tsx"
							fileName="resume_page.tsx"
						/>
						<GitHubButton
							relativePath="src/app/resume/page.tsx"
						/>
					</div>
				</div>*/}

				{/* Header */}
				<h1 className="text-4xl font-bold mb-1 tc1">Lewis Bass</h1>
				<div className="m-0 mb-3 min-h-[8px] w-[75%] bg-gradient-to-r from-[#3b82f6] via-[#3b82f600] to-[#00000000] rounded-full"></div>
				<div className="mb-8 be p-4 rounded-lg">
					<div className="flex flex-wrap gap-4 items-center justify-between">
						<div className="flex flex-wrap gap-4 tc2">

							<a href="mailto:lewisbass@vt.edu" className="hover:underline tc1">lewisbass@vt.edu</a>
							<span>•</span>
							<a href="http://lewisbass.org" target="_blank" rel="noopener noreferrer" className="hover:underline tc1">lewisbass.org</a>
						</div>
						<Link
							href="/resume/transcript"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg tc1 font-medium shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200"
							style={{ background: "linear-gradient(to right, #3b82f680, #1e40af80)" }}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							View Transcript
						</Link>
					</div>
				</div>

				{/* Career Goals */}
				<div className="prose dark:prose-invert max-w-none">
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Career Goals</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#ff0000] via-[#ff000000] to-[#00000000] rounded-full"></div>
					<div className="be">
						<p className="tc2 text-lg">
							Experienced AI/ML researcher looking to turn my extensive knowledge of Mathematics and Computing theory into practical experience; to contribute to innovative solutions and expand expertise in project frameworks and state-of-the-art ML/AI technologies.
						</p>
					</div>

					{/* Education */}
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Education</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#ff7f00] via-[#ff7f0000] to-[#00000000] rounded-full"></div>
					<div className="be">
						<div className="space-y-4">
							<div className="flex justify-between items-start flex-wrap gap-2">
								<div>
									<h3 className="text-xl font-semibold tc1">Virginia Polytechnic Institute</h3>
									<p className="tc2">Masters of Science: Computer Engineering</p>
								</div>
								<span className="tc2 italic">2023 - 2025</span>
							</div>
							<div className="flex justify-between items-start flex-wrap gap-2">
								<div>
									<h3 className="text-xl font-semibold tc1">Virginia Polytechnic Institute</h3>
									<p className="tc2">Bachelor's Degree: Mathematics</p>
								</div>
								<span className="tc2 italic">2021 - 2022</span>
							</div>
							<div className="flex justify-between items-start flex-wrap gap-2">
								<div>
									<h3 className="text-xl font-semibold tc1">Virginia Polytechnic Institute</h3>
									<p className="tc2">Bachelor's Degree: Computer Engineering (Machine Learning)</p>
								</div>
								<span className="tc2 italic">2019 - 2021</span>
							</div>
						</div>
					</div>

					{/* Work Experience */}
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Work Experience</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#ffff00] via-[#ffff0000] to-[#00000000] rounded-full"></div>
					<div className="be">
						<div className="space-y-6">
							<div>
								<div className="flex justify-between items-start flex-wrap gap-2 mb-2">
									<h3 className="text-xl font-semibold tc1">CO-Lead Designer / Instructor CEED</h3>
									<span className="tc2 italic">2023 - 2024</span>
								</div>
								<ul className="list-disc pl-6 tc2 space-y-1">
									<li>Coordinated Imagination technology education camps for Virginia Tech.</li>
									<li>Designing and implementing soldering and programming kits.</li>
									<li>
										<a href="https://www.youtube.com/embed/jw3perSnIFg" target="_blank" rel="noopener noreferrer" className="tc1 hover:underline">Video Demo</a>
									</li>
								</ul>
							</div>
							<div>
								<div className="flex justify-between items-start flex-wrap gap-2 mb-2">
									<h3 className="text-xl font-semibold tc1">Research Assistant</h3>
									<span className="tc2 italic">2022 - 2023</span>
								</div>
								<ul className="list-disc pl-6 tc2 space-y-1">
									<li>Machine Learning for Computational Molecular Biophysics for the VT CS department.</li>
									<li>Developing and testing ML models, coordinating research, consulting experts and scientific writing.</li>
								</ul>
							</div>
							<div>
								<div className="flex justify-between items-start flex-wrap gap-2 mb-2">
									<h3 className="text-xl font-semibold tc1">Software Engineering Intern</h3>
									<span className="tc2 italic">2020</span>
								</div>
								<ul className="list-disc pl-6 tc2 space-y-1">
									<li>Internship programming for Robotic Research LLC.</li>
									<li>Developing HID firmware for legacy hardware.</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Publication */}
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Publication</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#00ff00] via-[#00ff0000] to-[#00000000] rounded-full"></div>
					<div className="be">
						<div className="flex justify-between items-start flex-wrap gap-2 mb-2">
							<h3 className="text-xl font-semibold tc1">Improving Solvation Predictions with Machine Learning</h3>
							<a 
								href="https://pubs.acs.org/doi/epdf/10.1021/acs.jctc.3c00981" 
								target="_blank" 
								rel="noopener noreferrer"
								className="tc1 hover:underline text-sm"
							>
								doi.org/10.1021/acs.jctc.3c00981
							</a>
						</div>
						<ul className="list-disc pl-6 tc2 space-y-1">
							<li>Led a research team to explore the use of Machine Learning in drug discovery</li>
							<li>Coordinated research, managed datasets and models and documented findings.</li>
							<li>Graph-convolution networks estimating solvation energy in drug design simulations.</li>
							<li>Validating models and methods on small, diverse datasets.</li>
						</ul>
					</div>

					{/* Course Experience */}
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Course Experience</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#0000ff] via-[#0000ff00] to-[#00000000] rounded-full"></div>
					<div className="be">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-xl font-semibold mb-3 tc1">Computer Science</h3>
								<ul className="list-disc pl-6 tc2 space-y-1">
									<li>Deep Reinforcement Learning</li>
									<li>Advanced Computer Vision</li>
									<li>Natural Language Processing</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-3 tc1">Mathematics</h3>
								<ul className="list-disc pl-6 tc2 space-y-1">
									<li>Algebraic Topology</li>
									<li>Matrix Theory</li>
									<li>Manifold Calculus</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Skills */}
					<h2 className="text-2xl font-semibold mt-8 mb-0 tc1">Skills</h2>
					<div className="m-0 mb-3 min-h-[4px] w-[75%] bg-gradient-to-r from-[#4b0082] via-[#4b008200] to-[#00000000] rounded-full"></div>
					<div className="be">
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-semibold tc1 mb-2">Programming</h3>
								<div className="flex flex-wrap gap-2">
									{['Python', 'Keras', 'PyTorch', 'C++', 'Linux', 'MATLAB', 'GLSL', 'React'].map((skill) => (
										<span key={skill} className="px-3 py-1 rounded-full text-sm bg-blue-500/20 tc1 border border-blue-500/30">
											{skill}
										</span>
									))}
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold tc1 mb-2">Design</h3>
								<div className="flex flex-wrap gap-2">
									{['PCB Layout', 'Circuit Design', 'CAD', '3D Printing', 'Rendering'].map((skill) => (
										<span key={skill} className="px-3 py-1 rounded-full text-sm bg-green-500/20 tc1 border border-green-500/30">
											{skill}
										</span>
									))}
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold tc1 mb-2">Practical</h3>
								<div className="flex flex-wrap gap-2">
									{['Tutoring/Instructing', 'Soldering', 'FPV Piloting', 'Cycling', 'Running', 'Swimming'].map((skill) => (
										<span key={skill} className="px-3 py-1 rounded-full text-sm bg-purple-500/20 tc1 border border-purple-500/30">
											{skill}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="mb-24" />
				</div>

				<Discussion
					baseThreadID={'resume-discussions'}
					baseThreadTitle="Resume Discussions"
					baseThreadContent="Give feedback on my resume here!"
				/>
			</div>
		</div>
	);
}