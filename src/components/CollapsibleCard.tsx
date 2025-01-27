"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleCardProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	onToggle?: (isOpen: boolean) => void;
}

export function CollapsibleCard({
	title,
	children,
	defaultOpen = false,
	onToggle,
}: CollapsibleCardProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		onToggle?.(newState);
	};

	return (
		<Card className="w-full">
			<CardHeader
				className="cursor-pointer hover:bg-gray-50"
				onClick={handleToggle}
			>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					{isOpen ? (
						<ChevronDown className="h-5 w-5" />
					) : (
						<ChevronRight className="h-5 w-5" />
					)}
				</div>
			</CardHeader>
			{isOpen && <CardContent>{children}</CardContent>}
		</Card>
	);
}
