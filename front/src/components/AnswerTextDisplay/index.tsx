import type { AnswerTextDisplayProps } from "./types";

const AnswerTextDisplay = ({ answerText }: AnswerTextDisplayProps) => {
	return (
		<div className='w-screen flex flex-col items-center p-4 gap-2 text-susan-blue-100 bg-susan-blue-50 dark:text-slate-50 dark:bg-slate-600'>
			<div className='relative w-full max-w-5xl flex flex-col items-center'>
				<h2 className='text-2xl font-bold'>💡 回答</h2>
				<p className='text-xs'>Answer</p>
			</div>
			<p className='text-lg whitespace-pre-line break-words leading-relaxed'>
				{answerText}
			</p>
		</div>
	);
};

export default AnswerTextDisplay;
