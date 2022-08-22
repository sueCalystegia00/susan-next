import type { MessageProps } from "./types";

const Message = ({
	timestamp,
	SenderType,
	MessageType,
	MessageText,
}: MessageProps) => {
	switch (MessageType) {
		case "chat":
			return <div>{MessageText}</div>;
		case "image":
			return <div>画像でした🎆</div>;
		case "answer":
			return <div>{MessageText}</div>;
		default:
			return null;
	}
};

export default Message;
