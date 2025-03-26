export const API_PATHS = {
	BASE: "/api",
	GATHER: "/gather",
	QUERY: "/query",
	PDF: "/pdf",
	PDF_UPLOAD: "/pdf/upload",
	PDF_PROCESS: "/pdf/process",
	PDF_GET: "/pdf/get",
	PDF_GET_FILE: "/pdf/get/file",
	PDF_GET_FILE_ALL: "/pdf/get/file/all",
	PDF_GET_DOC: "/pdf/get/doc",
	PDF_GET_DOC_ALL: "/pdf/get/doc/all",
	PDF_DELETE_DOC: "/pdf/delete/doc",
	REVIEW: "/review",
	REVIEW_COMPLETE: "/review/complete",
} as const;

export const getFullPath = (path: string) => `${API_PATHS.BASE}${path}`;
