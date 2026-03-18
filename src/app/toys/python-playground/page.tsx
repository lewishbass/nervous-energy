'use client';
import LineAnimation from '@/components/backgrounds/LineAnimation';
import AsyncPyIde from '@/components/coding/AsyncPyIde';

const DEFAULT_CODE = `# Write your Python code here
class Robot:
	def __init__(self):
		self.pos = [0, 0]
	def speak(self):
		print("Beep boop!")

robby = Robot()
robby.speak()
`;

export default function PythonPlayground() {
	return (
		<div className="relative w-screen overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					seed={789}
					style={{ opacity: 0.35 }}
					spacing={200}
					doAnimation={false}
				/>
			</div>

			<AsyncPyIde
				initialCode={DEFAULT_CODE}
				initialDocumentName="test.py"
				initialWordWrap={true}
				initialHDivider={55}
			/>
		</div>
	);
}
