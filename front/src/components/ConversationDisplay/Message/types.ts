import type { ConversationMessage } from "@/types/models";

export interface MessageProps {
	timestamp: ConversationMessage["timestamp"];
	SenderType: ConversationMessage["SenderType"];
	MessageType: ConversationMessage["MessageType"];
	MessageText: ConversationMessage["MessageText"];
}
