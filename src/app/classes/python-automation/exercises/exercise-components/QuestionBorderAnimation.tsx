
import "./QuestionBorderAnimation.css";

type QuestionBorderAnimationProps = {
	children: React.ReactNode;
	validationState: 'passed' | 'failed' | 'pending' | null;
	className?: string;
};

export default function QuestionBorderAnimation({children, validationState, className}: QuestionBorderAnimationProps) {
	const stateClass = validationState
		? `qba-${validationState}`
		: 'qba-idle';

	return (
		<div className={`qba-wrapper ${stateClass}`}>
			<div className={`qba-content ${className || ''}`}>
				{children}
			</div>
		</div>
	);
}