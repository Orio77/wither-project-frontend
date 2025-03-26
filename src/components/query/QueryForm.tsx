"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { QueryFormProps } from "@/types/query.types";

export const QueryForm: React.FC<QueryFormProps> = ({
	onSubmit,
	isLoading,
}) => {
	const [question, setQuestion] = useState("");
	const [numResults, setNumResults] = useState<number>(5);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(question, numResults);
	};

	return (
		<Card className="mb-8 text-center">
			<CardHeader>
				<CardTitle>Ask Wither</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						id="question-input"
						type="text"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder="Ask your question"
						disabled={isLoading}
						minLength={3}
						required
						className="flex-1"
					/>
					<Input
						id="num-results-input"
						type="number"
						value={numResults}
						onChange={(e) =>
							setNumResults(Math.max(1, Math.min(20, Number(e.target.value))))
						}
						disabled={isLoading}
						min={1}
						max={20}
						required
						className="w-24"
						title="Number of results (1-20)"
					/>
					<Button
						type="submit"
						disabled={isLoading || question.trim().length < 3}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isLoading ? "Searching..." : "Ask"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
