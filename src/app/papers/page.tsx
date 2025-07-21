'use client';

//toys/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { papers } from '@/data/papers';
import { useEffect, useState } from 'react';
import { JSX } from 'react';

// Star background component with parallax effect
const StarBackground = () => {
	const [stars, setStars] = useState<JSX.Element[]>([]);

	useEffect(() => {
		// Add keyframe animation to the document
		const style = document.createElement('style');
		style.innerHTML = `
      @keyframes starMove {
        from { transform: translateX(0); }
        to { transform: translateX(-100vw); }
      }
    `;
		document.head.appendChild(style);

		// Generate stars
		const newStars = [];
		const starCount = 600;

		for (let i = 0; i < starCount; i++) {
			const size = Math.random() * 2 + 1; // 1-3px
			const top = Math.random() * 100; // 0-100%
			const opacity = Math.random() * 0.5 + 0.2; // 0.2-0.7
			const duration = Math.random() * 30 + 40; // 40-70s
			const delay = -Math.random() * 150; // 0-15s

			newStars.push(
				<div
					key={i}
					className="absolute rounded-full invert dark:invert-0"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						top: `${top}%`,
						right: `-${size}px`,
						backgroundColor: `rgba(255, 255, 255, ${opacity})`,
						animation: `starMove ${duration}s linear ${delay}s infinite`,

					}}
				/>
			);
		}

		setStars(newStars);

		// Cleanup
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none">
			{stars}
		</div>
	);
};
// Radial Gradient Background Component

export default function Toys() {
	// Function to generate a random rotation angle
	const getRandomRotation = () => {
		return Math.floor(Math.random() * 360);
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div
				style={{
					background: `radial-gradient(circle at top left, #FFF2, transparent 60%)`,
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: 0,
				}}
				className='invert dark:invert-0'
			/>
			<div style={{ opacity: 0, animation: "fade-in 10s ease 0.2s forwards" }}><StarBackground /></div>


			<h1 className="text-4xl font-bold mb-8 tc1 relative z-10">Interactive ML Toys</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
				{papers.map((toy, index) => {
					// Generate a random rotation for each tile
					const rotation = getRandomRotation();

					return (
						<div
							key={index}
							className="bg2 rounded-lg shadow-lg overflow-hidden cursor-pointer relative group"
						>
							<Image
								src="/KH_figures.svg"
								alt="Keith Haring background"
								className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-25 dark:opacity-15 dark:invert select-none pointer-events-none"
								width={100}
								height={100}
								style={{
									userSelect: "none",
									transform: `rotate(${rotation}deg) scale(1.3)`, // Scale up by 1.5x to ensure coverage when rotated
									transformOrigin: "center center", // Ensure rotation happens from the center
								}}
							/>
							<Link href={toy.link}>
								<div className="p-5 h-full flex flex-col relative z-10">
									<div className="w-full h-48 relative mb-4 bg-gray-200 rounded-md overflow-hidden">
										<Image
											src={toy.imagePath}
											alt={toy.title}
											fill
											style={{ objectFit: 'cover', transform: `rotate(${rotation}deg) scale(2)`}}
											className="transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<h2 className="text-xl font-semibold mb-2 tc1">{toy.title}</h2>
									<p className="tc2 mb-4 flex-grow">{toy.description}</p>
									<div className="flex justify-between items-center mt-auto">
										<span className={`text-sm px-3 py-1 rounded-full ${toy.hasPage ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
											{toy.hasPage ? 'Available' : 'Coming Soon'}
										</span>
										{toy.hasPage && (
											<span className="text-blue-500 dark:text-blue-400 group-hover:animate-[wiggle_0.25s_ease_1]">
												Read it →
											</span>
										)}
									</div>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
}
