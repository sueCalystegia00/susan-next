import type { EventSource } from "@line/bot-sdk";
import { lineClient } from "@/pages/api/v1/line/libs";
import { followFlexMessage } from "@/pages/api/v1/line/libs/flexMessages";

const handleFollow = async (replyToken: string, source: EventSource) => {
	await lineClient.replyMessage(replyToken, followFlexMessage);
};

export default handleFollow;
