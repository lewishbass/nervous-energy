"use client";

export default function ReferencePage() {
	return (
		<div className="w-full h-screen overflow-hidden">
			<iframe
				src="https://reference.duggydiggytunnel.store/"
				title="Reference Site"
				className="w-full h-full border-none"
				sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
			/>
		</div>
	);
}