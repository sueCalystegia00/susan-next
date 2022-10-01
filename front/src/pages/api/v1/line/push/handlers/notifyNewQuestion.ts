import type { Question, User } from "@/types/models";
import type { TextMessage } from "@line/bot-sdk/lib/types";
import { lineClient } from "../../libs";
/**
 * 新しい質問投稿を通知する
 */
const notifyNewQuestion = async ({
	userIds,
	questionIndex,
}: {
	userIds: User["userUid"][];
	questionIndex: Question["index"];
}) => {
	// 質問に対する回答を送信

	const message: TextMessage[] = [
		{
			type: "text",
			text: `質問が投稿されました ${questionIndex}`,
		},
	];

	try {
		return await lineClient.multicast(userIds, message);
	} catch (error) {
		throw new Error(
			JSON.stringify({ error: error, props: { userIds, message } })
		);
	}
};

export default notifyNewQuestion;
