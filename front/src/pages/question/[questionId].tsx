import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import ConversationDisplay from "@/components/ConversationDisplay";
import MessageTypeSelector from "@/components/MessageTypeSelector";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import useConversationData from "@/hooks/useConversation";
import useQuestions from "@/hooks/useQuestions";
import type { Question } from "@/types/models";
import { useRouter } from "next/router";
import { useState } from "react";

const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	const conversationMessages = useConversationData(Number(questionId));

	const [selectedMessageType, setSelectedMessageType] = useState("");

	return (
		<>
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
			<MessageTypeSelector
				selectedValue={selectedMessageType}
				selectHandler={setSelectedMessageType}
			/>
			<p>{selectedMessageType}</p>
		</>
	);
};

export default QuestionDetailsPage;
