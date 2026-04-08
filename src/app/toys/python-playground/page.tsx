'use client';
import LineAnimation from '@/components/backgrounds/LineAnimation';
import AsyncPyIde from '@/components/coding/AsyncPyIde';

const DEFAULT_CODE = `# Write your Python code here
# Write your Python code here
import random

robby = Robot(name='robby')
wilson = Robot(name='wilson')
turn_speed1 = 0
turn_speed2 = 0

for i in range(100):
	robby.move(0.1)
	robby.turn(turn_speed1)

	wilson.move(0.1)
	wilson.turn(turn_speed2)

	turn_speed1 = (turn_speed1 + random.randrange(-100, 100)/200) * 0.8
	turn_speed2 = (turn_speed2 + random.randrange(-100, 100)/200) * 0.8

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
