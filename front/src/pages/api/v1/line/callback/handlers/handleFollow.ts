import { Client } from "@line/bot-sdk";
import type { EventSource } from "@line/bot-sdk";
import { config } from "@/pages/api/v1/line/libs/config";
import { followFlexMessage } from "@/pages/api/v1/line/libs/flexMessages";

// create LINE SDK client
const client = new Client(config);

const handleFollow = async (replyToken: string, source: EventSource) => {
	await client.replyMessage(replyToken, followFlexMessage);
};

export default handleFollow;
