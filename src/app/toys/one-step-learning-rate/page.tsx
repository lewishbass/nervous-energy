'use client';

import Link from 'next/link';
import SquareAnimation from '@/components/backgrounds/SquareAnimation';
import { useEffect } from 'react';
import 'mathjax-full/es5/tex-mml-chtml.js'; // Import MathJax
import OneStepDemo from './OneStepDemo';

export default function OneStepLearningRate() {
	useEffect(() => {

		// @ts-expect-error typescript doesn't know about mathjax
		if (typeof window !== 'undefined' && window.MathJax) {
			// @ts-expect-error typescript doesn't know mathjax
			window.MathJax.typeset();
		}
	}, []);// add [] dependency to run only once

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
				<div className="mb-6">
					<Link
						href="/toys"
						className="inline-flex items-center px-4 py-2 opacity-60 backdrop-blur-sm rounded-lg tc4 hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: "var(--khg)" }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Toys
					</Link>
				</div>

				<h1 className="text-4xl font-bold mb-6 tc1">One Step Learning Rate</h1>

				<div className="prose dark:prose-invert max-w-none">
					<p className="tc2 text-lg">
						Understanding optimal learning rates for quadratic loss functions in neural networks.
					</p>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Problem</h2>
					<p className="be"> A hypothetical one dimensional neural network where the loss function is a <b className="tc1">quadratic</b> function of the weights:
						<div className="eq">
							{`\\[\\Large
								L(w): \\mathbb{R} \\rightarrow \\mathbb{R} \\
							\\]`}
						</div>
						And learning update:
						<div className="eq">
							{`\\[\\Large
								w_{t+1} = w_t - \\frac{dL}{dw}(w_t) \\
							\\]`}
						</div>
						Assuming that there is a single global extreme \(f(w_*)\), how do you determine the optimal learning rate:
						<div className="eq">
							{`\\[ \\Large \\quad \\eta_* \\text{st:} \\quad w_t+ \\eta_* \\frac{dL}{dw}(w_t) = w_* \\]`}
						</div>
						that allows you to reach the global extreme in one step?
					</p>
					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Solution</h2>
					<p className="be">
						<p className="mb-4">
							The loss function is quadratic, so any derivative beyond the second is zero.
						</p>
						<p className="mb-4">
							This means that the <b className="tc1">Taylor Expansion</b> of the derivative of the loss function at point \( w_* \) can be written using only two terms:
							<div className="eq">
								{`\\[\\Large
									\\frac{dL}{dw}(w_*) = \\frac{dL}{dw}(w_t) + \\frac{d^2L}{dw^2}(w_t)(w_* - w_t)
								\\]`}
							</div>
							\( w_* \) is a <b className="tc1">unique</b> maximum on a smooth curve, so the first derivative at that point is zero:
							<div className="eq">
								{`\\[\\Large
									\\frac{dL}{dw}(w_*) = 0
								\\]`}
							</div>
							substituting this into the <b className="tc1">Taylor Expansion</b>, yields:
							<div className="eq">
								{`\\[\\Large
									0 = \\frac{dL}{dw}(w_t) + \\frac{d^2L}{dw^2}(w_t)(w_* - w_t)
								\\]`}
							</div>
							and solving for \( w_* \):
							<div className="eq">
								{`\\[\\Large
									w_* = w_t -\\frac{\\frac{dL}{dw}(w_t)}{\\frac{d^2L}{dw^2}(w_t)}
								\\]`}
							</div>
							which can be written in terms of the original learning step:
							<div className="eq">
								{`\\[\\Large
									w_* = w_t - \\frac{1}{\\frac{d^2L}{dw^2}(w_t)} \\frac{dL}{dw}(w_t)
								\\]`}
							</div>
							<div className="eq">
								{`\\[\\Large
									w_* = w_t - \\eta \\frac{dL}{dw}(w_t)
								\\]`}
							</div>
							<div className="eq">
								{`\\[\\Large
									\\eta = \\frac{1}{\\frac{d^2L}{dw^2}(w_t)}
								\\]`}
							</div>
						</p>
						It can be assumed that {`\\( \\frac{d^2L}{dw^2}(w_t) \\)`} is not zero.
						If it is, then the equation is either monotonic or constant, and does not have a global extreme.

					</p>
					<p className="be">
						If L is a field over a vector space:
						<div className="eq">
							{`\\[\\Large L: \\mathbb{R}^n \\rightarrow \\mathbb{R} \\]`}
						</div>
						<p className="mb-4">
							the math is slightly more complicated, but the same principle applies.
						</p>
						<p className='mb-4'>
							The <b className="tc1">Taylor Expansion</b> is truncated at the second term under the assumption that
							each term of the loss function is a component of at most two dimensions.
							<div className="eq">
								{`\\[\\Large
									\\nabla L (w_*) = \\nabla L(w_t) + H \\big[L(w_t) \\big] (w_* - w_t)
								\\]`}
							</div>
							Where \( H \) is the <b className="tc1">Hessian</b> of the loss function.
						</p>
						<p className="mb-4">
							The same assumption can be made about the gradient at the local extreme:

							<div className="eq">
								{`\\[\\Large \\nabla L = \\overrightarrow{0} \\]`}
							</div>
							and substituted in to the <b className="tc1">Taylor Expansion</b>:
							<div className="eq">
								{`\\[\\Large
									\\overrightarrow{0} = \\nabla L(w_t) + H \\big[L(w_t) \\big] (w_* - w_t)
								\\]`}
							</div>
							<div className="eq">
								{`\\[\\Large
									w_* = w_t - H^{-1} \\big[L(w_t) \\big] \\nabla L(w_t)
								\\]`}
							</div>
							<div className="eq">
								{`\\[\\Large	
									\\eta = H^{-1} \\big[L(w_t) \\big]
								\\]`}
							</div>

							If any of the eigenvalues of {`\\( H^{-1} \\)`} are 0,
							the directional derivative of its corresponding eigenvector is 0.
							This means that the loss function is either constant or monotonic in that direction,
							and does not have a global extreme.
						</p>
						<p>
							Therefore \( H \) has a full set of non-zero eigenvalues and is invertible.
						</p>
					</p>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
					<div className="be">
						<div className="">
							<OneStepDemo />
						</div>
					</div>

					<h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Concepts</h2>
					<ul className="list-disc pl-6 tc2">
						<li>Functions rarely are only second order, but incorporating more derivatives into gradient descent can seed up convergence </li>
						<li>The cost of calculating second order derivatives for fields grows with the dimension</li>
						<li>The closer a function is to quadratic, the better this works</li>
						<li>Computing the Hessian can be the most computationally expensive part of this</li>
					</ul>
					<div className='mb-100'/>
					
				</div>
			</div>
		</div>
	);
}
