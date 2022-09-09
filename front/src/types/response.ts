import { User } from "@line/bot-sdk";
import { DiscussionMessage } from "./models";

export interface postDiscussionResponse {
	insertedData: DiscussionMessage;
	questionerId?: User["userId"];
}
