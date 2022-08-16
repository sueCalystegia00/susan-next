import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { Question } from "@/types/models";

interface Questions {
	[key: number]: Question;
}

/**
 * 質疑応答情報を保存するセッションストレージのキー
 */
const STORAGE_KEY_QUESTIONS = "yoslab/susan-next/questionsList";

/**
 * 質疑応答情報の管理
 * @returns questions: 質疑応答情報
 * @returns isHasMore: 追加取得可能かどうか
 * @returns getQuestionsDataHandler: 質疑応答情報を取得する関数
 *
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
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/list`, {
				params: { startIndex: startIndex },
			})
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

	return { questions, isHasMore, getQuestionsDataHandler };
};

export default useQuestionsData;
