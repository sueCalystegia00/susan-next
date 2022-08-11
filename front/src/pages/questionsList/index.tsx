import DefaultLayout from "@/layouts/Default";
import QuestionCard from "@/components/QuestionCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";
import useQuestions from "@/hooks/useQuestions";

const QuestionListPage = () => {
	const { questions, isHasMore, getQuestionsDataHandler } = useQuestions();

	useEffect(() => {
		getQuestionsDataHandler();
	}, []);

	return (
		<DefaultLayout>
			<InfiniteScroll
				dataLength={Object.keys(questions).length} //現在のデータの長さ
				next={getQuestionsDataHandler} // スクロール位置を監視してコールバック（次のデータを読み込ませる）
				hasMore={isHasMore} // さらにスクロールするかどうか（ある一定数のデータ数に達したらfalseを返すことで無限スクロールを回避）
				loader={null} // ローディング中のコンポーネント
				//height={420} // 高さ（なくても良い）
			>
				<ul className='flex flex-col gap-3 p-2'>
					{Object.keys(questions)
						.reverse()
						.map((key) => (
							<QuestionCard
								key={key}
								id={Number(key)} // questionId
								timestamp={questions[key].timestamp} // timestamp
								answerStatus={questions[key].AnswerText != null} // answerStatus
								lectureNumber={1} // lectureNumber
								questionText={questions[key].QuestionText} // questionText
							/>
						))}
				</ul>
			</InfiniteScroll>
		</DefaultLayout>
	);
};

export default QuestionListPage;
