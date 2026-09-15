'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import PDFPreview from '@/app/papers/pdf_preview';
import AuthorLink from '@/app/papers/author_link';
import PaperLink from '@/components/links/paper_link';
import { useMemo } from 'react';

const BIBLIOGRAPHY_DATA: Parameters<typeof PaperLink>[0][] = [
	{ title: 'Learning to see by moving', arxivId: '1505.01596', preferredPreview: 'arxiv' },
	{ title: 'Learning to poke by poking: Experiential learning of intuitive physics', arxivId: '1606.07419', preferredPreview: 'arxiv' },
	{ title: 'Unifying count-based exploration and intrinsic motivation', arxivId: '1606.01868', preferredPreview: 'arxiv' },
	{ title: 'R-max: A general polynomial time algorithm for near-optimal reinforcement learning', url: 'https://jmlr.org/papers/v3/brafman02a.html', preferredPreview: 'url' },
	{ title: 'OpenAI Gym', url: 'https://github.com/openai/gym', arxivId: '1606.01540', preferredPreview: 'arxiv' },
	{ title: 'Fast and accurate deep network learning by exponential linear units (ELUs)', arxivId: '1511.07289', preferredPreview: 'arxiv' },
	{ title: 'Unsupervised visual representation learning by context prediction', url: 'http://graphics.cs.cmu.edu/projects/deepContext/', arxivId: '1505.05192', preferredPreview: 'arxiv' },
	{ title: 'Learning to act by predicting the future', url: 'https://github.com/IntelVCL/DirectFuturePrediction', arxivId: '1611.01779', preferredPreview: 'arxiv' },
	{ title: 'Ex2: Exploration with exemplar models for deep reinforcement learning', url: 'https://github.com/justinjfu/ex2', arxivId: '1703.01260', preferredPreview: 'arxiv' },
	{ title: 'Unsupervised feature learning from temporal data', arxivId: '1504.02518', preferredPreview: 'arxiv' },
	{ title: 'Variational intrinsic control', arxivId: '1611.07507', preferredPreview: 'arxiv' },
	{ title: 'VIME: Variational information maximizing exploration', arxivId: '1605.09674', preferredPreview: 'arxiv' },
	{ title: 'Reinforcement learning with unsupervised auxiliary tasks', arxivId: '1611.05397', preferredPreview: 'arxiv' },
	{ title: 'Learning image representations tied to ego-motion', url: 'http://vision.cs.utexas.edu/projects/egomotion/', arxivId: '1505.02206', preferredPreview: 'arxiv' },
	{ title: 'Forward models: Supervised learning with a distal teacher', pdfPath: '/papers/forward_models.pdf', preferredPreview: 'pdf' },
	{ title: 'Efficient reinforcement learning in factored MDPs', arxivId: '2008.13319', preferredPreview: 'arxiv' },
	{ title: 'ViZDoom: A doom-based AI research platform for visual reinforcement learning', url: 'http://vizdoom.cs.put.edu.pl/', arxivId: '1605.02097', preferredPreview: 'arxiv' },
	{ title: 'Empowerment: A universal agent-centric measure of control', url: 'https://ieeexplore.ieee.org/document/1554676', pdfPath: '/papers/Empowerment.pdf', preferredPreview: 'pdf' },
	{ title: 'Continuous control with deep reinforcement learning', arxivId: '1509.02971', preferredPreview: 'arxiv' },
	{ title: 'Learning and exploration in action-perception loops', url: 'https://doi.org/10.3389/fncir.2014.00037', pdfPath: '/papers/learning_in_loops.pdf', preferredPreview: 'pdf' },
	{ title: 'Exploration in model-based reinforcement learning by empirically estimating learning progress', pdfPath: '/papers/exploration_in_model.pdf', preferredPreview: 'pdf' },
	{ title: 'Learning to navigate in complex environments', arxivId: '1611.03673', preferredPreview: 'arxiv' },
	{ title: 'Human-level control through deep reinforcement learning', url: 'https://www.nature.com/articles/nature14236', pdfPath: '/papers/human_level.pdf', preferredPreview: 'pdf' },
	{ title: 'Asynchronous methods for deep reinforcement learning', arxivId: '1602.01783', preferredPreview: 'arxiv' },
	{ title: 'Variational information maximisation for intrinsically motivated reinforcement learning', arxivId: '1509.08731', preferredPreview: 'arxiv' },
	{ title: 'Action-conditional video prediction using deep networks in Atari games', arxivId: '1507.08750', preferredPreview: 'arxiv' },
	{ title: 'Deep exploration via bootstrapped DQN', arxivId: '1602.04621', preferredPreview: 'arxiv' },
	{ title: 'What is intrinsic motivation? A typology of computational approaches', url: 'https://doi.org/10.3389/neuro.12.006.2007', pdfPath: '/papers/what_is_motivation.pdf', preferredPreview: 'pdf' },
	{ title: 'Intrinsic motivation systems for autonomous mental development', url: 'https://ieeexplore.ieee.org/document/4141061', preferredPreview: 'pdf', pdfPath: '/papers/motivation_systems.pdf' },
	{ title: 'Super Mario Bros. in OpenAI Gym', url: 'https://github.com/ppaquette/gym-super-mario', preferredPreview: 'none' },
	{ title: 'Context encoders: Feature learning by inpainting', url: 'http://people.eecs.berkeley.edu/~pathak/context_encoder/', arxivId: '1604.07379', preferredPreview: 'arxiv' },
	{ title: 'An analytic solution to discrete Bayesian reinforcement learning', pdfPath: '/papers/analytical_solution_to_BRL.pdf', preferredPreview: 'pdf' },
	{ title: 'Intrinsic and extrinsic motivations: Classic definitions and new directions', url: 'https://www.sciencedirect.com/science/article/pii/S0361476X99910202?via%3Dihub', pdfPath: '/papers/in_ex_motivatioin.pdf', preferredPreview: 'pdf' },
	{ title: 'A possibility for implementing curiosity and boredom in model-building neural controllers', url: 'https://ieeexplore.ieee.org/document/6294131', preferredPreview: 'pdf', pdfPath: '/papers/curiosity_boredom.pdf' },
	{ title: 'Formal theory of creativity, fun, and intrinsic motivation (1990–2010)', pdfPath: '/papers/formal_creativity.pdf', preferredPreview: 'url' },
	{ title: 'Loss is its own reward: Self-supervision for reinforcement learning', url: 'https://github.com/shelhamer/loss-is-its-own-reward', arxivId: '1612.07307', preferredPreview: 'arxiv' },
	{ title: 'Curiosity and motivation', url: 'https://academic.oup.com/edited-volume/28143/chapter-abstract/212909828?redirectedFrom=fulltext', preferredPreview: 'none' },
	{ title: 'Intrinsically motivated reinforcement learning', url: 'https://papers.nips.cc/paper/2552-intrinsically-motivated-reinforcement-learning', preferredPreview: 'none' },
	{ title: 'Incentivizing exploration in reinforcement learning with deep predictive models', arxivId: '1507.00814', preferredPreview: 'arxiv' },
	{ title: 'An information-theoretic approach to curiosity-driven reinforcement learning', pdfPath: '/papers/information_theoretic.pdf', preferredPreview: 'pdf' },
	{ title: 'Reinforcement driven information acquisition in non-deterministic environments', pdfPath: '/papers/information_acquisition.pdf', preferredPreview: 'pdf' },
	{ title: 'Intrinsic motivation and automatic curricula via asymmetric self-play', arxivId: '1703.05407', preferredPreview: 'arxiv' },
	{ title: 'Planning to be surprised: Optimal Bayesian exploration in dynamic environments', arxivId: '1103.5708', preferredPreview: 'arxiv' },
	{ title: '#Exploration: A study of count-based exploration for deep reinforcement learning', arxivId: '1611.04717', preferredPreview: 'arxiv' },
	{ title: 'Unsupervised learning of visual representations using videos', url: 'https://people.eecs.berkeley.edu/~xiaolonw/project_video_unsupervised.html', arxivId: '1505.00687', preferredPreview: 'arxiv' },
	{ title: 'An internal model for sensorimotor integration', url: 'https://pubmed.ncbi.nlm.nih.gov/7569931/', preferredPreview: 'pdf',pdfPath:"/papers/internal_sensimotor.pdf" },
];

