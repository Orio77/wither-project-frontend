"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Copy, ExternalLink } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SourceDisplayProps } from "@/types/query.types";

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(source);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
			<div className="flex items-center justify-between">
				<CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
					Source{" "}
					{isExpanded ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="text-sm text-muted-foreground mt-2">
				<div className="flex items-center justify-center space-x-2">
					<span>{source}</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleCopy}
						aria-label="Copy source to clipboard"
					>
						<Copy className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => window.open(source, "_blank")}
						aria-label="Open source in new tab"
					>
						<ExternalLink className="h-4 w-4" />
					</Button>
				</div>
				{copied && (
					<span className="text-green-500 text-xs mt-1">Source copied!</span>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};
