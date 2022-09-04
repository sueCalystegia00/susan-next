import MessageTextArea from "@/components/MessageTextArea";
import { useContext, useEffect } from "react";
import { ConversationContext } from "@/contexts/ConversationContext";

/**
 * @param questionIndex: 質問のインデックス
 * @returns 質問対応のメッセージを入力するフォームおよび送信ボタン
 */
const InputMessageField = () => {
	const { inputtedText, setInputtedText, postConversationMessage } =
		useContext(ConversationContext);

	const submitHandler = async () => {
		try {
			await postConversationMessage();
			setInputtedText("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea text={inputtedText} setText={setInputtedText} />
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={submitHandler}
				disabled={!setInputtedText}
			>
				送信
			</button>
		</div>
	);
};

export default InputMessageField;
