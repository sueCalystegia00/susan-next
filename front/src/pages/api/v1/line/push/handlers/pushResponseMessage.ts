import { PushLineMessagePayload } from "@/types/payloads";
import { lineClient } from "../../libs";
import {
	questionResponseMessage,
	questionAnswerMessage,
} from "../../libs/flexMessages";

/**
 * 質疑応答の回答をLINEに送信する
 * @note event.type == "response" or "answer"
 */
const pushResponseMessage = async ({
	userIds,
	broadcast,
	event,
}: PushLineMessagePayload) => {
	// 質問に対する回答を送信
	const { questionIndex, questionText } = event.message.question!;
	const message = () => {
		if (event.type == "response") {
			return questionResponseMessage(questionIndex, event.message.text);
		} else if (event.type == "answer") {
			return questionAnswerMessage(
				questionIndex,
				questionText,
				event.message.text
			);
		} else {
			throw new Error("event type is invalid");
		}
	};

	if (userIds.length == 1) {
		await lineClient.pushMessage(userIds[0], message());
	} else if (userIds.length > 1) {
		await lineClient.multicast(userIds, message());
	} else if (!userIds.length && broadcast) {
		await lineClient.broadcast(message());
	} else {
		throw new Error("destination is required");
	}
};

export default pushResponseMessage;
