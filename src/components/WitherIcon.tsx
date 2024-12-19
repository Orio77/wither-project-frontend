interface WitherIconProps {
	mirror?: boolean;
	className?: string;
}

const WitherIcon = ({ mirror, className = "" }: WitherIconProps) => {
	return (
		<div className={`${mirror ? "scale-x-[-1]" : ""} ${className}`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 200 200"
				className="w-16 h-16 opacity-80"
				fill="currentColor"
			>
				{/* Head 1 */}
				<rect x="20" y="30" width="40" height="40" />
				<rect x="30" y="40" width="20" height="20" fillOpacity="0.7" />

				{/* Head 2 (center) */}
				<rect x="80" y="10" width="40" height="40" />
				<rect x="90" y="20" width="20" height="20" fillOpacity="0.7" />

				{/* Head 3 */}
				<rect x="140" y="30" width="40" height="40" />
				<rect x="150" y="40" width="20" height="20" fillOpacity="0.7" />

				{/* Body */}
				<rect x="70" y="60" width="60" height="20" />

				{/* Arms */}
				<rect x="10" y="70" width="50" height="10" />
				<rect x="140" y="70" width="50" height="10" />

				{/* Tail */}
				<rect x="90" y="80" width="20" height="60" />
			</svg>
		</div>
	);
};

export default WitherIcon;
