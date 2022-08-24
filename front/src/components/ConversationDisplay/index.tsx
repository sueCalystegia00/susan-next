import Message from "./Message";
import { ConversationDisplayProps } from "./types";

const ConversationDisplay = ({ messages }: ConversationDisplayProps) => {
	return (
		<div className='w-screen flex flex-col items-center gap-y-3 p-4'>
			{messages.map((message, index) => (
				<Message
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
