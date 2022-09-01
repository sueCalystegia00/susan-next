import axios, { AxiosResponse, AxiosError } from "axios";
import { useContext, useState } from "react";
import type { ConversationMessage } from "@/types/models";
import { AuthContext } from "@/contexts/AuthContext";

const usePostMessage = (questionIndex: number) => {
	const { user } = useContext(AuthContext);
	const [text, setText] = useState<ConversationMessage["MessageText"]>("");
	const [messageType, setMessageType] =
		useState<ConversationMessage["MessageType"]>("chat");

	const postConversationMessage = () => {
		axios
			.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/message`, {
				index: questionIndex,
				userId: user?.userUid,
				messageType: messageType,
				message: text,
				userType: user?.position,
			})
			.then((response: AxiosResponse<ConversationMessage>) => {
				const { data } = response;
				console.log(data);
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
			});
	};

	return {
		text,
		setText,
		messageType,
		setMessageType,
		postConversationMessage,
	};
};

export default usePostMessage;
