import { Client, TextEventMessage } from "@line/bot-sdk";
import type { TextMessage, EventSource } from "@line/bot-sdk";
import { config } from "../libs/config";

// create LINE SDK client
const client = new Client(config);

const handleText = async (
	event: TextEventMessage,
	replyToken: string,
	source: EventSource
) => {
	// create a echoing text message
	const echo: TextMessage = { type: "text", text: event.text };
	// use reply API
	await client.replyMessage(replyToken, echo);
};

export default handleText;
