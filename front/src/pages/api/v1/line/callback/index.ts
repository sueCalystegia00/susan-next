import type { NextApiRequest, NextApiResponse } from "next";
import { validateSignature } from "../libs/validateSignature";
import { cors, runMiddleware } from "../libs/cors";
import { config } from "../libs/config";
import type { WebhookEvent } from "@line/bot-sdk";
import handleText from "./handleText";
import { replyText } from "../libs/replyText";
import handleFollow from "./handleFollow";
import { getLatestContexts } from "../libs/connectDB";
import { DialogflowContext } from "@/types/models";
import { pickContextName } from "../libs/pickContextName";

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
			await Promise.all(body.events.map(webhookEventHandler));
			res.status(200).json({ message: "ok" });
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

const webhookEventHandler = async (event: WebhookEvent) => {
	switch (event.type) {
		case "message":
			const message = event.message;
			// ユーザーの最新のコンテキストを取得
			const latestContexts = await getLatestContexts(event.source.userId!).then(
				(contexts: DialogflowContext[]) => {
					return contexts.map((context) => pickContextName(context));
				}
			);
			switch (message.type) {
				case "text":
					return message.text.length < 256
						? handleText(
								message,
								latestContexts,
								event.replyToken,
								event.source
						  )
						: replyText(
								event.replyToken,
								"ごめんなさい．こんなに長い文章はしんどいです😫256文字未満でお願いしていい？"
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
					replyText(
						event.replyToken,
						"ごめんなさい．まだその種類のメッセージには対応できません😫"
					);
					throw new Error(`Unknown message: ${JSON.stringify(message)}`);
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
};
