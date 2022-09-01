import InnerUrlText from "@/components/InnerUrlText";
import type { MessageProps } from "./types";

const Message = ({
	timestamp,
	SenderType,
	MessageType,
	MessageText,
}: MessageProps) => {
	const senderClass =
		SenderType === "student"
			? "ml-auto bg-forest-green dark:bg-slate-500 after:content-[''] after:absolute after:bottom-4 after:-right-1.5 after:w-3 after:h-3 after:rotate-45 after:bg-forest-green dark:after:bg-slate-500"
			: "mr-auto bg-neutral-200  dark:bg-slate-700  before:content-[''] before:absolute before:bottom-4 before:-left-1.5 before:w-3 before:h-3 before:rotate-45 before:bg-neutral-200 dark:before:bg-slate-700";
	switch (MessageType) {
		case "chat":
		case "answer":
			return (
				<div
					className={`relative max-w-full p-2 rounded-lg break-words ${senderClass}`}
				>
					<InnerUrlText innerText={MessageText} settingClass={undefined} />
				</div>
			);
		case "image":
			return (
				<div
					className={`relative max-w-full p-2 rounded-lg ${senderClass}`}
				>
					<img
						src={`https://www2.yoslab.net/${MessageText}`}
						alt={`${SenderType}'s image message`}
					/>
				</div>
			);
		default:
			return null;
	}
};

export default Message;
