import type { DialogflowContext, User } from "@/types/models";
import type { EventMessage } from "@line/bot-sdk";
import axios, { AxiosError, AxiosResponse } from "axios";

const postMessageLog = async (
	userId: User["userUid"],
	messageType: EventMessage["type"],
	message: string,
	userType: User["type"] | "bot",
	context: DialogflowContext
) => {
	return await axios
		.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/line/message`, {
			userId,
			messageType,
			message,
			sender: userType,
			contextName: context.name,
			lifespanCount: context.lifespanCount,
		})
		.then((response: AxiosResponse) => {
			const { status } = response;
			return status;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};
export default postMessageLog;
