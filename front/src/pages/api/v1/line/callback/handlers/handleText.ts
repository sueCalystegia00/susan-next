import {
	Client,
	MessageAPIResponseBase,
	TextEventMessage,
} from "@line/bot-sdk";
import type { TextMessage, EventSource } from "@line/bot-sdk";
import { config } from "@/pages/api/v1/line/libs/config";
import { postMessageLog } from "@/pages/api/v1/line/libs/connectDB";
import { AxiosError } from "axios";
import { replyText } from "@/pages/api/v1/line/libs/replyText";
import type { DialogflowContext } from "@/types/models";
import { pickContextId } from "@/pages/api/v1/line/libs/pickContextId";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";

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
			{
				type: "text",
				text: `${JSON.stringify(event)}`,
			},
			{
				type: "text",
				text: `${JSON.stringify(contexts)}`,
			},
			{
				type: "text",
				text: `${JSON.stringify(nlpResult)}`,
			},
		];
		// use reply API
		client.replyMessage(replyToken, echo).then(() => {
			console.log("success");
		});
	} catch (error) {
		if (error instanceof AxiosError) {
			replyText(replyToken, "データベースに接続できませんでした．");
		} else {
			replyText(replyToken, "エラーが発生しました．");
		}
	}
};

export default handleText;
