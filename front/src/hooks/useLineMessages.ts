import type { PushLineMessagePayload } from "@/types/payloads";
import axios, { AxiosError, AxiosResponse } from "axios";

const useLineMessages = () => {
	const pushLineMessage = async (payload: PushLineMessagePayload) => {
		try {
			const { status, data } = await axios.post<AxiosResponse>(
				"/api/v1/line/push",
				payload
			);
			if (status !== 200) {
				throw new Error("pushLineMessage failed");
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.message);
				throw new AxiosError(error.message);
			} else {
				console.error(error);
				throw new Error("サーバー通信時にエラーが発生しました．");
			}
		}
	};

	return { pushLineMessage };
};
export default useLineMessages;
