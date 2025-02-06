import axios from "axios";
import { API_PATHS, getFullPath } from "../../constants/apiPaths";
import { Document, FileEntity } from "../../../types/pdf.types";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

export const dataGatherApi = {
	gatherData: (query: string) =>
		axiosInstance.post<Document[]>(getFullPath(API_PATHS.GATHER), { query }),
};

export const queryApi = {
	query: (question: string, numResults: number) =>
		axiosInstance.post<Document[]>(getFullPath(API_PATHS.QUERY), {
			question,
			numResults,
		}),
};

export const pdfApi = {
	upload: (formData: FormData) =>
		axiosInstance.post<string>(getFullPath(API_PATHS.PDF_UPLOAD), formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),

	process: (name: string) =>
		axiosInstance.post<string>(getFullPath(API_PATHS.PDF_PROCESS), { name }),

	get: (name: string) =>
		axiosInstance.get<FileEntity>(getFullPath(API_PATHS.PDF_GET_FILE), {
			params: { name },
		}),

	getAll: () =>
		axiosInstance.get<FileEntity[]>(getFullPath(API_PATHS.PDF_GET_FILE_ALL)),

	getDoc: (name: string) =>
		axiosInstance.get<Document>(getFullPath(API_PATHS.PDF_GET_DOC), {
			params: { name },
		}),

	getAllDocs: () =>
		axiosInstance.get<Document[]>(getFullPath(API_PATHS.PDF_GET_DOC_ALL)),

	delete: (name: string) =>
		axiosInstance.delete(getFullPath(API_PATHS.PDF_DELETE_DOC), {
			params: { name },
		}),
};
