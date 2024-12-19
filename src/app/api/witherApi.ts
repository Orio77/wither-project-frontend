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
