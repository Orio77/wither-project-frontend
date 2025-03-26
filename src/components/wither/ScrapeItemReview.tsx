import React, { useEffect, useState } from "react";
import {
	ScrapeItem,
	ScrapeItemReviewRequest,
	ScrapeItemReviewResult,
} from "../../types/wither.types";
import { subscribeToScrapeItemReviews } from "../../app/api/services/webSocket";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { API_PATHS } from "@/app/constants/apiPaths";
import axios from "axios";
import { scrapeReviewApi } from "@/app/api/services/api";

const ScrapeItemReviewComponent: React.FC = () => {
	const [currentReview, setCurrentReview] =
		useState<ScrapeItemReviewRequest | null>(null);
	const [selectedItems, setSelectedItems] = useState<ScrapeItem[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		console.log("Setting up WebSocket subscription for scrape item reviews");

		const unsubscribe = subscribeToScrapeItemReviews((reviewData) => {
			console.log("Received items for review:", reviewData);
			if (!reviewData) {
				console.error("Received empty review data");
				return;
			}
			setCurrentReview(reviewData);
			setSelectedItems([]);
			setError(null);
		});

		return () => {
			console.log("Cleaning up WebSocket subscription");
			unsubscribe();
		};
	}, []);

	const handleItemToggle = (item: ScrapeItem): void => {
		setSelectedItems((prevSelected) => {
			// create a composite key if needed
			const isAlreadySelected = prevSelected.some(
				(selectedItem) =>
					selectedItem.link === item.link ||
					(selectedItem.title === item.title &&
						selectedItem.author === item.author)
			);

			if (isAlreadySelected) {
				return prevSelected.filter(
					(selectedItem) =>
						!(
							selectedItem.link === item.link ||
							(selectedItem.title === item.title &&
								selectedItem.author === item.author)
						)
				);
			} else {
				return [...prevSelected, item];
			}
		});
	};

	const submitSelections = async (): Promise<void> => {
		if (!currentReview) return;

		try {
			setIsSubmitting(true);
			setError(null);

			const payload: ScrapeItemReviewResult = {
				reviewId: currentReview.reviewId,
				acceptedScrapeItems: selectedItems,
			};

			console.log(
				`Submitting review to endpoint: ${API_PATHS.REVIEW_COMPLETE}`
			);

			await scrapeReviewApi.submitReview(payload);
			console.log("Review submitted successfully");
			setCurrentReview(null);
		} catch (error) {
			console.error("Failed to submit review:", error);

			if (axios.isCancel(error)) {
				setError("Request timed out. Please try again.");
			} else if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.message || error.message;
				setError(errorMessage || "Failed to submit review");
			} else {
				setError(
					error instanceof Error ? error.message : "Unknown error occurred"
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// Rest of component remains unchanged
	if (!currentReview) {
		return (
			<Card className="w-full h-64">
				<CardContent className="flex items-center justify-center h-full text-muted-foreground">
					No items to review
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center font-bold purple-gradient-text">
						Review Scraped Items
					</CardTitle>
					<p className="text-muted-foreground text-center">
						Select the items you want to accept
					</p>
				</CardHeader>

				<CardContent>
					{error && (
						<div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md">
							{error}
						</div>
					)}
					<ScrollArea className="max-h-[600px] pr-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{currentReview.items.map((item, index) => (
								<Card
									key={index}
									onClick={() => handleItemToggle(item)}
									className={`cursor-pointer transition-all duration-200 hover:shadow-purple ${
										selectedItems.includes(item)
											? "ring-2 ring-accent border-accent"
											: "border border-border hover:border-primary/40"
									}`}
								>
									<CardContent className="p-5">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												{item.title && (
													<h3 className="font-semibold text-lg mb-2">
														{item.title}
													</h3>
												)}
											</div>
											<div
												className={`w-5 h-5 rounded-full flex-shrink-0 border ${
													selectedItems.includes(item)
														? "bg-accent border-accent"
														: "border-muted-foreground"
												} flex items-center justify-center`}
											>
												{selectedItems.includes(item) && (
													<Check size={12} className="text-accent-foreground" />
												)}
											</div>
										</div>

										<div className="space-y-2 mt-3">
											{item.author && (
												<div className="flex gap-1.5">
													<span className="text-sm text-muted-foreground">
														Author:
													</span>
													<span className="text-sm">{item.author}</span>
												</div>
											)}

											{item.publishDate && (
												<div className="flex gap-1.5">
													<span className="text-sm text-muted-foreground">
														Published:
													</span>
													<span className="text-sm">{item.publishDate}</span>
												</div>
											)}

											{item.description && (
												<div className="mt-3">
													<span className="text-sm text-muted-foreground">
														Description:
													</span>
													<p className="text-sm mt-1 line-clamp-3">
														{item.description}
													</p>
												</div>
											)}

											<div className="mt-3 flex items-center justify-between">
												{item.link && (
													<Button
														variant="link"
														size="sm"
														className="p-0 h-auto text-primary hover:text-accent"
														onClick={(e) => {
															e.stopPropagation();
															window.open(
																item.link,
																"_blank",
																"noopener,noreferrer"
															);
														}}
													>
														Visit source
													</Button>
												)}

												{item.error && (
													<Badge variant="destructive" className="ml-auto">
														Error: {item.error.message}
													</Badge>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ScrollArea>
				</CardContent>

				<CardFooter className="flex justify-end pt-4">
					<Button
						onClick={submitSelections}
						disabled={selectedItems.length === 0 || isSubmitting}
						className={`purple-gradient-bg text-primary-foreground hover:opacity-90 ${
							selectedItems.length === 0 ? "opacity-50" : ""
						}`}
					>
						{isSubmitting ? (
							<>
								<Skeleton className="h-4 w-4 rounded-full animate-spin mr-2" />
								Submitting...
							</>
						) : (
							<>Submit Selection ({selectedItems.length} items)</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ScrapeItemReviewComponent;
