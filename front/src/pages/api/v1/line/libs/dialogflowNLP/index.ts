import { DialogflowContext } from "@/types/models";
import createUniqueString from "@/utils/createUniqueString";
import { v2 } from "@google-cloud/dialogflow";

const sessionsClient = new v2.SessionsClient({
	credentials: {
		private_key: process.env.DIALOGFLOW_PRIVATE_KEY!.replace(/\\n/gm, "\n"),
		client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
	},
	//keyFilename: process.env.DIALOGFLOW_KEYFILE_PATH,
	projectId: process.env.DIALOGFLOW_PROJECT_ID,
});
const languageCode = "ja-JP";

/**
 * @param inputText ユーザーの発話
 * @param contexts ユーザーの最新のコンテキスト
 * @returns Dialogflowからのレスポンス(NLP解析結果)
 */
const detectIntent = async (
	inputText: string,
	contexts: DialogflowContext[]
) => {
	const sessionId = createUniqueString();
	const sessionPath = sessionsClient.projectAgentSessionPath(
		process.env.DIALOGFLOW_PROJECT_ID!,
		sessionId
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
	try {
		const [response] = await sessionsClient.detectIntent(request);
		return response;
	} catch (error) {
		throw new Error("Dialogflowのエラー");
	}
};

export default detectIntent;
