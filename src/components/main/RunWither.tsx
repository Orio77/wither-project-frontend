"use client";
import { useState } from "react";
import { DataItem } from "@/app/types/api";
import { fetchGatherData } from "@/app/api/witherPdfApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Loader2,
	Copy,
	ExternalLink,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function RunWither() {
	const [query, setQuery] = useState("");
	const [data, setData] = useState<DataItem[]>([]);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [expandedSources, setExpandedSources] = useState<number[]>([]);
	const [expandedAnswers, setExpandedAnswers] = useState<number[]>([]);

	// New state for tracking copied sources
	const [copiedSources, setCopiedSources] = useState<number[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await fetchGatherData(query);
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
					<CardTitle>Run Wither</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							id="search-query"
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Enter your query"
							disabled={isLoading}
							minLength={3}
							required
							className="flex-1"
						/>
						<Button
							type="submit"
							disabled={isLoading || query.trim().length < 3}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading ? "Searching..." : "Search"}
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
									<Collapsible
										open={expandedSources.includes(index)}
										onOpenChange={() => {
											setExpandedSources((prev) =>
												prev.includes(index)
													? prev.filter((i) => i !== index)
													: [...prev, index]
											);
										}}
									>
										<div className="flex items-center justify-between">
											<CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
												Source{" "}
												{expandedSources.includes(index) ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</CollapsibleTrigger>
										</div>
										<CollapsibleContent className="text-sm text-muted-foreground mt-2">
											<div className="flex items-center justify-center space-x-2">
												<span>{item.source}</span>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => {
														navigator.clipboard.writeText(item.source);
														setCopiedSources((prev) => [...prev, index]);
														setTimeout(() => {
															setCopiedSources((prev) =>
																prev.filter((i) => i !== index)
															);
														}, 500);
													}}
												>
													<Copy className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => window.open(item.source, "_blank")}
												>
													<ExternalLink className="h-4 w-4" />
												</Button>
											</div>
											{copiedSources.includes(index) && (
												<span className="text-green-500 text-xs mt-1">
													Source copied!
												</span>
											)}
										</CollapsibleContent>
									</Collapsible>

									<p className="mb-3 font-medium">{item.question}</p>

									<Collapsible
										open={expandedAnswers.includes(index)}
										onOpenChange={() => {
											setExpandedAnswers((prev) =>
												prev.includes(index)
													? prev.filter((i) => i !== index)
													: [...prev, index]
											);
										}}
									>
										<div className="flex items-center justify-between">
											<CollapsibleTrigger className="flex items-center gap-2 hover:text-foreground transition-colors">
												Answer{" "}
												{expandedAnswers.includes(index) ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</CollapsibleTrigger>
										</div>
										<CollapsibleContent className="mt-2">
											{item.answer}
										</CollapsibleContent>
									</Collapsible>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}
		</>
	);
}
