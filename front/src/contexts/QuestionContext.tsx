import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { createContext } from "react";
import type { Question } from "@/types/models";
import useQuestionsData from "@/hooks/useQuestions";
import { UpdateAnswerPayload } from "@/types/payloads";
import axios from "axios";

class QuestionContextProps {
	question?: Question;
	relevance: "questioner" | "assigner" | null = null;
	updateAnswerPayload!: UpdateAnswerPayload;
	setUpdateAnswerPayload!: Dispatch<SetStateAction<UpdateAnswerPayload>>;
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
	const [relevance, setRelevance] = useState<"questioner" | "assigner" | null>(
		null
	);

	const { openingQuestion, updateQandA } = useQuestionsData(questionIndex);

	const [updateAnswerPayload, setUpdateAnswerPayload] =
		useState<UpdateAnswerPayload>({
			...openingQuestion!,
			answerIdToken: userIdToken,
		});

	const checkQuestionRelevance = async () => {
		try {
			const { status, data } = await axios.post<{
				isYourQuestion: boolean;
				isAssigner: boolean;
			}>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/view_log/${questionIndex}`,
				{
					userIdToken: userIdToken,
				}
			);
			if (status === 201) {
				if (data.isYourQuestion) {
					setRelevance("questioner");
				} else if (data.isAssigner) {
					setRelevance("assigner");
				}
			} else {
				throw new Error("check users question: Error");
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkQuestionRelevance();
	}, []);

	useEffect(() => {
		setUpdateAnswerPayload({
			...openingQuestion!,
			answerIdToken: userIdToken,
		});
	}, [openingQuestion]);

	return (
		<QuestionContext.Provider
			value={{
				question: openingQuestion,
				relevance,
				updateAnswerPayload,
				setUpdateAnswerPayload,
				updateQandA,
			}}
		>
			{children}
		</QuestionContext.Provider>
	);
};

export default QuestionProvider;
