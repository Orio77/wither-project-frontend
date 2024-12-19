export interface DataItem {
	source: string;
	question: string;
	answer: string;
}

export interface ApiError {
	message: string;
	status?: number;
}
