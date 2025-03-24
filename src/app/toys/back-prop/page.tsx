'use client';

import Link from 'next/link';
import TriangleAnimation from '@/components/backgrounds/TriangleAnimation';
import { useEffect } from 'react';
import 'mathjax-full/es5/tex-mml-chtml.js'; // Import MathJax
import BackPropDemo from './BackPropDemo';
import { DownloadButton, GitHubButton } from '@/scripts/sourceButtons';
import NetworkGraph from './NetworkGraph';
import FiveLayerNetwork from './FiveLayerNetwork';

export default function BackProp() {
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
        <TriangleAnimation
          radiusRange={[300, 1200]}
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
              relativePath="src/app/toys/back-prop/page.tsx"
              fileName="back-prop_page.tsx"
            />
            <GitHubButton
              relativePath="src/app/toys/back-prop/page.tsx"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 tc1">Backpropagation Visualizer</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="tc2 text-lg">
            Understanding how backpropagation and gradients are used to train neural networks.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Introduction</h2>
          <div className="be">
            <p className="mb-4">
              Using the first or second derivative of a function to find its sequentially approximate the local extremes of a function is
              <Link href="/toys/one-step-learning-rate" className="text-blue-500 ml-[0.2em]">simple</Link>,
              but with multilayer perceptrons, as the network becomes deeper, these derivatives become harder and harder to compute.
            </p>

            <p className="mb-4">
              The most important tool used for this is <b className='tc1'>backpropagation</b> via the chain rule.
              Where gradients can be calculated for a whole layer of a network and then used as the basis to calculate the gradients of the previous layer.
            </p>
            <p className="mb-[-24] text-center w-full text-[1.5em] underline underline-offset-4">
              Chain Rule
            </p>


            <div className="eq">
              {`\\[\\Large
               f(g(x))' = f'(g(x)) \\cdot g'(x)
              \\]`}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Backpropogation</h2>
          <div className="be">
            <p className="mb-4">
              The simple MLP \(  L \circ f( \theta_3) \circ f( \theta_2 ) \circ f( \theta_1 )  ( x ) \),
              can be represented as a graph:
            </p>

            {/* Network graph visualization */}
            <div className="invert-0 dark:invert-100 bg-white/5 rounded-2xl mx-[-10]">
              <NetworkGraph />
            </div>
            <p className="mb-4">
              Where:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>\( L \) is the loss function</li>
              <li>{`\\( \\theta_i \\)`} are the weights for neuron i</li>
              <li>\( f \) is the activation function of the neuron</li>
              <li>\( g \) is a neuron without activation</li>
              <li>\( a_i \) is the output to layer \( i \)</li>
              <li>\( z_i \) is the output to layer \( i \) before activation</li>
            </ul>

            <p className="mb-4">
              First the graph is evaluated forwards, calculating the value at each layer based on x
            </p>
            <div className="eq">
              {`\\[\\Large
               a_1 = f( \\theta_1, x )
              \\]`}
              {`\\[\\Large
               a_2 = f( \\theta_2, a_1 )
              \\]`}
              {`\\[\\Large
               a_3 = f( \\theta_3, a_2 )
              \\]`}
              {`\\[\\Large
               L = L( a_3 )
              \\]`}
            </div>

            <p className="mb-4">
              and then the gradients are calculated backwards using the chain rule
            </p>
            <div className="eq" style={{ display: 'block' }}>
              <div style={{ alignSelf: "left", justifySelf: "left" }}>
                {`\\[\\Large
               \\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial a_3} \\cdot \\frac{\\partial a_3}{\\partial a_2} \\cdot \\frac{\\partial a_2}{\\partial a_1} \\cdot \\frac{\\partial a_1}{\\partial x}
              \\]`}
              </div>
              <div style={{ alignSelf: "left", justifySelf: "left" }}>
                {`\\[\\Large
               \\frac{\\partial L}{\\partial a_3} = L'( a_3 ) 
              \\]`}
              </div>
              <div style={{ alignSelf: "left", justifySelf: "left" }}>
                {`\\[\\Large
               \\frac{\\partial L}{\\partial a_2} = L'( a_3 ) \\cdot f'( \\theta_3, a_2 )
              \\]`}
              </div>
              <div style={{ alignSelf: "left", justifySelf: "left" }}>
                {`\\[\\Large
               \\frac{\\partial L}{\\partial a_1} = L'( a_3 ) \\cdot f'( \\theta_3, a_2 ) \\cdot f'( \\theta_2, a_1 )
              \\]`}
              </div>
              <div style={{ alignSelf: "left", justifySelf: "left" }}>
                {`\\[\\Large
               \\frac{\\partial L}{\\partial x} = L'( a_3 ) \\cdot f'( \\theta_3, a_2 ) \\cdot f'( \\theta_2, a_1 ) \\cdot f'( \\theta_1, x )
              \\]`}
              </div>
            </div>

            <p className="mb-4">
              Start at the loss function, updating and storing the gradients of its direct children and marking them as completed.<br />
              Then update nodes who have downstream nodes that are all marked as completed.<br />
              Repeating this iteration until all nodes are marked as completed the gradient of the loss with respect to each weight can be calculated.<br />
              This allows any graph no matter how complicated to be trained using backpropagation, as long as it has no loops, and the loss function is accessible from all nodes.
            </p>

            <p className="mb-4">
              If each neuron has activation
              <br />{`\\( \\sigma(x) = \\frac{1}{1+e^{-x}} \\)`}<span className='ml-29' /> {`\\( \\sigma'(x) = \\sigma(x) \\cdot (1 - \\sigma(x)) \\)`}
              <br /> {`\\( \L(a_3) = \\frac{1}{2} \\Sigma (y_i - a_{3i}) \\)`} <span className='ml-8' /> {`\\( \L'(a_3) = a_3 - y \\)`}
              <br />at all positions in the network:
            </p>
            <table className="eq">

              <tbody className="">
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial a_{3i} } \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( a_{3i} -y_i \\)`}</span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial \\theta_{3ij}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial a_{3i}} \\)`}</span>
                    <span style={{ color: "var(--khr)" }}> {`\\( \\frac{\\partial a_{3i}}{\\partial \\theta_{3ij}} \\)`}</span>
                    = <span style={{ color: "var(--khg)" }}>{`\\( (a_{3i}-y_i) \\)`}</span>
                    <span style={{ color: "var(--khr)" }}> {`\\( (a_{2j}) \\)`}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial a_{2i}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial a_{3}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial a_{3}}{a_{2i}}\\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( ( \\theta_{3i}) \\)`}</span>{`\\( \\)`}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial z_{2i}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial a_{2i}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial a_{2i}}{\\partial z_{2i}} \\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y \\cdot \\theta_{3i}) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\sigma'(z_{2i}) \\)`}</span>
                  </td>
                </tr>
              </tbody>
              <tbody className="">
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial \\theta^{2ij}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" >
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial z_{2i}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial z_{2i}}{\\partial \\theta^{2ij}} \\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y \\cdot \\theta_{3i} \\cdot \\sigma'(z_{2i})) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( ( a_{1j} )\\)`}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\(\\frac{\\partial L}{\\partial a_{1i}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial z_{2}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial z_{2}}{\\partial a_{1i}} \\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y \\cdot \\theta_{3} \\cdot \\sigma'(z_{2})) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( ( \\theta_{2i} ) \\)`}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial z_{1i}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial a_{1i}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial a_{1i}}{\\partial z_{1i}} \\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y \\cdot \\theta_{3} \\cdot \\sigma'(z_{2}) \\cdot \\theta_{2i} ) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( ( \\sigma'(z_{1i}) )\\)`}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap" style={{ color: "var(--khb)" }}>
                    {`\\( \\frac{\\partial L}{\\partial \\theta_{1ij}} \\)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    = <span style={{ color: "var(--khg)" }}>{`\\( \\frac{\\partial L}{\\partial z_{1i}} \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( \\frac{\\partial z_{1i}}{\\partial \\theta_{1ij}} \\)`}</span> =
                    <span style={{ color: "var(--khg)" }}>{`\\( (y \\cdot \\theta_{3} \\cdot \\sigma'(z_{2}) \\cdot \\theta_{2i} \\cdot \\sigma'(z_{1i}) ) \\)`}</span><span style={{ color: "var(--khr)" }}>{`\\( ( x_{j} )\\)`}</span>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">CNN Classifier</h2>
          <div className="be">
            <p className="mb-4">
              When attempting to learn a finite set of labels, a <b className='tc1'> Classifier</b> with <em>one-hot</em> encoding can be used.
            </p>
            <p className="mb-[-24] text-center w-full text-[1.5em] underline underline-offset-4">
              One Hot Encoding
            </p>
            <div className="eq">
              {`\\[\\Large
               y = [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ]
              \\]`}
            </div>
            <p className="mb-4">
              Where the index of the 1 is the label of the image.<br />
              This uses
            </p>

            <p className="mb-[-24] text-center w-full text-[1.5em] underline underline-offset-4">
              Cross Entropy Loss
            </p>
            <div className="eq">
              {`\\[\\Large
               L(a_i, y) = - \\Sigma y_i \\cdot log( a_i ) = -log( a_* )
              \\]`}
            </div>
            <p className="mb-4">
              Where:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>\( y_i \) is the one hot vector encoding of the correct label</li>
              <li>\( a_i \) is the models array of probability estimations, the last layer of the MLP</li>
              <li>\( a_* \) is the estimate at the correct label</li>
            </ul>
            <p className="mb-4">
              This rewards the model for picking the correct image, but does not directly penalize it for picking the wrong ones.
            </p>

            <p className="mb-4">
              The final layer of the classifier is a
            </p>
            <p className="mb-[-24] text-center w-full text-[1.5em] underline underline-offset-4">
              Softmax Activation
            </p>
            <div className="eq">
              {`\\[\\Large
               \\sigma(z_i) = \\frac{e^{z_i}}{ \\Sigma_{j=1}^n e^{z_j} }
              \\]`}
            </div>

            <p className="mb-4">
              Which elevates the highest value and suppresses the others, ensuring the sum of probability is 1.
              This ensures the modes does not just output high estimates for every class.
            </p>
            <p className="mb-4">
              When these two are combined, it yields a simpler equation for the final two layers of the classifier.
            </p>
            <div className="eq">
              {`\\[\\Large
               L( \\sigma ( z_i) , y ) = -log( \\sigma ( z_* ) ) = -z_* + log( \\Sigma e^{z_i} )
              \\]`}
              {`\\[\\Large
               \\frac{\\partial L}{\\partial z_i} = -y_i + \\sigma( z_i )
              \\]`}
            </div>

            Combining this with a 1D convolutional neural network for signal processing yields the network equation:
            <div className="eq">
              {`\\[\\Large
               L \\circ \\sigma \\circ p \\circ c( \\theta_1 )  ( x ) = -y_* + log( \\Sigma e^{z_i} )
              \\]`}
            </div>
            <p className="mb-4">
              Where:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>\( p \) is average pooling with stride 2</li>
              <li>\( c \) is a 1D 0-pad convolution with a kernel size of 3</li>
              <li>\( \\theta_1 \) is the weights for the convolution (size 3)</li>
              <li>\( x \) is input of size 4</li>
            </ul>

            <p className="mb-4">
              Here's what this network looks like:
            </p>

            <div className="invert-0 dark:invert-100">
              <FiveLayerNetwork />
            </div>

          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Interactive Demonstration</h2>
          <div className="be min-w-fill">
            <BackPropDemo />
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Key Concepts Explored</h2>
          <div className="be">
            <ul className="list-disc pl-6 tc2 space-y-2">
              <li><b className="tc1">Chain Rule of Calculus</b> - The mathematical foundation that allows gradients to flow backward</li>
              <li><b className="tc1">Gradient Descent Optimization</b> - How networks use gradients to adjust weights</li>
              <li><b className="tc1">Error Calculation and Propagation</b> - Computing errors at the output and distributing them backward</li>
              <li><b className="tc1">Weight and Bias Updates</b> - The process of adjusting parameters to minimize loss</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 tc1">Takeaways</h2>
          <ul className="list-disc pl-6 tc2 space-y-4">
            <li>Backpropagation enables efficient training by computing all gradients in a single forward and backward pass</li>
            <li>The algorithm can face challenges like vanishing or exploding gradients in deep networks</li>
            <li>Modern variants and optimizations of backpropagation form the basis of all deep learning systems</li>
          </ul>
          <div className="mb-100" />
        </div>
      </div>
    </div>
  );
}
