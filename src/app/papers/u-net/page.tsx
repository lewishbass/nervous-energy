// Unet paper review page

'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax } from 'better-react-mathjax';
import PDFPreview from '@/app/papers/pdf_preview';
import AuthorLink from '@/app/papers/author_link';
import PaperLink from '@/components/links/paper_link';
import styles from './page.module.css';

export default function UNetReview() {

	return (
		<>
			{/* PDF Preview */}
			<PDFPreview
				pdfPath="/papers/U-Net.pdf"
				title="U-Net: Convolutional Networks for Biomedical Image Segmentation"
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
								relativePath="src/app/papers/u-net/page.tsx"
								fileName="u-net_review.tsx"
							/>
							<GitHubButton
								relativePath="src/app/papers/u-net/page.tsx"
							/>
						</div>
					</div>

					{/* Paper Title */}
					<h1 className="text-4xl font-bold mb-6 tc1">U-Net: Convolutional Networks for Biomedical Image Segmentation</h1>

					{/* Paper Metadata */}
					<div className="mb-8 be p-6 rounded-lg">
						<div className="mb-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold tc1 ml-6">Authors</h3>
								
									<a
										href="https://arxiv.org/pdf/1505.04597"
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
								<AuthorLink name="Olaf Ronneberger" url=""/>
								<AuthorLink name="Philipp Fischer" url=""/>
								<AuthorLink name="Thomas Brox" url=""/>
							</div>
						</div>
					</div>

					{/* Review Content */}
					<div className="prose dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Abstract</h2>
						<div className="be">
							<p className="mb-4 tc2 text-lg">
								This paper demonstrates a symmetric contracting and expanding convolutional network architecture for the ISBI cell tracking challenge 2015.
								This challenge tests the ability to segment microscopic images of cells.
								It focuses on using data augmentation to effectively train a deep network on fewer samples.
							</p>
						</div>

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Ideas</h2>
						<div className="be">
							some text <PaperLink title="VideoGPT" url="https://videodirectorgpt.github.io/" pdfPath="/papers/VideoDirectorGPT.pdf" arxivId='2309.15091' preferredPreview='arxiv' /> more text
							
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

						<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">References</h2>
						<div className={` ${styles.references}`}>
							<ol className="list-decimal pl-6 space-y-3 tc2">
								<li>
									<PaperLink title="Deep Neural Networks Segment Neuronal Membranes in Electron Microscopy Images" preferredPreview="pdf" pdfPath="DeepSegmentation.pdf" url="https://papers.nips.cc/paper_files/paper/2012/hash/459a4ddcb586f24efd9395aa7662bc7c-Abstract.html" />
									<br />Ciresan, D.C., Gambardella, L.M., Giusti, A., Schmidhuber, J.
								</li>
								<li>
									<PaperLink title="Discriminative unsupervised feature learning with convolutional neural networks" arxivId="1406.6909" preferredPreview="arxiv" />
									<br />Dosovitskiy, A., Springenberg, J.T., Riedmiller, M., Brox, T.
								</li>
								<li>
									<PaperLink title="Rich feature hierarchies for accurate object detection and semantic segmentation" arxivId="1311.2524" preferredPreview="arxiv" /> 
									<br />Girshick, R., Donahue, J., Darrell, T., Malik, J.
								</li>
								<li>
									<PaperLink title="Hypercolumns for object segmentation and fine-grained localization" arxivId="1411.5752" preferredPreview="arxiv" />
									<br />Hariharan, B., Arbelez, P., Girshick, R., Malik, J.
								</li>
								<li>
									<PaperLink title="Delving deep into rectifiers: Surpassing human-level performance on imagenet classification" arxivId="1502.01852" preferredPreview="arxiv" />
									<br />He, K., Zhang, X., Ren, S., Sun, J.
								</li>
								<li>
									<PaperLink title="Caffe: Convolutional architecture for fast feature embedding" arxivId="1408.5093" preferredPreview="arxiv" />
									<br />Jia, Y., Shelhamer, E., Donahue, J., Karayev, S., Long, J., Girshick, R., Guadarrama, S., Darrell, T.
								</li>
								<li>
									<PaperLink title="Imagenet classification with deep convolutional neural networks" url="https://dl.acm.org/doi/10.1145/3065386" pdfPath="ImageNet.pdf" preferredPreview="pdf" />
									<br />Krizhevsky, A., Sutskever, I., Hinton, G.E.
								</li>
								<li>
									<PaperLink title="Backpropagation applied to handwritten zip code recognition" url="https://ieeexplore.ieee.org/document/6795724" pdfPath="BackpropZipCode.pdf" preferredPreview="pdf" />
									<br />LeCun, Y., Boser, B., Denker, J.S., Henderson, D., Howard, R.E., Hubbard, W., Jackel, L.D.
								</li>
								<li>
									<PaperLink title="Fully convolutional networks for semantic segmentation" arxivId="1411.4038" preferredPreview="arxiv" />
									<br />Long, J., Shelhamer, E., Darrell, T.
								</li>
								<li>
									<PaperLink title="A benchmark for comparison of cell tracking algorithms" pdfPath="CellTrackingBenchmark.pdf" url="https://academic.oup.com/bioinformatics/article/30/11/1609/283435?login=false" preferredPreview="pdf" />
									<br />Maska, M., (...), de Solorzano, C.O.
								</li>
								<li>
									<PaperLink title="Image segmentation with cascaded hierarchical models and logistic disjunctive normal networks." pdfPath="CascadingImageSegmentation.pdf" url="https://ieeexplore.ieee.org/document/6751380/" preferredPreview="pdf" />
									<br />Seyedhosseini, M., Sajjadi, M., Tasdizen, T.
								</li>
								<li>
									<PaperLink title="Very deep convolutional networks for large-scale image recognition" arxivId="1409.1556" preferredPreview="arxiv" />
									<br />Simonyan, K., Zisserman, A.
								</li>
								<li>
									<PaperLink title="Cell Tracking Challenge" url="http://www.codesolorzano.com/celltrackingchallenge/Cell_Tracking_Challenge/Welcome.html" preferredPreview="url" />
								</li>
								<li>
									<PaperLink title="EM Segmentation Challenge" url="http://brainiac2.mit.edu/isbi_challenge/" preferredPreview="url" />
								</li>
							</ol>
						</div>

						<div className="mb-100" />
					</div>
				</div>
			</div>
		</>
	);
}