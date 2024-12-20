import { Alert } from "@/components/ui/alert";
import { useState } from "react";

interface ErrorAlertProps {
	message: string;
	onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
	const [isErrorFading, setIsErrorFading] = useState(false);

	const handleClick = () => {
		setIsErrorFading(true);
		setTimeout(() => {
			onDismiss();
			setIsErrorFading(false);
		}, 0);
	};

	return (
		<Alert
			variant="destructive"
			className={`error-message transition-opacity duration-300 hover:opacity-90 cursor-pointer ${
				isErrorFading ? "opacity-0" : "opacity-100"
			}`}
			onClick={handleClick}
		>
			{message}
		</Alert>
	);
}
