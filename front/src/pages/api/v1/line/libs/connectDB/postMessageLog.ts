import { postMessageLogParams } from "@/types/payloads";
import axios from "axios";

const postMessageLog = async ({
	userId,
	messageType,
	message,
	userType,
	context,
}: postMessageLogParams) => {
	try {
		const { status, data } = await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/line/message`,
			{
				userId,
				messageType,
				message,
				sender: userType,
				contextName: context?.name,
				lifespanCount: context?.lifespanCount,
			}
		);
		return status;
	} catch (error: any) {
		throw error;
	}
};
export default postMessageLog;
