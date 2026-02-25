import "./QuestionBorderAnimation.css";
import { spawnParticlesAroundBox } from "./ExerciseUtils";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

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
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isEnabled, setIsEnabled] = useState(false);

	// Disable animations and sound on load for 2 seconds
	useEffect(() => {
		const loadTimer = setTimeout(() => {
			setIsEnabled(true);
		}, 2000);
		return () => clearTimeout(loadTimer);
	}, []);

	// Trigger particles after 0.35 seconds after correct answer, to sync with border animation
	useEffect(() => {
		if (validationState === 'passed' && isEnabled) {
			const timer = setTimeout(() => {
				if (audioRef.current) {
					audioRef.current.currentTime = 0;
					audioRef.current.volume = 0.25; // Set volume to 50%
					audioRef.current.play().catch(err => console.error('Failed to play sound:', err));
				}
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
		<>
			<audio ref={audioRef} src="/sounds/correct.mp3" />
			<div ref={wrapperRef} className={`qba-wrapper ${stateClass}`} >
				<div className={`qba-content ${className || ''}`} style={style}>
					{children}
				</div>
			</div>
		</>
	);
}