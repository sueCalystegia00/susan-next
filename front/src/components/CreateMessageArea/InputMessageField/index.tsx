import MessageTextArea from "@/components/MessageTextArea";
import { useContext } from "react";
import { DiscussionContext } from "@/contexts/DiscussionContext";
import useLineMessages from "@/hooks/useLineMessages";
import { QuestionContext } from "@/contexts/QuestionContext";

/**
 * @returns 質問対応のメッセージを入力するフォームおよび送信ボタン
 */
const InputMessageField = () => {
	const { question, isUsersQuestion } = useContext(QuestionContext);
	const { inputtedText, setInputtedText, postDiscussionMessage } =
		useContext(DiscussionContext);
	const { linePayload, pushLineMessage } = useLineMessages(
		"response",
		question
	);

	const submitHandler = async () => {
		try {
			// DBにメッセージを記録
			const res = await postDiscussionMessage(isUsersQuestion);
			// LINEにメッセージを送信
			if (res.questionerId) {
				linePayload.userIds = [res.questionerId];
				linePayload.event.message.text = inputtedText;
				await pushLineMessage(linePayload);
				alert("メッセージを送信しました");
			}
			// メッセージ入力欄を空にする
			setInputtedText("");
		} catch (error: any) {
			console.error(error);
			alert(`エラーが発生しました. 
			Error:${JSON.stringify(error)}`);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea text={inputtedText} setText={setInputtedText} />
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={submitHandler}
				disabled={!inputtedText}
			>
				送信
			</button>
		</div>
	);
};

export default InputMessageField;
