import { DialogflowIntent, Question } from "@/types/models";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const usePostAnswer = (questionIndex: number, question: Question) => {
	const [questionText, setQuestionText] = useState(question.QuestionText || "");
	const [answerText, setAnswerText] = useState(question.AnswerText || "");
	const [shared, setShared] = useState(question.Shared || false);

	const [trainingPhrases, setTrainingPhrases] = useState<
		DialogflowIntent["trainingPhrases"]
	>([question.QuestionText] || []);
	const [intent, setIntent] = useState<DialogflowIntent>();

	useEffect(() => {
		//TODO: ここでDialogflowからIntent情報(トレーニングフレーズ)を取得する
		//!!question.IntentName && getIntentTrainingPhrases(question.IntentName);
	}, []);

	/**
	 * DialogflowのIntentに登録されているトレーニングフレーズを取得する
	 * TODO: Next.jsのAPI Routesを使って，DialogflowのAPIを叩く
	 * @param intentName
	 * @return intent
	 */
	const getIntentTrainingPhrases = (intentName: string) => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/dialogflow/trainingPhrases?intentName=${intentName}`
			)
			.then((response: AxiosResponse) => {
				const { data } = response;
				data.map((phrase: string) =>
					setTrainingPhrases([...trainingPhrases, phrase])
				);
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				throw new Error(error.message);
			});
	};

	/**
	 * DialogflowのIntentを更新する
	 * TODO: Next.jsのAPI Routesを使って，DialogflowのAPIを叩く
	 * TODO: 処理の分離
	 */
	const setIntentToDialogflowAndMySQL = async () => {
		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/dialogflow/response`,
					{
						intentName: question.IntentName,
						trainingPhrases,
						responseText: answerText,
					}
				)
				.then((response: AxiosResponse) => {
					setIntent({
						intentName: response.data.intentName,
						trainingPhrases,
						responseText: answerText,
					});
				})
				.catch((error: AxiosError) => {
					alert("サーバーでエラーが発生しました．(Dialogflow intent更新)");
					throw new Error(error.message);
				});

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

	return {
		answerText,
		setAnswerText,
		shared,
		setShared,
		setIntentToDialogflowAndMySQL,
	};
};

export default usePostAnswer;
