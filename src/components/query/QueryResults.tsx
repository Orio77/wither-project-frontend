"use client";
import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ResultItem } from "./ResultItem";
import { QueryResultsProps } from "@/types/query.types";

export const QueryResults: React.FC<QueryResultsProps> = ({ data }) => {
	const [isExpanded, setIsExpanded] = useState(true);

	if (data.length === 0) return null;

	return (
		<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
			<CollapsibleTrigger className="mb-4 text-xl font-semibold cursor-pointer hover:text-gray-600 hover:scale-105 transition-all">
				Results
			</CollapsibleTrigger>
			<CollapsibleContent>
				<section aria-label="Query Results">
					<div className="space-y-4">
						{data.map((item, index) => (
							<ResultItem
								key={`${item.source}-${index}`}
								item={item}
								index={index}
							/>
						))}
					</div>
				</section>
			</CollapsibleContent>
		</Collapsible>
	);
};
