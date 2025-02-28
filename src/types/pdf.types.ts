export enum PDFType {
	SHORT = "SHORT",
	MEDIUM = "MEDIUM",
	LONG = "LONG",
	BOOK = "BOOK",
}

export interface PageSummary {
	id: number;
	content: string;
	page?: Page;
}

export interface ChapterSummary {
	id: number;
	content: string;
	chapter?: Chapter;
	chapterTitle: string;
	chapterNumber: number;
}

export interface BookSummary {
	id: number;
	content: string;
	book?: Document;
}

export interface Page {
	id: number;
	content: string;
	summary: PageSummary;
	fileName: string;
	type: PDFType;
	pageNumber: number;
	chapter?: Chapter;
}

export interface Chapter {
	id: number;
	content: string;
	summary: ChapterSummary;
	fileName: string;
	type: PDFType;
	title: string;
	chapterNumber: number;
	doc?: Document;
	pages: Page[];
}

export interface Document {
	id: number;
	content: string;
	summary: BookSummary;
	summaryCompletionPercentage?: number;
	fileName: string;
	type: PDFType;
	title: string;
	author: string;
	chapters: Chapter[];
}

export interface FileEntity {
	id: number;
	fileName: string;
	name: string;
	contentType: string;
	data: Uint8Array;
}

export interface ProgressUpdate {
	currentPage: number;
	totalPages: number;
}

export interface SummaryProgressDTO {
	progress: number; // A value between 0 and 1 representing progress percentage
}
