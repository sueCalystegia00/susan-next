import useQuestions from "@/hooks/useQuestions";
import { Question } from "@/types/models";
import { useRouter } from "next/router";

const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	return <div>{question.QuestionText}</div>;
};

export default QuestionDetailsPage;
