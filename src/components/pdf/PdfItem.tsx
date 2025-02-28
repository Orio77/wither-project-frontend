import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEntity } from "@/types/pdf.types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface PdfItemProps {
	pdf: FileEntity;
	isProcessed: boolean;
	onDetailsClick: (pdfName: string) => void;
	onDelete: (pdf: FileEntity) => void;
	onContinueProcessing?: (pdf: FileEntity) => void;
	actionButtons?: Array<{
		label: string;
		onClick: (pdf: FileEntity) => void;
		loading?: boolean;
		loadingId?: number | null;
		disabled?: boolean;
		progress?: number | null;
	}>;
}

export function PdfItem({
	pdf,
	isProcessed,
	onDetailsClick,
	onDelete,
	onContinueProcessing,
	actionButtons,
}: PdfItemProps) {
	const isProcessing = actionButtons?.some(
		(action) => action.loadingId === pdf.id
	);

	return (
		<Card
			className={`transform transition-transform duration-200 hover:scale-[1.02] ${
				isProcessed ? "bg-green-100 dark:bg-green-900/30" : ""
			}`}
		>
			<CardContent className="flex justify-between items-center py-4">
				<div className="truncate max-w-[30%]" title={pdf.name}>
					{pdf.name}
				</div>

				<div className="flex items-center ml-auto gap-2">
					{isProcessed ? (
						<Button
							variant="outline"
							onClick={() => onDetailsClick(pdf.name)}
							aria-label={`View details for ${pdf.name}`}
							className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
						>
							Go to PDF Details
						</Button>
					) : (
						actionButtons && (
							<>
								{actionButtons.map((action, index) => (
									<ActionButton key={index} action={action} pdf={pdf} />
								))}
							</>
						)
					)}

					<PdfContextMenu
						pdf={pdf}
						isProcessing={Boolean(isProcessing)}
						onContinueProcessing={onContinueProcessing}
						onDelete={onDelete}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

// Helper component for action buttons
function ActionButton({
	action,
	pdf,
}: {
	action: NonNullable<PdfItemProps["actionButtons"]>[number];
	pdf: FileEntity;
}) {
	const isProcessing = action.loadingId === pdf.id;
	const progressValue =
		isProcessing && action.progress != null ? action.progress : 0;

	return (
		<Button
			onClick={() => action.onClick(pdf)}
			disabled={action.disabled || isProcessing}
			aria-busy={isProcessing}
			className={isProcessing ? "relative overflow-hidden" : ""}
		>
			{isProcessing ? (
				<>
					<span className="relative z-10">
						{progressValue !== null
							? `${Math.round(progressValue)}%`
							: "Processing..."}
					</span>
					<span
						className="absolute inset-0 bg-green-600 opacity-80 z-0"
						style={{
							width: `${progressValue || 0}%`,
							transition: "width 0.5s ease-in-out",
						}}
					/>
				</>
			) : (
				action.label
			)}
		</Button>
	);
}

// Helper component for the context menu
function PdfContextMenu({
	pdf,
	isProcessing,
	onContinueProcessing,
	onDelete,
}: {
	pdf: FileEntity;
	isProcessing: boolean;
	onContinueProcessing?: (pdf: FileEntity) => void;
	onDelete: (pdf: FileEntity) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isProcessing}>
				<Button
					variant="ghost"
					size="icon"
					disabled={isProcessing}
					aria-label="More options"
					className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{onContinueProcessing && (
					<DropdownMenuItem
						onClick={() => onContinueProcessing(pdf)}
						className="text-blue-600"
					>
						Continue Processing
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					className="text-red-600"
					onClick={() => onDelete(pdf)}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
