"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnswerDisplayProps } from "@/types/query.types";

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
			<div className="flex items-center justify-between">
				<CollapsibleTrigger className="flex items-center gap-2 hover:text-foreground transition-colors">
					Answer{" "}
					{isExpanded ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="mt-2">{answer}</CollapsibleContent>
		</Collapsible>
	);
};
