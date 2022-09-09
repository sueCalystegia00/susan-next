import MessageTextArea from "@/components/MessageTextArea";
import { useContext, useEffect } from "react";
import CheckedToggle from "../../CheckedToggle";
import { DiscussionContext } from "@/contexts/DiscussionContext";
import { QuestionContext } from "@/contexts/QuestionContext";
import useDialogflowIntent from "@/hooks/useDialogflowIntent";
import useLineMessages from "@/hooks/useLineMessages";

/**
 * @param questionIndex: 質問のインデックス
 * @param question: 質問情報
 * @returns 質問対応の回答メッセージを入力するフォームおよび送信ボタン
 */
const InputAnswerField = () => {
	const { question, updateAnswerPayload, updateQandA } =
		useContext(QuestionContext);
	const { inputtedText, setInputtedText, postDiscussionMessage } =
		useContext(DiscussionContext);
	const { intent, setIntent, postIntent } = useDialogflowIntent(
		question!.questionText,
		question!.intentName
	);
	const { linePayload, pushLineMessage } = useLineMessages("answer", question);

	useEffect(() => {
		updateAnswerPayload.answerText = inputtedText;
		setIntent({
			...intent,
			responseText: inputtedText,
		});
	}, [inputtedText]);

	const submitHandler = async () => {
		try {
			// Dialogflowのインテントを更新，更新後のintentNameを取得
			updateAnswerPayload.intentName = (await postIntent(
				question!
			))!.intentName;

			// DBの質問と回答を更新
			await updateQandA(updateAnswerPayload);

			// DBにメッセージを記録
			const res = await postDiscussionMessage();
			// LINEにメッセージを送信
			if (res.questionerId) {
				if (updateAnswerPayload.broadcast) {
					linePayload.userIds = [];
					linePayload.broadcast = true;
				} else {
					linePayload.userIds = [res.questionerId];
				}
				linePayload.event.message.text = updateAnswerPayload.answerText!;
				linePayload.event.question!.questionText = question!.questionText;
				await pushLineMessage(linePayload);
				alert("メッセージを送信しました");
			}
			setInputtedText("");
		} catch (error: any) {
			console.error(error);
			console.error(error);
			alert(`エラーが発生しました. 
			Error:${JSON.stringify(error)}`);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea text={inputtedText} setText={setInputtedText} />
			<CheckedToggle
				checked={updateAnswerPayload.broadcast}
				onChange={() => {
					updateAnswerPayload.broadcast = !updateAnswerPayload.broadcast;
				}}
				children={
					<span className='text-sm text-gray-500'>
						質問者以外の学生にも回答を通知する
					</span>
				}
			/>
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

export default InputAnswerField;
