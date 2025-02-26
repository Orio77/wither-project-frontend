"use client";
import { Header } from "@/components/Header";
import { RunWither } from "@/components/main/RunWither";
import { QueryWither } from "@/components/main/QueryWither";
import { PdfWitherWorkspace } from "@/components/main/PdfWitherWorkspace";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
			<Header />
			<main className="container mx-auto p-6 max-w-5xl">
				<div className="space-y-8">
					<div className="glass-effect p-6 shadow-purple">
						<RunWither />
					</div>

					<div className="glass-effect p-6 shadow-purple">
						<QueryWither />
					</div>

					<div className="glass-effect p-6 shadow-purple">
						<PdfWitherWorkspace />
					</div>
				</div>
			</main>
		</div>
	);
}
