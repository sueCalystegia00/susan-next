import DefaultLayout from "@/layouts/Default";
import QuestionCard from "@/components/QuestionCard";

const QuestionListPage = () => {
	return (
		<DefaultLayout>
			<QuestionCard
				id={1} // questionId
				timestamp='2020-01-01 00:00:00' // timestamp
				answerStatus={false} // answerStatus
				lectureNumber={1} // lectureNumber
				questionText='こんにちは' // questionText
			/>
		</DefaultLayout>
	);
};

export default QuestionListPage;
