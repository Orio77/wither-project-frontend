import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback } from "react";

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function SearchBox({
	value,
	onChange,
	placeholder = "Search PDFs...",
}: SearchBoxProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value);
		},
		[onChange]
	);

	return (
		<div className="relative">
			<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className="pl-8"
				aria-label="Search"
			/>
		</div>
	);
}
