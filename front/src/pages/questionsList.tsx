import DefaultLayout from "@/layouts/Default";
import QuestionCard from "@/components/QuestionCard";
import useQuestionsData from "@/hooks/useQuestions";

const QuestionListPage = () => {
	const questionsData = useQuestionsData();

	return (
		<DefaultLayout>
			<ul>
				{Object.keys(questionsData).map((key) => (
					<QuestionCard
						key={key}
						id={Number(key)} // questionId
						timestamp={questionsData[key].timestamp} // timestamp
						answerStatus={false} // answerStatus
						lectureNumber={1} // lectureNumber
						questionText={questionsData[key].QuestionText} // questionText
					/>
				))}
			</ul>
		</DefaultLayout>
	);
};

export default QuestionListPage;
