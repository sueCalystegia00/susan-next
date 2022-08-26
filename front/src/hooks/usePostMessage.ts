import axios, { AxiosResponse, AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import type { ConversationMessage } from "@/types/models";
import { PostConversationMessagePayload } from "@/types/payloads";
import { AuthContext } from "@/contexts/AuthContext";

const usePostMessage = (
	questionIndex: number,
	messageType: ConversationMessage["MessageType"]
) => {
	const { user } = useContext(AuthContext);
	const [text, setText] = useState<ConversationMessage["MessageText"]>("");
	const [payload, setPayload] = useState<PostConversationMessagePayload>();

	useEffect(() => {
		user &&
			setPayload({
				index: questionIndex,
				userId: user?.userUid,
				messageType: messageType,
				message: text,
				userType: user?.position,
			});
	}, [text]);

	const postConversationMessage = (payload: PostConversationMessagePayload) => {
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/message`,
				payload
			)
			.then((response: AxiosResponse<ConversationMessage>) => {
				const { data } = response;
				console.log(data);
			})
			.catch((error: AxiosError) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
			});
	};

	const postHandler = () => {
		!!payload?.message && postConversationMessage(payload);
	};

	return {
		text,
		setText,
		postHandler,
	};
};

export default usePostMessage;
