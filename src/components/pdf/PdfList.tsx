import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileEntity } from "@/types/pdf.types";
import { useState, useEffect } from "react";
import { checkPdfProcessed } from "@/app/api/witherPdfApi";
import { useRouter } from "next/navigation";

interface PdfListProps {
	pdfs: FileEntity[];
	actionButton?: {
		label: string;
		onClick: (pdf: FileEntity) => void;
		loading?: boolean;
		loadingId?: number | null;
		disabled?: boolean;
	};
}

interface ProcessingStatus {
	[key: number]: boolean;
}

export function PdfList({ pdfs, actionButton }: PdfListProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPdfs, setFilteredPdfs] = useState<FileEntity[]>([]);
	const [processedStatus, setProcessedStatus] = useState<ProcessingStatus>({});

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
								className={processedStatus[pdf.id] ? "bg-green-50" : ""}
							>
								<CardContent className="flex justify-between items-center py-4">
									<div>
										<div>{pdf.name}</div>
									</div>

									{processedStatus[pdf.id] ? (
										<Button
											variant="outline"
											onClick={() => handleDetailsClick(pdf.name)}
											className="text-green-600 hover:text-green-700 hover:bg-green-50"
										>
											Go to PDF Details
										</Button>
									) : (
										actionButton && (
											<Button
												onClick={() => actionButton.onClick(pdf)}
												disabled={
													actionButton.disabled ||
													actionButton.loadingId === pdf.id
												}
											>
												{actionButton.loadingId === pdf.id
													? "Processing..."
													: actionButton.label}
											</Button>
										)
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}
		</div>
	);
}
