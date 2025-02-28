import { FileEntity } from "@/types/pdf.types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";

interface DeleteConfirmDialogProps {
	pdf: FileEntity | null;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({
	pdf,
	onConfirm,
	onOpenChange,
}: DeleteConfirmDialogProps) {
	const isOpen = Boolean(pdf);

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						This will permanently delete &quot;{pdf?.name}&quot;. This action
						cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-600 hover:bg-red-700"
						onClick={onConfirm}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
