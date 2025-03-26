"use client";
import { useState } from "react";
import { fetchQueryData } from "@/app/api/witherPdfApi";
import { QueryForm } from "@/components/query/QueryForm";
import { ErrorAlert } from "@/components/query/ErrorAlert";
import { LoadingIndicator } from "@/components/query/LoadingIndicator";
import { QueryResults } from "@/components/query/QueryResults";
import { QAModel } from "@/types/wither.types";

export function QueryWither() {
	const [data, setData] = useState<QAModel[]>([]);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleQuerySubmit = async (question: string, numResults: number) => {
		setIsLoading(true);
		setError("");

		try {
			const result = await fetchQueryData(question);
			setData(result);
			if (result.length === 0) {
				setError("No answers found");
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			setData([]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<QueryForm onSubmit={handleQuerySubmit} isLoading={isLoading} />
			<ErrorAlert message={error} />
			{isLoading && <LoadingIndicator />}
			<QueryResults data={data} />
		</>
	);
}
