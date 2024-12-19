export const API_PATHS = {
	BASE: "/api",
	GATHER: "/gather",
	QUERY: "/query",
} as const;

export const getFullPath = (path: string) => `${API_PATHS.BASE}${path}`;
