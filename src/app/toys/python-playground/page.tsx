'use client';

import LineAnimation from '@/components/backgrounds/LineAnimation';
import PythonIde from '@/components/coding/PythonIde';

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
					spacing={100}
				/>
			</div>

			<PythonIde
				initialCode={DEFAULT_CODE}
				initialDocumentName="test.py"
				initialShowLineNumbers={true}
				initialIsCompact={false}
				initialVDivider={70}
				initialHDivider={50}
				initialPersistentExec={false}
			/>
		</div>
	);
}
