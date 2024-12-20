"use client";
import { useState } from "react";
import { DataItem } from "@/app/types/api";
import { fetchQueryData } from "@/app/api/witherApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Loader2,
	ChevronUp,
	ChevronDown,
	Copy,
	ExternalLink,
} from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function QueryWither() {
	const [question, setQuestion] = useState("");
	const [numResults, setNumResults] = useState<number>(5);
	const [data, setData] = useState<DataItem[]>([]);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [expandedSources, setExpandedSources] = useState<number[]>([]);
	const [expandedAnswers, setExpandedAnswers] = useState<number[]>([]);
	const [copiedSources, setCopiedSources] = useState<number[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await fetchQueryData(question, numResults);
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

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{isLoading && (
				<div className="flex justify-center items-center gap-2 my-8">
					<Loader2 className="h-6 w-6 animate-spin" />
					<p>Finding answers...</p>
				</div>
			)}

			{data.length > 0 && (
				<Collapsible>
					<CollapsibleTrigger className="mb-4 text-xl font-semibold cursor-pointer hover:text-gray-600 hover:scale-105 transition-all">
						Results
					</CollapsibleTrigger>
					<CollapsibleContent>
						<section aria-label="Query Results">
							<div className="space-y-4">
								{data.map((item, index) => (
									<Collapsible key={`${item.source}-${index}`}>
										<CollapsibleTrigger className="cursor-pointer">
											<Card className="text-center">
												<CardContent className="pt-6">
													<p className="mb-3 font-medium">{item.question}</p>
												</CardContent>
											</Card>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<Card className="text-center">
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
																		setCopiedSources((prev) => [
																			...prev,
																			index,
																		]);
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
																	onClick={() =>
																		window.open(item.source, "_blank")
																	}
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
										</CollapsibleContent>
									</Collapsible>
								))}
							</div>
						</section>
					</CollapsibleContent>
				</Collapsible>
			)}
		</>
	);
}
