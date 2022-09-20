import { Question } from "@/types/models";
import type { FlexMessage } from "@line/bot-sdk";

const checkInputNewQuestion = (
	inputQuestionText: Question["questionText"]
): FlexMessage => ({
	type: "flex",
	altText: "この質問文で間違いないですか？",
	contents: {
		type: "bubble",
		header: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: "🙋🏻‍♂️この質問を送る？",
					size: "lg",
					weight: "bold",
					align: "center",
					color: "#FFFFFF",
				},
				{
					type: "text",
					text: "この質問文で間違いないですか？",
					color: "#FFFFFF",
					wrap: true,
					align: "center",
				},
			],
			backgroundColor: "#284275",
			paddingAll: "lg",
		},
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: "入力された質問文",
					align: "center",
					wrap: true,
					size: "xs",
					color: "#B4B4B4",
					offsetBottom: "md",
				},
				{
					type: "text",
					text: `${inputQuestionText}`,
					align: "start",
					wrap: true,
				},
			],
			justifyContent: "center",
		},
		footer: {
			type: "box",
			layout: "vertical",
			spacing: "none",
			contents: [
				{
					type: "button",
					style: "link",
					action: {
						type: "message",
						label: "この質問を送る",
						text: "質問を送信",
					},
					height: "sm",
				},
				{
					type: "button",
					style: "link",
					action: {
						type: "message",
						label: "書き直す",
						text: "書き直す",
					},
					height: "sm",
				},
				{
					type: "button",
					style: "link",
					action: {
						type: "message",
						label: "質問しない",
						text: "キャンセル",
					},
					height: "sm",
				},
			],
		},
	},
});

export default checkInputNewQuestion;
