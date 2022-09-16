import { User } from "@line/bot-sdk";
import { DiscussionMessage } from "./models";

export interface postDiscussionResponse {
	insertedMessage: DiscussionMessage;
	questionerId?: User["userId"];
}
