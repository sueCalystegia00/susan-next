import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import ConversationDisplay from "@/components/ConversationDisplay";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import useConversationData from "@/hooks/useConversation";
import useQuestions from "@/hooks/useQuestions";
import DefaultLayout from "@/layouts/Default";
import type { Question } from "@/types/models";
import { useRouter } from "next/router";

const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	const conversationMessages = useConversationData(Number(questionId));

	return (
		<DefaultLayout>
			<QuestionTextDisplay
				questionText={question.QuestionText}
				lectureNumber={1}
			/>
			{!!question.AnswerText && (
				<AnswerTextDisplay answerText={question.AnswerText} />
			)}
			{!!conversationMessages.length && (
				<ConversationDisplay messages={conversationMessages} />
			)}
		</DefaultLayout>
	);
};

export default QuestionDetailsPage;
