import WitherIcon from "@/components/WitherIcon";

export function Header() {
	return (
		<header className="sticky top-0 w-full bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-background/80 backdrop-blur-sm py-4 md:py-6 mb-8 z-50 transition-all duration-200">
			<div className="container mx-auto flex justify-center items-center gap-4 px-4">
				<div className="flex items-center gap-4">
					<WitherIcon className="transition-transform hover:scale-110 duration-200" />
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 hover:to-gray-300 transition-colors duration-200">
						Wither Project
					</h1>
					<WitherIcon
						mirror
						className="transition-transform hover:scale-110 duration-200"
					/>
				</div>
			</div>
		</header>
	);
}
