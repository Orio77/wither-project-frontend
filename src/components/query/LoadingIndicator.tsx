import { Loader2 } from "lucide-react";

export const LoadingIndicator: React.FC = () => (
	<div className="flex justify-center items-center gap-2 my-8">
		<Loader2 className="h-6 w-6 animate-spin" />
		<p>Finding answers...</p>
	</div>
);
