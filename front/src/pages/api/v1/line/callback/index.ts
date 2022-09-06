import { DialogflowContext } from "@/types/models";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookEvent } from "@line/bot-sdk";
import { middleware } from "@line/bot-sdk";
import { handleFollow, handleText } from "./handlers";
import { validateSignature } from "../libs/validateSignature";
import runMiddleware from "../libs/runMiddleware";
import { linebotConfig } from "../libs/linebotConfig";
import { replyText } from "../libs/replyText";
import { getLatestContexts } from "../libs/connectDB";
import { pickContextId } from "../libs/pickContextId";

// ref: https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
	api: {
		bodyParser: false,
	},
};

const LineCallbackHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	// Run the middleware
	await runMiddleware(req, res, middleware(linebotConfig));

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
					linebotConfig.channelSecret,
					req.headers["x-line-signature"] as string
				)
			) {
				res.status(400).json({ message: "invalid signature" });
				return;
			}

			const events: WebhookEvent[] = req.body.events;
			// handle webhook body
			const results = await Promise.all(
				events.map(async (event: WebhookEvent) => {
					try {
						await webhookEventHandler(event);
					} catch (error: any) {
						if ("replyToken" in event) {
							replyText(
								event.replyToken,
								error.message ||
									"ごめんなさい．エラーが発生しました😫 しばらくしてからもう一度お試しください．"
							);
							return res.status(200).end();
						} else {
							return res.status(500).json({ message: "internal server error" });
						}
					}
				})
			);
			return res.status(200).json({
				status: "success",
				results,
			});

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};
export default LineCallbackHandler;

const webhookEventHandler = async (event: WebhookEvent) => {
	switch (event.type) {
		case "message":
			const message = event.message;
			// ユーザーの最新のコンテキストを取得
			const latestContexts = await getLatestContexts(event.source.userId!).then(
				(contexts: DialogflowContext[]) => {
					return contexts.map((context) => pickContextId(context));
				}
			);
			switch (message.type) {
				case "text":
					if (message.text.length > 256)
						throw new RangeError(
							`ごめんなさい．メッセージが長すぎます😫．256文字以下にしてください．(${message.text.length}文字でした)`
						);
					await handleText(
						message,
						latestContexts,
						event.replyToken,
						event.source
					);
					break;

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
					throw new TypeError(
						`ごめんなさい．まだその種類のメッセージ(${message.type})には対応できません😫 `
					);
			}
			break;

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
			throw new Error("予期せぬ入力によりエラーが発生しました😫");
	}
};
