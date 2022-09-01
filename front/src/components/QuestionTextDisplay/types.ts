import type { Question } from "@/types/models";

export interface QuestionTextDisplayProps {
	lectureNumber: number;
	questionText: Question["QuestionText"];
}
