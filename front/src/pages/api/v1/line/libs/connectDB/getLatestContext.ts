import { DialogflowContext, User } from "@/types/models";
import axios, { AxiosError, AxiosResponse } from "axios";

const getLatestContexts = async (userId: User["userUid"]) => {
	return await axios
		.get(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/line/context/${userId}`
		)
		.then((response: AxiosResponse<DialogflowContext[]>) => {
			const { data } = response;
			return data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

export default getLatestContexts;
