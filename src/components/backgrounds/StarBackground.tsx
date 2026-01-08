'use client';

import { useEffect, useState } from 'react';
import { JSX } from 'react';

interface StarBackgroundProps {
	starCount?: number;
	speed?: number;
}

export const StarBackground = ({ starCount = 100, speed = 1 }: StarBackgroundProps) => {
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

		for (let i = 0; i < starCount; i++) {
			const size = Math.random() * 2 + 1; // 1-3px
			const top = Math.random() * 100; // 0-100%
			const opacity = Math.random() * 0.5 + 0.2; // 0.2-0.7
			const baseDuration = Math.random() * 30 + 40; // 40-70s
			const duration = baseDuration / speed; // Apply speed multiplier
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
	}, [starCount, speed]);

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none">
			{stars}
		</div>
	);
};