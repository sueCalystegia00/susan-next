import usePostMessage from "@/hooks/usePostMessage";
import { ConversationMessage } from "@/types/models";
import MessageTextArea from "@/components/MessageTextArea";
import { InputAnswerFieldProps } from "./types";
import { useEffect } from "react";
import usePostAnswer from "@/hooks/usePostAnswer";
import CheckedToggle from "../CheckedToggle";

/**
 * @param questionIndex: 質問のインデックス
 * @param question: 質問情報
 * @returns 質問対応の回答メッセージを入力するフォームおよび送信ボタン
 */
const InputAnswerField = ({
	questionIndex,
	question,
}: InputAnswerFieldProps) => {
	const { text, setText, setMessageType, postConversationMessage } =
		usePostMessage(questionIndex);

	useEffect(() => {
		setMessageType("answer");
	}, []);

	const { setAnswerText, shared, setShared, setIntentToDialogflowAndMySQL } =
		usePostAnswer(questionIndex, question);

	useEffect(() => {
		setAnswerText(text);
	}, [text]);

	const submitHandler = async () => {
		try {
			await setIntentToDialogflowAndMySQL();
			postConversationMessage();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea setText={setText} />
			<CheckedToggle
				checked={shared}
				onChange={() => setShared(!shared)}
				children={
					<span className='text-sm text-gray-500'>
						質問者以外の学生にも回答を通知する
					</span>
				}
			/>
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={submitHandler}
				disabled={!text}
			>
				送信
			</button>
		</div>
	);
};

export default InputAnswerField;
