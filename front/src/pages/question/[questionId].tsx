import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import ConversationDisplay from "@/components/ConversationDisplay";
import InputAnswerField from "@/components/InputAnswerField";
import InputImageField from "@/components/InputImageField";
import InputMessageField from "@/components/InputMessageField";
import MessageTypeSelector from "@/components/MessageTypeSelector";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import useConversationData from "@/hooks/useConversation";
import useQuestions from "@/hooks/useQuestions";
import type { ConversationMessage, Question } from "@/types/models";
import { useRouter } from "next/router";
import { useState } from "react";

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

	const conversationMessages =
		question && useConversationData(Number(questionId));

	const [selectedMessageType, setSelectedMessageType] = useState(
		"chat" as ConversationMessage["MessageType"]
	);

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
			{selectedMessageType === "chat" && (
				<InputMessageField questionIndex={Number(questionId)} />
			)}
			{selectedMessageType === "image" && (
				<InputImageField questionIndex={Number(questionId)} />
			)}
			{selectedMessageType === "answer" && (
				<InputAnswerField
					questionIndex={Number(questionId)}
					question={question}
				/>
			)}
		</>
	);
};

export default QuestionDetailsPage;
