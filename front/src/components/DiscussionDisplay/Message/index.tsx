import InnerUrlText from "@/components/InnerUrlText";
import { MessageProps } from "./types";

/**
 * @returns 質問対応メッセージ1件分を表示するコンポーネント
 */
const Message = ({ discussionMessage }: MessageProps) => {
	const senderClass =
		discussionMessage.userType === "instructor"
			? "mr-auto bg-neutral-200  dark:bg-slate-700  before:content-[''] before:absolute before:bottom-4 before:-left-1.5 before:w-3 before:h-3 before:rotate-45 before:bg-neutral-200 dark:before:bg-slate-700"
			: "ml-auto bg-forest-green dark:bg-slate-500 after:content-[''] after:absolute after:bottom-4 after:-right-1.5 after:w-3 after:h-3 after:rotate-45 after:bg-forest-green dark:after:bg-slate-500";
	switch (discussionMessage.messageType) {
		case "chat":
		case "answer":
			return (
				<div
					className={`relative max-w-full p-2 rounded-lg break-words ${senderClass}`}
				>
					<InnerUrlText
						innerText={discussionMessage.message}
						settingClass={undefined}
					/>
				</div>
			);
		case "image":
			return (
				<div className={`relative max-w-full p-2 rounded-lg ${senderClass}`}>
					<img
						src={`https://www2.yoslab.net/${discussionMessage.message}`}
						alt={`${discussionMessage.userType}'s image message`}
					/>
				</div>
			);
		default:
			return null;
	}
};

export default Message;
