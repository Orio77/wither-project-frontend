"use client";
import { Header } from "@/components/Header";
import { RunWither } from "@/components/main/RunWither";
import { QueryWither } from "@/components/main/QueryWither";

export default function Home() {
	return (
		<>
			<Header />
			<main className="container mx-auto p-4 max-w-4xl">
				<div className="space-y-12">
					<RunWither />
					<QueryWither />
				</div>
			</main>
		</>
	);
}
