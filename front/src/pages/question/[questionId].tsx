import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import useQuestions from "@/hooks/useQuestions";
import DefaultLayout from "@/layouts/Default";
import { Question } from "@/types/models";
import { useRouter } from "next/router";

const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	return (
		<DefaultLayout>
			<QuestionTextDisplay
				questionText={question.QuestionText}
				lectureNumber={1}
			/>
			<AnswerTextDisplay answerText={question.AnswerText} />
		</DefaultLayout>
	);
};

export default QuestionDetailsPage;
