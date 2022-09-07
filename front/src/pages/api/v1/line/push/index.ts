import { PushLineMessagePayload } from "@/types/payloads";
import type { NextApiRequest, NextApiResponse } from "next";
import { pushResponseMessage } from "./handlers";

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
				pushResponseMessage(body);
			} else if (body.event.type == "announce") {
				//
			} else {
				res.status(400).json({ error: "event type is invalid" });
				return;
			}
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};
export default LinePushMessageHandler;
