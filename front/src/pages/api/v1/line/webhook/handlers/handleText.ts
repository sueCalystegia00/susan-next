import type { DialogflowContext } from "@/types/models";
import type { postMessageLogParams } from "@/types/payloads";
import type {
	Message,
	TextEventMessage,
	TextMessage,
	EventSource,
	StickerMessage,
} from "@line/bot-sdk/lib/types";
import { lineClient } from "@/pages/api/v1/line/libs";
import { detectIntent } from "@/pages/api/v1/dialogflow/sessions/detectIntent";
import {
	autoAnswerFlexMessage,
	checkInputNewQuestion,
	completeSendNewQuestion,
	offerSendNewMessage,
} from "../../libs/flexMessages";
import calcLectureNumber from "@/utils/calcLectureNumber";
import getInputQuestion from "../../libs/connectDB/getInputQuestion";
import postNewQuestion from "../../libs/connectDB/postNewQuestion";

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
	let replyMessage: Message[] = [
		{
			type: "text",
			text: "すみません，よくわかりませんでした🤔",
		},
	];

	// Dialogflowにテキストを送信・解析結果から応答を生成する
	/**
	 * Dialogflowの解析結果
	 */
	const nlpResult = await detectIntent(message.id, message.text, contexts);
	if (!nlpResult.queryResult) throw new Error("queryResultが存在しません");

	switch (nlpResult.queryResult.action) {
		case "QuestionStart": // input:「質問があります」
		case "AskTheTeacherDirectly": // input:「(質問を)書き直す」
			// 質問文の入力を促すメッセージを返す
			const { type, number } = calcLectureNumber(new Date());
			replyMessage = [
				{
					type: "text",
					text:
						type && number
							? `データサイエンス入門${type}第${number}回講義の質問を受付中です！256字未満で具体的に書いてもらえる？😊`
							: "質問を256字未満で具体的に書いてもらえる？😊",
				} as TextMessage,
			];
			break;

		case "AnswerToTheQuestion": // 自動回答
			let autoAnswerParameters = nlpResult.queryResult.parameters!.fields!;
			replyMessage = [
				autoAnswerFlexMessage(
					Number(autoAnswerParameters["questionIndex"].stringValue!),
					autoAnswerParameters["originQuestion"].stringValue!,
					nlpResult.queryResult.fulfillmentText!,
					Number(autoAnswerParameters["lectureNumber"].stringValue!)
				),
			];
			break;

		case "NotFoundAnswer":
		case "RequestDifferentAnswer":
			// 質問文の確認・送信または修正を促すメッセージを返す
			replyMessage = [
				offerSendNewMessage(await getInputQuestion(source.userId!)),
			];
			break;

		case "FreeWriting":
			// 書き直した質問文の確認・送信または修正を促すメッセージを返す
			replyMessage = [
				checkInputNewQuestion(await getInputQuestion(source.userId!)),
			];
			break;

		case "CompleteWritingQuestion": // input:「質問を送信する」
			// 質問文の送信完了を伝えるメッセージを返す
			// 質問文をDBに登録する
			const { questionIndex, discussionIndex } = await postNewQuestion({
				userId: source.userId!,
				lectureNumber: calcLectureNumber(new Date()).number,
				questionText: await getInputQuestion(source.userId!),
			});
			replyMessage = [completeSendNewQuestion(questionIndex)];
			nlpResult.queryResult.outputContexts = null; // 質問送信後はcontextを削除する
			break;

		case "cancel":
			// 処理をキャンセル・コンテキストをリセット
			replyMessage = [
				{
					type: "text",
					text: "また質問してね！",
				} as TextMessage,
				{
					type: "sticker",
					packageId: "11539",
					stickerId: "52114128",
				} as StickerMessage,
			];
			nlpResult.queryResult.outputContexts = null; // contextを削除する
			break;

		default:
			// 原則DialogflowのIntentに設定しているResponseを返す，設定されていない場合は不明なメッセージとして返答するふぃｘ
			replyMessage = nlpResult.queryResult.fulfillmentText
				? [
						{
							type: "text",
							text: `${nlpResult.queryResult.fulfillmentText}`,
						} as TextMessage,
				  ]
				: [
						{
							type: "text",
							text: `すみません，よくわかりませんでした🤔`,
						} as TextMessage,
						{
							type: "sticker",
							packageId: "11539",
							stickerId: "52114129",
						} as StickerMessage,
				  ];
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
		messageType: replyMessage[0].type,
		message:
			("text" in replyMessage[0] && replyMessage[0].text) ||
			("altText" in replyMessage[0] && replyMessage[0].altText) ||
			"unknown message",
		context: nlpResult.queryResult.outputContexts
			? (nlpResult.queryResult.outputContexts[0] as DialogflowContext)
			: null,
	};

	return { messageAPIResponse, messageLog };
};

export default handleText;
