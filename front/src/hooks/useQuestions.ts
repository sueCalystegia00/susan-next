import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { Question } from "@/types/models";
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
const useQuestionsData = (questionIndex?: number) => {
	/**
	 * @var セッションストレージから取得した質問情報
	 */
	const sessionQuestionsData = sessionStorage.getItem(STORAGE_KEY_QUESTIONS);

	// セッションストレージに質問情報があればそれを利用，なければ空配列を初期値とする
	const [questions, setQuestions] = useState<Question[]>(
		sessionQuestionsData ? JSON.parse(sessionQuestionsData) : []
	);

	const [openingQuestion, setOpeningQuestion] = useState<
		Question | undefined
	>();

	// 初回のみ，質問情報がなければ取得を試みる
	useEffect(() => {
		!questions.length && getQuestionsDataHandler();
	}, []);

	useEffect(() => {
		if (!questionIndex) return;
		const q = questions.find((question) => question.index === questionIndex);
		q ? setOpeningQuestion(q) : getOneQuestionDataHandler(questionIndex);
	}, [questionIndex, questions]);

	/**
	 * データベースから質疑応答情報を取得，stateのquestionsに追加する
	 */
	const getQuestionsDataHandler = async () => {
		try {
			const { status, data } = await axios.get<Question[]>(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL
				}/api/v2/questions/list?startIndex=${questions.slice(-1)[0]?.index}`
			);
			if (status === 200) {
				// indexで降順ソート
				const sortedQuestions = [...questions, ...data].sort((pre, cur) =>
					pre.index > cur.index ? -1 : 1
				);
				// セッションストレージに保存
				sessionStorage.setItem(
					STORAGE_KEY_QUESTIONS,
					JSON.stringify(sortedQuestions)
				);
				setQuestions(sortedQuestions); // stateを更新
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response);
			} else {
				console.error(error);
			}
		}
	};

	/**
	 * 指定の質疑応答情報を1件取得する関数
	 * @param questionId 質疑応答情報のID
	 * @returns question: 質疑応答情報
	 */
	const getOneQuestionDataHandler = async (questionId: number) => {
		try {
			const { status, data } = await axios.get<Question>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/${questionId}`
			);
			if (status === 200) {
				setOpeningQuestion(data);
			}
		} catch (error) {
			console.error(error);
			router.push("/404");
		}
	};

	/**
	 * 質疑応答情報を更新する
	 * @param questionIndex 質疑応答情報のID
	 * @param updatedQandA 更新する質疑応答情報
	 */
	const updateQandA = async (updateAnswerPayload: UpdateAnswerPayload) => {
		try {
			const { status, data } = await axios.put<Question>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/${updateAnswerPayload.index}/answer`,
				{
					questionText: updateAnswerPayload.questionText,
					answerText: updateAnswerPayload.answerText,
					broadcast: updateAnswerPayload.broadcast,
					intentName: updateAnswerPayload.intentName,
				}
			);
			if (status === 201) {
				const updatedQuestions = questions.reduce((acc, question) => {
					if (data.index === question.index) {
						acc.push(data);
					} else {
						acc.push(question);
					}
					return acc;
				}, [] as Question[]);

				setQuestions(updatedQuestions);
				sessionStorage.setItem(
					STORAGE_KEY_QUESTIONS,
					JSON.stringify(updatedQuestions)
				);
			} else {
				throw new Error("質問・回答の更新に失敗しました");
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw new AxiosError(`update answer: ${error.response}`);
			} else {
				throw new Error(
					`update answer: ${error.response || "不明なエラーが発生しました"}`
				);
			}
		}
	};

	return {
		openingQuestion,
		questions,
		getQuestionsDataHandler,
		getOneQuestionDataHandler,
		updateQandA,
	};
};

export default useQuestionsData;
