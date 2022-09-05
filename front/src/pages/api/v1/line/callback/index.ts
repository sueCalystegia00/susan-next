import type { NextApiRequest, NextApiResponse } from "next";
import { validateSignature } from "../libs/validateSignature";
import { cors, runMiddleware } from "../libs/cors";
import { config } from "../libs/config";
import type { WebhookEvent } from "@line/bot-sdk";
import { handleFollow, handleText } from "./handlers";
import { replyText } from "../libs/replyText";
import { getLatestContexts } from "../libs/connectDB";
import { DialogflowContext } from "@/types/models";
import { pickContextId } from "../libs/pickContextId";
import detectIntent from "../libs/dialogflowNLP";

export default async function LineCallbackHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Run the middleware
	await runMiddleware(req, res, cors);

	const { method, body } = req;
	switch (method) {
		case "GET":
			// check this api is alive
			res.status(200).json({ message: "active!" });
			break;

		case "POST":
			// check signature
			if (
				!validateSignature(
					JSON.stringify(body),
					config.channelSecret,
					req.headers["x-line-signature"] as string
				)
			) {
				res.status(400).json({ message: "invalid signature" });
				return;
			}
			// handle webhook body
			Promise.all(body.events.map(webhookEventHandler))
				.then(() => res.status(200).end())
				.catch((error) => {
					console.error(error);
					res.status(500).end();
				});
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

const webhookEventHandler = async (event: WebhookEvent) => {
	try {
		switch (event.type) {
			case "message":
				const message = event.message;
				// ユーザーの最新のコンテキストを取得
				const latestContexts = await getLatestContexts(
					event.source.userId!
				).then((contexts: DialogflowContext[]) => {
					return contexts.map((context) => pickContextId(context));
				});
				switch (message.type) {
					case "text":
						if (message.text.length > 256)
							throw new RangeError(`${message.text.length}`); // 文字数オーバー
						return await handleText(
							message,
							latestContexts,
							event.replyToken,
							event.source
						);

					// case "image":
					// 	return handleImage(message, event.replyToken);
					// case "video":
					// 	return handleVideo(message, event.replyToken);
					// case "audio":
					// 	return handleAudio(message, event.replyToken);
					// case "location":
					// 	return handleLocation(message, event.replyToken);
					// case "sticker":
					// 	return handleSticker(message, event.replyToken);

					default:
						throw new ReferenceError(`${event.type}`);
				}

			case "follow":
				return handleFollow(event.replyToken, event.source);

			// case "unfollow":
			// 	return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

			// case "join":
			// 	return replyText(event.replyToken, `Joined ${event.source.type}`);

			// case "leave":
			// 	return console.log(`Left: ${JSON.stringify(event)}`);

			// case "postback":
			// 	let data = event.postback.data;
			// 	if (data === "DATE" || data === "TIME" || data === "DATETIME") {
			// 		data += `(${JSON.stringify(event.postback.params)})`;
			// 	}
			// 	return replyText(event.replyToken, `Got postback: ${data}`);

			// case "beacon":
			// 	return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

			default:
				throw new Error(`Unknown event: ${JSON.stringify(event)}`);
		}
	} catch (error) {
		if (!("replyToken" in event)) return;

		if (error instanceof RangeError) {
			replyText(
				event.replyToken,
				`ごめんなさい．メッセージが長すぎます😫．256文字以下にしてください．(${error.message}文字でした)`
			);
		} else if (error instanceof ReferenceError) {
			replyText(
				event.replyToken,
				`ごめんなさい．まだその種類のメッセージには対応できません😫 (${error.message})`
			);
		} else {
			replyText(
				event.replyToken,
				"ごめんなさい．エラーが発生しました😫 しばらくしてからもう一度お試しください．"
			);
		}
	}
};
