import type { DialogflowContext } from "@/types/models";
import type { postMessageLogParams } from "@/types/payloads";
import type {
	Message,
	TextEventMessage,
	TextMessage,
	EventSource,
} from "@line/bot-sdk/lib/types";
import { lineClient } from "@/pages/api/v1/line/libs";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";
import { offerSendNewMessage } from "../../libs/flexMessages";
import calcLectureNumber from "@/utils/calcLectureNumber";
import getInputQuestion from "../../libs/connectDB/getInputQuestion";

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
			// 質問文の入力を促すメッセージを返す
			const { type, number } = calcLectureNumber(new Date());
			replyMessage = {
				type: "text",
				text:
					type && number
						? `データサイエンス入門${type}第${number}回講義の質問を受付中です！256字未満で具体的に書いてもらえる？😊`
						: "質問を256字未満で具体的に書いてもらえる？😊",
			} as TextMessage;
			break;

		case "NotFoundAnswer":
		case "RequestDifferentAnswer":
			// 質問文の確認・送信または修正を促すメッセージを返す
			const inputQuestionText = await getInputQuestion(source.userId!);
			replyMessage = offerSendNewMessage(inputQuestionText);
			break;

		default:
			// create a echoing text message
			replyMessage = {
				type: "text",
				text: `${message.text}...？ すみません，よくわかりませんでした🤔`,
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
		message:
			replyMessage.type === "text"
				? replyMessage.text
				: replyMessage.altText || "unknown message",
		context: nlpResult.queryResult.outputContexts
			? (nlpResult.queryResult.outputContexts[0] as DialogflowContext)
			: null,
	};

	return { messageAPIResponse, messageLog };
};

export default handleText;
