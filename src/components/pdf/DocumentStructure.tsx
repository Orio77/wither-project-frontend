import { Chapter } from "@/types/pdf.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentStructureProps {
	chapters: Chapter[] | undefined;
}

export function DocumentStructure({ chapters }: DocumentStructureProps) {
	console.log("Received chapters:", chapters);

	if (!chapters || chapters.length === 0) {
		return (
			<Card>
				<CardContent className="p-4">
					<p className="text-gray-500 text-center">
						No chapters available for this document
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{chapters.map((chapter) => (
				<Card key={chapter.id}>
					<CardHeader>
						<CardTitle>
							Chapter {chapter.chapterNumber}: {chapter.title}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{chapter.summary && (
							<div className="mb-4">
								<h4 className="font-semibold text-sm text-gray-600">
									Chapter Summary
								</h4>
								<p className="text-gray-700">{chapter.summary.content}</p>
							</div>
						)}

						<div className="mt-4 space-y-2">
							{chapter.pages.map((page) => (
								<Card key={page.id} className="bg-gray-50">
									<CardContent className="p-4">
										<h5 className="font-semibold mb-2">
											Page {page.pageNumber}
										</h5>
										{page.content && <p> {page.content} </p>}
										{page.summary && (
											<p className="text-sm text-gray-600">
												{page.summary.content}
											</p>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
