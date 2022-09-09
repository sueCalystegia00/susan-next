import { DiscussionContext } from "@/contexts/DiscussionContext";
import { useContext } from "react";
import Message from "./Message";

/**
 * @param messages: メッセージの配列
 * @returns 質問対応のメッセージ群を表示するコンポーネント
 */
const DiscussionDisplay = () => {
	const { discussionMessages } = useContext(DiscussionContext);

	return !!discussionMessages && discussionMessages.length > 0 ? (
		<div className='w-screen flex flex-col items-center gap-y-3 px-4 py-10'>
			{!discussionMessages.length && <></>}
			{discussionMessages.map((message, index) => (
				<Message
					key={index}
					timestamp={message.timestamp}
					SenderType={message.SenderType}
					MessageType={message.MessageType}
					MessageText={message.MessageText}
				/>
			))}
		</div>
	) : (
		<></>
	);
};

export default DiscussionDisplay;
