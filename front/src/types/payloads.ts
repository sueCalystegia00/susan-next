import { User, DiscussionMessage, DialogflowIntent, Question } from "./models";

export interface PostDiscussionMessagePayload {
	index: number;
	userId: User["userUid"];
	messageType: DiscussionMessage["MessageType"];
	message: DiscussionMessage["MessageText"];
	userType: User["position"];
}

export interface PostDiscussionImagePayload {
	index: number;
	userId: User["userUid"];
	file: File | undefined;
}

export interface PostDialogflowIntentPayload {
	questionIndex: number;
	lectureNumber: Question["lectureNumber"];
	trainingPhrases: DialogflowIntent["trainingPhrases"];
	responseText: DialogflowIntent["responseText"];
	intentName?: DialogflowIntent["intentName"];
}

export interface UpdateAnswerPayload extends Question {
	answerIdToken: string;
}

export interface PushLineMessagePayload {
	userIds: User["userUid"][];
	broadcast?: boolean;
	event: {
		type: "response" | "answer" | "announce";
		message: {
			text: string;
		};
		question?: {
			// only when event.type == "response"
			questionIndex: number;
			questionText?: Question["questionText"];
		};
	};
}
