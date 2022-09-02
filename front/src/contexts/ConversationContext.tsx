import type { ReactNode } from "react";
import { createContext } from "react";
import type { ConversationMessage, Question } from "@/types/models";
import useConversationData from "@/hooks/useConversation";
import { Dispatch, SetStateAction } from "react";

class ConversationContextProps {
	questionIndex!: number;
	question!: Question;
	conversationMessages: ConversationMessage[] = [];
	getConversationMessages: (questionId: number) => void = () => {
		//
	};
	postText: ConversationMessage["MessageText"] = "";
	setPostText!: Dispatch<SetStateAction<ConversationMessage["MessageText"]>>;
	postImage: File | undefined = undefined;
	setPostImage!: Dispatch<SetStateAction<File | undefined>>;
	messageType: ConversationMessage["MessageType"] = "chat";
	setMessageType: (messageType: ConversationMessage["MessageType"]) => void =
		() => {
			//
		};
	postConversationMessage = () => {
		//
	};
	postConversationImage = () => {
		//
	};
}

export const ConversationContext = createContext<ConversationContextProps>(
	new ConversationContextProps()
);

type Props = {
	questionIndex: number;
	question: Question;
	children: ReactNode;
};

const ConversationProvider = ({ questionIndex, question, children }: Props) => {
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
	} = question && useConversationData(questionIndex);

	return (
		<ConversationContext.Provider
			value={{
				questionIndex,
				question,
				conversationMessages,
				getConversationMessages,
				postText: text,
				setPostText: setText,
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
