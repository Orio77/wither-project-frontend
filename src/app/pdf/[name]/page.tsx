import { notFound } from "next/navigation";
import { fetchPdfDocument } from "@/app/api/witherPdfApi";
import { Document } from "@/types/pdf.types";
import { DocumentViewer } from "@/components/pdf/DocumentViewer";

interface PDFDetailsPageProps {
	params: Promise<{
		name: string;
	}>;
}

async function getDocumentData(name: string): Promise<Document> {
	try {
		const data = await fetchPdfDocument(name);
		return data;
	} catch (error) {
		console.error("Error fetching document:", error);
		throw error;
	}
}

export default async function PDFDetailsPage({ params }: PDFDetailsPageProps) {
	const resolvedParams = await params;

	if (!resolvedParams.name) {
		notFound();
	}

	const decodedName = decodeURIComponent(resolvedParams.name);

	try {
		const document = await getDocumentData(decodedName);

		if (!document) {
			return (
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4 text-red-600">
						Document not found
					</h1>
				</div>
			);
		}

		return (
			<div className="container mx-auto p-4">
				<DocumentViewer document={document} />
			</div>
		);
	} catch {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4 text-red-600">
					Error loading document details
				</h1>
			</div>
		);
	}
}
