
import "./QuestionBorderAnimation.css";
import { spawnParticlesAroundBox } from "./ExerciseUtils";
import { useEffect } from "react";
import { useRef } from "react";

type QuestionBorderAnimationProps = {
	children: React.ReactNode;
	validationState: 'passed' | 'failed' | 'pending' | null;
	className?: string;
	style?: React.CSSProperties;
};

export default function QuestionBorderAnimation({children, validationState, className, style}: QuestionBorderAnimationProps) {
	const stateClass = validationState
		? `qba-${validationState}`
		: 'qba-idle';
	const wrapperRef = useRef<HTMLDivElement>(null);

		// Trigger particles after 0.35 seconds after correct answer, to sync with border animation
	useEffect(() => {
		if (validationState === 'passed') {
			const timer = setTimeout(() => {
				if (wrapperRef.current) {
					const box = wrapperRef.current;
					if (box) {
					spawnParticlesAroundBox(box, '#4ade80'); // Green particles for success
				}
			}

				
			}, 350);
			return () => clearTimeout(timer);
		}
	}, [validationState]);

	return (
		<div ref={wrapperRef} className={`qba-wrapper ${stateClass}`} >
			<div className={`qba-content ${className || ''}`} style={style}>
				{children}
			</div>
		</div>
	);
}