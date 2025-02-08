import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PdfUploadFormProps {
	onUpload: (file: File, name: string) => Promise<void>;
	isLoading: boolean;
}

export function PdfUploadForm({ onUpload, isLoading }: PdfUploadFormProps) {
	const [uploadName, setUploadName] = useState("");
	const [uploadFile, setUploadFile] = useState<File | null>(null);

	const handleSubmit = async () => {
		if (uploadFile && uploadName.trim()) {
			await onUpload(uploadFile, uploadName);
			setUploadName("");
			setUploadFile(null);
			const fileInput = document.querySelector(
				'input[type="file"]'
			) as HTMLInputElement;
			if (fileInput) fileInput.value = "";
		}
	};

	return (
		<div className="mt-1 flex gap-2">
			<Input
				type="text"
				value={uploadName}
				onChange={(e) => setUploadName(e.target.value)}
				placeholder="PDF Name"
				className="flex-1"
			/>
			<Input
				type="file"
				accept=".pdf"
				onChange={(e) => {
					if (e.target.files && e.target.files[0]) {
						setUploadFile(e.target.files[0]);
					}
				}}
				className="flex-1 hover:bg-gray-200"
			/>
			<Button
				onClick={handleSubmit}
				disabled={isLoading || !uploadFile || !uploadName.trim()}
			>
				Upload
			</Button>
		</div>
	);
}
