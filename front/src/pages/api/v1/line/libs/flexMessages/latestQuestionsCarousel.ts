import type { Question } from "@/types/models";
import type {
	FlexBubble,
	FlexCarousel,
	FlexMessage,
} from "@line/bot-sdk/lib/types";

const latestQuestionsCarousel = (questions: Question[]): FlexMessage => {
	return {
		type: "flex",
		altText: "最新の質問を表示します",
		contents: {
			type: "carousel",
			contents: questions.map((question) => {
				return {
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
										type: "box",
										layout: "vertical",
										contents: [
											{
												type: "text",
												text: question.lectureNumber
													? `第${question.lectureNumber}回`
													: "未設定",
												color: "#FFFFFF",
												weight: "bold",
											},
										],
										backgroundColor: "#6366f1",
										position: "absolute",
										paddingTop: "sm",
										paddingBottom: "sm",
										paddingStart: "md",
										paddingEnd: "md",
										cornerRadius: "md",
									},
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
										text: `${question.questionText}`,
										size: "lg",
										weight: "bold",
										wrap: true,
										color: "#FFFFFF",
										align: "start",
									},
								],
								paddingTop: "md",
								margin: "lg",
							},
						],
						backgroundColor: "#284275",
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
									uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/question/${question.index}`,
								},
								height: "sm",
							},
						],
					},
				} as FlexBubble;
			}),
		} as FlexCarousel,
	};
};

export default latestQuestionsCarousel;
