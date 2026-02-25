import React, { useEffect, useRef, useState } from 'react';

interface SquareAnimationProps {
	radiusRange?: [number, max: number]; // Min and max radius for squares
	className?: string; // Additional class names
	style?: React.CSSProperties; // Additional styles
	seed?: number; // Seed for random generation
	strokeWidth?: number;
	doAnimation?: boolean; // Whether to animate the squares
}

interface Square {
	x: number;
	y: number;
	radius: number;
	color: string;
	animationDuration: number;
	animationDelay: number;
	opacity: number;
}

const SquareAnimation: React.FC<SquareAnimationProps> = ({
	radiusRange = [10, 140],
	className = '',
	style = {},
	seed = 42,
	strokeWidth = 8,
	doAnimation = true,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [squares, setSquares] = useState<Square[]>([]);
	const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

	// Pseudo-random number generator with seed
	const seededRandom = (min: number, max: number, seedValue: number) => {
		const s = Math.sin(seedValue) * 10000;
		return min + (Math.abs(s) % 1) * (max - min);
	};

	// Generate non-overlapping squares
	const generateSquares = () => {
		if (!containerRef.current) return;
		console.log("Existing squares : ", squares.length);

		const rect = containerRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		const [minRadius, maxRadius] = radiusRange;
		const newSquares: Square[] = [];
		// load existing squares that are in the container
		let seedOffset_x = 0;
		let seedOffset_y = 0;
		
		for (let x = 0; x < width+2*radiusRange[1]; x += radiusRange[1]+20) {
			seedOffset_x += 10;
			for (let y = 0; y < height+2*radiusRange[1];  y += radiusRange[1]+20) {
				seedOffset_y += 10;
				const seedOffset = seedOffset_x + seedOffset_y;
				if(seededRandom(0, 1, seed + seedOffset) < 0.5) continue;
				const color = `rgba(255, 255, 255, ${seededRandom(0.1, 0.3, seed + seedOffset + 1)})`;
				const radius = seededRandom(minRadius, maxRadius, seed + seedOffset + 2);
				newSquares.push({
					x:x-radius/2,
					y:y-radius/2,
					radius: radius - strokeWidth,
					color,
					animationDuration: seededRandom(4, 8, seed + seedOffset + 6),
					animationDelay: seededRandom(0, 10, seed + seedOffset + 7),
					opacity: seededRandom(0.1, 0.3, seed + seedOffset + 8),
				});
			}
		}


		console.log("Squares generated: ", newSquares.length);
		setSquares(newSquares);
	};

	// Handle window resize and initial generation
	useEffect(() => {
		generateSquares();
	}, [radiusRange, seed]);

	useEffect(() => {
		// No need to redeclare useRef here
		
		const handleResize = () => {
			clearTimeout(throttleTimeout.current!);
			throttleTimeout.current = setTimeout(() => {
				generateSquares();
				console.log("Resized");
			}
			, 200);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
		};
	}, [radiusRange, seed, squares]);

	return (
		<div
			ref={containerRef}
			className={`relative w-full h-full overflow-hidden ${className}`}
			style={style}
		>
			<svg
				width="100%"
				height="100%"
				className="absolute inset-0"
				preserveAspectRatio="none"
				//style={{animation: `fade-in 5s ease 0.2s forwards`}}
			>
				<defs>
					<style>
						{`
          @keyframes dash {
            to {
          stroke-dashoffset: 0;
            }
          }
        `}
					</style>
				</defs>
				{squares.map((square, index) => (
					<rect
						key={index}
						x={square.x}
						y={square.y}
						width={square.radius}
						height={square.radius}
						fill={'none'}
						opacity={0}
						stroke={square.color}
						strokeWidth={strokeWidth}
						strokeDasharray={doAnimation ? `0 ${square.radius * 0} ${square.radius * 3} ${square.radius * 5}` : 'none'}
						strokeDashoffset={doAnimation ? square.radius * 3 : 0}
						style={{
							animation: doAnimation ? `dash ${square.animationDuration}s ease 0.2s forwards, fade-in ${square.animationDuration / 8}s ease 0.2s forwards` : 'none',
							animationDelay: `${square.animationDelay}s`,
							strokeLinejoin: "round",
							strokeLinecap: "round",
							transform: `rotate(${Math.floor(seededRandom(0, 4, seed + index)) * 90}deg)`,
							transformOrigin: `${square.x + square.radius / 2}px ${square.y + square.radius / 2}px`,

				}}
					/>
				))}
			</svg>
		</div>
	);
};

export default SquareAnimation;
