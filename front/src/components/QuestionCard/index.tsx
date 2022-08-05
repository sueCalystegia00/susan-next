import type { QuestionCardProps } from "./types";

const QuestionCard = ({
	id,
	timestamp,
	answerStatus,
	lectureNumber,
	questionText,
}: QuestionCardProps) => (
	<>
		<div className='question-label'>
			<div className='lecture-count'>第{lectureNumber}回</div>
			<div className='answer-status'>
				<p>{answerStatus ? "回答済" : "未回答"}</p>
			</div>
			<time>{timestamp}</time>
		</div>
		<p className='question-text'>{questionText}</p>
	</>
);

export default QuestionCard;
