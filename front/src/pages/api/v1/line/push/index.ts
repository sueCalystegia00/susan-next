import { PushLineMessagePayload } from "@/types/payloads";
import sendEmail from "@/utils/sendEmail";
import { LINE_REQUEST_ID_HTTP_HEADER_NAME } from "@line/bot-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { pushAnnounceMessage, pushResponseMessage } from "./handlers";

const LinePushMessageHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	switch (req.method) {
		case "GET":
			res.status(200).json({ message: "active!" });
			break;

		case "POST":
			const body = req.body as PushLineMessagePayload;
			if (!body.userIds.length && !body.broadcast) {
				res.status(400).json({ error: "userId is required" });
				return;
			}
			if (!body.event) {
				res.status(400).json({ error: "message event is required" });
				return;
			}
			// event handling
			if (body.event.type == "response" || body.event.type == "answer") {
				await pushResponseMessage(body).then(async (result) => {
					await sendEmail(
						`新しい${
							body.event.type == "response" ? "メッセージ" : "回答"
						}が投稿されました`,
						body.event.message.text,
						body.event.question!.questionIndex
					);
					res.status(200).json(result);
				});
			} else if (body.event.type == "announce") {
				pushAnnounceMessage(body);
			} else {
				res.status(400).json({ error: "event type is invalid" });
				return;
			}
			res.status(200).json({ message: "success" });
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};
export default LinePushMessageHandler;
