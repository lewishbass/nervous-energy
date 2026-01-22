export const RainbowText = (text: string, iterationCount = 100, speed = 0.1) => {

	let n = 0;
	return (
		<>
			{text.split('').map((char, index) => (
				<span
					key={index}
					className="rainbow-text"
					style={{ animationDelay: `${(n++) * speed}s`, animationIterationCount: iterationCount }}
				>
					{char}
				</span>
			))}

		</>
	);
};