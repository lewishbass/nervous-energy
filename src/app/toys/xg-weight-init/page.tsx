'use client';

import Link from 'next/link';
import CircleAnimation from '@/components/backgrounds/CircleAnimmation';
//import { useEffect } from 'react';
//import 'mathjax-full/es5/tex-mml-chtml.js'; // Import MathJax
import XGWeightDemo from './XGWeightDemo';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export default function XGWeightInit() {
  //  useEffect(() => {
  //
  //    // @ts-expect-error typescript doesn't know about mathjax
  //    if (typeof window !== 'undefined' && window.MathJax) {
  //      // @ts-expect-error typescript doesn't know mathjax
  //      window.MathJax.typeset();
  //    }
  //  }, []);// add [] dependency to run only once

  return (
    <div className="relative min-h-screen">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10 invert dark:invert-0">
        <CircleAnimation
          radiusRange={[10, 800]}
          seed={123}
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
              relativePath="src/app/toys/xg-weight-init/page.tsx"
              fileName="XGWeight_page.tsx"
            />
            <GitHubButton
              relativePath="src/app/toys/xg-weight-init/"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 tc1">XG Weight Initialization</h1>
        <MathJaxContext>
        <div className="prose dark:prose-invert max-w-none">
          <p className="tc2 text-lg">
            Explore how to initialize <b>Neural Network</b> weights to avoid gradient explosion/vanishing.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Problem</h2>
          <div className="be">
            As <b className="tc1">Neural Network</b> grow deeper, if the weights are not properly initialized

            <ul className="list-disc pl-6 mt-2">
              <li>Vanishing gradients</li>
              <li>Exploding gradients</li>
              <li>Slow convergence</li>
              <li>Getting stuck in poor local minima</li>
            </ul>
            In their paper
            <p className="my-4 text-center">
              <a
                href="http://proceedings.mlr.press/v9/glorot10a/glorot10a.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="lnk"
              >
                Understanding the difficulty of training deep feedforward neural networks
              </a>
            </p>
            <p className='mb-4'>
              Xavier Glorot and Yoshua Bengio show that initializing the weights so that the distribution of the activations and gradients remain constant through the layers helps to alleviate these issues.
            </p>
            <p className="mb-4">
              Here we show that the <b className="tc1">Xavier/Glorot</b> weight initialization for a network
              with <em>tanh</em> activation is
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                  W \\sim N \\bigg( 0, \\frac{1}{n_{l}} \\bigg)
                \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              where <MathJax inline>{`\\(n_l\\)`}</MathJax> is the number of inputs in layer <MathJax inline>{`\\(l\\)`}</MathJax>
            </p>

          </div>
          {/*---------- SOlUTION ----------*/}
          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Solution</h2>
          <div className="be">
            <p className="mb-4">
              For the Xavier/Glorot initialization, the goal is to keep the variance of the activation and gradient of each layer the same:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(y) = \\text{Var}(x)
              \\]`}
              </MathJax>
            </div>
            and:
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(dy) = \\text{Var}(dx)
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              A single dense layer with the <em>tanh</em> activation function can be written as:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                y = tanh(Wx)
              \\]`}
              </MathJax>
            </div>

            <p className="mb-4">
              We assume that the input <MathJax inline>{`\\(x\\)`}</MathJax> is zero-centered and has unit variance:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(x) = 1, E[x] = 0
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              For the case that the network has a linear response function, ant the bias are incorporated into the input vector.
            </p>
            <p className="mb-4">
              Considering each neuron and observation independently, with the weight vector <MathJax inline>{`\\( w \\)`}</MathJax> and observation <MathJax inline>{`\\( x \\)`}</MathJax> the output variance is:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(y) = \\text{Var}(wx) = \\text{Var}( \\Sigma_{i} w_i x_i )
              \\]`}
              </MathJax>
            </div>
            Since the weights and inputs are <b className="tc1">independently distributed</b>, the variance of the sum is the sum of the variances:
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}( \\Sigma w_i x_i ) = \\Sigma \\text{Var}(w_i x_i)
              \\]`}
              </MathJax>
            </div>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\Sigma \\text{Var}(w_i x_i) = \\Sigma E[w_i^2 x_i^2]-E[w_i x_i]^2
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              <MathJax inline>{`\\( w_i \\)`}</MathJax> and <MathJax inline>{`\\( x_i \\)`}</MathJax> are <b className="tc1">independent</b> and zero-centered, so their expectations are separable and zero:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                E[w_i x_i]^2 = E[w_i]^2 E[x_i]^2 = 0
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              <MathJax inline>{`\\( x^2 \\)`}</MathJax> and <MathJax inline>{`\\( w^2 \\)`}</MathJax> are also <b className="tc1">independent</b>:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                E[w_i^2 x_i^2] = E[w_i^2] E[x_i^2] = \\text{Var}(w_i) \\text{Var}(x_i)
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              Putting it back together:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(y) = \\Sigma \\text{Var}(w_i) \\text{Var}(x_i) = n_l \\text{Var}(w) \\text{Var}(x)
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              Setting <MathJax inline>{`\\(\\text{Var}(x)\\)`}</MathJax> and <MathJax inline>{`\\(\\text{Var}(y)\\)`}</MathJax> equal to each other:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(y) = \\text{Var}(x)
              \\]`}
              </MathJax>
            </div>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(W) = \\frac{\\text{Var}(y)}{n_l\\text{Var}(x)} = \\frac{1}{n_l}
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              The same can be done for the gradient resulting in the layer-wise initialization:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(W) = \\frac{1}{n_{out}}
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              where the compromise is to use the average of the input and output:
            </p>
            <div className="eq">
              <MathJax>
              {`\\[\\Large
                \\text{Var}(W) = \\frac{1}{n_{in} + n_{out}}
              \\]`}
              </MathJax>
            </div>
            <p className="mb-4">
              The <MathJax inline>{`\\( tanh \\)`}</MathJax> activation function does not have the same properties, but it <b className='tc1'>behaves</b> similar to linearly near the origin, so its effects are negligible.
            </p>


          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
          <div className="be">

            <p className="mb-4">Experiment with different weight initialization techniques and observe their effects on neural network training:</p>
            <XGWeightDemo />
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Techniques Explored</h2>
          <div className="be">
            <ul className="list-disc pl-6">
              <li><b className="tc1">Xavier/Glorot Initialization</b> - Designed for layers with linear activations</li>
              <li><b className="tc1">He Initialization</b> - Optimized for ReLU activation functions</li>
              <li><b className="tc1">Random Normal/Uniform Initialization</b> - Traditional approaches with various drawbacks</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Takeaways</h2>
          <ul className="list-disc pl-6 tc2 space-y-4">
            <li>Initializing with <b className='tc1'>low variance</b> causes the activations to <b className="tc1">contract</b> towards the center, mapping from a large domain to a small one.<br></br>
              This means that <b className="tc1">LARGE</b> movements at the first layer have <sub className="tc1"> small </sub> effects on the results, or vanishing gradients.</li>
            <li>The opposite effect is true with  <b className='tc1'>high variance</b>, causing the activations to  <b className='tc1'>expand</b>, leading to exploding gradients</li>
            <li><em className="tc1">Xavier/Glorot</em> initialization leads to a more stable variance across all layers, but is still susceptible to dramatic changes in layer sizes</li>
          </ul>
          <div className='mb-100' />
          </div>
        </MathJaxContext>
      </div>
    </div>
  );
}
