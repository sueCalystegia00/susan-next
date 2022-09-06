import { DialogflowIntent, Question } from "@/types/models";
import { PostDialogflowIntentPayload } from "@/types/payloads";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const useDialogflowIntent = (
	questionText: Question["QuestionText"],
	existedIntentName: DialogflowIntent["intentName"] | undefined
) => {
	const [intent, setIntent] = useState<DialogflowIntent>({
		trainingPhrases: [questionText],
	} as DialogflowIntent);

	useEffect(() => {
		!!existedIntentName && getIntentData(existedIntentName);
	}, []);

	/**
	 * DialogflowのIntentに登録されているトレーニングフレーズを取得する
	 * @param intentName
	 * @return intent
	 */
	const getIntentData = (intentName: string) => {
		try {
			axios
				.get(`/api/v1/dialogflow/intents?intentName=${intentName}`)
				.then((response: AxiosResponse) => {
					setIntent(response.data);
				});
		} catch (error: any) {
			if (error instanceof AxiosError) {
				alert("サーバーでエラーが発生しました．");
				throw new Error(error.message);
			}
		}
	};

	/**
	 * DialogflowのIntentを更新する
	 */
	const postIntent = async (questionIndex: number) => {
		try {
			return await axios
				.post(
					`/api/v1/dialogflow/intents${
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
			} else {
				console.error(error);
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
