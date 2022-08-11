import { useRouter } from "next/router";

const QuestionDetailsPage = () => {
	const router = useRouter();
	const { questionId } = router.query;
	return <div>{questionId}</div>;
};

export default QuestionDetailsPage;
