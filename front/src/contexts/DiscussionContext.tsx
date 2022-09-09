import type { ReactNode } from "react";
import { createContext } from "react";
import type { DiscussionMessage } from "@/types/models";
import useDiscussionData from "@/hooks/useDiscussion";
import { Dispatch, SetStateAction } from "react";
import type { postDiscussionResponse } from "@/types/response";

class DiscussionContextProps {
	discussionMessages!: DiscussionMessage[];
	getDiscussionMessages!: (questionId: number) => void;
	inputtedText: DiscussionMessage["MessageText"] = "";
	setInputtedText!: Dispatch<SetStateAction<DiscussionMessage["MessageText"]>>;
	postImage: File | undefined = undefined;
	setPostImage!: Dispatch<SetStateAction<File | undefined>>;
	messageType: DiscussionMessage["MessageType"] = "chat";
	setMessageType!: (messageType: DiscussionMessage["MessageType"]) => void;
	postDiscussionMessage!: () => Promise<postDiscussionResponse>;
	postDiscussionImage!: () => Promise<postDiscussionResponse>;
}

export const DiscussionContext = createContext<DiscussionContextProps>(
	new DiscussionContextProps()
);

type Props = {
	questionIndex: number;
	children: ReactNode;
};

const DiscussionProvider = ({ questionIndex, children }: Props) => {
	const {
		discussionMessages,
		getDiscussionMessages,
		text,
		setText,
		messageType,
		setMessageType,
		postDiscussionMessage,
		image,
		setImage,
		postDiscussionImage,
	} = useDiscussionData(questionIndex);

	return (
		<DiscussionContext.Provider
			value={{
				discussionMessages,
				getDiscussionMessages,
				inputtedText: text,
				setInputtedText: setText,
				postImage: image,
				setPostImage: setImage,
				messageType,
				setMessageType,
				postDiscussionMessage,
				postDiscussionImage,
			}}
		>
			{children}
		</DiscussionContext.Provider>
	);
};

export default DiscussionProvider;
