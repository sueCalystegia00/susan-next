import { User } from "@line/bot-sdk";
import { ConversationMessage } from "./models";

export interface postConversationResponse {
	insertedData: ConversationMessage;
	questioner: User["userId"];
}
