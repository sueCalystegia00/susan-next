import { Question } from "@/types/models";
import type { FlexMessage } from "@line/bot-sdk";

const completeSendNewQuestion = (
	sendQuestionIndex: Question["index"]
): FlexMessage => ({
	type: "flex",
	altText: "まだ誰もしていない質問を送ってみよう！",
	contents: {
		type: "bubble",
		header: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: "🕊 送信したよ！",
					size: "xl",
					weight: "bold",
					align: "center",
					color: "#FFFFFF",
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
					text: "回答があれば通知します！",
					align: "start",
					wrap: true,
				},
				{
					type: "text",
					text: "補足説明や画像は「質問の詳細へ」から追加できます👇",
					align: "start",
					wrap: true,
				},
			],
			justifyContent: "center",
		},
		footer: {
			type: "box",
			layout: "vertical",
			spacing: "sm",
			contents: [
				{
					type: "button",
					style: "link",
					height: "sm",
					action: {
						type: "uri",
						label: "質問の詳細へ",
						uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/question/${sendQuestionIndex}`,
						altUri: {
							desktop: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/question/${sendQuestionIndex}`,
						},
					},
				},
			],
			flex: 0,
		},
	},
});

export default completeSendNewQuestion;
