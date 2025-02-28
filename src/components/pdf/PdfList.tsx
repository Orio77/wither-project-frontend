import { FileEntity } from "@/types/pdf.types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { checkPdfProcessed } from "@/app/api/witherPdfApi";
import { useRouter } from "next/navigation";
import { SearchBox } from "./SearchBox";
import { PdfItem } from "./PdfItem";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface PdfListProps {
	pdfs: FileEntity[];
	actionButtons?: Array<{
		label: string;
		onClick: (pdf: FileEntity) => void;
		loading?: boolean;
		loadingId?: number | null;
		disabled?: boolean;
		progress?: number | null;
	}>;
	onDelete?: (pdf: FileEntity) => void;
	onContinueProcessing?: (pdf: FileEntity) => void;
}

interface ProcessingStatus {
	[key: number]: boolean;
}

export function PdfList({
	pdfs,
	actionButtons,
	onDelete,
	onContinueProcessing,
}: PdfListProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [processedStatus, setProcessedStatus] = useState<ProcessingStatus>({});
	const [pdfToDelete, setPdfToDelete] = useState<FileEntity | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Memoize filtered PDFs to prevent unnecessary re-renders
	const filteredPdfs = useMemo(() => {
		const term = searchTerm.toLowerCase().trim();
		// Only return filtered results if there is a search term
		if (term === "") {
			return []; // Return empty array when no search term
		}
		return pdfs.filter((pdf) => pdf?.name?.toLowerCase().includes(term));
	}, [searchTerm, pdfs]);

	// Use useCallback for event handlers to prevent unnecessary re-renders
	const handleDetailsClick = useCallback(
		(pdfName: string) => {
			router.push(`/pdf/${encodeURIComponent(pdfName)}`);
		},
		[router]
	);

	const handleDeleteConfirm = useCallback(() => {
		if (pdfToDelete && onDelete) {
			onDelete(pdfToDelete);
			setPdfToDelete(null);
		}
	}, [pdfToDelete, onDelete]);

	// Check processing status for all PDFs
	useEffect(() => {
		let isMounted = true;
		const checkProcessingStatus = async () => {
			setIsLoading(true);
			const statuses: ProcessingStatus = {};

			try {
				await Promise.all(
					pdfs.map(async (pdf) => {
						try {
							if (isMounted) {
								statuses[pdf.id] = await checkPdfProcessed(pdf.name);
							}
						} catch (error) {
							console.error(`Error checking status for ${pdf.name}:`, error);
							if (isMounted) {
								statuses[pdf.id] = false;
							}
						}
					})
				);

				if (isMounted) {
					setProcessedStatus(statuses);
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Error checking processing statuses:", error);
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		checkProcessingStatus();

		return () => {
			isMounted = false;
		};
	}, [pdfs]);

	return (
		<div className="space-y-4">
			<SearchBox value={searchTerm} onChange={setSearchTerm} />

			{isLoading ? (
				<div className="text-center py-8">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
					<p className="mt-2 text-gray-500">Loading PDFs...</p>
				</div>
			) : (
				<div className="space-y-2">
					{searchTerm.trim() === "" ? (
						<div className="text-center text-gray-500 py-8">
							Start typing to search PDFs
						</div>
					) : filteredPdfs.length === 0 ? (
						<div className="text-center text-gray-500 py-8">
							No PDFs found matching &quot;{searchTerm}&quot;
						</div>
					) : (
						filteredPdfs.map((pdf) => (
							<PdfItem
								key={pdf.id}
								pdf={pdf}
								isProcessed={processedStatus[pdf.id]}
								onDetailsClick={handleDetailsClick}
								onDelete={setPdfToDelete}
								onContinueProcessing={onContinueProcessing}
								actionButtons={actionButtons}
							/>
						))
					)}
				</div>
			)}

			<DeleteConfirmDialog
				pdf={pdfToDelete}
				onConfirm={handleDeleteConfirm}
				onOpenChange={(open) => !open && setPdfToDelete(null)}
			/>
		</div>
	);
}
