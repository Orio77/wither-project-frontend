import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { processPdf } from "@/app/api/witherPdfApi";
import { PdfList } from "./PdfList";
import { FileEntity } from "@/types/pdf.types";

interface PdfProcessFormProps {
	pdfs: FileEntity[];
}

export function PdfProcessForm({ pdfs }: PdfProcessFormProps) {
	const [processingId, setProcessingId] = useState<number | null>(null);
	const [processSuccess, setProcessSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleProcess = async (pdf: FileEntity) => {
		setProcessingId(pdf.id);
		setError("");
		try {
			const result = await processPdf(pdf.name);
			if (result) {
				setProcessSuccess(true);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to process PDF");
		} finally {
			setProcessingId(null);
		}
	};

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="text-center">Process PDF</CardTitle>
			</CardHeader>
			<CardContent>
				<PdfList
					pdfs={pdfs}
					actionButton={{
						label: "Process",
						onClick: handleProcess,
						loadingId: processingId,
					}}
				/>

				{error && (
					<Alert variant="destructive" className="mt-4">
						{error}
					</Alert>
				)}

				{processSuccess && (
					<Alert
						variant="default"
						className="mt-4 bg-green-100 border-green-600 text-green-600"
						onClick={() => setProcessSuccess(false)}
						role="button"
					>
						PDF processed successfully! Click to dismiss.
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
