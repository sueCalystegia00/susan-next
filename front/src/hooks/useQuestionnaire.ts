import { User } from "@/types/models";
import axios, { AxiosError } from "axios";
import { useState } from "react";

/**
 * アンケートの管理を行うカスタムフック
 * @param userIdToken ユーザーIDトークン
 * @returns
 */
const useQuestionnaire = (userIdToken?: User["token"]) => {
	/**
	 * アンケートの回答状況
	 */
	const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] =
		useState(false);

	/**
	 * アンケートの回答状況を確認する
	 */
	const checkIsQuestionnaireCompleted = async () => {
		try {
			const { status, data } = await axios.get<{
				isQuestionnaireCompleted: boolean;
			}>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questionnaire?userIdToken=${userIdToken}`
			);
			if (status === 200) {
				setIsQuestionnaireCompleted(data.isQuestionnaireCompleted);
			} else {
				throw new Error("failed to check questionnaire");
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				const { status, data } = error.response!;
			}
			throw error;
		}
	};

	/**
	 * アンケートの回答を送信する
	 * @param payload アンケートの回答
	 */
	const postQuestionnaire = async (payload: {}) => {
		try {
			const { status, data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questionnaire`,
				{
					userIdToken,
					questionnaire: payload,
				}
			);
			if (status === 201) {
				setIsQuestionnaireCompleted(true);
			} else {
				throw new Error("failed to post questionnaire");
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				const { status, data } = error.response!;
			}
			throw error;
		}
	};

	return {
		isQuestionnaireCompleted,
		checkIsQuestionnaireCompleted,
		postQuestionnaire,
	};
};

export default useQuestionnaire;
