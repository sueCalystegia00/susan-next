import { Question } from "@/types/models";
import type { FlexMessage } from "@line/bot-sdk";

const questionResponseMessage = (
	questionIndex: number,
	questionText: Question["questionText"],
	answerText: Question["answerText"]
) =>
	({
		type: "flex",
		altText: `${answerText}`,
		contents: {
			type: "bubble",
			header: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "box",
						layout: "vertical",
						contents: [
							{
								type: "text",
								text: "🤔質問",
								size: "lg",
								weight: "bold",
								align: "center",
								color: "#FFFFFF",
							},
							{
								type: "text",
								text: "Question",
								size: "xxs",
								weight: "bold",
								align: "center",
								color: "#FFFFFF",
							},
						],
					},
					{
						type: "box",
						layout: "vertical",
						contents: [
							{
								type: "text",
								text: `${questionText}`,
								size: "lg",
								weight: "bold",
								wrap: true,
								color: "#FFFFFF",
								align: "start",
							},
						],
						paddingTop: "md",
					},
				],
				backgroundColor: "#284275",
			},
			body: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "box",
						layout: "vertical",
						contents: [
							{
								type: "text",
								text: "💡回答",
								size: "lg",
								weight: "bold",
								align: "center",
							},
							{
								type: "text",
								text: "Answer",
								size: "xxs",
								weight: "bold",
								align: "center",
							},
						],
					},
					{
						type: "box",
						layout: "vertical",
						contents: [
							{
								type: "text",
								text: `${answerText}`,
								size: "lg",
								weight: "bold",
								wrap: true,
							},
						],
						paddingTop: "md",
					},
				],
				backgroundColor: "#FFFFFF",
			},
			footer: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "button",
						action: {
							type: "uri",
							label: "詳細へ",
							uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/question/${questionIndex}`,
						},
					},
				],
			},
		},
	} as FlexMessage);

export default questionResponseMessage;
