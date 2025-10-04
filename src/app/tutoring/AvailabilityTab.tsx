import GenericEdit from '@/components/generics/GenericEdit';
import { useState } from 'react';


export default function AvailabilityTab() {

	const [editingMap, setEditingMap] = useState<boolean>(false);

	function toggleEditingMap() {
		setEditingMap(!editingMap);
		console.log("Toggling map editing to ", !editingMap);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4 tc1">Availability</h2>
			<div className="space-y-6">
				<div onClick={toggleEditingMap} className="cursor-pointer">
					<h3 className="text-xl font-semibold mb-3 tc1">Service Area</h3>
					<div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
						<p className="text-sm tc2 mb-3">
							Primary service area centered around Richmond, VA. Online tutoring available anywhere.
						</p>
						<GenericEdit
							type="location"
							editable={editingMap}
							value={{ lat: 37.551492441696894, lon: -77.464017311759 }}
							placeholder={{ lat: 0, lon: 0 }}
						/>
					</div>
				</div>

				<div>
					<h3 className="text-xl font-semibold mb-3 tc1">Schedule</h3>
					<div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600">
						<div className="text-center tc3">
							<svg className="mx-auto mb-3 w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p className="text-lg font-medium">Weekly Availability Calendar</p>
							<p className="text-sm mt-1">Coming Soon</p>
						</div>
					</div>
				</div>

				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
					<p className="tc2">
						<strong>Note:</strong> Sessions are available both in-person and online. Weekend and evening slots fill up quickly, so book early!
					</p>
				</div>
			</div>
		</div>
	);
}
