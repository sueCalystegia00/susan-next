import { DialogflowIntent, Question } from "@/types/models";
import { PostDialogflowIntentPayload } from "@/types/payloads";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const usePostAnswer = (questionIndex: number, question: Question) => {
	const [questionText, setQuestionText] = useState(question.QuestionText || "");
	const [answerText, setAnswerText] = useState(question.AnswerText || "");
	const [shared, setShared] = useState(question.Shared || false);
	const [intent, setIntent] = useState<DialogflowIntent>();

	useEffect(() => {
		!!question.IntentName && getIntentData(question.IntentName);
	}, []);

	/**
	 * DialogflowのIntentに登録されているトレーニングフレーズを取得する
	 * TODO: Next.jsのAPI Routesを使って，DialogflowのAPIを叩く
	 * @param intentName
	 * @return intent
	 */
	const getIntentData = (intentName: string) => {
		axios
			.get(`/api/v1/dialogflow?intentName=${intentName}`)
			.then((response: AxiosResponse) => {
				setIntent(response.data);
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				throw new Error(error.message);
			});
	};

	/**
	 * DialogflowのIntentを更新する
	 */
	const postIntent = () => {
		try {
			axios
				.post(
					`/api/v1/dialogflow${
						question.IntentName ? "?intentName=" + question.IntentName : ""
					}`,
					{
						questionIndex: questionIndex,
						intentName: question.IntentName,
						trainingPhrases: intent?.trainingPhrases,
						responseText: answerText,
					} as PostDialogflowIntentPayload
				)
				.then((response: AxiosResponse) => {
					setIntent(response.data);
				})
				.catch((error: AxiosError) => {
					alert("サーバーでエラーが発生しました．(Dialogflow intent更新)");
					throw new Error(error.message);
				});
		} catch (error: any) {
			console.error(error);
		}
	};

	const updateQandA = async () => {
		try {
			await axios
				.put(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/${questionIndex}/answer`,
					{
						questionText: questionText,
						answerText: answerText,
						isShared: shared,
						intentName: intent?.intentName,
					}
				)
				.then((response: AxiosResponse) => {
					console.log(response);
				})
				.catch((error: AxiosError) => {
					alert("サーバーでエラーが発生しました．(DB 回答追加)");
					throw new Error(error.message);
				});
		} catch (e) {
			console.error(e);
		}
	};

	const setAnswerHandler = async () => {
		try {
			await postIntent();
			await updateQandA();
		} catch (e) {
			console.error(e);
		}
	};

	return {
		answerText,
		setAnswerText,
		shared,
		setShared,
		setAnswerHandler,
	};
};

export default usePostAnswer;
