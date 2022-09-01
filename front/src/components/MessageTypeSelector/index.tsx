import TileRadioButton from "@/components/TileRadioButton";
import ChatIcon from "@/assets/chat_black_24dp.svg";
import ImageIcon from "@/assets/image_black_24dp.svg";
import { MessageTypeSelectorProps } from "./types";
import { ConversationMessage } from "@/types/models";

const MessageTypeSelector = ({
	selectedValue,
	selectHandler,
}: MessageTypeSelectorProps) => {
	const buttons = [
		{
			value: "chat" as ConversationMessage["MessageType"],
			imageComponent: <ChatIcon width='24' height='24' viewBox='0 0 24 24' />,
			displayText: "テキスト",
		},
		{
			value: "image" as ConversationMessage["MessageType"],
			imageComponent: <ImageIcon width='24' height='24' viewBox='0 0 24 24' />,
			displayText: "画像",
		},
	];

	return (
		<div
			className={`w-full inline-grid grid-cols-2 grid-rows-1 gap-x-2 grow px-4`}
		>
			{buttons.map((button, index) => (
				<TileRadioButton
					key={index}
					id={index}
					name='messageType'
					value={button.value}
					imageComponent={button.imageComponent}
					displayText={button.displayText}
					onChange={() => selectHandler(button.value)}
					defaultCheckedValue={selectedValue}
				/>
			))}
		</div>
	);
};

export default MessageTypeSelector;
