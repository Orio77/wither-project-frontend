import axios from "axios";
import { Document, FileEntity } from "../../types/pdf.types";
import { dataGatherApi, queryApi, pdfApi } from "./services/api";

export async function fetchGatherData(query: string): Promise<Document[]> {
	if (!query.trim()) {
		throw new Error("Query cannot be empty");
	}

	try {
		const response = await dataGatherApi.gatherData(query);
		return response.data;
	} catch (error) {
		throw new Error(
			`Failed to fetch data: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function fetchQueryData(
	question: string,
	numResult: number = 5
): Promise<Document[]> {
	if (!question.trim()) {
		throw new Error("Question cannot be empty");
	}

	try {
		const response = await queryApi.query(question, numResult);
		return response.data;
	} catch (error) {
		throw new Error(
			`Failed to fetch query results: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function fetchPdfDocuments(): Promise<FileEntity[]> {
	try {
		const response = await pdfApi.getAll();
		return response.data;
	} catch (error) {
		throw new Error(
			`Failed to fetch PDF documents: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function uploadPdf(file: File, name: string): Promise<boolean> {
	try {
		const formData = new FormData();
		formData.append("pdf", file);
		formData.append("name", name);

		const response = await pdfApi.upload(formData);

		return !!response.data;
	} catch (error) {
		console.error("Upload error:", error);
		throw new Error(
			`Failed to upload PDF: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function processPdf(name: string): Promise<boolean> {
	try {
		const response = await pdfApi.process(name);
		return response.data === "PDF processed successfully";
	} catch (error) {
		throw new Error(
			`Failed to process PDF: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function getPdf(name: string): Promise<FileEntity> {
	try {
		const response = await pdfApi.get(name);
		return response.data;
	} catch (error) {
		throw new Error(
			`Failed to get PDF: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function fetchPdfDocument(name: string): Promise<Document> {
	try {
		const response = await pdfApi.getDoc(name);
		console.log("API Response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Detailed error:", {
			error,
			response: axios.isAxiosError(error) ? error.response?.data : null,
			status: axios.isAxiosError(error) ? error.response?.status : null,
		});
		throw new Error(
			`Failed to fetch PDF document: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function fetchAllPdfDocuments(): Promise<Document[]> {
	try {
		const response = await pdfApi.getAllDocs();
		return response.data;
	} catch (error) {
		throw new Error(
			`Failed to fetch PDF documents: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function checkPdfProcessed(name: string): Promise<boolean> {
	try {
		const response = await pdfApi.getDoc(name);
		return !!response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return false;
		}
		throw new Error(
			`Failed to check PDF status: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function deletePdf(name: string): Promise<boolean> {
	try {
		const response = await pdfApi.delete(name);
		return response.status === 200;
	} catch (error) {
		throw new Error(
			`Failed to delete PDF: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}
