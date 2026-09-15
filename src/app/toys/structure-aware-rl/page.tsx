'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaExpandAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { LectureTemplate } from '@/app/classes/python-automation/lectures/LectureTemplate';
import { LectureEquation } from '@/app/classes/python-automation/lectures/lecture-components/LectureEquation';
import '@/app/classes/python-automation/lectures/lecture.css';
import '@/styles/buttons.css';
import NetworkToy from './network-toy';
import { createExampleNetwork, TopologyType } from './example-network';

const TOPOLOGY_OPTIONS: { type: TopologyType; label: string }[] = [
	{ type: 'knn', label: 'K-Nearest Neighbors' },
	{ type: 'bigSmall', label: 'Big-Small World' },
	{ type: 'directedRing', label: 'Directed Ring' },
	{ type: 'bottleneck', label: 'Bottleneck' },
	{ type: 'parallelHighways', label: 'Parallel Highways' },
];

export default function StructureAwareRLPage() {
	const [slideMode, setSlideMode] = useState(false);
	const [network] = useState(() => createExampleNetwork());
	const [structureTopology, setStructureTopology] = useState<TopologyType>('knn');
	const [structureNetwork, setStructureNetwork] = useState(() => createExampleNetwork('knn'));

	const handleTopologyChange = (type: TopologyType) => {
		setStructureTopology(type);
		setStructureNetwork(createExampleNetwork(type));
	};

	const handleEnterSlideMode = () => {
		setSlideMode(true);
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
	};

	const handleExitSlideMode = () => {
		if (document.exitFullscreen && document.fullscreenElement) {
			document.exitFullscreen();
		}
		setSlideMode(false);
	};


	// exit slide mode when exiting fullscreen
	useEffect(() => {
		const handleFullscreenChange = () => {
			if (!document.fullscreenElement) {
				setSlideMode(false);
			}
		};
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	}, []);

	return (
		<MathJaxContext>
		<div className="max-w-4xl w-full relative mx-auto">
			{!slideMode && (
				<div className="mb-6 flex justify-between items-center px-6 pt-6">
					<Link
						href="/toys"
						className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
						style={{ background: 'var(--khg)' }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Toys
					</Link>
				</div>
			)}

			<div className="sticky top-0 right-1 float-right flex flex-row items-center justify-end gap-2 z-20 mr-6 mt-6">
				<div onClick={handleEnterSlideMode} className="hover:opacity-60 transition-opacity duration-200 tc1 cursor-pointer">
					<FaExpandAlt className="w-5.5 h-5.5 tc1" />
				</div>
				{slideMode && (
					<div onClick={handleExitSlideMode} className="hover:opacity-60 transition-opacity duration-200 tc1 cursor-pointer">
						<IoMdClose className="w-8 h-8 tc1" />
					</div>
				)}
			</div>

			<LectureTemplate displayMode={slideMode ? 'slideshow' : 'scrollable'} className="px-6 pb-6" exitFSCallback={handleExitSlideMode}>
				{/* Title */}
				<section className="lecture-section mini-scroll">
					<h2 className="tc1 lecture-big-title">Structure-Aware Reinforcement Learning</h2>
				</section>

				{/* About Me */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">About Me</h3>
					<div className="lecture-header-decorator" />
					<div className="flex flex-row w-full justify-between">

						<div className="grow">
							<p className="lecture-paragraph lecture-bold lecture-big lecture-underline w-[60%] mt-5 mb-2">Education</p>
							<table className="lecture-table">
								<tbody>
									<tr className="lecture-table-row" style={{ borderBottom: 'none' }}>
										<td className="lecture-table-cell lecture-bold">BS Computer Engineering</td>
										<td className="lecture-table-cell opacity-50">Virginia Tech</td>
									</tr>
									<tr className="lecture-table-row" style={{ borderBottom: 'none' }}>
										<td className="lecture-table-cell lecture-bold">BS Mathematics</td>
										<td className="lecture-table-cell opacity-50">Virginia Tech</td>
									</tr>
									<tr className="lecture-table-row" style={{ borderBottom: 'none' }}>
										<td className="lecture-table-cell lecture-bold">MS Computer Engineering</td>
										<td className="lecture-table-cell opacity-50">Virginia Tech</td>
									</tr>
								</tbody>
							</table>
							<p className="lecture-paragraph lecture-bold lecture-big lecture-underline w-[60%] mt-5 mb-2">Experience</p>
							<ul className="list-inside tc2 space-y-1 ml-4">
								<li className="lecture-list-item-card">Chemistry ML <span className="opacity-50">(predicting solvation in proteins)</span></li>
								<li className="lecture-list-item-card">Introduction to Python Instructor <Link className="cursor-pointer opacity-50" href="/classes/python-automation?tab=syllabus">(HCPS)</Link></li>
							</ul>
							<p className="lecture-paragraph lecture-bold lecture-big lecture-underline w-[60%] mt-5 mb-2">Interests</p>
							<ul className="list-inside tc2 space-y-1 ml-4">
								<li className="lecture-list-item-card">Swimming</li>
								<li className="lecture-list-item-card">Woodworking</li>
							</ul>
						</div>
						<div className="w-[30%] self-center text-center rounded-2xl bg3 overflow-hidden float-right ml-6 mb-4 ">
							<Image src="/images/pets/nutmeg_c.jpg" alt="Nutmeg" width={400} height={400} className="w-full h-auto" />
							<div className="text-[0.9em] text-gray-500 m-2 lecture-caption">Nutmeg</div>
						</div>
					</div>

				</section>

				{/* Example Application */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">Motivating Example</h3>
					<div className="lecture-header-decorator" />
					<p className="lecture-paragraph lecture-bold lecture-big lecture-underline w-[60%] mt-5 mb-2">Packet Routing</p>
					<ul className="lecture-list">
						<li className="lecture-list-item-card lecture-text">
							<span className="lecture-bold">stationary environment</span><br />
							transitions are deterministic for this example<br />
							rewards (routing traffic) can be enabled/disabled to observe ideal vs actual performance</li>
						<li className="lecture-list-item-card lecture-text">
							<span className="lecture-bold">UNISOFT features</span><br />
							since packets spawn randomly, the features of the initial conditions span the feature space
						</li>
						<li className="lecture-list-item-card lecture-text">
							<span className="lecture-bold">structure dependent strategy</span><br />
							networks have a strategy inherit to their structure<br />
							the models is unable to directly observe the network, and can only infer structure through trial and error

						</li>
					</ul>
				</section>

				{/* ML Toy Environment Demo */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">Toy Environment</h3>
					<div className="lecture-header-decorator" />
					<p className="lecture-paragraph">A packet routing toy for learning to navigate networks<br />It consists of: </p>
					<ul className="lecture-list">
						<li className="lecture-list-item-card">Towers
							<ul className="lecture-text list-['-'] ml-6">
								<li className='pl-1'>Position (lat, lon)</li>
							</ul>
						</li>
						<li className="lecture-list-item-card">Links
							<ul className="lecture-text list-['-'] ml-6">
								<li className='pl-1'>Bandwidth (packets wait in queues to be transmitted)</li>
								<li className='pl-1'>Latency (cost)</li>
							</ul>
						</li>
						<li className="lecture-list-item-card">Packets
							<ul className="lecture-text list-['-'] ml-6">
								<li className='pl-1'>Source</li>
								<li className='pl-1'>Destination</li>
							</ul>
						</li>
					</ul>
					<div className={`w-full ${slideMode ? 'h-[70vh]' : 'h-96'}`}>
						<NetworkToy network={network} />
					</div>
				</section>

				{/* Exploitable Structures */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">Exploitable Structures</h3>
					<div className="lecture-header-decorator" />
					<p className="lecture-paragraph">networks whose structures suggest a specific strategy, that an unaware agent might be slow to exploit</p>
					<ul className="lecture-list">
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>k-nearest neighbors</span>
							<p className="lecture-text">simple, default network structure</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>big-small world</span>
							<p className="lecture-text">locally dense - globally close</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>directed ring</span>
							<p className="lecture-text">packets flow in one direction, 1-2 steps at a time<br />simple strategy that should be easy to exploit</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>bottleneck</span>
							<p className="lecture-text">tempting short path that is constantly congested </p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>parallel highways</span>
							<p className="lecture-text">two parallel highways with sparse connections</p>
						</li>
					</ul>

					<div className={`w-full ${slideMode ? 'h-[70vh]' : 'h-96'} relative`}>
						<NetworkToy network={structureNetwork} />
						<div className="button-group absolute top-4 left-1/2 -translate-x-1/2 w-full z-1000">
							{TOPOLOGY_OPTIONS.map(({ type, label }) => (
								<button
									key={type}
									onClick={() => handleTopologyChange(type)}
									className={`control-button ${structureTopology === type ? 'button-active' : 'button-secondary'}`}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				</section>




				{/* Definition of Structured Problems */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header"> Structured Problems</h3>
					<div className="lecture-header-decorator" />
					<p className="lecture-paragraph">input features occupy a much smaller portion of the overall feature space, making it possible to assume specific properties</p>
					<ul className="lecture-list lecture-text">
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>Convolutional networks</span>
							<p className="lecture-text">with images and audio, nearby information is relevant, and offset invariance is important, so small kernels can be re-used across the input features.</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>Recurrent networks</span>
							<p className="lecture-text">with sequential data, past information is relevant, and temporal dependencies are important, so recurrent connections can be used to capture these dependencies.</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>RL MDPs</span>
							<p className="lecture-text">purely state dependant tasks can make assumptions about advantage estimates from previous experiences</p>
						</li>
						<li className="lecture-list-item-card">
							<span className='lecture-bold'>Cross Attention</span>
							<p className="lecture-text">assuming that visual / textual tasks rely on granular attention within themselves, but only semantic attention between mediums allows for more efficient </p>
						</li>

					</ul>
				</section>

				{/* Metric for Exploitation of Structure */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">Metric for Structure Exploitation</h3>
					<div className="lecture-header-decorator" />
							<p className="lecture-paragraph lecture-bold lecture-big lecture-underline w-[60%] mt-5 mb-2">Feature Embeddings</p>
					<p className="lecture-paragraph">H scores can estimate the generalizability of embeddings from one task to another by minimizing feature redundancy and maximizing class feature discrimination </p>
					<LectureEquation>
						<MathJax inline>{'\\( \\mathcal{H}(f) = \\mathfrak{tr}(\\mathrm{cov}(f(X))^{-1}\\mathrm{cov}(\\mathbb{E}_{P_{X|Y}}[f(X)|Y])) \\)'}</MathJax>
					</LectureEquation>
					<p className="lecture-paragraph">it is important to keep feature mutual information small, but instead of maximizing class relevance for transfer, structure exploitation should be independent of class labels</p>

				</section>

				{/* Approach to Designing Custom Models */}
				<section className="lecture-section mini-scroll">
					<h3 className="lecture-section-header">Designing Custom Models</h3>
					<div className="lecture-header-decorator" />
					<ul className="lecture-list">
						<li className="lecture-list-item-card">Identify structures in data</li>
						<li className="lecture-list-item-card">use these to make assumptions about relevant features</li>
						<li className="lecture-list-item-card">design core embeddings that conform to these assumptions</li>
					</ul>
				</section>

			</LectureTemplate>
		</div>
		</MathJaxContext>
	);
}

