import React, { useEffect, useRef, useState } from 'react';

interface LineAnimationProps {
  spacing?: number; // Spacing between lines
  className?: string; // Additional class names
  style?: React.CSSProperties; // Additional styles
  seed?: number; // Seed for random generation
  strokeWidth?: number;
  doAnimation?: boolean; // Whether to animate the lines
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  length: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
}

const LineAnimation: React.FC<LineAnimationProps> = ({
  spacing = 10,
  className = '',
  style = {},
  seed = 42,
  strokeWidth = 8,
  doAnimation = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Pseudo-random number generator with seed
  const seededRandom = (min: number, max: number, seedValue: number) => {
    const s = Math.sin(seedValue) * 10000;
    return min + (Math.abs(s) % 1) * (max - min);
  };

  // Generate non-overlapping lines
  const generateLines = () => {

    if (!containerRef.current) return;
		console.log("Existing lines : ", lines.length);

		const rect = containerRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
    
    const lineRadius = Math.sqrt(width**2 + height**2);

		const newLines: Line[] = [];
		// load existing squares that are in the container
		let seedOffset_x = 0;
		let seedOffset_y = 0;
		
		for (let x = 0; x < width+2*spacing; x += spacing+20) {
			seedOffset_x += 10;
			for (let y = 0; y < height+2*spacing;  y += spacing+20) {
				seedOffset_y += 10;
				const seedOffset = seedOffset_x + seedOffset_y;
				if(seededRandom(0, 1, seed + seedOffset) < 0.5) continue;
				const theta = seededRandom(0, 360, seed + seedOffset + 2);
        const length = seededRandom(20, 80, seed + seedOffset + 3);
        const depth = seededRandom(0, 3, seed + seedOffset + 4);
        const luminance = 255/(1+depth*depth);//seededRandom(50, 255, seed + seedOffset + 1)/(1+depth);
				const color = `rgba(${luminance}, ${luminance}, ${luminance}, 1)`;
				newLines.push({
          x1:  Math.cos(theta) * lineRadius + x,
          x2: -Math.cos(theta) * lineRadius + x,
          y1:  Math.sin(theta) * lineRadius + y,
          y2: -Math.sin(theta) * lineRadius + y,
          length: length,
          depth,
					color,
					animationDuration: seededRandom(4, 16, seed + seedOffset + 6),
					animationDelay: seededRandom(0, 20, seed + seedOffset + 7),
					opacity: seededRandom(0.1, 0.3, seed + seedOffset + 8),
				});
			}
		}
    // sort lines by depth
    newLines.sort((a, b) => b.depth - a.depth);

		console.log("Lines generated: ", newLines.length);
		setLines(newLines);
  };

  // Handle window resize and initial generation
  useEffect(() => {
    generateLines();
  }, [spacing, seed]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(throttleTimeout.current!);
      throttleTimeout.current = setTimeout(() => {
        generateLines();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [spacing, seed, lines]);

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
        {lines.map((line, index) => {
          // Calculate the actual line length for dash animation
          const lineLength = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
          
          return (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              z={1-line.depth}
              fill={'none'}
              stroke={line.color}
              strokeWidth={strokeWidth/(1+line.depth)}
              strokeDasharray={doAnimation ? lineLength : 0}
              strokeDashoffset={doAnimation ? lineLength : 0}
              style={{
                animation: doAnimation ? `dash ${(5 + 30 / line.length ** 0.5) * (1 + line.depth)}s ease-in-out forwards` : 'none',
                animationDelay: `${30 / line.length**0.5}s`,
                strokeLinejoin: "round",
                strokeLinecap: "round"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LineAnimation;
