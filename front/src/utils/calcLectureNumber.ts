const calcLectureNumber = (date: Date) => {
	// 第3Qから第4Qかどうか
	const isAorB = date <= new Date(2022, 12, 6) ? "A" : "B";

	// TODO: クイックソート的なアルゴリズムがあるのではなかろうか...

	if (isAorB === "A") {
		// 第3Qの場合
		if (date <= new Date(2022, 10, 12)) {
			return { type: isAorB, number: 1 };
		} else if (date <= new Date(2022, 10, 19)) {
			return { type: isAorB, number: 2 };
		} else if (date <= new Date(2022, 10, 26)) {
			return { type: isAorB, number: 3 };
		} else if (date <= new Date(2022, 11, 2)) {
			return { type: isAorB, number: 4 };
		} else if (date <= new Date(2022, 11, 9)) {
			return { type: isAorB, number: 5 };
		} else if (date <= new Date(2022, 11, 16)) {
			return { type: isAorB, number: 6 };
		} else if (date <= new Date(2022, 11, 23)) {
			return { type: isAorB, number: 7 };
		} else if (date <= new Date(2022, 11, 30)) {
			return { type: isAorB, number: 8 };
		} else {
			return { type: undefined, number: undefined };
		}
	} else {
		// 第4Qの場合
		if (date <= new Date(2022, 12, 14)) {
			return { type: isAorB, number: 1 };
		} else if (date <= new Date(2022, 12, 21)) {
			return { type: isAorB, number: 2 };
		} else if (date <= new Date(2022, 12, 28)) {
			return { type: isAorB, number: 3 };
		} else if (date <= new Date(2023, 1, 4)) {
			return { type: isAorB, number: 4 };
		} else if (date <= new Date(2023, 1, 11)) {
			return { type: isAorB, number: 5 };
		} else if (date <= new Date(2023, 1, 18)) {
			return { type: isAorB, number: 6 };
		} else if (date <= new Date(2023, 1, 25)) {
			return { type: isAorB, number: 7 };
		} else if (date <= new Date(2023, 2, 4)) {
			return { type: isAorB, number: 8 };
		} else {
			return { type: undefined, number: undefined };
		}
	}
};

export default calcLectureNumber;
