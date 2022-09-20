import type { postNewQuestionParams } from "@/types/payloads";
import type { postNewQuestionResponse } from "@/types/response";
import axios from "axios";

const postNewQuestion = async ({
	userId,
	lectureNumber,
	questionText,
}: postNewQuestionParams) => {
	try {
		const { status, data } = await axios.post<postNewQuestionResponse>(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/questions/newQuestion`,
			{
				userId,
				lectureNumber,
				questionText,
			}
		);
		if (status === 201) {
			return data;
		} else {
			throw new Error("failed to post new question");
		}
	} catch (error) {
		throw error;
	}
};

export default postNewQuestion;
