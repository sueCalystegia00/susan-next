import Message from "./Message";
import { ConversationDisplayProps } from "./types";

/**
 * @param messages: メッセージの配列
 * @returns 質問対応のメッセージ群を表示するコンポーネント
 */
const ConversationDisplay = ({ messages }: ConversationDisplayProps) => {
	return (
		<div className='w-screen flex flex-col items-center gap-y-3 px-4 py-10'>
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
