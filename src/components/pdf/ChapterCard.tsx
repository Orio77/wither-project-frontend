"use client";

import { Chapter } from "@/types/pdf.types";
import { Card, CardContent } from "@/components/ui/card";

interface ChapterCardProps {
	chapter: Chapter;
	onClick: (chapter: Chapter) => void;
}

export function ChapterCard({ chapter, onClick }: ChapterCardProps) {
	return (
		<Card
			className="cursor-pointer hover:bg-gray-50 transition-colors"
			onClick={() => onClick(chapter)}
		>
			<CardContent className="p-4">
				<h3 className="font-semibold">
					Chapter {chapter.chapterNumber}: {chapter.title}
				</h3>
			</CardContent>
		</Card>
	);
}
