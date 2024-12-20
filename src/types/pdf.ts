export interface PDFDocument {
	id: number;
	fileName: string;
	author: string;
	summary: string;
	chapterSummaries: string[];
	pageSummaries: string[];
}
