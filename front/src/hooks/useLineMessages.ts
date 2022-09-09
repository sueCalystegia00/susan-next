import { Question } from "@/types/models";
import type { PushLineMessagePayload } from "@/types/payloads";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";

const useLineMessages = (
	eventType: PushLineMessagePayload["event"]["type"],
	question?: Question
) => {
	const linePayload: PushLineMessagePayload = {
		userIds: [],
		broadcast: undefined,
		event: {
			type: eventType,
			message: {
				text: "",
			},
			question: {
				questionIndex: question?.index || 0,
				questionText: question?.questionText,
			},
		},
	};
	useEffect(() => {
		linePayload.event.question = {
			questionIndex: question?.index || 0,
			questionText: question?.questionText,
		};
	}, [question]);

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

	return { linePayload, pushLineMessage };
};
export default useLineMessages;
