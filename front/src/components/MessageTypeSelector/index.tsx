import TileRadioButton from "@/components/TileRadioButton";
import ChatIcon from "@/assets/chat_black_24dp.svg";
import ImageIcon from "@/assets/image_black_24dp.svg";
import AnswerIcon from "@/assets/reviews_FILL1_wght400_GRAD0_opsz24.svg";
import { MessageTypeSelectorProps } from "./types";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const MessageTypeSelector = ({
	selectedValue,
	selectHandler,
}: MessageTypeSelectorProps) => {
	const { user } = useContext(AuthContext);

	const buttons = [
		{
			value: "chat",
			imageComponent: <ChatIcon width='30' height='30' viewBox='0 0 24 24' />,
			displayText: "テキスト",
		},
		{
			value: "image",
			imageComponent: <ImageIcon width='30' height='30' viewBox='0 0 24 24' />,
			displayText: "画像",
		},
	];

	return (
		<div className='w-full flex flex-row items-center place-content-around'>
			{buttons.map((button, index) => (
				<TileRadioButton
					key={index}
					id={index}
					name='messageType'
					value={button.value}
					imageComponent={button.imageComponent}
					displayText={button.displayText}
					onChange={() => selectHandler(button.value)}
				/>
			))}
		</div>
	);
};

export default MessageTypeSelector;
