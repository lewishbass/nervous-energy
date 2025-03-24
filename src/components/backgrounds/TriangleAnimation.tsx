import React, { useEffect, useRef, useState } from 'react';

// TODO : fill in a serpenski triangle only when in view

interface TriangleAnimationProps {
	radiusRange?: [number, max: number]; // Min and max size for triangles
	className?: string; // Additional class names
	style?: React.CSSProperties; // Additional styles
	seed?: number; // Seed for random generation
	strokeWidth?: number;
}

interface Triangle {
	x: number;
	y: number;
	size: number;
	color: string;
	animationDuration: number;
	animationDelay: number;
	opacity: number;
	rotation: number;
	serpdepth: number;
}

const TriangleAnimation: React.FC<TriangleAnimationProps> = ({
	radiusRange = [10, 140],
	className = '',
	style = {},
	seed = 42,
	strokeWidth = 8,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [triangles, setTriangles] = useState<Triangle[]>([]);
	const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

	// Pseudo-random number generator with seed
	const seededRandom = (min: number, max: number, seedValue: number) => {
		const s = Math.sin(seedValue) * 10000;
		return min + (Math.abs(s) % 1) * (max - min);
	};

	// Generate triangles
	const generateTriangles = () => {
		if (!containerRef.current) return;
		console.log("Existing triangles: ", triangles.length);

		const rect = containerRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;



		const [minSize, maxSize] = radiusRange;
		const newTriangles: Triangle[] = [];
		let seedOffset_x = 0;
		let seedOffset_y = 0;
		
		for (let x = 0; x < width+2*radiusRange[1]; x += radiusRange[1]/2+20) {
			seedOffset_x += 10;
			for (let y = 0; y < height+2*radiusRange[1]; y += radiusRange[1]/2+20) {
				seedOffset_y += 10;
				const seedOffset = seedOffset_x + seedOffset_y;
				if(seededRandom(0, 1, seed + seedOffset) < 0.25) continue;
				const color = `rgba(255, 255, 255, ${seededRandom(0.1, 0.3, seed + seedOffset + 1)})`;
				const size = seededRandom(minSize, maxSize, seed + seedOffset + 2);
				const rotation = seededRandom(0, 360, seed + seedOffset + 3);
				
				newTriangles.push({
					x: x-size/2,
					y: y-size/2,
					size: size - strokeWidth,
					color,
					animationDuration: seededRandom(4, 8, seed + seedOffset + 6)*10,
					animationDelay: seededRandom(0, 10, seed + seedOffset + 7)*10,
					opacity: seededRandom(0.1, 0.3, seed + seedOffset + 8),
					rotation,
					serpdepth: seededRandom(1, Math.floor(3*Math.sqrt(size/maxSize)), seed + seedOffset + 9),
				});
			}
		}

		console.log("Triangles generated: ", newTriangles.length);
		setTriangles(newTriangles);
	};

	// Handle window resize and initial generation
	useEffect(() => {
		generateTriangles();
	}, [radiusRange, seed]);

	useEffect(() => {
		const handleResize = () => {
			clearTimeout(throttleTimeout.current!);
			throttleTimeout.current = setTimeout(() => {
				generateTriangles();
				console.log("Resized");
			}, 200);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
		};
	}, [radiusRange, seed, triangles]);

	// Helper function to calculate triangle points
	const getTrianglePoints = (x: number, y: number, size: number, depth: number = 4): string => {
		// Equilateral triangle centered at (x, y) with given size
		const height = size * Math.sqrt(3) / 2;
		const halfSize = size / 2;
		
		const x1 = x;
		const y1 = y - height * 2/3;
		
		const x2 = x - halfSize;
		const y2 = y + height / 3;
		
		const x3 = x + halfSize;
		const y3 = y + height / 3;
		
		// Generate Sierpinski triangle path recursively
		return sierpinskiTriangle([x1, y1], [x2, y2], [x3, y3], depth);
	};

	// Recursive function to generate Sierpinski triangle
	const sierpinskiTriangle = (
		p1: [number, number], 
		p2: [number, number], 
		p3: [number, number], 
		depth: number
	): string => {
		if (depth === 0) {
			// Base case: return a single triangle
			return `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p1[0]},${p1[1]}, ${p3[0]},${p3[1]}`;
		}
		
		// Calculate midpoints of the three sides
		const mid1: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
		const mid2: [number, number] = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2];
		const mid3: [number, number] = [(p3[0] + p1[0]) / 2, (p3[1] + p1[1]) / 2];
		
		// Recursively generate the three smaller triangles
		return [
			sierpinskiTriangle(p1, mid1, mid3, depth - 1),
			sierpinskiTriangle(mid1, p2, mid2, depth - 1),
			sierpinskiTriangle(mid3, mid2, p3, depth - 1)
		].join(' ');
	};



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
				{triangles.map((triangle, index) => {
					const centerX = triangle.x + triangle.size / 2;
					const centerY = triangle.y + triangle.size / 2;
					
					return (
						<polygon
							key={index}
							points={getTrianglePoints(centerX, centerY, triangle.size, 4)}
							fill="none"
							opacity={0}
							stroke={triangle.color}
							strokeWidth={strokeWidth}
							strokeDasharray={`${triangle.size * 3 * 1.5**6}`}
							strokeDashoffset={triangle.size * 3 * 1.5**5}
							style={{
								animation: `dash ${triangle.animationDuration}s ease 0.2s forwards, fade-in ${triangle.animationDuration/64}s ease 0.2s forwards`,
								animationDelay: `${triangle.animationDelay}s`,
								strokeLinejoin: "round",
								strokeLinecap: "round",
								transform: `rotate(${triangle.rotation}deg)`,
								transformOrigin: `${centerX}px ${centerY}px`,
							}}
						/>
					);
				})}
			</svg>
		</div>
	);
};

export default TriangleAnimation;
