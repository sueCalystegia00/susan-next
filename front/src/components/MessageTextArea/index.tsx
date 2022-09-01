import { MessageTextAreaProps } from "./types";

const MessageTextArea = ({ setText }: MessageTextAreaProps) => {
	return (
		<>
			<textarea
				className='w-full h-24 p-2 border border-gray-400 rounded-lg dark:bg-slate-600 focus:outline-none focus:border-sky-400'
				placeholder='メッセージを入力'
				onChange={(e) => setText(e.target.value)}
			/>
		</>
	);
};

export default MessageTextArea;
