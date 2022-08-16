import useQuestions from "@/hooks/useQuestions";
import { useRouter } from "next/router";

const QuestionDetailsPage = () => {
	const { questions } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question = questions[Number(questionId)];

	return <div>{question.QuestionText}</div>;
};

export default QuestionDetailsPage;
