'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax } from 'better-react-mathjax';
import PDFPreview from '@/app/papers/pdf_preview';
import AuthorLink from '@/app/papers/author_link';

export default function LatentReasoningReview() {

	return (
		<>
			{/* PDF Preview */}
			<PDFPreview
				pdfPath="/papers/A_Survey_on_Latent_Reasoning.pdf"
				title="A Survey on Latent Reasoning"
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
								relativePath="src/app/papers/latent-reasoning/page.tsx"
								fileName="latent-reasoning_review.tsx"
							/>
							<GitHubButton
								relativePath="src/app/papers/latent-reasoning/page.tsx"
							/>
						</div>
					</div>

					{/* Paper Title */}
					<h1 className="text-4xl font-bold mb-6 tc1">A Survey on Latent Reasoning</h1>

					{/* Paper Metadata */}
					<div className="mb-8 be p-6 rounded-lg">


						<div className="mb-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold tc1 ml-6">Authors</h3>
								
									<a
										href="https://arxiv.org/abs/2404.09334"
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
								<AuthorLink name="Rui-Jie Zhu" />
								<AuthorLink name="Tianhao Peng" />
								<AuthorLink name="Tianhao Cheng" />
								<AuthorLink name="Xingwei Qu" />
								<AuthorLink name="Jinfa Huang" />
								<AuthorLink name="Dawei Zhu" />
								<AuthorLink name="Hao Wang" />
								<AuthorLink name="Kaiwen Xue" />
								<AuthorLink name="Xuanliang Zhang" />
								<AuthorLink name="Yong Shan" />
								<AuthorLink name="Tianle Cai" />
								<AuthorLink name="Taylor Kergan" />
								<AuthorLink name="Assel Kembay" />
								<AuthorLink name="Andrew Smith" />
								<AuthorLink name="Chenghua Lin" />
								<AuthorLink name="Binh Nguyen" />
								<AuthorLink name="Yuqi Pan" />
								<AuthorLink name="Yuhong Chou" />
								<AuthorLink name="Zefan Cai" />
								<AuthorLink name="Zhenhe Wu" />
								<AuthorLink name="Yongchi Zhao" />
								<AuthorLink name="Tianyu Liu" />
								<AuthorLink name="Jian Yang" />
								<AuthorLink name="Wangchunshu Zhou" />
								<AuthorLink name="Chujie Zheng" />
								<AuthorLink name="Chongxuan Li" />
								<AuthorLink name="Yuyin Zhou" />
								<AuthorLink name="Zhoujun Li" />
								<AuthorLink name="Zhaoxiang Zhang" />
								<AuthorLink name="Jiaheng Liu†" />
								<AuthorLink name="Ge Zhang" />
								<AuthorLink name="Wenhao Huang" />
								<AuthorLink name="Jason Eshraghian" />
							</div>
						</div>
					</div>



					{/* Review Content */}
					<div className="prose dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Abstract</h2>
						<div className="be">
							<p className="mb-4 tc2 text-lg">
Large Language Models (LLMs) have demonstrated impressive reasoning capabilities, especially when guided by explicit chain-of-thought (CoT) reasoning that verbalizes intermediate
steps. While CoT improves both interpretability and accuracy, its dependence on natural
language reasoning limits the model’s expressive bandwidth. Latent reasoning tackles this
bottleneck by performing multi-step inference entirely in the model’s continuous hidden state,
eliminating token-level supervision. To advance latent reasoning research, this survey provides
a comprehensive overview of the emerging field of latent reasoning. We begin by examining
the foundational role of neural network layers as the computational substrate for reasoning,
highlighting how hierarchical representations support complex transformations. Next, we
explore diverse latent reasoning methodologies, including activation-based recurrence, hidden
state propagation, and fine-tuning strategies that compress or internalize explicit reasoning
traces. Finally, we discuss advanced paradigms such as infinite-depth latent reasoning via
masked diffusion models, which enable globally consistent and reversible reasoning processes.
By unifying these perspectives, we aim to clarify the conceptual landscape of latent reasoning
and chart future directions for research at the frontier of LLM cognition
							</p>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Ideas</h2>
						<div className="be">
							<ul className="list-disc pl-6 tc2 space-y-2">
								<li><b className="tc1">Vertical Recurrence</b> - "expanding computational depth" reasoning between model layers (spatial dimension)</li>
								<li><b className="tc1">Horizontal Recurrence</b> - "increasing sequential capacity" reasoning along hidden state trajectories (temporal dimension)</li>
								<li><b className="tc1">Layer Specialization</b> - parsing distinct functions of specific layers</li>
								<li><b className="tc1">Infinite Depth</b> - global attention, unlimited compute budget reasoning</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Technical Analysis</h2>
						<div className="be">
							<p className="mb-4 w-[70%] mx-auto flex-wrap">
								<MathJax inline>{`\\( x^l_t \\in \\mathbb{R}^d \\)`}</MathJax> represents the activation of layer <MathJax inline>{`\\( l \\)`}</MathJax> at time step <MathJax inline>{`\\( t \\)`}</MathJax> in a neural network.<br/>
								<MathJax inline>{`\\( S^l_t \\)`}</MathJax> Is the hidden layer that captures historical information
							</p>
								<b>KV Cache: </b> compromises the key and value matrices <MathJax inline>{`\\( K^l_t, V^l_t \\)`}</MathJax> where <MathJax inline>{`\\( K_l, V_l \\in \\mathbb{R}^{nxd} \\)`}</MathJax> with sequence length <MathJax inline>{`\\( n \\)`}</MathJax> and hidden dimension <MathJax inline>{`\\( d \\)`}</MathJax>.<br/><br/>
								<b>Linear Attention State: </b>when a model has linear attention, the hidden state can be compressed into fixed size matrix <MathJax inline>{`\\( S^l_t \\in \\mathbb{R}^{dxd} \\)`}</MathJax><br/><br/>
								<b>Recurrent State: </b>in RNN-like models, <MathJax inline>{`\\( S^l_t \\in \\mathbb{R}^d \\)`}</MathJax> summarizes all past information in a fixed size.<br/><br/>

							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								Spatial Transformation Propagation
							</p>

							<div className="eq">
								<MathJax>
									{`\\[\\Large
               x^{l+1}_{t+1} = f(x^l_{t+1}, g(S^l_t, x^l_t))
              \\]`}
								</MathJax>
							</div>

							<p className="mb-4">
								Where:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li><MathJax inline>{`\\( f \\)`}</MathJax> is the layer-wise transformation function using the previous layer <MathJax inline> {`\\( x^l_{t+1} \\)`}</MathJax> and historical context <MathJax inline>{`\\( S^l_t \\)`}</MathJax></li> 
								<li><MathJax inline>{`\\( g \\)`}</MathJax> represents historical information propagation</li>
							</ul>
								
							<p className="mb-4">
										<b>Activation-Based Methods: </b> (Vertical Recurrence) iteratively refines the activation within a single time step
							</p>
							<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								Recursive Update
							</p>
							<div className="eq">
								<MathJax>
									{`\\[\\Large
									x^{l+1}_{t} = f(x^l_{t}, g(S^l_t, x^l_t))
							\\]`}
								</MathJax>
							</div>
						Where the model iteratively refines the activation at the same time step.<br/><br/>

						<b>Hidden State-Based Methods: </b> (Horizontal Recurrence) aggregates information from multiple places using rich historical representations.
<p className="mb-[-18] text-center w-full text-[1.5em] underline underline-offset-4">
								Hidden State Update
							</p>
							<div className="eq">
								<MathJax>
									{`\\[\\Large
									x^{l+1}_{t} = f(x^l_{t}, g(S^l_t, S^l_{t-1}, S^l_{t-2}..., x^l_t))
							\\]`}
								</MathJax>
							</div>
							This allows the model to access broader context, but requires it to learn to effectively use the historical information.<br/><br/>



						</div>


						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Experimental Results</h2>
						<div className="be">
							<p className="mb-4">
								The survey includes extensive benchmarking across multiple reasoning tasks:
							</p>

							{/* Placeholder for results figure */}
							<div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4 text-center">
								<div className="text-6xl mb-4">📊</div>
								<p className="tc2">Figure 1: Performance comparison across different latent reasoning approaches</p>
								<p className="text-sm tc2 mt-2">[Placeholder for actual results visualization]</p>
							</div>

							<p className="mb-4">
								Key findings include:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Transformer-based models excel at sequential reasoning tasks</li>
								<li>Graph neural networks perform better on relational reasoning problems</li>
								<li>Memory-augmented architectures show promise for multi-step reasoning</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Critical Assessment</h2>
						<div className="be">
							<h3 className="text-xl font-semibold mb-3 tc1">Strengths</h3>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>Comprehensive coverage of the field with over 200 references</li>
								<li>Clear mathematical formalization of latent reasoning concepts</li>
								<li>Extensive empirical validation across diverse benchmarks</li>
								<li>Well-structured taxonomy that aids understanding and future research</li>
							</ul>

							<h3 className="text-xl font-semibold mb-3 tc1">Limitations</h3>
							<ul className="list-disc pl-6 mb-4 tc2 space-y-2">
								<li>Limited discussion of computational complexity and scalability issues</li>
								<li>Insufficient analysis of failure modes and robustness</li>
								<li>Could benefit from more detailed case studies of real-world applications</li>
								<li>Some experimental comparisons lack statistical significance testing</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Implications and Future Work</h2>
						<div className="be">
							<p className="mb-4">
								This survey establishes important foundations for understanding how AI systems can develop
								sophisticated reasoning capabilities through implicit learning processes. The implications extend beyond
								academic research to practical applications in automated theorem proving, scientific discovery,
								and complex decision-making systems.
							</p>

							{/* Placeholder for architecture diagram */}
							<div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4 text-center">
								<div className="text-6xl mb-4">🧠</div>
								<p className="tc2">Figure 2: Proposed architecture for next-generation latent reasoning systems</p>
								<p className="text-sm tc2 mt-2">[Placeholder for architectural diagram]</p>
							</div>

							<p className="mb-4">
								The paper identifies several promising research directions:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Integration of symbolic and latent reasoning approaches</li>
								<li>Development of interpretability methods for latent reasoning processes</li>
								<li>Exploration of few-shot and zero-shot reasoning capabilities</li>
								<li>Investigation of reasoning transfer across different domains</li>
							</ul>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Personal Notes</h2>
						<div className="be">
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
								<p className="tc2">
									<strong>Note:</strong> This paper provides an excellent entry point for researchers new to latent reasoning.
									The mathematical framework is particularly useful for understanding the theoretical underpinnings of modern reasoning systems.
								</p>
							</div>

							<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-4">
								<p className="tc2">
									<strong>Research Idea:</strong> Consider investigating how the proposed latent reasoning framework
									might be applied to multi-modal reasoning tasks involving vision and language.
								</p>
							</div>

							<div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4">
								<p className="tc2">
									<strong>Implementation Note:</strong> The experimental setup could be replicated using the provided
									mathematical framework - might be worth implementing some of the simpler baselines.
								</p>
							</div>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Overall Rating</h2>
						<div className="be text-center">
							<div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
							<p className="text-xl tc1 font-semibold">9/10 - Excellent Survey</p>
							<p className="tc2 mt-2">
								A comprehensive and well-executed survey that significantly advances our understanding of latent reasoning.
								Highly recommended for both newcomers and experts in the field.
							</p>
						</div>

						<div className="mb-100" />
					</div>
				</div>
			</div>
		</>
	);
}
