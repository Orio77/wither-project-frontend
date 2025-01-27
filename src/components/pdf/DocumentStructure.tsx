import { Chapter, Document, Page } from "@/types/pdf.types";
import { ViewState } from "@/types/ui.types";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { ChapterCard } from "./ChapterCard";
import { PageCard } from "./PageCard";

interface DocumentStructureProps {
	document: Document;
	selectedChapter: Chapter | null;
	viewState: ViewState;
	onChapterClick: (chapter: Chapter) => void;
	onPageClick: (page: Page) => void;
}

export function DocumentStructure({
	document,
	selectedChapter,
	viewState,
	onChapterClick,
	onPageClick,
}: DocumentStructureProps) {
	if (!document) {
		return (
			<Card>
				<CardContent className="p-4">
					<p className="text-gray-500 text-center">No document available</p>
				</CardContent>
			</Card>
		);
	}

	if (viewState === ViewState.CHAPTER && selectedChapter) {
		return (
			<div className="space-y-4">
				<CollapsibleCard title={selectedChapter.title}>
					{selectedChapter.summary && (
						<div className="prose max-w-none">
							<p className="text-gray-700">{selectedChapter.summary.content}</p>
						</div>
					)}
				</CollapsibleCard>

				<div className="space-y-2">
					{selectedChapter.pages.map((page) => (
						<PageCard key={page.id} page={page} onClick={onPageClick} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<CollapsibleCard title={document.title}>
				{document.summary && (
					<div className="prose max-w-none">
						<p className="text-gray-700">{document.summary.content}</p>
					</div>
				)}
			</CollapsibleCard>

			<div className="space-y-2">
				{document.chapters?.map((chapter) => (
					<ChapterCard
						key={chapter.id}
						chapter={chapter}
						onClick={onChapterClick}
					/>
				))}
			</div>
		</div>
	);
}
