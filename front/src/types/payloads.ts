import { User, DialogflowIntent, Question } from "./models";

export interface UserRegistrationPayload {
	userIdToken?: User["token"];
	canAnswer: User["canAnswer"];
	age: number;
	gender: "male" | "female" | "other";
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
