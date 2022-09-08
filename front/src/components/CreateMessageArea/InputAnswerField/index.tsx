import MessageTextArea from "@/components/MessageTextArea";
import { useContext, useEffect } from "react";
import CheckedToggle from "../../CheckedToggle";
import { ConversationContext } from "@/contexts/ConversationContext";
import { QuestionContext } from "@/contexts/QuestionContext";
import useDialogflowIntent from "@/hooks/useDialogflowIntent";
import { DialogflowIntent } from "@/types/models";
import useLineMessages from "@/hooks/useLineMessages";

/**
 * @param questionIndex: 質問のインデックス
 * @param question: 質問情報
 * @returns 質問対応の回答メッセージを入力するフォームおよび送信ボタン
 */
const InputAnswerField = () => {
	const { question, updateAnswerPayload, updateQandA } =
		useContext(QuestionContext);
	const { inputtedText, setInputtedText, postConversationMessage } =
		useContext(ConversationContext);
	const { intent, setIntent, postIntent } = useDialogflowIntent(
		question!.questionText,
		question!.intentName
	);
	const { linePayload, pushLineMessage } = useLineMessages(
		question!.index,
		"answer"
	);

	useEffect(() => {
		updateAnswerPayload.answerText = inputtedText;
		setIntent({
			...intent,
			responseText: inputtedText,
		});
	}, [inputtedText]);

	const submitHandler = async () => {
		await setIntent({
			...intent,
			trainingPhrases: [question!.questionText],
		});
		try {
			await postIntent(question!.index).then((intent?: DialogflowIntent) => {
				updateAnswerPayload.intentName = intent!.intentName;
			});
			await updateQandA(updateAnswerPayload);
			// DBにメッセージを記録
			const res = await postConversationMessage();
			// LINEにメッセージを送信
			if (res && res.questionerId) {
				if (updateAnswerPayload.broadcast) {
					linePayload.userIds = [];
					linePayload.broadcast = true;
				} else {
					linePayload.userIds = [res.questionerId];
				}
				linePayload.event.message.text = updateAnswerPayload.answerText!;
				linePayload.event.question!.questionText = question!.questionText;
				await pushLineMessage(linePayload).then(() => {
					alert("メッセージを送信しました");
				});
			}
			setInputtedText("");
		} catch (error) {
			console.error(error);
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
