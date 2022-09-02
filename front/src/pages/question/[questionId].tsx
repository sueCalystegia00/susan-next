import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import ConversationDisplay from "@/components/ConversationDisplay";
import CreateMessageArea from "@/components/CreateMessageArea";
import MessageTypeSelector from "@/components/MessageTypeSelector";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import ConversationProvider, {
	ConversationContext,
} from "@/contexts/ConversationContext";
import useQuestions from "@/hooks/useQuestions";
import type { Question } from "@/types/models";
import { useRouter } from "next/router";
import { useContext } from "react";

/**
 * @returns 質問詳細ページ
 * @description クエリパラメータよりquestionIdを指定する必要がある
 */
const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	return (
		<>
			<QuestionTextDisplay
				questionText={question.QuestionText}
				lectureNumber={1}
			/>
			{!!question.AnswerText && (
				<AnswerTextDisplay answerText={question.AnswerText} />
			)}
			<ConversationProvider
				questionIndex={Number(questionId)}
				question={question}
			>
				<ConversationDisplay />
				<MessageTypeSelector />
				<CreateMessageArea />
			</ConversationProvider>
		</>
	);
};

export default QuestionDetailsPage;