export default function CuriosityExplorationReview() {
	const bibliography = useMemo(
		() => BIBLIOGRAPHY_DATA.map((props, i) => <PaperLink key={i} {...props} />),
		[]
	);

	return (
		<>
			{/* PDF Preview */}
			<PDFPreview
				pdfPath="/papers/Curiosity-driven_Exploration.pdf"
				title="Curiosity-driven Exploration by Self-Supervised Prediction"
			/>
			<div className="relative min-h-screen">
				{/* Background animation */}
				<div className="absolute inset-0 -z-10 invert dark:invert-0">
					<TriangleAnimation
						radiusRange={[300, 1200]}
						seed={789}
						style={{ opacity: 0.5 }}
					/>
				</div>

				{/* Content with slight transparency for background visibility */}
				<div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2">
					<div className="mb-6 flex justify-between items-center">
						<Link
							href="/papers"
							className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
							style={{ background: "var(--khg)" }}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Back to Papers
						</Link>

						<div className="flex gap-2">
							<DownloadButton
								relativePath="src/app/papers/curiosity-exploration/page.tsx"
								fileName="curiosity-exploration_review.tsx"
							/>
							<GitHubButton
								relativePath="src/app/papers/curiosity-exploration/page.tsx"
							/>
						</div>
					</div>

					{/* Paper Title */}
					<h1 className="text-4xl font-bold mb-6 tc1">Curiosity-driven Exploration by Self-Supervised Prediction</h1>

					{/* Paper Metadata */}
					<div className="mb-8 be p-6 rounded-lg">
						<div className="mb-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold tc1 ml-6">Authors</h3>

								<a
									href="https://arxiv.org/abs/1705.05363"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-4 py-2 rounded-lg tc1 font-medium shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200"
									style={{
										background: "linear-gradient(to right, #3b82f6, #1e40af)",
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 tc2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 20l-6-6" />
									</svg>
									Paper Link
								</a>
							</div>
							<div className="flex flex-wrap gap-0">
								<AuthorLink name="Deepak Pathak" url="https://www.cs.cmu.edu/~dpathak/" />
								<AuthorLink name="Pulkit Agrawal" url="https://people.eecs.berkeley.edu/~pulkitag/" />
								<AuthorLink name="Alexei A. Efros" url="https://people.eecs.berkeley.edu/~efros/" />
								<AuthorLink name="Trevor Darrell" url="https://people.eecs.berkeley.edu/~trevor/" />
							</div>
						</div>
					</div>

					{/* Review Content */}
					<MathJaxContext>
					<div className="prose dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Abstract</h2>
						<div className="be">
							<p className="mb-4 tc2 text-lg">
								Rewards in real world tasks are often single success/fail conditions.
								<br/>
								These sparse 
							</p>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Ideas</h2>
						<div className="be">
							<ul className="list tc2 space-y-2">
								<li>
									<b className="tc1">Intrinsic Curiosity Module (ICM)</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>[placeholder]</li>
										<li>[placeholder]</li>
										<li>[placeholder]</li>
									</ul>
								</li>
								<li>
									<b className="tc1">Inverse Dynamics Model</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>[placeholder]</li>
										<li>[placeholder]</li>
									</ul>
								</li>
								<li>
									<b className="tc1">Forward Dynamics Model</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>[placeholder]</li>
										<li>[placeholder]</li>
									</ul>
								</li>
								<li>
									<b className="tc1">Related Work</b>
									<ul className="list-['-'] pl-6 mt-2">
										{bibliography.map((element, index) => (
											<li key={index}>{element}</li>
										))}
									</ul>
								</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Technical Analysis</h2>
						<div className="be">
							<p className="mb-4 w-[70%] mx-auto flex-wrap">
								[placeholder]
							</p>
							<b>[placeholder]: </b> [placeholder]<br /><br />
							<b>[placeholder]: </b> [placeholder]<br /><br />
							<b>[placeholder]: </b> [placeholder]<br /><br />

							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								[placeholder]
							</p>

							<div className="eq">
								<MathJax>
									{`\\[\\Large
									[placeholder]
								\\]`}
								</MathJax>
							</div>

							<p className="mb-4">
								Where:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>

							<p className="mb-4">
								<b>[placeholder]: </b> [placeholder]
							</p>
							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								[placeholder]
							</p>
							<div className="eq">
								<MathJax>
									{`\\[\\Large
									[placeholder]
								\\]`}
								</MathJax>
							</div>
							[placeholder]<br /><br />

							<b>[placeholder]: </b> [placeholder]
							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								[placeholder]
							</p>
							<div className="eq">
								<MathJax>
									{`\\[\\Large
									[placeholder]
								\\]`}
								</MathJax>
							</div>
							[placeholder]<br /><br />
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Experimental Results</h2>
						<div className="be">
							<p className="mb-4">
								[placeholder]
							</p>

							{/* Placeholder for results figure */}
							<div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4 text-center">
								<div className="text-6xl mb-4">📊</div>
								<p className="tc2">[placeholder]</p>
								<p className="text-sm tc2 mt-2">[placeholder]</p>
							</div>

							<p className="mb-4">
								[placeholder]
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Critical Assessment</h2>
						<div className="be">
							<h3 className="text-xl font-semibold mb-3 tc1">Strengths</h3>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>

							<h3 className="text-xl font-semibold mb-3 tc1">Limitations</h3>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Implications and Future Work</h2>
						<div className="be">
							<p className="mb-4">
								[placeholder]
							</p>

							{/* Placeholder for architecture diagram */}
							<div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4 text-center">
								<div className="text-6xl mb-4">🧠</div>
								<p className="tc2">[placeholder]</p>
								<p className="text-sm tc2 mt-2">[placeholder]</p>
							</div>

							<p className="mb-4">
								[placeholder]
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Personal Notes</h2>
						<div className="be">
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
								<p className="tc2">
									<strong>Note:</strong> [placeholder]
								</p>
							</div>

							<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-4">
								<p className="tc2">
									<strong>Research Idea:</strong> [placeholder]
								</p>
							</div>

							<div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4">
								<p className="tc2">
									<strong>Implementation Note:</strong> [placeholder]
								</p>
							</div>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Overall Rating</h2>
						<div className="be text-center">
							<div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
							<p className="text-xl tc1 font-semibold">[placeholder]</p>
							<p className="tc2 mt-2">
								[placeholder]
							</p>
						</div>

						<div className="mb-100" />
					</div>
					</MathJaxContext>
				</div>
			</div>
		</>
	);
}
