export default function SignUpTab() {
	return (
		<div>
			<h2 className="text-2xl font-bold mb-4 tc1">Sign Up</h2>
			<div className="space-y-6">
				<div>
					<h3 className="text-xl font-semibold mb-3 tc1">Select a Time Slot</h3>
					<div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 min-h-[400px]">
						<div className="text-center tc3">
							<svg className="mx-auto mb-3 w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p className="text-lg font-medium">Interactive Booking Calendar</p>
							<p className="text-sm mt-1">Coming Soon</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center gap-4 py-6">
					<button
						className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled
					>
						Schedule a Session
					</button>
					<p className="text-sm tc3 italic">Booking system coming soon</p>
				</div>

				<div className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-transparent rounded-lg p-6 border border-green-200 dark:border-green-800/30">
					<h3 className="text-lg font-bold mb-3 tc1">What to Expect</h3>
					<ul className="space-y-2 tc2">
						<li className="flex items-start">
							<span className="text-green-500 mr-2 mt-1">1.</span>
							<span>Choose a convenient time slot from the calendar</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 mt-1">2.</span>
							<span>Fill out a brief form about your learning goals</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 mt-1">3.</span>
							<span>Receive confirmation and session details via email</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 mt-1">4.</span>
							<span>Join the session and start learning!</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
