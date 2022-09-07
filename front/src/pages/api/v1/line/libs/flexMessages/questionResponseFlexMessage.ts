import type { FlexMessage } from "@line/bot-sdk";

const questionResponseMessage = (questionIndex: number, responseText: string) =>
	({
		type: "flex",
		altText: `${responseText}`,
		contents: {
			type: "bubble",
			header: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "text",
						text: "💬新しいメッセージ",
						size: "lg",
						weight: "bold",
						align: "center",
						color: "#FFFFFF",
					},
				],
				backgroundColor: "#284275",
			},
			body: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "text",
						text: `${responseText}`,
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
							uri: `https://liff.line.me/1657189212-Lwpmnpld/question/${questionIndex}`,
						},
					},
				],
			},
		},
	} as FlexMessage);

export default questionResponseMessage;
