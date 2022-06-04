import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
	liff: {
		uid: string | null;
		//name: string | null;
		//picture: string | null;
		isInClient: boolean | null;
		isLoggedIn: boolean | null;
		token: string | null;
	};
	type: string | null;
};

const initialState: UserState = {
	liff: {
		uid: null,
		//name: null,
		//picture: null,
		isInClient: null,
		isLoggedIn: null,
		token: null,
	},
	type: null,
};

export type UpdateLiffPayload = UserState["liff"];

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setLiffInfo: (state, action: PayloadAction<UpdateLiffPayload>) => ({
			...state,
			liff: action.payload,
		}),
		reset(): UserState {
			return initialState;
		},
	},
});
