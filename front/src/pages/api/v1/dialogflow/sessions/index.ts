import { DialogflowContext } from "@/types/models";
import createUniqueString from "@/utils/createUniqueString";
import { v2 } from "@google-cloud/dialogflow";
import type { NextApiRequest, NextApiResponse } from "next";

const sessionsClient = new v2.SessionsClient({
	credentials: {
		private_key: process.env.DIALOGFLOW_PRIVATE_KEY!.replace(/\\n/gm, "\n"),
		client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
	},
	//keyFilename: process.env.DIALOGFLOW_KEYFILE_PATH,
	projectId: process.env.DIALOGFLOW_PROJECT_ID,
});
const languageCode = "ja-JP";

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

/**
 * @param inputText ユーザーの発話
 * @param contexts ユーザーの最新のコンテキスト
 * @returns Dialogflowからのレスポンス(NLP解析結果)
 */
export const detectIntent = async (
	inputText: string,
	contexts: DialogflowContext[]
) => {
	const sessionPath = sessionsClient.projectAgentSessionPath(
		process.env.DIALOGFLOW_PROJECT_ID!,
		createUniqueString()
	);

	const inputContexts = contexts.reduce((acc, cur) => {
		if (!cur.name || cur.name == "__system_counters__") return acc;
		cur.name = sessionPath + "/contexts/" + cur.name;
		acc.push(cur);
		return acc;
	}, [] as DialogflowContext[]);

	const request = {
		session: sessionPath,
		queryInput: {
			text: {
				text: inputText,
				languageCode: languageCode,
			},
		},
		queryParams: {
			contexts: inputContexts.length > 0 ? inputContexts : null,
		},
	};
	return request;
	/* const [response] = await sessionsClient.detectIntent(request);
	return response; */
};
