import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileEntity } from "@/types/pdf.types";
import { useState, useEffect } from "react";
import { checkPdfProcessed } from "@/app/api/witherPdfApi";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
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

interface PdfListProps {
	pdfs: FileEntity[];
	actionButtons?: Array<{
		label: string;
		onClick: (pdf: FileEntity) => void;
		loading?: boolean;
		loadingId?: number | null;
		disabled?: boolean;
	}>;
	onDelete?: (pdf: FileEntity) => void;
}

interface ProcessingStatus {
	[key: number]: boolean;
}

export function PdfList({ pdfs, actionButtons, onDelete }: PdfListProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPdfs, setFilteredPdfs] = useState<FileEntity[]>([]);
	const [processedStatus, setProcessedStatus] = useState<ProcessingStatus>({});
	const [pdfToDelete, setPdfToDelete] = useState<FileEntity | null>(null);

	useEffect(() => {
		const results = pdfs.filter((pdf) =>
			pdf?.name?.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredPdfs(results);
	}, [searchTerm, pdfs]);

	useEffect(() => {
		const checkProcessingStatus = async () => {
			const statuses: ProcessingStatus = {};
			for (const pdf of pdfs) {
				try {
					statuses[pdf.id] = await checkPdfProcessed(pdf.name);
				} catch (error) {
					console.error(`Error checking status for ${pdf.name}:`, error);
					statuses[pdf.id] = false;
				}
			}
			setProcessedStatus(statuses);
		};

		checkProcessingStatus();
	}, [pdfs]);

	const handleDetailsClick = (pdfName: string) => {
		router.push(`/pdf/${encodeURIComponent(pdfName)}`);
	};

	const renderContextMenu = (pdf: FileEntity) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					className="text-red-600"
					onClick={() => setPdfToDelete(pdf)}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<div>
			<Input
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search PDFs..."
				className="mb-4"
			/>

			{searchTerm.trim() !== "" && (
				<div className="space-y-2">
					{filteredPdfs.length === 0 ? (
						<div className="text-center text-gray-500">No PDFs found</div>
					) : (
						filteredPdfs.map((pdf) => (
							<Card
								key={pdf.id}
								className={`transform transition-transform duration-200 hover:scale-[1.02] ${
									processedStatus[pdf.id]
										? "bg-green-100 dark:bg-green-900/30"
										: ""
								}`}
							>
								<CardContent className="flex justify-between items-center py-4">
									<div>
										<div>{pdf.name}</div>
									</div>

									{processedStatus[pdf.id] ? (
										<Button
											variant="outline"
											onClick={() => handleDetailsClick(pdf.name)}
											className="ml-auto text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
										>
											Go to PDF Details
										</Button>
									) : (
										actionButtons && (
											<div className="flex ml-auto gap-2">
												{actionButtons.map((action, index) => (
													<Button
														key={index}
														onClick={() => action.onClick(pdf)}
														disabled={
															action.disabled || action.loadingId === pdf.id
														}
													>
														{action.loadingId === pdf.id
															? "Processing..."
															: action.label}
													</Button>
												))}
											</div>
										)
									)}
									{renderContextMenu(pdf)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}

			<AlertDialog
				open={!!pdfToDelete}
				onOpenChange={() => setPdfToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center">
							This will permanently delete &quot;{pdfToDelete?.name}&quot;. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-600 hover:bg-red-700"
							onClick={() => {
								if (pdfToDelete && onDelete) {
									onDelete(pdfToDelete);
									setPdfToDelete(null);
								}
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
