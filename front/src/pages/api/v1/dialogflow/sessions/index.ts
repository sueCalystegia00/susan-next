import type { NextApiRequest, NextApiResponse } from "next";
import detectIntent from "@/pages/api/v1/line/libs/dialogflowNLP";

// 動作確認用API
const DialogflowSessionsHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { method, query } = req;
	switch (method) {
		case "GET":
			if (!query.inputTexts) {
				res.status(400).json({ error: "inputTexts is required" });
				return;
			}
			try {
				const response = await detectIntent(query.inputTexts as string, [
					{
						name: null, //query.contextName as string | null,
						lifespanCount: null, //Number(query.lifespanCount) as number | null,
					},
				]);
				res.status(200).json(response);
			} catch (error) {
				res.status(500).json({ error: error });
			}
			break;

		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};
export default DialogflowSessionsHandler;
