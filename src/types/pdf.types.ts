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
	fileName: string;
	type: PDFType;
	title: string;
	author: string;
	chapters: Chapter[];
}

export interface FileEntity {
	id: number;
	name: string;
	contentType: string;
	data: Uint8Array;
}
