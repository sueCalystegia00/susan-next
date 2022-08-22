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
	Shared: number;
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
