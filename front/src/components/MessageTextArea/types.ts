import { Dispatch, SetStateAction } from "react";

export interface MessageTextAreaProps {
	setText: Dispatch<SetStateAction<string>>; //React HooksのsetStateを使う
}
