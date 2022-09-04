import { ConversationContext } from "@/contexts/ConversationContext";
import { useContext } from "react";
import InputAnswerField from "./InputAnswerField";
import InputImageField from "./InputImageField";
import InputMessageField from "./InputMessageField";

/**
 * @returns 質問に対するメッセージを入力するフォームおよび送信ボタンを管理するコンポーネント
 * @description 質問に対するメッセージの種類に応じたフォームを表示する
 */
const CreateMessageArea = () => {
	const { messageType } = useContext(ConversationContext);
	return (
		<>
			{messageType === "chat" && <InputMessageField />}
			{messageType === "image" && <InputImageField />}
			{messageType === "answer" && <InputAnswerField />}
		</>
	);
};
export default CreateMessageArea;
