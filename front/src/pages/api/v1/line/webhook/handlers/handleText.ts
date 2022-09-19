import type { TextEventMessage, TextMessage, EventSource } from "@line/bot-sdk";
import { lineClient, pickContextId } from "@/pages/api/v1/line/libs";
import { postMessageLog } from "@/pages/api/v1/line/libs/connectDB";
import { AxiosError } from "axios";
import type { DialogflowContext } from "@/types/models";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";

/**
 * LINEbotのテキストメッセージを受け取ったときの処理
 */
const handleText = async (
	message: TextEventMessage,
	contexts: DialogflowContext[],
	replyToken: string,
	source: EventSource
) => {
	try {
		// 受信メッセージをログに保存
		await postMessageLog(
			source.userId!,
			message.type,
			message.text,
			"student",
			contexts[0]
		);

		const nlpResult = await detectIntent(message.id, message.text, contexts);
		//TODO: 解析結果を基にメッセージを返す

		// create a echoing text message
		const echo: TextMessage[] = [
			{
				type: "text",
				text: `${JSON.stringify(message)}`,
			},
			{
				type: "text",
				text: `${nlpResult.queryResult?.action || "no action"}`,
			},
		];
		// use reply API
		return lineClient.replyMessage(replyToken, echo);
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			throw new AxiosError("データベースへの接続に失敗しました");
		} else {
			throw new Error("入力文の解析に失敗しました");
		}
	}
};

export default handleText;
