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

export const detectIntent = async (
	inputText: string,
	contexts: DialogflowContext[]
) => {
	const sessionPath = sessionsClient.projectAgentSessionPath(
		process.env.DIALOGFLOW_PROJECT_ID!,
		createUniqueString()
	);
	const request = {
		session: sessionPath,
		queryInput: {
			text: {
				text: inputText,
				languageCode: languageCode,
			},
		},
		queryParams: {
			contexts:
				contexts.length > 0
					? contexts.reduce((acc, cur) => {
							cur.name != "__system_counters__" && acc.push(cur);
							return acc;
					  }, [] as DialogflowContext[])
					: null,
		},
	};

	const [response] = await sessionsClient.detectIntent(request);
	return response;
};
