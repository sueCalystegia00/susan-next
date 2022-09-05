import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@line/bot-sdk";
import type { WebhookEvent, TextMessage } from "@line/bot-sdk";
import { validateSignature } from "../libs/validateSignature";
import { cors, runMiddleware } from "../libs/cors";

// create LINE SDK config from env variables
const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
	channelSecret: process.env.CHANNEL_SECRET!,
};
// create LINE SDK client
const client = new Client(config);

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
					body,
					config.channelSecret,
					req.headers["x-line-signature"] as string
				)
			) {
				res.status(400).json({ message: "invalid signature" });
				return;
			}
			// check request body is not empty
			if (!body.events || body.events.length === 0) {
				res.status(400).json({ message: "invalid request" });
				return;
			}
			// handle webhook body
			await Promise.all(
				body.events.map(async (event: WebhookEvent) => {
					if (event.type !== "message" || event.message.type !== "text") {
						return;
					}
					const replyToken = event.replyToken;
					const message = event.message.text;
					const replyMessage: TextMessage = {
						type: "text",
						text: message,
					};
					await client.replyMessage(replyToken, replyMessage);
				})
			);
			res.status(200).json({ message: "ok" });
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
