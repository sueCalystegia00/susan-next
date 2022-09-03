import MessageTextArea from "@/components/MessageTextArea";
import { useContext, useEffect } from "react";
import usePostAnswer from "@/hooks/usePostAnswer";
import CheckedToggle from "../../CheckedToggle";
import { ConversationContext } from "@/contexts/ConversationContext";

/**
 * @param questionIndex: 質問のインデックス
 * @param question: 質問情報
 * @returns 質問対応の回答メッセージを入力するフォームおよび送信ボタン
 */
const InputAnswerField = () => {
	const {
		getConversationMessages,
		questionIndex,
		question,
		postText,
		setPostText,
		postConversationMessage,
	} = useContext(ConversationContext);

	const { setAnswerText, shared, setShared, setAnswerHandler } = usePostAnswer(
		questionIndex,
		question
	);

	useEffect(() => {
		setAnswerText(postText);
	}, [postText]);

	const submitHandler = async () => {
		try {
			await setAnswerHandler();
			await postConversationMessage();
			getConversationMessages(questionIndex);
			setPostText("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea setText={setPostText} />
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
				disabled={!postText}
			>
				送信
			</button>
		</div>
	);
};

export default InputAnswerField;
