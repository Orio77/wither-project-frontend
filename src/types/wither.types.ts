/**
 * Represents a single scraped item with its properties
 */
export interface ScrapeItem {
	title?: string;
	link?: string;
	content?: string;
	description?: string;
	author?: string;
	publishDate?: string;
	error?: Error;
}

/**
 * Represents a data model containing query results
 */
export interface DataModel {
	id: string;
	query: string;
	items?: ScrapeItem[];
	errors?: Error[];
}

/**
 * Request object for scrape item review
 */
export interface ScrapeItemReviewRequest {
	reviewId: string;
	items: ScrapeItem[];
}

/**
 * Response object after completing a scrape item review
 */
export interface ScrapeItemReviewResult {
	reviewId: string;
	acceptedScrapeItems: ScrapeItem[];
}

export interface QAModel {
	id: number;
	question: string;
	answer: string;
	source: string;
}
