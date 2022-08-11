export interface User {
	userUid: string;
	token: string;
	position: string;
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
