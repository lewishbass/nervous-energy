'use client';

import Link from 'next/link';
import SquareAnimation from '@/components/backgrounds/SquareAnimation';
import OneStepDemo from './OneStepDemo';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax } from 'better-react-mathjax';

export default function OneStepLearningRate() {
	return (
		<div className="relative min-h-screen">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<SquareAnimation
					radiusRange={[80, 160]}
					seed={456}
					style={{ opacity: 0.5 }}
				/>
			</div>

			{/* Content with slight transparency for background visibility */}
			<div className="relative z-10 p-6 max-w-4xl mx-auto backdrop-blur-sm min-h-screen tc2">
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
							relativePath="src/app/toys/one-step-learning-rate/page.tsx"
							fileName="one-step-learning-rate_page.tsx"
						/>
						<GitHubButton
							relativePath="src/app/toys/one-step-learning-rate/"
						/>
					</div>
				</div>

				<h1 className="text-4xl font-bold mb-6 tc1">One Step Learning Rate</h1>

				<div className="prose dark:prose-invert max-w-none">
					<p className="tc2 text-lg">
						Using taylor expansions to increase the speed of convergence in gradient descent.
					</p>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Problem</h2>
					<p className="be"> A hypothetical one dimensional neural network where the loss function is a <b className="tc1">quadratic</b> function of the weights:
						<div className="eq">
							<MathJax>
							{`\\[\\Large
								L(w): \\mathbb{R} \\rightarrow \\mathbb{R} \\
							\\]`}
							</MathJax>
						</div>
						And learning update:
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
					</p>
					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Solution</h2>
					<p className="be">
						<p className="mb-4">
							The loss function is quadratic, so any derivative beyond the second is zero.
						</p>
						<p className="mb-4">
							This means that the <b className="tc1">Taylor Expansion</b> of the derivative of the loss function at point <MathJax inline>{`\\( w_* \\)`}</MathJax> can be written using only two terms:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									\\frac{dL}{dw}(w_*) = \\frac{dL}{dw}(w_t) + \\frac{d^2L}{dw^2}(w_t)(w_* - w_t)
								\\]`}
								</MathJax>
							</div>
							<MathJax inline>{`\\( w_* \\)`}</MathJax> is a <b className="tc1">unique</b> maximum on a smooth curve, so the first derivative at that point is zero:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									\\frac{dL}{dw}(w_*) = 0
								\\]`}
								</MathJax>
							</div>
							substituting this into the <b className="tc1">Taylor Expansion</b>, yields:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									0 = \\frac{dL}{dw}(w_t) + \\frac{d^2L}{dw^2}(w_t)(w_* - w_t)
								\\]`}
								</MathJax>
							</div>
							and solving for <MathJax inline>{`\\( w_* \\)`}</MathJax>:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									w_* = w_t -\\frac{\\frac{dL}{dw}(w_t)}{\\frac{d^2L}{dw^2}(w_t)}
								\\]`}
								</MathJax>
							</div>
							which can be written in terms of the original learning step:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									w_* = w_t - \\frac{1}{\\frac{d^2L}{dw^2}(w_t)} \\frac{dL}{dw}(w_t)
								\\]`}
								</MathJax>
							</div>
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									w_* = w_t - \\eta \\frac{dL}{dw}(w_t)
								\\]`}
								</MathJax>
							</div>
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									\\eta = \\frac{1}{\\frac{d^2L}{dw^2}(w_t)}
								\\]`}
								</MathJax>
							</div>
						</p>
						It can be assumed that <MathJax inline>{`\\( \\frac{d^2L}{dw^2}(w_t) \\)`}</MathJax> is not zero.
						If it is, then the equation is either monotonic or constant, and does not have a global extreme.

					</p>
					<p className="be">
						If L is a field over a vector space:
						<div className="eq">
							<MathJax>
							{`\\[\\Large L: \\mathbb{R}^n \\rightarrow \\mathbb{R} \\]`}
							</MathJax>
						</div>
						<p className="mb-4">
							the math is slightly more complicated, but the same principle applies.
						</p>
						<p className='mb-4'>
							The <b className="tc1">Taylor Expansion</b> is truncated at the second term under the assumption that
							each term of the loss function is a component of at most two dimensions.
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									\\nabla L (w_*) = \\nabla L(w_t) + H \\big[L(w_t) \\big] (w_* - w_t)
								\\]`}
								</MathJax>
							</div>
							Where <MathJax inline>{`\\( H \\)`}</MathJax> is the <b className="tc1">Hessian</b> of the loss function.
						</p>
						<p className="mb-4">
							The same assumption can be made about the gradient at the local extreme:

							<div className="eq">
								<MathJax>
								{`\\[\\Large \\nabla L = \\overrightarrow{0} \\]`}
								</MathJax>
							</div>
							and substituted in to the <b className="tc1">Taylor Expansion</b>:
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									\\overrightarrow{0} = \\nabla L(w_t) + H \\big[L(w_t) \\big] (w_* - w_t)
								\\]`}
								</MathJax>
							</div>
							<div className="eq">
								<MathJax>
								{`\\[\\Large
									w_* = w_t - H^{-1} \\big[L(w_t) \\big] \\nabla L(w_t)
								\\]`}
								</MathJax>
							</div>
							<div className="eq">
								<MathJax>
								{`\\[\\Large	
									\\eta = H^{-1} \\big[L(w_t) \\big]
								\\]`}
								</MathJax>
							</div>

							If any of the eigenvalues of <MathJax inline>{`\\( H^{-1} \\)`}</MathJax> are 0,
							the directional derivative of its corresponding eigenvector is 0.
							This means that the loss function is either constant or monotonic in that direction,
							and does not have a global extreme.
						</p>
						<p>
							Therefore <MathJax inline>{`\\( H \\)`}</MathJax> has a full set of non-zero eigenvalues and is invertible.
						</p>
					</p>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
					<div className="be min-w-full">
						<div className="min-w-full">
							<OneStepDemo />
						</div>
					</div>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Takeaways</h2>
					<ul className="list-disc pl-6 tc2 space-y-4">
						<li>As the magnitude of the derivatives beyond the second increase, the estimation becomes less accurate</li>
						<li>Functions rarely are only second order, but incorporating more derivatives into gradient descent can speed up convergence </li>
						<li>The cost of calculating second order derivatives for fields grows with the dimension</li>
						<li>Computing the Hessian and its inverse, can be more expensive than multiple steps of first gradient descent</li>
					</ul>
					<div className='mb-100'/>
					
				</div>
			</div>
		</div>
	);
}
