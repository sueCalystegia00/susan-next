import TileRadioButton from "@/components/TileRadioButton";
import AnswerIcon from "@/assets/reviews_FILL1_wght400_GRAD0_opsz24.svg";
import ChatIcon from "@/assets/chat_black_24dp.svg";
import ImageIcon from "@/assets/image_black_24dp.svg";
import { ConversationMessage } from "@/types/models";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { ConversationContext } from "@/contexts/ConversationContext";

/**
 * @returns 質問対応メッセージの形式を選択するコンポーネント
 * @description ユーザが教員権限を持っている場合のみ「回答」が追加される
 */
const MessageTypeSelector = () => {
	const { user } = useContext(AuthContext);
	const { messageType, setMessageType } = useContext(ConversationContext);
	const [buttons, setButtons] = useState([
		{
			value: "chat" as ConversationMessage["MessageType"],
			imageComponent: <ChatIcon width='24' height='24' viewBox='0 0 24 24' />,
			displayText: "チャット",
		},
		{
			value: "image" as ConversationMessage["MessageType"],
			imageComponent: <ImageIcon width='24' height='24' viewBox='0 0 24 24' />,
			displayText: "画像",
		},
	]);

	useEffect(() => {
		if (
			user!.position === "instructor" &&
			!buttons.find((b) => b.value === "answer")
		) {
			setButtons([
				...buttons,
				{
					value: "answer" as ConversationMessage["MessageType"],
					imageComponent: (
						<AnswerIcon width='24' height='24' viewBox='0 0 24 24' />
					),
					displayText: "回答",
				},
			]);
		}
	}, []);

	return (
		<div className={`w-full flex gap-x-2 px-4`}>
			{buttons.map((button, index) => (
				<TileRadioButton
					key={index}
					id={index}
					name='messageType'
					value={button.value}
					imageComponent={button.imageComponent}
					displayText={button.displayText}
					onChange={() => setMessageType(button.value)}
					defaultCheckedValue={messageType}
				/>
			))}
		</div>
	);
};

export default MessageTypeSelector;
