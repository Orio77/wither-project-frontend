"use client";

import { Page } from "@/types/pdf.types";
import { Card, CardContent } from "@/components/ui/card";

interface PageCardProps {
	page: Page;
	onClick: (page: Page) => void;
}

export function PageCard({ page, onClick }: PageCardProps) {
	return (
		<Card
			className="cursor-pointer hover:bg-gray-50 transition-colors"
			onClick={() => onClick(page)}
		>
			<CardContent className="p-4">
				<h3 className="font-semibold">Page {page.pageNumber}</h3>
				{page.summary && (
					<p className="text-sm text-gray-600 mt-2">{page.summary.content}</p>
				)}
			</CardContent>
		</Card>
	);
}
