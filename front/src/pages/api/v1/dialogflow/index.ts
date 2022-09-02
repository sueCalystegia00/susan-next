import { DialogflowIntent } from "@/types/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 } from "@google-cloud/dialogflow";
import { PostDialogflowIntentPayload } from "@/types/payloads";

const intentsClient = new v2.IntentsClient({
	/* credentials: {
		private_key: process.env.DIALOGFLOW_PRIVATE_KEY!.replace(/\\n/gm, "\n"),
		client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
	}, */
	keyFilename: process.env.DIALOGFLOW_KEYFILE_PATH,
	projectId: process.env.DIALOGFLOW_PROJECT_ID,
});
const agentPath = intentsClient.projectAgentPath(
	process.env.DIALOGFLOW_PROJECT_ID!
);

export default function DialogflowIntentHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method, query } = req;
	switch (method) {
		case "GET":
			if (!!query.intentName) {
				res.status(400).json({ error: "intentName is required" });
				return;
			}
			try {
				const response = getIntent(
					query.intentName as DialogflowIntent["intentName"]
				);
				res.status(200).json(response);
			} catch (error) {
				res.status(500).json({ error: error });
			}
			break;

		case "POST":
			try {
				const response = !!req.body.intentName
					? createQuestionIntent(req.body)
					: updateQuestionIntent(req.body);
				res.status(200).json(response);
			} catch (error) {
				res.status(500).json({ error: error });
			}
			break;

		/* case "PUT":
			if (!!query.intentName) {
				res.status(400).json({ error: "intentName is required" });
				return;
			}
			try {
				const response = updateQuestionIntent(req.body);
				res.status(200).json(response);
			} catch (error) {
				res.status(500).json({ error: error });
			}
			break;
			 */

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

const getIntent = async (intentName: DialogflowIntent["intentName"]) => {
	const request = {
		parent: agentPath,
		intentView: "INTENT_VIEW_FULL" as "INTENT_VIEW_FULL",
		name: intentName,
	};
	try {
		const intent = await intentsClient.getIntent(request);
		const trainingPhrases = intent[0].trainingPhrases!.map((phrase) => {
			return phrase.parts![0].text;
		});
		return {
			intentName: intent[0].name,
			trainingPhrases,
			responseText: intent[0].messages![0].text!.text![0],
			displayName: intent[0].displayName,
			priority: intent[0].priority,
		} as DialogflowIntent;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

const createQuestionIntent = async (req: NextApiRequest) => {
	const {
		questionIndex,
		trainingPhrases,
		responseText,
	}: PostDialogflowIntentPayload = req.body;
	const createIntentRequest = {
		parent: agentPath,
		intentView: "INTENT_VIEW_FULL" as "INTENT_VIEW_FULL",
		intent: {
			displayName:
				`0000${questionIndex}`.slice(-4) +
				`_${trainingPhrases[0].slice(0, 10)}`,
			parentFollowupIntentName:
				"projects/susanbotdialogflowagent-u9qh/agent/intents/fd08e1fd-e40a-42b6-ab9d-61fef96db07e",
			inputContextNames: [
				"projects/susanbotdialogflowagent-u9qh/agent/sessions/-/contexts/QuestionStart-followup",
			],
			outputContexts: [
				{
					name: "projects/susanbotdialogflowagent-u9qh/agent/sessions/-/contexts/SendAutoAnswer",
					lifespanCount: 1,
					parameters: null,
				},
			],
			trainingPhrases: trainingPhrases.map((phrase: string) => {
				return {
					parts: [
						{
							text: phrase,
						},
					],
				};
			}),
			parameters: [
				{
					displayName: "questionIndex",
					value: `${questionIndex}`,
				},
				{
					displayName: "originQuestion",
					value: trainingPhrases[0],
				},
			],
			messages: [
				{
					text: {
						text: [responseText],
					},
				},
			],
		},
	};
	try {
		const intent = await intentsClient.createIntent(createIntentRequest);
		return {
			intentName: intent[0].name,
			trainingPhrases,
			responseText: intent[0].messages![0].text!.text![0],
			displayName: intent[0].displayName,
			priority: intent[0].priority,
		} as DialogflowIntent;
	} catch (error: any) {
		throw new Error(error);
	}
};

const updateQuestionIntent = async (req: NextApiRequest) => {
	const {
		intentName,
		trainingPhrases,
		responseText,
	}: PostDialogflowIntentPayload = req.body;
	try {
		const existsIntent = await intentsClient.getIntent({ name: intentName });
		existsIntent[0].trainingPhrases = trainingPhrases.map((phrase: string) => {
			return {
				parts: [
					{
						text: phrase,
					},
				],
			};
		});
		existsIntent[0].messages![0].text!.text![0] = responseText;
		const updateIntentRequest = {
			intent: existsIntent[0],
			updateMask: {
				paths: ["training_phrases", "messages"],
			},
			intentView: "INTENT_VIEW_FULL" as "INTENT_VIEW_FULL",
		};
		const updatedIntent = await intentsClient.updateIntent(updateIntentRequest);
		return {
			intentName: updatedIntent[0].name,
			trainingPhrases,
			responseText: updatedIntent[0].messages![0].text!.text![0],
			displayName: updatedIntent[0].displayName,
			priority: updatedIntent[0].priority,
		} as DialogflowIntent;
	} catch (error: any) {
		throw new Error(error);
	}
};
