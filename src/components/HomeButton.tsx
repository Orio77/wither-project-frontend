"use client";

import { Button } from "./ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface HomeButtonProps {
	className?: string;
}

export function HomeButton({ className }: HomeButtonProps) {
	const router = useRouter();

	return (
		<Button
			variant="outline"
			onClick={() => router.push("/")}
			className={className}
		>
			<Home className="h-4 w-4 mr-2" />
			Home
		</Button>
	);
}
