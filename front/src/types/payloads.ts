import {
	User,
	ConversationMessage,
	DialogflowIntent,
	Question,
} from "./models";

export interface PostConversationMessagePayload {
	index: number;
	userId: User["userUid"];
	messageType: ConversationMessage["MessageType"];
	message: ConversationMessage["MessageText"];
	userType: User["position"];
}

export interface PostConversationImagePayload {
	index: number;
	userId: User["userUid"];
	file: File | undefined;
}

export interface PostDialogflowIntentPayload {
	questionIndex: number;
	trainingPhrases: DialogflowIntent["trainingPhrases"];
	responseText: DialogflowIntent["responseText"];
	intentName?: DialogflowIntent["intentName"];
}

export interface UpdateAnswerPayload {
	questionText: Question["QuestionText"];
	answerText: Question["AnswerText"];
	isShared: Question["Shared"];
	intentName: DialogflowIntent["intentName"];
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
			questionText?: Question["QuestionText"];
		};
	};
}
