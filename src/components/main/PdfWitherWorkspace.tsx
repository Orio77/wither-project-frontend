import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { fetchPdfDocuments, uploadPdf } from "@/app/api/witherPdfApi";
import { PdfUploadForm } from "../pdf/PdfUploadForm";
import { PdfProcessForm } from "../pdf/PdfProcessForm";
import { ErrorAlert } from "../ErrorAlert";
import { FileEntity } from "@/types/pdf.types";

export function PdfWitherWorkspace() {
	const [pdfs, setPdfs] = useState<FileEntity[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		fetchPdfData();
	}, []);

	const fetchPdfData = async () => {
		setIsLoading(true);
		try {
			const data = await fetchPdfDocuments();
			setPdfs(data);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			setError(`Failed to fetch PDFs: ${errorMessage}`);
			setShowError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpload = async (file: File) => {
		setIsLoading(true);
		setError("");

		try {
			const result = await uploadPdf(file);
			if (result === false) {
				setError(`A file with name "${file.name}" already exists`);
				setShowError(true);
				return;
			}

			const updatedPdfs = await fetchPdfDocuments();
			setPdfs(updatedPdfs);
			setSuccessMessage("PDF uploaded successfully!");
			setTimeout(() => setSuccessMessage(""), 500);
		} catch (err) {
			setError(
				`Failed to upload PDF: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			);
			setShowError(true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-center">Upload PDF</CardTitle>
				</CardHeader>
				<CardContent>
					{pdfs.length === 0 ? (
						<Alert variant="default">Upload your first PDF</Alert>
					) : (
						<>
							{error && showError && (
								<ErrorAlert
									message={error}
									onDismiss={() => setShowError(false)}
								/>
							)}
							{successMessage && (
								<Alert
									variant="default"
									className="mb-4 bg-green-100 border-green-600 text-green-600"
								>
									{successMessage}
								</Alert>
							)}
						</>
					)}
					<PdfUploadForm onUpload={handleUpload} isLoading={isLoading} />
				</CardContent>
			</Card>

			{pdfs.length > 0 && <PdfProcessForm pdfs={pdfs} onPdfUpdate={setPdfs} />}
		</div>
	);
}
