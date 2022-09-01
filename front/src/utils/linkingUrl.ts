/**
 * @param text urlが含まれるテキスト
 * @returns urlを含むテキストをリンクに変換したテキスト
 */
const linkingUrl = (text: string) => {
	return text.replace(
		/(https?:\/\/[^\s]*)/g,
		"<a style='text-decoration-line: underline;' href='$1'>$1</a>"
	);
};

export default linkingUrl;
