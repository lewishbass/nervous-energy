'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax } from 'better-react-mathjax';
import PDFPreview from '@/app/papers/pdf_preview';
import AuthorLink from '@/app/papers/author_link';
import PaperLink from '@/components/links/paper_link';

export default function VideoDirectorGPTReview() {

	return (
		<>
			{/* PDF Preview */}
			<PDFPreview
				pdfPath="/papers/VideoDirectorGPT.pdf"
				title="VideoDirectorGPT"
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
								relativePath="src/app/papers/videodirectorGPT/page.tsx"
								fileName="videodirectorGPT_review.tsx"
							/>
							<GitHubButton
								relativePath="src/app/papers/videodirectorGPT/page.tsx"
							/>
						</div>
					</div>

					{/* Paper Title */}
					<h1 className="text-4xl font-bold mb-6 tc1">VideoDirectorGPT</h1>

					{/* Paper Metadata */}
					<div className="mb-8 be p-6 rounded-lg">
						<div className="mb-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold tc1 ml-6">Authors</h3>
								
									<a
										href="https://videodirectorgpt.github.io/"
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
								<AuthorLink name="Han Lin" url="https://hl-hanlin.github.io/"/>
								<AuthorLink name="Abhay Zala" url="https://aszala.com/"/>
								<AuthorLink name="Jaemin Cho" url="https://j-min.io/"/>
								<AuthorLink name="Mohit Bansal" url="https://www.cs.unc.edu/~mbansal/"/>
							</div>
						</div>
					</div>

					{/* Review Content */}
					<div className="prose dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Abstract</h2>
						<div className="be">
							<p className="mb-4 tc2 text-lg">
								Recent text-to-video generation methods focus on producing short video clips of distinct events.
								Meanwhile, LLMs demonstrate capability in generating layouts to control downstream visual models.
								<span className="ml-1 italic tc1">Can we leverage the knowledge embedded in these LLMs for temporally consistent long video generation?</span>
								<br /> <br />
								In this paper, they propose <b className="tc1" style={{ fontVariant: "small-caps" }}>VideoDirectorGPT</b>, a novel framework for consistent multi-scene video generation that uses the knowledge of LLMs for video content planning.
								<br /> <br />
								Given a single text prompt, GPT-4 generates a <span className="tc1 italic">'video plan'</span> including scene descriptions, entities, backgrounds layouts and grouping.
								<br /> <br />
								Guided by this <span className="tc1 italic">'video plan'</span>, their video generator <b className="tc1" style={{ fontVariant: "small-caps" }}>Layout2Vid</b> can maintain spatial-temporal consistency across scenes while maintaining <b className="tc1">SOTA</b> performance in single-scene T2V generation.
							</p>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Ideas</h2>
						<div className="be">
							some text <PaperLink title="VideoGPT" url="https://videodirectorgpt.github.io/" pdfPath="/papers/VideoDirectorGPT.pdf" arxivId='2309.15091' preferredPreview='arxiv' /> more text
							<ul className="list  tc2 space-y-2">
								<li>
									<b className="tc1">T2V Generation</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>
											<PaperLink title="Modelscope" arxivId="2308.06571" />
										</li>
										<li>
											<PaperLink title="Latent video diffusion" arxivId="2211.13221" />
										</li>
										<li>
											<PaperLink title="Imagen video" arxivId="2210.02303" />
										</li>
										<li>
											<PaperLink title="Make-a-video" arxivId="2209.14792" />
										</li>
										<li>
											<PaperLink title="Magicvideo" arxivId="2211.11018" />
										</li>
									</ul>
								</li>
								<li><b className="tc1">Long Video Generation</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>
											<PaperLink title="Align your latents" arxivId="2304.08818" />
										</li>
										<li>
											<PaperLink title="NUWA-XL" arxivId="2303.12346" />
										</li>
										<li>
											<PaperLink title="Phenaki" arxivId="2210.02399" />
										</li>
										<li>
											<PaperLink title="Animate-a-story" arxivId="2307.06940" />
										</li>
									</ul>
								</li>
								<li><b className="tc1">LLM Guided Generation</b>
									<ul className="list-['-'] pl-6 mt-2">
										<li>
											<PaperLink title="Vipergpt" arxivId="2303.08128" />
										</li>
										<li>
											<PaperLink title="Visual programming" arxivId="2211.11559" />
										</li>
										<li>
											<PaperLink title="Visual programming" arxivId="2305.15328" />
										</li>
										<li>
											<PaperLink title="Layoutgpt" arxivId="2305.15393" />
										</li>
									</ul>
								</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Technical Analysis</h2>
						<div className="be">
							<p className="mb-4 w-[70%] mx-auto flex-wrap">
								[placeholder]
							</p>
								<b>[placeholder]: </b> [placeholder]<br/><br/>
								<b>[placeholder]: </b> [placeholder]<br/><br/>
								<b>[placeholder]: </b> [placeholder]<br/><br/>

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
						[placeholder]<br/><br/>

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
							[placeholder]<br/><br/>
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
				</div>
			</div>
		</>
	);
}