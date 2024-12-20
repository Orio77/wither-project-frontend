import { ENDPOINTS } from "../constants/api";
import { DataItem } from "../types/api";

export async function fetchGatherData(query: string): Promise<DataItem[]> {
	if (!query.trim()) {
		throw new Error("Query cannot be empty");
	}

	const response = await fetch(ENDPOINTS.GATHER);

	if (response.status === 204) {
		return [];
	}

	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}

	return response.json();
}

export async function fetchQueryData(
	question: string,
	numResult: number = 5
): Promise<DataItem[]> {
	if (!question.trim()) {
		throw new Error("Question cannot be empty");
	}

	const queryParams = new URLSearchParams({
		question: question.trim(),
		numResult: numResult.toString(),
	});

	const response = await fetch(`${ENDPOINTS.QUERY}?${queryParams.toString()}`);

	if (response.status === 204) {
		return [];
	}

	if (!response.ok) {
		throw new Error("Failed to fetch query results");
	}

	return response.json();
}

export async function fetchPdfDocuments(): Promise<PDFDocument[]> {
	const response = await fetch(`${ENDPOINTS.PDFGETALL}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();
	return data;
}

export async function uploadPdf(file: File, name: string): Promise<boolean> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("name", name);

	const response = await fetch(`${ENDPOINTS.PDFUPLOAD}`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error("PDF already present in the database");
	}

	const result = await response.json();
	return result;
}

interface PDFDocument {
	id: number;
	fileName: string;
	author: string;
	summary: string;
	chapterSummaries: string[];
	pageSummaries: string[];
}
