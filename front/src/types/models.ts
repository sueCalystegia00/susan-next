export interface User {
	userUid: string;
	token: string;
	position: "student" | "instructor" | "Non-experimenter";
	//displayName: string;
	//pictureUrl: string;
}

export interface IErrorResponse {
	type: string;
	message: string;
}

export interface Question {
	AnswerText: string;
	IntentName: string;
	QuestionText: string;
	Shared: boolean;
	timestamp: string;
}

export interface Questions {
	[key: number]: Question;
}

export interface ConversationMessage {
	index: number;
	timestamp: string;
	SenderType: User["position"];
	MessageType: "chat" | "image" | "answer";
	MessageText: string;
}

export interface DialogflowIntent {
	intentName: string;
	trainingPhrases: string[];
	responseText: string;
	displayName: string;
	priority: number;
}

export interface DialogflowContext {
	name: string | null;
	lifespanCount: number | null;
}
