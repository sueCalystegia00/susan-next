import { Client, TextEventMessage } from "@line/bot-sdk";
import type { TextMessage, EventSource } from "@line/bot-sdk";
import { config } from "../libs/config";
import { postMessageLog } from "../libs/connectDB";
import { AxiosError } from "axios";
import { replyText } from "../libs/replyText";
import { DialogflowContext } from "@/types/models";
import { pickContextName } from "../libs/pickContextName";
import { detectIntent } from "../../dialogflow/sessions";

// create LINE SDK client
const client = new Client(config);

/**
 * LINEbotのテキストメッセージを受け取ったときの処理
 */
const handleText = async (
	event: TextEventMessage,
	contexts: DialogflowContext[],
	replyToken: string,
	source: EventSource
) => {
	try {
		// 受信メッセージをログに保存
		postMessageLog(
			source.userId!,
			event.type,
			event.text,
			"student",
			contexts[0]
		);

		const nlpResult = await detectIntent(event.text, contexts);

		// create a echoing text message
		const echo: TextMessage[] = [
			{ type: "text", text: JSON.stringify(nlpResult) },
		];
		// use reply API
		await client.replyMessage(replyToken, echo);
	} catch (error) {
		if (error instanceof AxiosError) {
			replyText(replyToken, "データベースに接続できませんでした．");
		} else {
			replyText(replyToken, "エラーが発生しました．");
		}
	}
};

export default handleText;
