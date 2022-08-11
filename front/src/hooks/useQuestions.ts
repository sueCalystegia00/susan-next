import axios, { AxiosResponse, AxiosError } from "axios";
import { useState } from "react";
import type { Question } from "@/types/models";

interface Questions {
	[key: string]: Question;
}

/**
 * DBから質疑応答情報を30件ずつ取得する
 */
const useQuestionsData = () => {
	const [questions, setQuestions] = useState<Questions>({});
	const [isHasMore, setIsHasMore] = useState(true);

	let dataKeys = Object.keys(questions);
	const startIndex =
		dataKeys.length < 30
			? 0
			: dataKeys.reverse()[((dataKeys.length / 30) | 0) * 30 - 1]; //(dataKeys.length/30 | 0)は少数以下切り捨ての除算(ビット演算子利用，Math.floorより気持ち速いらしい)

	const getQuestionsDataHandler = async () => {
		await axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/list`, {
				params: { startIndex: startIndex },
			})
			.then((response: AxiosResponse<Questions>) => {
				const { data } = response;
				setQuestions({ ...questions, ...data });
				Object.keys(data).length < 30 && setIsHasMore(false);
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
			});
	};

	return { questions, isHasMore, getQuestionsDataHandler };
};

export default useQuestionsData;
