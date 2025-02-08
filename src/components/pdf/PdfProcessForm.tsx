import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { deletePdf, processPdf } from "@/app/api/witherPdfApi";
import { PdfList } from "./PdfList";
import { FileEntity, ProgressUpdate } from "@/types/pdf.types";
import { Progress } from "../ui/progress";
import {
	connectWebSocket,
	disconnectWebSocket,
} from "@/app/api/services/webSocket";

interface PdfProcessFormProps {
	pdfs: FileEntity[];
	onPdfUpdate?: (pdfs: FileEntity[]) => void;
}

export function PdfProcessForm({ pdfs, onPdfUpdate }: PdfProcessFormProps) {
	const [localPdfs, setLocalPdfs] = useState<FileEntity[]>(pdfs);
	const [refreshKey, setRefreshKey] = useState(0);
	const [processingId, setProcessingId] = useState<number | null>(null);
	const [processSuccess, setProcessSuccess] = useState(false);
	const [error, setError] = useState("");
	const [progress, setProgress] = useState<{
		current: number;
		total: number;
	} | null>(null);

	useEffect(() => {
		setLocalPdfs(pdfs);
	}, [pdfs]);

	useEffect(() => {
		console.log("Setting up WebSocket connection...");
		connectWebSocket(handleProgressUpdate, (message) => {
			console.log("WebSocket connection message:", message);
		});

		return () => {
			console.log("Cleaning up WebSocket connection...");
			disconnectWebSocket();
		};
	}, []);

	const handleProgressUpdate = (progressUpdate: ProgressUpdate) => {
		console.log("Received progress update:", progressUpdate);
		setProgress({
			current: progressUpdate.currentPage,
			total: progressUpdate.totalPages,
		});
		console.log("Updated progress state:", {
			current: progressUpdate.currentPage,
			total: progressUpdate.totalPages,
		});
	};

	const refresh = () => {
		setProgress(null);
		setProcessSuccess(false);
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const handleProcess = async (pdf: FileEntity) => {
		console.log("Starting process for PDF:", pdf.name);
		setProcessingId(pdf.id);
		setError("");
		try {
			const result = await processPdf(pdf.name);
			console.log("Process result:", result);
			if (result) {
				setProcessSuccess(true);
				setLocalPdfs([...localPdfs]);
			}
		} catch (err) {
			console.error("Process error:", err);
			setError(err instanceof Error ? err.message : "Failed to process PDF");
		} finally {
			setProcessingId(null);
		}
	};

	const handleDelete = async (pdf: FileEntity) => {
		console.log("Deleting PDF:", pdf.name);
		try {
			await deletePdf(pdf.name);
			const updatedPdfs = localPdfs.filter((p) => p.id !== pdf.id);
			setLocalPdfs(updatedPdfs);
			onPdfUpdate?.(updatedPdfs);
			setProcessSuccess(true); // Reuse success alert
		} catch (err) {
			console.error("Delete error:", err);
			setError(err instanceof Error ? err.message : "Failed to delete PDF");
		}
	};

	const progressPercentage = progress
		? Math.floor((progress.current / progress.total) * 100)
		: 0;

	console.log("Render state:", {
		processingId,
		processSuccess,
		error,
		progress,
		progressPercentage,
	});

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="text-center">Process PDF</CardTitle>
			</CardHeader>
			<CardContent>
				<PdfList
					key={refreshKey}
					pdfs={localPdfs}
					actionButtons={[
						{
							label: "Process",
							onClick: handleProcess,
							loadingId: processingId,
						},
					]}
					onDelete={handleDelete}
				/>

				{progress && (
					<div className="mt-4">
						<Progress value={progressPercentage} />
						<span>{`${progress.current} / ${progress.total} pages processed`}</span>
					</div>
				)}

				{error && (
					<Alert variant="destructive" className="mt-4">
						{error}
					</Alert>
				)}

				{processSuccess && (
					<Alert
						variant="default"
						className="mt-4 bg-green-100 dark:bg-green-900/30 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400"
						onClick={refresh}
						role="button"
					>
						PDF processed successfully! Click to dismiss.
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
