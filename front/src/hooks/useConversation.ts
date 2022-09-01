import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { ConversationMessage } from "@/types/models";

/**
 * 質問対応のメッセージ群の管理
 */
const useConversationData = (questionId: number) => {
	const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);

	useEffect(() => {
		getConversationDataHandler(questionId);
	}, []);

	/**
	 * データベースからメッセージ群を取得する
	 */
	const getConversationDataHandler = (questionId: number) => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/conversation?index=${questionId}`
			)
			.then((response: AxiosResponse<ConversationMessage[]>) => {
				const { data } = response;
				setConversationMessages(data); // stateを更新
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
			});
	};

	// TODO: メッセージを送信する関数として，usePostMessage, usePostImageを統合する

	return conversationMessages;
};

export default useConversationData;
