import { useMemo } from 'react';
import LineAnimation from './LineAnimation';
import CircleAnimation from './CircleAnimmation';
import SquareAnimation from './SquareAnimation';
import TriangleAnimation from './TriangleAnimation';

type BackgroundProps = {
	density: number;
	seed?: number;
	doAnimation?: boolean;
};

function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export default function RandomBackground({ density = 1, seed, doAnimation = true }: BackgroundProps) {
	const seedValue = useMemo(() => seed ?? Math.floor(Math.random() * 1000000), [seed]);

	const { choice, adjustedDensity, opacity } = useMemo(() => {
		const r1 = seededRandom(seedValue);
		const r2 = seededRandom(seedValue + 1);
		const r3 = seededRandom(seedValue + 2);

		const choice = ['line', 'circle', 'square'][seedValue%3];
		const adjustedDensity = 0.5*density * (0.4 * r2 + 0.8);
		const opacity = r3 * 0.2 + 0.1;

		return { choice, adjustedDensity, opacity };
	}, [seedValue, density]);

	const radiusRange: [number, number] = [Math.max(10, 30 / adjustedDensity), Math.max(20, 140 / adjustedDensity)];
	const spacing = Math.max(5, 10 / adjustedDensity);

	return (
		<div className="absolute inset-0 -z-10 invert dark:invert-0" style={{ opacity }}>
			{choice === 'line' && (
				<LineAnimation seed={seedValue} spacing={spacing * 10} doAnimation={doAnimation} />
			)}
			{choice === 'circle' && (
				<CircleAnimation seed={seedValue} radiusRange={radiusRange} doAnimation={doAnimation} />
			)}
			{choice === 'square' && (
				<SquareAnimation seed={seedValue} radiusRange={[radiusRange[0] * 0.35, radiusRange[1] * 0.35]} doAnimation={doAnimation} />
			)}
			{choice === 'triangle' && (
				<TriangleAnimation seed={seedValue} radiusRange={[radiusRange[0] * 5, radiusRange[1] * 5]} />
			)}
		</div>
	);
}