import { ConversationContext } from "@/contexts/ConversationContext";
import { useContext } from "react";
import Message from "./Message";

/**
 * @param messages: メッセージの配列
 * @returns 質問対応のメッセージ群を表示するコンポーネント
 */
const ConversationDisplay = () => {
	const { conversationMessages } = useContext(ConversationContext);

	return (
		<div className='w-screen flex flex-col items-center gap-y-3 px-4 py-10'>
			{!conversationMessages.length && <></>}
			{conversationMessages.map((message, index) => (
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
