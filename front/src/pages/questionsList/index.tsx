import QuestionCard from "@/components/QuestionCard";
import InfiniteScroll from "react-infinite-scroll-component";
import useQuestions from "@/hooks/useQuestions";

/**
 * @returns 質問一覧ページ
 */
const QuestionsListPage = () => {
	const { questions, isHasMore, getQuestionsDataHandler } = useQuestions();

	return (
		<>
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
						.map((StringOfKey) => (
							<QuestionCard
								key={StringOfKey}
								id={Number(StringOfKey)} // questionId
								timestamp={questions[Number(StringOfKey)].timestamp} // timestamp
								answerStatus={questions[Number(StringOfKey)].AnswerText != null} // answerStatus
								lectureNumber={1} // lectureNumber
								questionText={questions[Number(StringOfKey)].QuestionText} // questionText
							/>
						))}
				</ul>
			</InfiniteScroll>
		</>
	);
};

export default QuestionsListPage;
