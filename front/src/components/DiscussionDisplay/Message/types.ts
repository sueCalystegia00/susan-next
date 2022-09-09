import type { DiscussionMessage } from "@/types/models";

export interface MessageProps {
	timestamp: DiscussionMessage["timestamp"];
	SenderType: DiscussionMessage["SenderType"];
	MessageType: DiscussionMessage["MessageType"];
	MessageText: DiscussionMessage["MessageText"];
}
