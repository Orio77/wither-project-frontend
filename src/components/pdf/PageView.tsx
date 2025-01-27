"use client";

import { Page } from "@/types/pdf.types";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PageViewProps {
	page: Page;
}

export function PageView({ page }: PageViewProps) {
	const [showContent, setShowContent] = useState(false);

	return (
		<div className="space-y-4">
			<div className="flex justify-center">
				<h2 className="text-xl font-semibold">Page {page.pageNumber}</h2>
			</div>

			<CollapsibleCard title="Page Summary" defaultOpen={true}>
				<div className="prose max-w-none">
					<p className="text-gray-700">{page.summary?.content}</p>
				</div>
			</CollapsibleCard>

			<div className="flex justify-center">
				<Button onClick={() => setShowContent(!showContent)} variant="outline">
					{showContent ? "Hide Content" : "Show Page Content"}
				</Button>
			</div>

			{showContent && (
				<div className="mt-4 p-4 bg-gray-50 rounded-lg prose max-w-none">
					<p>{page.content}</p>
				</div>
			)}
		</div>
	);
}
