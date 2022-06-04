import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import liff from "@line/liff";

export type UserState = {
	liff: {
		uid?: string;
		//name?: string;
		//pictureUrl?: string;
		isInClient?: boolean;
		isLoggedIn?: boolean;
		token?: string;
	};
	type: string | null;
	loading: boolean;
	error: {
		status: boolean;
		message: string | null;
	};
};

const initialState: UserState = {
	liff: {
		uid: undefined,
		//name: null,
		//picture: null,
		isInClient: false,
		isLoggedIn: false,
		token: undefined,
	},
	type: null,
	loading: false,
	error: {
		status: false,
		message: null,
	},
};

export type UpdateLiffPayload = UserState["liff"];

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		reset(): UserState {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(initializeLiff.pending, (state, action) => {
			state.loading = true;
			state.error.status = false;
			state.error.message = null;
		});
		builder.addCase(initializeLiff.fulfilled, (state, action) => {
			state.loading = false;
			state.liff = { ...action.payload };
		});
		builder.addCase(initializeLiff.rejected, (state, action) => {
			state.loading = true;
			state.error.status = true;
			state.error.message = "cant fetched data";
		});
	},
});

export const initializeLiff = createAsyncThunk(
	"user/initializeLiff",
	async () => {
		return await liff
			.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
			.then(() => {
				if (!liff.isInClient() && !liff.isLoggedIn()) {
					liff.login();
				} else {
					const userData = liff.getDecodedIDToken();
					return {
						uid: userData?.sub,
						//name: userData?.name,
						//picture: userData?.picture,
						isInClient: liff.isInClient(),
						isLoggedIn: liff.isLoggedIn(),
						token: liff.getAccessToken(),
					} as UserState["liff"];
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
);
