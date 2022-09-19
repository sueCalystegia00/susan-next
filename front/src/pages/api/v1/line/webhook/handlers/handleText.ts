import type { TextEventMessage, TextMessage, EventSource } from "@line/bot-sdk";
import { lineClient } from "@/pages/api/v1/line/libs";
import type { DialogflowContext } from "@/types/models";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";
import { Message } from "@line/bot-sdk/lib/types";
import { postMessageLogParams } from "@/types/payloads";

/**
 * LINE botのテキストメッセージを受け取ったときの処理
 */
const handleText = async (
	message: TextEventMessage,
	contexts: DialogflowContext[],
	replyToken: string,
	source: EventSource
) => {
	/**
	 * LINE botから返信するメッセージ
	 */
	let replyMessage: Message = {
		type: "text",
		text: "すみません，よくわかりませんでした🤔",
	};

	// Dialogflowにテキストを送信・解析結果から応答を生成する
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
			break;

		default:
			// create a echoing text message
			replyMessage = {
				type: "text",
				text: `${JSON.stringify(message)}`,
			} as TextMessage;
	}

	/**
	 * LINE botから返信した結果
	 */
	const messageAPIResponse = await lineClient.replyMessage(
		replyToken,
		replyMessage
	);
	const messageLog: postMessageLogParams = {
		userId: source.userId!,
		userType: "bot",
		messageType: replyMessage.type,
		message: replyMessage.text,
		context: nlpResult.queryResult.outputContexts
			? (nlpResult.queryResult.outputContexts[0] as DialogflowContext)
			: null,
	};

	return { messageAPIResponse, messageLog };
};

export default handleText;
