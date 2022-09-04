import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { createContext } from "react";
import type { Question, Questions } from "@/types/models";
import useQuestionsData from "@/hooks/useQuestions";
import { UpdateAnswerPayload } from "@/types/payloads";

class QuestionContextProps {
	questionIndex!: number;
	question!: Question;
	setQuestion!: Dispatch<SetStateAction<Question>>;
	updateAnswerPayload!: UpdateAnswerPayload;
	setUpdateAnswerPayload!: Dispatch<SetStateAction<UpdateAnswerPayload>>;
	updateQandA!: (
		questionIndex: number,
		updatedQandA: UpdateAnswerPayload
	) => Promise<Questions | undefined>;
	updateQuestionsCallback!: (questionIndex: number, question: Question) => void;
}

export const QuestionContext = createContext<QuestionContextProps>(
	new QuestionContextProps()
);

type Props = {
	questionIndex: number;
	children: ReactNode;
};

const QuestionProvider = ({ questionIndex, children }: Props) => {
	const {
		questions,
		updateQandA,
		getOneQuestionDataHandler,
		updateQuestionsCallback,
	} = useQuestionsData();

	const [question, setQuestion] = useState<Question>(
		questions[Number(questionIndex)] ||
			getOneQuestionDataHandler(Number(questionIndex))
	);

	const [updateAnswerPayload, setUpdateAnswerPayload] =
		useState<UpdateAnswerPayload>({
			questionText: question.QuestionText,
			answerText: question.AnswerText,
			isShared: question.Shared,
			intentName: question.IntentName,
		});

	return (
		<QuestionContext.Provider
			value={{
				questionIndex,
				question,
				setQuestion,
				updateAnswerPayload,
				setUpdateAnswerPayload,
				updateQandA,
				updateQuestionsCallback,
			}}
		>
			{children}
		</QuestionContext.Provider>
	);
};

export default QuestionProvider;
