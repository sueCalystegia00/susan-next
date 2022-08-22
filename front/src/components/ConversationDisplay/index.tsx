import { ConversationDisplayProps } from "./types";

const ConversationDisplay = ({ messages }: ConversationDisplayProps) => {
	return (
		<div>
			{messages.map((message, index) => (
				<div key={index}>{message.MessageText}</div>
			))}
		</div>
	);
};

export default ConversationDisplay;
