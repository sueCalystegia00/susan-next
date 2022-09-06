import { Client } from "@line/bot-sdk";
import type { EventSource } from "@line/bot-sdk";
import { linebotConfig } from "@/pages/api/v1/line/libs";
import { followFlexMessage } from "@/pages/api/v1/line/libs/flexMessages";

// create LINE SDK client
const client = new Client(linebotConfig);

const handleFollow = async (replyToken: string, source: EventSource) => {
	await client.replyMessage(replyToken, followFlexMessage);
};

export default handleFollow;
