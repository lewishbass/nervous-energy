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
		<code
			onClick={handleCopy}
			className={`px-1.5 pb-0.5 pt-1 rounded select-none cursor-pointer transition-colors duration-200 font-semibold ${
				isCopied
					? "bg-green-300 dark:bg-green-700"
					: "bg-gray-200 dark:bg-gray-700/80"
			}`}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && handleCopy()}
			aria-label={`Copy code: ${code}`}
		>
			{code}
		</code>
	);
}
