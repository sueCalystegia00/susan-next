import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { DiscussionMessage, User } from "@/types/models";
import { postDiscussionResponse } from "@/types/response";

/**
 * 質問対応のメッセージ群の管理
 */
const useDiscussionData = (userIdToken: User["token"], questionId: number) => {
	// メッセージ群を取得・保持する
	const [discussionMessages, setDiscussionMessages] = useState<
		DiscussionMessage[]
	>([]);
	useEffect(() => {
		getDiscussionMessages(questionId);
	}, []);

	/**
	 * データベースからメッセージ群を取得する
	 */
	const getDiscussionMessages = async (questionId: number) => {
		try {
			const { status, data } = await axios.get<DiscussionMessage[]>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/discussions/${questionId}`
			);
			if (status === 200) {
				setDiscussionMessages(data);
			} else {
				throw new Error("データベースからの取得に失敗しました");
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw new AxiosError(`get discussion: ${error.message}`);
			} else {
				throw new Error(`get discussion: ${error.message || "unknown error"}`);
			}
		}
	};

	// メッセージを送信する
	const [messageType, setMessageType] =
		useState<DiscussionMessage["messageType"]>("chat");

	// テキスト
	const [text, setText] = useState<DiscussionMessage["message"]>("");

	const postDiscussionMessage = async () => {
		try {
			const { status, data } = await axios.post<postDiscussionResponse>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/message`,
				{
					index: questionId,
					userIdToken: userIdToken,
					messageType: messageType,
					message: text,
				}
			);
			if (status == 201) {
				setDiscussionMessages([...discussionMessages, data.insertedData]);
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

	const postDiscussionImage = async () => {
		const formData = new FormData();
		formData.append("index", questionId.toString());
		formData.append("userIdToken", userIdToken);
		formData.append("file", image!);
		try {
			const { status, data } = await axios.post<postDiscussionResponse>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/image`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (status !== 201) throw new Error("画像の送信に失敗しました");
			setDiscussionMessages([...discussionMessages, data.insertedData]);
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
		discussionMessages,
		getDiscussionMessages,
		text,
		setText,
		messageType,
		setMessageType,
		postDiscussionMessage,
		image,
		setImage,
		postDiscussionImage,
	};
};

export default useDiscussionData;
