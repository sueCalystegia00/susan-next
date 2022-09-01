import usePostMessage from "@/hooks/usePostMessage";
import MessageTextArea from "@/components/MessageTextArea";
import { InputMessageFieldProps } from "./types";
import { useEffect } from "react";

/**
 * @param questionIndex: 質問のインデックス
 * @returns 質問対応のメッセージを入力するフォームおよび送信ボタン
 */
const InputMessageField = ({ questionIndex }: InputMessageFieldProps) => {
	const { text, setText, setMessageType, postConversationMessage } =
		usePostMessage(questionIndex);

	useEffect(() => {
		setMessageType("chat");
	}, []);

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea setText={setText} />
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={postConversationMessage}
				disabled={!text}
			>
				送信
			</button>
		</div>
	);
};

export default InputMessageField;
