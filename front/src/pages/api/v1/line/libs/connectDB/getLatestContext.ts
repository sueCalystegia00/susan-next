import { User } from "@/types/models";
import axios, { AxiosError, AxiosResponse } from "axios";

const getLatestContext = async (userId: User["userUid"]) => {
	return await axios
		.get(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/line/context/${userId}`
		)
		.then((response: AxiosResponse) => {
			const { data } = response;
			return data;
		})
		.catch((error: AxiosError) => {
			alert("サーバーでエラーが発生しました．");
			console.error(error);
		});
};

export default getLatestContext;
