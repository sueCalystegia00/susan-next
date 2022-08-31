import usePostMessage from "@/hooks/usePostMessage";
import { ConversationMessage } from "@/types/models";
import { InputMessageFieldProps } from "./types";

const InputMessageField = ({ questionIndex }: InputMessageFieldProps) => {
	const { text, setText, postHandler } = usePostMessage(
		questionIndex,
		"chat" as ConversationMessage["MessageType"]
	);

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<textarea
				className='w-full h-24 p-2 border border-gray-400 rounded-lg dark:bg-slate-600 focus:outline-none focus:border-sky-400'
				placeholder='メッセージを入力'
				onChange={(e) => setText(e.target.value)}
			/>
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={postHandler}
				disabled={!text}
			>
				送信
			</button>
		</div>
	);
};

export default InputMessageField;
