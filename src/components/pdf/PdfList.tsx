import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDocument } from "@/types/pdf";
import { useState, useEffect } from "react";

interface PdfListProps {
	pdfs: PDFDocument[];
}

export function PdfList({ pdfs }: PdfListProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPdfs, setFilteredPdfs] = useState<PDFDocument[]>([]);

	useEffect(() => {
		const results =
			searchTerm.trim() === ""
				? [] // Return empty array when search is empty
				: pdfs.filter((pdf) =>
						pdf?.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
				  );
		setFilteredPdfs(results);
	}, [searchTerm, pdfs]);

	return (
		<div>
			<div className="flex gap-2 mb-4">
				<Input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search PDFs..."
					className="flex-1"
				/>
			</div>
			{searchTerm.trim() !== "" && (
				<div>
					{filteredPdfs.length === 0 ? (
						<div className="text-center text-gray-500">No PDFs found</div>
					) : (
						<div className="space-y-2">
							{filteredPdfs.map((pdf) => (
								<Card key={pdf.id} className="text-center">
									<CardContent>
										<div className="py-2">{pdf.fileName}</div>
										{pdf.summary && (
											<div className="text-sm text-gray-500">{pdf.summary}</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
