import InnerUrlText from "../InnerUrlText";
import type { QuestionTextDisplayProps } from "./types";

const QuestionTextDisplay = ({
	questionText,
	lectureNumber,
}: QuestionTextDisplayProps) => {
	return (
		<div className='w-screen flex flex-col items-center p-4 gap-2 text-slate-50 bg-susan-blue-100'>
			<div className='relative w-full max-w-5xl flex flex-col items-center'>
				<span className='absolute top-0 left-0 text-sm font-semibold inline-block py-1 px-2 rounded-lg text-indigo-600 bg-indigo-200'>
					第{lectureNumber}回
				</span>
				<h2 className='text-2xl font-bold'>🤔 質問</h2>
				<p className='text-xs'>Question</p>
			</div>
			<InnerUrlText
				settingClass='w-full text-lg whitespace-pre-line break-words leading-relaxed'
				innerText={questionText}
			/>
		</div>
	);
};

export default QuestionTextDisplay;
