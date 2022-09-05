import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { Client, validateSignature } from "@line/bot-sdk";
import type { WebhookEvent, TextMessage } from "@line/bot-sdk";

// CORS のミドルウェアを初期化
const cors = Cors({
	methods: ["GET", "HEAD"],
});

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

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runMiddleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Function
) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
};
