import { ReactNode, useEffect } from "react";
import { createContext } from "react";
import type { Question } from "@/types/models";
import useQuestionsData from "@/hooks/useQuestions";
import { UpdateAnswerPayload } from "@/types/payloads";
import axios from "axios";

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
	useEffect(() => {
		axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/view_log/${questionIndex}`,
			{
				userIdToken: userIdToken,
			}
		);
	}, []);

	const { openingQuestion, updateQandA } = useQuestionsData(questionIndex);

	const updateAnswerPayload: UpdateAnswerPayload = {
		...openingQuestion!,
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
