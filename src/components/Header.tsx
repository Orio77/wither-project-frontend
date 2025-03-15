import WitherIcon from "@/components/WitherIcon";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
	return (
		<header className="sticky top-0 w-full bg-gradient-to-b from-accent/95 via-primary/90 to-transparent backdrop-blur-sm py-4 md:py-6 mb-8 z-50 transition-all duration-200 text-white dark:text-black">
			<div className="container mx-auto px-4 relative">
				<div className="flex justify-center items-center gap-4 ">
					<WitherIcon
						mirror
						className="transition-transform hover:scale-110 duration-200"
					/>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center hover:text-primary-foreground transition-colors duration-200 ">
						Wither Project
					</h1>
					<WitherIcon
						mirror
						className="transition-transform hover:scale-110 duration-200"
					/>
				</div>
				<div className="absolute right-4 top-1/2 -translate-y-1/2">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
