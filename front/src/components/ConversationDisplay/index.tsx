import ChatMessage from "./ChatMessage";
import { ConversationDisplayProps } from "./types";

const ConversationDisplay = ({ messages }: ConversationDisplayProps) => {
	return (
		<div className='w-screen flex flex-col gap-y-2 py-2'>
			{messages.map((message, index) => (
				<ChatMessage
					key={index}
					timestamp={message.timestamp}
					SenderType={message.SenderType}
					MessageType={message.MessageType}
					MessageText={message.MessageText}
				/>
			))}
		</div>
	);
};

export default ConversationDisplay;
