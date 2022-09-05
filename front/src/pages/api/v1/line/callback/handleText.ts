import { Client, TextEventMessage } from "@line/bot-sdk";
import type { TextMessage, EventSource } from "@line/bot-sdk";
import { config } from "../libs/config";
import { getLatestContexts } from "../libs/connectDB";
import { AxiosError } from "axios";
import { replyText } from "../libs/replyText";
import { contextLog } from "@/types/models";
import { pickContextName } from "../libs/pickContextName";

// create LINE SDK client
const client = new Client(config);

/**
 * LINEbotのテキストメッセージを受け取ったときの処理
 */
const handleText = async (
	event: TextEventMessage,
	replyToken: string,
	source: EventSource
) => {
	try {
		// ユーザーの最新のコンテキストを取得
		const latestContexts = await getLatestContexts(source.userId!).then(
			(contexts: contextLog[]) => {
				return contexts.map((context) => pickContextName(context));
			}
		);
		// create a echoing text message
		const echo: TextMessage[] = [
			{ type: "text", text: event.text },
			{ type: "text", text: `context: ${latestContexts[0]}` },
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
