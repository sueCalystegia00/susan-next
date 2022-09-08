import MessageTextArea from "@/components/MessageTextArea";
import { useContext } from "react";
import { ConversationContext } from "@/contexts/ConversationContext";
import useLineMessages from "@/hooks/useLineMessages";
import { AxiosError } from "axios";
import sendEmail from "@/utils/sendEmail";

/**
 * @returns 質問対応のメッセージを入力するフォームおよび送信ボタン
 */
const InputMessageField = () => {
	const {
		questionIndex,
		inputtedText,
		setInputtedText,
		postConversationMessage,
	} = useContext(ConversationContext);
	const { linePayload, pushLineMessage } = useLineMessages(
		questionIndex,
		"response"
	);

	const submitHandler = async () => {
		try {
			// DBにメッセージを記録
			const res = await postConversationMessage();
			// LINEにメッセージを送信
			if (res && res.questioner) {
				linePayload.userIds = [res.questioner];
				linePayload.event.message.text = inputtedText;
				await pushLineMessage(linePayload).then(() => {
					alert("メッセージを送信しました");
				});
			}
			// メッセージ入力欄を空にする
			setInputtedText("");
		} catch (error) {
			if (error instanceof AxiosError) {
				alert(error.response?.data.message);
			} else {
				alert(`error: ${JSON.stringify(error)}`);
			}
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
