import QuestionCard from "@/components/QuestionCard";
import InfiniteScroll from "react-infinite-scroll-component";
import useQuestions from "@/hooks/useQuestions";

/**
 * @returns 質問一覧ページ
 */
const QuestionsListPage = () => {
	const { questions, getQuestionsDataHandler } = useQuestions();

	return (
		<div className='relative w-full'>
			<InfiniteScroll
				dataLength={questions.length} //現在のデータの長さ
				next={getQuestionsDataHandler} // スクロール位置を監視してコールバック（次のデータを読み込ませる）
				hasMore={questions.slice(-1)[0]?.index != 1 || false} // さらにスクロールするかどうか（index:1の質問があればfalseを返すことで無限スクロールを回避）
				loader={null} // ローディング中のコンポーネント
				//height={420} // 高さ（なくても良い）
			>
				<ul className='flex flex-col gap-3 p-2'>
					{questions.map((question, key) => (
						<QuestionCard
							key={key}
							id={question.index} // questionId
							timestamp={question.timestamp} // timestamp
							answerStatus={question.answerText != null} // answerStatus
							lectureNumber={question.lectureNumber} // lectureNumber
							questionText={question.questionText} // questionText
						/>
					))}
				</ul>
			</InfiniteScroll>
		</div>
	);
};

export default QuestionsListPage;
