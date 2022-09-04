import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { Question, Questions } from "@/types/models";
import router from "next/router";
import { UpdateAnswerPayload } from "@/types/payloads";

/**
 * 質疑応答情報を保存するセッションストレージのキー
 */
const STORAGE_KEY_QUESTIONS = "yoslab/susan-next/questionsList";

/**
 * 質疑応答情報の管理
 * @returns questions: 質疑応答情報
 * @returns isHasMore: 追加取得可能かどうか
 * @returns getQuestionsDataHandler: 質疑応答情報を30件取得する関数
 * @returns getOneQuestionDataHandler: 指定の質疑応答情報を1件取得する関数
 */
const useQuestionsData = () => {
	const sessionQuestionsData = sessionStorage.getItem(STORAGE_KEY_QUESTIONS); // セッションストレージから質疑応答情報を取得
	const [questions, setQuestions] = useState<Questions>(
		sessionQuestionsData ? JSON.parse(sessionQuestionsData) : {} // セッションストレージに質疑応答情報があればそれを利用，なければ空オブジェクトを利用
	);
	const [startIndex, setStartIndex] = useState(0); // 質疑応答情報の取得開始インデックス
	const [isHasMore, setIsHasMore] = useState(true);

	// 質疑応答情報が変わったら取得開始インデックスを更新する
	useEffect(() => {
		let dataKeys = questions ? Object.keys(questions) : [];
		setStartIndex(
			dataKeys.length < 30
				? 0
				: Number(dataKeys.reverse()[((dataKeys.length / 30) | 0) * 30 - 1]) //(dataKeys.length/30 | 0)は少数以下切り捨ての除算(ビット演算子利用，Math.floorより気持ち速いらしい)
		);
		setIsHasMore("1" in dataKeys); // index:1 が含まれているかどうかで追加取得可能かどうかを判断
	}, [questions]);

	useEffect(() => {
		Object.keys(questions).length === 0 && getQuestionsDataHandler();
	}, []);

	/**
	 * データベースから質疑応答情報を取得する
	 */
	const getQuestionsDataHandler = () => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/list?startIndex=${startIndex}`
			)
			.then((response: AxiosResponse<Questions>) => {
				const { data } = response;
				// セッションストレージに保存
				sessionStorage.setItem(
					STORAGE_KEY_QUESTIONS,
					JSON.stringify({ ...questions, ...data })
				);
				setQuestions({ ...questions, ...data }); // stateを更新
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
			});
	};

	/**
	 * 指定の質疑応答情報を1件取得する関数
	 * @param questionId 質疑応答情報のID
	 * @returns question: 質疑応答情報
	 */
	const getOneQuestionDataHandler = (questionId: number) => {
		return axios
			.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/specified?index=${questionId}`
			)
			.then((response: AxiosResponse<Question>) => {
				const { data } = response;
				return data;
			})
			.catch((error: AxiosError) => {
				const { response } = error;
				if (response!.status === 404) {
					alert("指定の質問が見つかりませんでした．");
					router.push(`/questionsList`);
				} else {
					alert("サーバーでエラーが発生しました．");
					console.error(error);
				}
			});
	};

	/**
	 * 質疑応答情報を更新する
	 * @param questionIndex 質疑応答情報のID
	 * @param updatedQandA 更新する質疑応答情報
	 */
	const updateQandA = async (
		questionIndex: number,
		payload: UpdateAnswerPayload
	) => {
		try {
			return await axios
				.put(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/${questionIndex}/answer`,
					{
						questionText: payload.questionText,
						answerText: payload.answerText,
						isShared: payload.isShared,
						intentName: payload.intentName,
					}
				)
				.then((response: AxiosResponse<Questions>) => {
					const { data } = response;
					Object.entries(data).map(([questionIndex, question]) => {
						if (!questions[Number(questionIndex)]) return;
						setQuestions({ ...questions, [questionIndex]: question });
						sessionStorage.setItem(
							STORAGE_KEY_QUESTIONS,
							JSON.stringify({ ...questions, [questionIndex]: question })
						);
					});
					return data;
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
		questions,
		isHasMore,
		getQuestionsDataHandler,
		getOneQuestionDataHandler,
		updateQandA,
	};
};

export default useQuestionsData;
