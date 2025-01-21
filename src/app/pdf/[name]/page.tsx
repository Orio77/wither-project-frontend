import { notFound } from "next/navigation";
import { fetchPdfDocument } from "@/app/api/witherPdfApi";
import { DocumentStructure } from "@/components/pdf/DocumentStructure";
import { Document } from "@/types/pdf.types";

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
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-4">
						{document.title || "Untitled Document"}
					</h1>
					<div className="mb-4">
						<p className="text-gray-600">
							Author: {document.author || "Unknown"}
						</p>
						<p className="text-gray-600">Type: {document.type || "Unknown"}</p>
					</div>
					Document Summary
					{document.summary && (
						<div className="mt-6 bg-green-50 p-4 rounded-lg">
							<h2 className="text-xl font-semibold mb-2">Document Summary</h2>
							<p className="text-gray-700">{document.summary.content}</p>
						</div>
					)}
				</div>

				<div className="mt-8">
					<h2 className="text-xl font-bold mb-4">Document Structure</h2>
					<DocumentStructure chapters={document.chapters} />
				</div>
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
