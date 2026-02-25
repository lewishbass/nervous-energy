import { copyToClipboard } from "@/scripts/clipboard";
import { useState } from "react";

type CopyCodeProps = {
	code: string;
	onCopy?: () => void;
};

export default function CopyCode({ code, onCopy }: CopyCodeProps) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		await copyToClipboard(code);
		setIsCopied(true);
		onCopy?.();
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<span
			onClick={handleCopy}
			className={`px-1 py-0.5 rounded select-none cursor-pointer transition-colors duration-200 font-semibold ${
				isCopied
					? "bg-green-300 dark:bg-green-600 dark:text-white text-black"
					: "bg-gray-200 dark:bg-gray-600/80 dark:text-gray-400 text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-500/80 active:bg-gray-400 dark:active:bg-gray-400/80"
				}`}
			style={{ fontFamily: 'SF Mono, Consolas, "Courier New", monospace' }}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && handleCopy()}
			aria-label={`Copy code: ${code}`}
		>
			{code}
		</span>
	);
}
