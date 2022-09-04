import { DialogflowIntent, Question } from "@/types/models";
import { PostDialogflowIntentPayload } from "@/types/payloads";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const useDialogflowIntent = (existedintentName: string | undefined) => {
	const [intent, setIntent] = useState<DialogflowIntent>(
		{} as DialogflowIntent
	);

	useEffect(() => {
		!!existedintentName && getIntentData(existedintentName);
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
	const postIntent = async (questionIndex: number) => {
		try {
			return await axios
				.post(
					`/api/v1/dialogflow${
						intent?.intentName ? "?intentName=" + intent.intentName : ""
					}`,
					{
						questionIndex: questionIndex,
						intentName: intent?.intentName,
						trainingPhrases: intent?.trainingPhrases,
						responseText: intent!.responseText,
					} as PostDialogflowIntentPayload
				)
				.then((response: AxiosResponse<DialogflowIntent>) => {
					setIntent(response.data);
					return intent;
				});
		} catch (error) {
			if (error instanceof AxiosError) {
				alert("サーバーでエラーが発生しました．(Dialogflow intent更新)");
				throw new Error(error.message);
			}
		}
	};

	return {
		intent,
		setIntent,
		getIntentData,
		postIntent,
	};
};

export default useDialogflowIntent;
