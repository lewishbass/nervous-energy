import Image from 'next/image';

export default function AboutTab() {
	return (
		<div className="w-[450px] md:w-[750px] lg:w-[950px] mx-auto">
			<h2 className="text-2xl font-bold mb-4 tc1">About Tutoring</h2>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row gap-6 items-start">
					<div className="flex-1 space-y-4 tc2">
						<p className="text-lg leading-relaxed">
							Teaching has been my passion since high school, and I&apos;ve been fortunate to share that passion with students throughout my academic journey and beyond. There&apos;s something incredibly rewarding about watching a concept click for a student-that moment when confusion transforms into understanding and confidence.
						</p>
						<Image
							src="/images/pets/me_c.jpg"
							alt="Lewis"
							width={250}
							height={250}
							className="rounded-lg shadow-lg object-cover w-full md:hidden lg:hidden"
						/>
						<p className="text-lg leading-relaxed">
							With a Bachelor&apos;s degree in Mathematics and another in Computer Engineering, plus a Master&apos;s degree in Machine Learning, I bring both depth and breadth to my tutoring sessions. But what truly drives me isn&apos;t just the credentials-it&apos;s the genuine joy I get from working with students of all ages and helping them discover their own potential.
						</p>
						<Image
							src="/images/pets/nutmeg_c.jpg"
							alt="Nutmeg the dog"
							width={250}
							height={250}
							className="rounded-lg shadow-lg object-cover w-full md:hidden lg:hidden"
						/>
						<p className="text-lg leading-relaxed">
							I&apos;ve organized tech summer camps, tutored students one-on-one throughout college, and continuously refined my teaching approach to meet each student where they are. Whether you&apos;re struggling with algebra, diving into calculus, exploring computer science, or curious about machine learning, I&apos;m here to make learning engaging, accessible, and-dare I say-fun!
						</p>
						<p className="text-lg leading-relaxed">
							When I&apos;m not teaching, you&apos;ll often find me with my loyal companion Nutmeg, who occasionally makes special appearances during virtual tutoring sessions (student morale booster guaranteed).
						</p>
					</div>
					<div className="flex flex-col gap-4 items-center sm:hidden md:block">
						<Image
							src="/images/pets/me_c.jpg"
							alt="Lewis"
							width={250}
							height={250}
							className="rounded-lg shadow-lg object-cover mb-5"
						/>
						<Image
							src="/images/pets/nutmeg_c.jpg"
							alt="Nutmeg the dog"
							width={250}
							height={250}
							className="rounded-lg shadow-lg object-cover"
						/>
						<p className="text-sm tc3 italic text-center">Me and my study buddy, Nutmeg</p>
					</div>
				</div>
				
				<div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-transparent rounded-lg p-6 border border-blue-200 dark:border-blue-800/30">
					<h3 className="text-xl font-bold mb-3 tc1">Areas of Expertise</h3>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-3 tc2">
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> Mathematics (Algebra through College)
						</li>
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> Computer Science & Programming
						</li>
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> Machine Learning & AI
						</li>
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> Computer Engineering
						</li>
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> Robotics
						</li>
						<li className="flex items-center">
							<span className="text-blue-500 mr-2">✓</span> STEM Summer Camps
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
