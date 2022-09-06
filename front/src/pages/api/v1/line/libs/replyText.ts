import { Client } from "@line/bot-sdk";
import { config } from "../libs/config";

// create LINE SDK client
const client = new Client(config);

// simple reply function
export const replyText = (token: string, texts: string | string[]) => {
	texts = Array.isArray(texts) ? texts : [texts];
	return client.replyMessage(
		token,
		texts.map((text) => ({ type: "text", text }))
	);
};
