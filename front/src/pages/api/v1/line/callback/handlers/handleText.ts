import { Client, EventMessageBase, TextEventMessage } from "@line/bot-sdk";
import type { TextMessage, EventSource } from "@line/bot-sdk";
import { linebotConfig, pickContextId } from "@/pages/api/v1/line/libs";
import { postMessageLog } from "@/pages/api/v1/line/libs/connectDB";
import { AxiosError } from "axios";
import type { DialogflowContext } from "@/types/models";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";

// create LINE SDK client
const client = new Client(linebotConfig);

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

		const nlpResult = await detectIntent(event.id, event.text, contexts);

		// create a echoing text message
		const echo: TextMessage[] = [
			{
				type: "text",
				text: `${JSON.stringify(event)}`,
			},
			{
				type: "text",
				text: `${nlpResult.queryResult?.action || "no action"}`,
			},
		];
		// use reply API
		return client.replyMessage(replyToken, echo);
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			throw new Error("データベースへの接続に失敗しました");
		} else {
			throw new Error("入力文の解析に失敗しました");
		}
	}
};

export default handleText;
