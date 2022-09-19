import type { TextEventMessage, TextMessage, EventSource } from "@line/bot-sdk";
import { lineClient, pickContextId } from "@/pages/api/v1/line/libs";
import { postMessageLog } from "@/pages/api/v1/line/libs/connectDB";
import { AxiosError } from "axios";
import type { DialogflowContext } from "@/types/models";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";
import { Message } from "@line/bot-sdk/lib/types";

/**
 * LINE botから返信するメッセージ
 */
let replyMessage: Message = {
	type: "text",
	text: "すみません，よくわかりませんでした🤔",
};
/**
 * DBに保存するログメッセージ
 */
let abstractMessage: string = "すみません，よくわかりませんでした🤔";

/**
 * LINE botのテキストメッセージを受け取ったときの処理
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
	} catch (error: any) {
		if (error instanceof AxiosError) {
			throw new AxiosError("データベースへの接続に失敗しました");
		} else {
			throw new Error("予期せぬエラーが発生しました");
		}
	}

	try {
		/**
		 * Dialogflowの解析結果
		 */
		const nlpResult = await detectIntent(message.id, message.text, contexts);
		if (!nlpResult.queryResult) throw new Error("queryResultが存在しません");

		switch (nlpResult.queryResult.action) {
			case "QuestionStart":
				replyMessage = {
					type: "text",
					text: "質問を256字未満で具体的に書いてもらえる？\nメッセージの確認してから送信するか決められますよ😊",
				} as TextMessage;
				abstractMessage = replyMessage.text;
				break;

			default:
				// create a echoing text message
				replyMessage = {
					type: "text",
					text: `${JSON.stringify(message)}`,
				} as TextMessage;
				abstractMessage = "すみません，よくわかりませんでした🤔";
		}

		// 受信メッセージをログに保存
		await postMessageLog(
			source.userId!,
			replyMessage.type,
			abstractMessage,
			"bot",
			nlpResult.queryResult.outputContexts![0] as DialogflowContext
		);

		// use reply API
		return lineClient.replyMessage(replyToken, replyMessage);
	} catch (error) {
		throw new Error("入力文の解析に失敗しました");
	}
};

export default handleText;
