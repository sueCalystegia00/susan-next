import { Client } from "@line/bot-sdk";
import linebotConfig from "./linebotConfig";

// create LINE SDK client
const client = new Client(linebotConfig);

// simple reply function
export const replyText = (token: string, texts: string | string[]) => {
	texts = Array.isArray(texts) ? texts : [texts];
	return client.replyMessage(
		token,
		texts.map((text) => ({ type: "text", text }))
	);
};
