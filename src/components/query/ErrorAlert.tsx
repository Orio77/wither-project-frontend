import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorAlertProps } from "@/types/query.types";

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
	if (!message) return null;

	return (
		<Alert variant="destructive" className="mb-6">
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
};
