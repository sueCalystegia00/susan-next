import { User } from "@line/bot-sdk";
import { DiscussionMessage, Question } from "./models";

export interface postDiscussionResponse {
	insertedMessage: DiscussionMessage;
	questionerId?: User["userId"];
}

export interface postNewQuestionResponse {
	questionIndex: Question["index"];
	discussionIndex: number;
}