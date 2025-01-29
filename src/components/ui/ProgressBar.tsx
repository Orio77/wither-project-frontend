import { cn } from "@/lib/utils";

interface ProgressBarProps {
	percentage: number;
	className?: string;
	showPercentage?: boolean;
	stage?: string;
	details?: string;
}

export function ProgressBar({
	percentage,
	className,
	showPercentage = true,
	stage,
	details,
}: ProgressBarProps) {
	return (
		<div className={cn("w-full space-y-2", className)}>
			{stage && <p className="text-sm font-medium">{stage}</p>}
			<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
				<div
					className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
					style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
				/>
			</div>
			{showPercentage && (
				<div className="flex justify-between text-sm text-gray-600">
					<span>{Math.round(percentage)}% Complete</span>
					{details && <span>{details}</span>}
				</div>
			)}
		</div>
	);
}
