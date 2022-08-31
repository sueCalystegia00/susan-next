import axios, { AxiosResponse, AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import type { ConversationMessage } from "@/types/models";
import { PostConversationImagePayload } from "@/types/payloads";
import { AuthContext } from "@/contexts/AuthContext";

const usePostImage = (questionIndex: number) => {
	const { user } = useContext(AuthContext);
	const [image, setImage] = useState<File>();
	const [payload, setPayload] = useState<PostConversationImagePayload>();

	useEffect(() => {
		user &&
			setPayload({
				index: questionIndex,
				userId: user?.userUid,
				file: image,
			});
	}, [image]);

	const postConversationImage = (payload: PostConversationImagePayload) => {
		const formData = new FormData();
		formData.append("index", payload.index.toString());
		formData.append("userId", payload.userId);
		formData.append("file", payload.file!);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/threads/image`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
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
		!!payload?.file && postConversationImage(payload);
	};

	return {
		image,
		setImage,
		postHandler,
	};
};

export default usePostImage;
