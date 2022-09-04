import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import ConversationDisplay from "@/components/ConversationDisplay";
import CreateMessageArea from "@/components/CreateMessageArea";
import MessageTypeSelector from "@/components/MessageTypeSelector";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import ConversationProvider from "@/contexts/ConversationContext";
import QuestionProvider from "@/contexts/QuestionContext";
import { useRouter } from "next/router";

/**
 * @returns 質問詳細ページ
 * @description クエリパラメータよりquestionIdを指定する必要がある
 */
const QuestionDetailsPage = () => {
	const router = useRouter();
	const { questionId } = router.query;

	return (
		<>
			<QuestionProvider questionIndex={Number(questionId)}>
				<QuestionTextDisplay lectureNumber={1} />
				<AnswerTextDisplay />
				<ConversationProvider questionIndex={Number(questionId)}>
					<ConversationDisplay />
					<MessageTypeSelector />
					<CreateMessageArea />
				</ConversationProvider>
			</QuestionProvider>
		</>
	);
};

export default QuestionDetailsPage;
