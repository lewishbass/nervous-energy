

type DailyViewProps = {
	className?: string;
}; 

export default function DailyView({ className }: DailyViewProps) {
	return (
		<div className={`${className} flex flex-row justify-center items-center p-[40px]`}>
			<div className="border-4 border-white/50 dark:border-black/50 h-full grow p-4">test</div>
		</div>
	);
}

