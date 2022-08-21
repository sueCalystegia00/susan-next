import AnswerTextDisplay from "@/components/AnswerTextDisplay";
import QuestionTextDisplay from "@/components/QuestionTextDisplay";
import useQuestions from "@/hooks/useQuestions";
import DefaultLayout from "@/layouts/Default";
import { Question } from "@/types/models";
import { useRouter } from "next/router";
import { useState } from "react";

const QuestionDetailsPage = () => {
	const { questions, getOneQuestionDataHandler } = useQuestions();
	const router = useRouter();
	const { questionId } = router.query;

	const question: Question =
		questions[Number(questionId)] ||
		getOneQuestionDataHandler(Number(questionId));

	const [canViewAnswer, setCanViewAnswer] = useState(!!question.AnswerText);

	return (
		<DefaultLayout>
			<QuestionTextDisplay
				questionText={question.QuestionText}
				lectureNumber={1}
			/>
			{canViewAnswer ? (
				<>
					<AnswerTextDisplay answerText={question.AnswerText} />
					<button
						className='w-full h-6 text-sm text-align-center border-none bg-gray-200 dark:text-slate-50 dark:bg-slate-500'
						onClick={() => setCanViewAnswer(false)}
					>
						チャットのやり取りを表示
					</button>
				</>
			) : (
				<>
					<button
						className='w-full h-6 text-sm text-align-center border-none bg-gray-200 dark:text-slate-50 dark:bg-slate-500'
						onClick={() => setCanViewAnswer(true)}
					>
						回答のみ表示
					</button>
					<div> no answer </div>
					<button
						className='w-full h-6 text-sm text-align-center border-none bg-gray-200 dark:text-slate-50 dark:bg-slate-500'
						onClick={() => setCanViewAnswer(true)}
					>
						回答のみ表示
					</button>
				</>
			)}
		</DefaultLayout>
	);
};

export default QuestionDetailsPage;
