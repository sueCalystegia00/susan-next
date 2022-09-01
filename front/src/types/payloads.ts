import { User, ConversationMessage } from "./models";

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
