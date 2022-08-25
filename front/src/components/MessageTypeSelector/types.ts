import type { ConversationMessage } from "@/types/models";
import { Dispatch, SetStateAction } from "react";

export interface MessageTypeSelectorProps {
	selectedValue: ConversationMessage["MessageType"];
	selectHandler: Dispatch<SetStateAction<ConversationMessage["MessageType"]>>;
}
