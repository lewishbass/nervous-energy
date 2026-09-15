'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export default function AntiAIWriting() {
	return (
		<>
			<div className="relative min-h-screen">
				{/* Background animation */}
				<div className="absolute inset-0 -z-10 invert dark:invert-0">
					<TriangleAnimation
						radiusRange={[300, 1200]}
						seed={42}
						style={{ opacity: 0.5 }}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2">
					{/* Nav bar */}
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
								relativePath="src/app/papers/anti-ai-writing/page.tsx"
								fileName="anti-ai-writing.tsx"
							/>
							<GitHubButton
								relativePath="src/app/papers/anti-ai-writing/page.tsx"
							/>
						</div>
					</div>

					{/* Post Title */}
					<h1 className="text-4xl font-bold mb-4 tc1">[placeholder title]</h1>

					{/* Post Metadata */}
					<div className="mb-8 flex items-center gap-4 tc2 text-sm">
						<span>[placeholder date]</span>
						<span>·</span>
						<span>[placeholder read time]</span>
						<span>·</span>
						<span>[placeholder category]</span>
					</div>

					{/* Hero / Intro block */}
					<div className="be p-6 rounded-lg mb-8">
						<p className="text-lg tc2 leading-relaxed">
							[placeholder intro paragraph — hook the reader]
						</p>
					</div>

					<MathJaxContext>
					<div className="prose dark:prose-invert max-w-none">

						{/* Section 1 */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">[placeholder section heading]</h2>
						<div className="be">
							<p className="mb-4 tc2">
								[placeholder]
							</p>
							<p className="mb-4 tc2">
								[placeholder]
							</p>
						</div>

						{/* Section 2 */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">[placeholder section heading]</h2>
						<div className="be">
							<p className="mb-4 tc2">
								[placeholder]
							</p>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>
						</div>

						{/* Section 3 — with inline math example */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">[placeholder section heading]</h2>
						<div className="be">
							<p className="mb-4 tc2">
								[placeholder]
							</p>
							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								[placeholder equation label]
							</p>
							<div className="eq">
								<MathJax>
									{`\\[\\Large
									[placeholder]
								\\]`}
								</MathJax>
							</div>
							<p className="mb-4 tc2">
								[placeholder — equation explanation]
							</p>
						</div>

						{/* Callout / aside */}
						<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-8">
							<p className="tc2">
								<strong>[placeholder callout heading]:</strong> [placeholder callout body]
							</p>
						</div>

						{/* Section 4 */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">[placeholder section heading]</h2>
						<div className="be">
							<p className="mb-4 tc2">
								[placeholder]
							</p>

							{/* Placeholder figure */}
							<div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4 text-center">
								<div className="text-6xl mb-4">📊</div>
								<p className="tc2">[placeholder figure caption]</p>
								<p className="text-sm tc2 mt-2">[placeholder figure source]</p>
							</div>

							<p className="mb-4 tc2">
								[placeholder]
							</p>
						</div>

						{/* Section 5 */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">[placeholder section heading]</h2>
						<div className="be">
							<p className="mb-4 tc2">
								[placeholder]
							</p>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>[placeholder]</li>
								<li>[placeholder]</li>
								<li>[placeholder]</li>
							</ul>
						</div>

						{/* Personal take */}
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">My Take</h2>
						<div className="be">
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
								<p className="tc2">
									<strong>Note:</strong> [placeholder]
								</p>
							</div>
							<div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4">
								<p className="tc2">
									<strong>Takeaway:</strong> [placeholder]
								</p>
							</div>
							<p className="mb-4 tc2">
								[placeholder closing thoughts]
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
