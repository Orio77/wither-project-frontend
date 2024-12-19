"use client";
import { useState } from "react";
import { DataItem } from "@/app/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SearchCardProps {
	title: string;
	buttonText: string;
	fetchFunction: (query: string) => Promise<DataItem[]>;
	minQueryLength?: number;
	placeholder?: string;
}

export function SearchCard({
	title,
	buttonText,
	fetchFunction,
	minQueryLength = 3,
	placeholder = "Enter your query",
}: SearchCardProps) {
	const [query, setQuery] = useState("");
	const [data, setData] = useState<DataItem[]>([]);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await fetchFunction(query);
			setData(result);
			if (result.length === 0) {
				setError("No data found");
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
			<Card className="mb-8 text-center">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={placeholder}
							disabled={isLoading}
							minLength={minQueryLength}
							required
							className="flex-1"
						/>
						<Button
							type="submit"
							disabled={isLoading || query.trim().length < minQueryLength}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading ? "Searching..." : buttonText}
						</Button>
					</form>
				</CardContent>
			</Card>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{isLoading && (
				<div className="flex justify-center items-center gap-2 my-8">
					<Loader2 className="h-6 w-6 animate-spin" />
					<p>Loading results...</p>
				</div>
			)}

			{data.length > 0 && (
				<section aria-label="Search Results">
					<h2 className="text-xl font-semibold mb-4">Results:</h2>
					<div className="space-y-4">
						{data.map((item, index) => (
							<Card key={`${item.source}-${index}`} className="text-center">
								<CardContent className="pt-6">
									<p className="mb-2 text-sm text-muted-foreground">
										Source: {item.source}
									</p>
									<p className="mb-3 font-medium">{item.question}</p>
									<p className="text-sm">{item.answer}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}
		</>
	);
}
