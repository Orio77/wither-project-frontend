"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SourceDisplay } from "./SourceDisplay";
import { AnswerDisplay } from "./AnswerDisplay";
import { ResultItemProps } from "@/types/query.types";

export const ResultItem: React.FC<ResultItemProps> = ({ item, index }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Collapsible
			key={`result-${index}`}
			open={isExpanded}
			onOpenChange={setIsExpanded}
		>
			<CollapsibleTrigger className="cursor-pointer w-full">
				<Card className="text-center">
					<CardContent className="pt-6">
						<p className="mb-3 font-medium">{item.question}</p>
					</CardContent>
				</Card>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<Card className="text-center">
					<CardContent className="pt-6">
						<SourceDisplay source={item.source} />
						<AnswerDisplay answer={item.answer} />
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
};
