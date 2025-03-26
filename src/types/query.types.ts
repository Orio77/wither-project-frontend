import { QAModel } from "@/types/wither.types";

export interface QueryFormProps {
	onSubmit: (question: string, numResults: number) => Promise<void>;
	isLoading: boolean;
}

export interface ErrorAlertProps {
	message: string;
}

export interface QueryResultsProps {
	data: QAModel[];
}

export interface ResultItemProps {
	item: QAModel;
	index: number;
}

export interface SourceDisplayProps {
	source: string;
}

export interface AnswerDisplayProps {
	answer: string;
}
