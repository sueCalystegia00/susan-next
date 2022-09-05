import type { NextApiRequest, NextApiResponse } from "next";
import { Client, validateSignature } from "@line/bot-sdk";
import type { WebhookEvent, TextMessage } from "@line/bot-sdk";
import crypto from "crypto";

// create LINE SDK config from env variables
const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
	channelSecret: process.env.CHANNEL_SECRET!,
};

// create LINE SDK client
const client = new Client(config);

/**
 * Compare x-line-signature request header and the signature
 * @param signature
 * @param body request body
 * @returns boolean
 */
/* const validateSignature = (signature: string, body: string) => {
	return (
		signature ==
		crypto
			.createHmac("SHA256", config.channelSecret)
			.update(body)
			.digest("base64")
	);
}; */

export default async function LineCallbackHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method, body } = req;
	if (method == "GET") {
		res.status(200).json({ message: "active!" });
		return;
	}
	if (method != "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${method} Not Allowed`);
		return;
	}
	if (
		!validateSignature(
			JSON.stringify(body),
			config.channelSecret,
			req.headers["x-line-signature"] as string
		)
	) {
		res.status(401).end("Unauthorized");
		return;
	}

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
	});
	res.status(200).end();
}
