import usePostMessage from "@/hooks/usePostMessage";
import { InputMessageFieldProps } from "./types";

const InputMessageField = ({questionIndex}: InputMessageFieldProps) => {
	const { text, setText, messageType, setMessageType, postHandler } =
		usePostMessage(questionIndex);

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<textarea
				className='w-full h-24 p-2 border border-gray-400 rounded-lg dark:bg-slate-600 focus:outline-none focus:border-sky-400'
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button
				className='bg-susan-blue-100 text-white active:bg-susan-blue-500 font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
				type='button'
				onClick={postHandler}
			>
				送信
			</button>
		</div>
	);
};

export default InputMessageField;
