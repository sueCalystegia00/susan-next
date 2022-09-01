import linkingUrl from "@/utils/linkingUrl";
import type { InnerUrlTextProps } from "./types";

const InnerUrlText = ({ settingClass, innerText }: InnerUrlTextProps) => {
	return (
		<p
			className={`${settingClass || ""}`}
			dangerouslySetInnerHTML={{
				__html: linkingUrl(innerText),
			}}
		/>
	);
};

export default InnerUrlText;
