import axios, { AxiosResponse, AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import type { ConversationMessage } from "@/types/models";
import { AuthContext } from "@/contexts/AuthContext";
import { postConversationResponse } from "@/types/response";

/**
 * 質問対応のメッセージ群の管理
 */
const useConversationData = (questionId: number) => {
	const { user } = useContext(AuthContext);

	// メッセージ群を取得・保持する
	const [conversationMessages, setConversationMessages] = useState<
		ConversationMessage[]
	>([]);
	useEffect(() => {
		getConversationMessages(questionId);
	}, []);

	/**
	 * データベースからメッセージ群を取得する
	 */
	const getConversationMessages = (questionId: number) => {
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

	// メッセージを送信する
	const [messageType, setMessageType] =
		useState<ConversationMessage["MessageType"]>("chat");

	// テキスト
	const [text, setText] = useState<ConversationMessage["MessageText"]>("");

	const postConversationMessage = async () => {
		try {
			const { status, data } = await axios.post<postConversationResponse>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/message`,
				{
					index: questionId,
					userId: user?.userUid,
					messageType: messageType,
					message: text,
					userType: user?.position,
				}
			);
			if (status == 201) {
				setConversationMessages([...conversationMessages, data.insertedData]);
				return data;
			} else {
				throw new Error("メッセージの送信に失敗しました");
			}
		} catch (error: any) {
			console.error(error);
			if (error instanceof AxiosError) {
				throw new AxiosError(error.message);
			} else {
				throw new Error(
					error.message || "サーバー通信時にエラーが発生しました．"
				);
			}
		}
	};

	// 画像
	const [image, setImage] = useState<File>();

	const postConversationImage = async () => {
		const formData = new FormData();
		formData.append("index", questionId.toString());
		formData.append("userId", user!.userUid);
		formData.append("file", image!);
		try {
			const { status, data } = await axios.post<postConversationResponse>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/image`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (status !== 201) throw new Error("画像の送信に失敗しました");
			setConversationMessages([...conversationMessages, data.insertedData]);
			return data;
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw new AxiosError(`upload image: ${error.message}`);
			} else {
				throw new Error(`upload image: ${error.message || "unkown error"}`);
			}
		}
	};

	return {
		conversationMessages,
		getConversationMessages,
		text,
		setText,
		messageType,
		setMessageType,
		postConversationMessage,
		image,
		setImage,
		postConversationImage,
	};
};

export default useConversationData;
