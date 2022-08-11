import type { QuestionCardProps } from "./types";
const QuestionCard = ({
	id,
	timestamp,
	answerStatus,
	lectureNumber,
	questionText,
}: QuestionCardProps) => (
	<li className='relative list-none cursor-pointer flex flex-col gap-y-2 border shadow-sm rounded-xl p-4 md:p-5 dark:border-gray-700 dark:shadow-slate-700/[.7]'>
		<div className='flex flex-row gap-x-4 items-center'>
			<span className='text-sm font-semibold inline-block py-1 px-2 rounded-lg text-indigo-600 bg-indigo-200'>
				第{lectureNumber}回
			</span>
			<time>{timestamp}</time>
			{answerStatus && (
				<span className='absolute top-0 right-0 text-7xl font-bold opacity-40 -z-10'>
					🏅
				</span>
			)}
		</div>
		<div>
			<p>{questionText}</p>
		</div>
	</li>
);

export default QuestionCard;
