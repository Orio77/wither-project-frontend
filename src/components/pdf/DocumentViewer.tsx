"use client";

import { useState } from "react";
import { Document, Chapter, Page } from "@/types/pdf.types";
import { ViewState } from "@/types/ui.types";
import { DocumentStructure } from "./DocumentStructure";
import { PageView } from "./PageView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { HomeButton } from "@/components/HomeButton";

interface DocumentViewerProps {
	document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
	const [viewState, setViewState] = useState<ViewState>(ViewState.DOCUMENT);
	const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
	const [selectedPage, setSelectedPage] = useState<Page | null>(null);

	const handleChapterClick = (chapter: Chapter) => {
		setSelectedChapter(chapter);
		setViewState(ViewState.CHAPTER);
	};

	const handlePageClick = (page: Page) => {
		setSelectedPage(page);
		setViewState(ViewState.PAGE);
	};

	const handleBack = () => {
		if (viewState === ViewState.PAGE) {
			setViewState(ViewState.CHAPTER);
			setSelectedPage(null);
		} else {
			setViewState(ViewState.DOCUMENT);
			setSelectedChapter(null);
		}
	};

	return (
		<div className="relative min-h-screen">
			<div className="flex justify-between items-center mb-4">
				<div className="flex space-x-2">
					{viewState !== ViewState.DOCUMENT && (
						<Button variant="ghost" onClick={handleBack}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to {viewState === ViewState.PAGE ? "Chapter" : "Document"}
						</Button>
					)}
					<HomeButton />
				</div>
			</div>

			{viewState === ViewState.PAGE && selectedPage ? (
				<PageView page={selectedPage} />
			) : (
				<DocumentStructure
					document={document}
					selectedChapter={selectedChapter}
					viewState={viewState}
					onChapterClick={handleChapterClick}
					onPageClick={handlePageClick}
				/>
			)}

			<div className="mt-8 mb-4">
				<HomeButton />
			</div>
		</div>
	);
}
