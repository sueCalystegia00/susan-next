import { ReactNode } from "react";
import { createContext } from "react";
import type { Question } from "@/types/models";
import useQuestionsData from "@/hooks/useQuestions";
import { UpdateAnswerPayload } from "@/types/payloads";

class QuestionContextProps {
	question?: Question;
	updateAnswerPayload!: UpdateAnswerPayload;
	updateQandA!: (updatedQandA: UpdateAnswerPayload) => Promise<void>;
}

export const QuestionContext = createContext<QuestionContextProps>(
	new QuestionContextProps()
);

type Props = {
	userIdToken: string;
	questionIndex: number;
	children: ReactNode;
};

const QuestionProvider = ({ userIdToken, questionIndex, children }: Props) => {
	const { openingQuestion, updateQandA } = useQuestionsData(questionIndex);

	const updateAnswerPayload: UpdateAnswerPayload = {
		index: questionIndex,
		questionText: openingQuestion?.questionText || "",
		answerText: openingQuestion?.answerText || "",
		broadcast: openingQuestion?.broadcast || false,
		intentName: openingQuestion?.intentName || "",
		answerIdToken: userIdToken,
	};

	return (
		<QuestionContext.Provider
			value={{
				question: openingQuestion,
				updateAnswerPayload,
				updateQandA,
			}}
		>
			{children}
		</QuestionContext.Provider>
	);
};

export default QuestionProvider;
