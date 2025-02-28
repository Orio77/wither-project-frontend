interface LoadingSpinnerProps {
	message?: string;
	size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
	message = "Loading...",
	size = "md",
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div className="text-center py-8">
			<div
				className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
			/>
			{message && <p className="mt-2 text-gray-500">{message}</p>}
		</div>
	);
}
