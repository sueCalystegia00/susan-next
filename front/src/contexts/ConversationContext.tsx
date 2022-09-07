import type { ReactNode } from "react";
import { createContext } from "react";
import type { ConversationMessage } from "@/types/models";
import useConversationData from "@/hooks/useConversation";
import { Dispatch, SetStateAction } from "react";
import type { postConversationResponse } from "@/types/response";

class ConversationContextProps {
	questionIndex!: number;
	conversationMessages!: ConversationMessage[];
	getConversationMessages: (questionId: number) => void = () => {
		//
	};
	inputtedText: ConversationMessage["MessageText"] = "";
	setInputtedText!: Dispatch<
		SetStateAction<ConversationMessage["MessageText"]>
	>;
	postImage: File | undefined = undefined;
	setPostImage!: Dispatch<SetStateAction<File | undefined>>;
	messageType: ConversationMessage["MessageType"] = "chat";
	setMessageType: (messageType: ConversationMessage["MessageType"]) => void =
		() => {
			//
		};
	postConversationMessage!: () => Promise<postConversationResponse> | undefined;
	postConversationImage = () => {
		//
	};
}

export const ConversationContext = createContext<ConversationContextProps>(
	new ConversationContextProps()
);

type Props = {
	questionIndex: number;
	children: ReactNode;
};

const ConversationProvider = ({ questionIndex, children }: Props) => {
	const {
		conversationMessages,
		getConversationMessages,
		text,
		setText,
		messageType,
		setMessageType,
		postConversationMessage,
		image,
		setImage,
		postConversationImage,
	} = useConversationData(questionIndex);

	return (
		<ConversationContext.Provider
			value={{
				questionIndex,
				conversationMessages,
				getConversationMessages,
				inputtedText: text,
				setInputtedText: setText,
				postImage: image,
				setPostImage: setImage,
				messageType,
				setMessageType,
				postConversationMessage,
				postConversationImage,
			}}
		>
			{children}
		</ConversationContext.Provider>
	);
};

export default ConversationProvider;
