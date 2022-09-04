import MessageTextArea from "@/components/MessageTextArea";
import { useContext, useEffect } from "react";
import CheckedToggle from "../../CheckedToggle";
import { ConversationContext } from "@/contexts/ConversationContext";
import { QuestionContext } from "@/contexts/QuestionContext";
import useDialogflowIntent from "@/hooks/useDialogflowIntent";
import { DialogflowIntent, Question } from "@/types/models";

/**
 * @param questionIndex: 質問のインデックス
 * @param question: 質問情報
 * @returns 質問対応の回答メッセージを入力するフォームおよび送信ボタン
 */
const InputAnswerField = () => {
	const {
		questionIndex,
		question,
		setQuestion,
		updateAnswerPayload,
		setUpdateAnswerPayload,
		updateQandA,
		updateQuestionsCallback,
	} = useContext(QuestionContext);
	const { inputtedText, setInputtedText, postConversationMessage } =
		useContext(ConversationContext);
	const { intent, setIntent, postIntent } = useDialogflowIntent(
		question.IntentName
	);

	useEffect(() => {
		setUpdateAnswerPayload({
			...updateAnswerPayload,
			answerText: inputtedText,
		});
		setIntent({
			...intent,
			responseText: inputtedText,
		});
	}, [inputtedText]);

	const submitHandler = async () => {
		setIntent({
			...intent,
			trainingPhrases: [question.QuestionText],
		});
		try {
			await postIntent(questionIndex).then((intent?: DialogflowIntent) => {
				setUpdateAnswerPayload({
					...updateAnswerPayload,
					intentName: intent!.intentName,
				});
			});
			await updateQandA(questionIndex, updateAnswerPayload).then((response) => {
				setQuestion(response![questionIndex] as Question);
				updateQuestionsCallback(questionIndex, response![questionIndex]);
			});
			await postConversationMessage();
			setInputtedText("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='w-full flex flex-col items-center gap-2 p-4 '>
			<MessageTextArea text={inputtedText} setText={setInputtedText} />
			<CheckedToggle
				checked={updateAnswerPayload.isShared}
				onChange={() =>
					setUpdateAnswerPayload({
						...updateAnswerPayload,
						isShared: !updateAnswerPayload.isShared,
					})
				}
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
