import {
	createSlice,
	createAsyncThunk,
	SerializedError,
} from "@reduxjs/toolkit";
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
	type?: string;
	loading: boolean;
	error: {
		status: boolean;
		message?: SerializedError;
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
	type: undefined,
	loading: false,
	error: {
		status: false,
		message: undefined,
	},
};

export type UpdateLiffPayload = UserState["liff"];

export const initializeLiff = createAsyncThunk<UpdateLiffPayload>(
	"user/initializeLiff",
	async (): Promise<UpdateLiffPayload> => {
		return await liff
			.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
			.then(() => {
				if (!liff.isInClient() && !liff.isLoggedIn()) {
					liff.login();
				}
				const userData = liff.getDecodedIDToken();
				return {
					uid: userData?.sub,
					//name: userData?.name,
					//picture: userData?.picture,
					isInClient: liff.isInClient(),
					isLoggedIn: liff.isLoggedIn(),
					token: liff.getAccessToken(),
				} as UpdateLiffPayload;
			})
			.catch((error) => {
				throw new Error(error);
			});
	}
);

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		/* reset(): UserState {
			return initialState;
		}, */
	},
	extraReducers: (builder) => {
		builder
			.addCase(initializeLiff.pending, (state) => {
				state.loading = true;
				state.error.status = false;
				state.error.message = undefined;
			})
			.addCase(initializeLiff.fulfilled, (state, action) => {
				state.loading = false;
				state.liff = { ...action.payload };
			})
			.addCase(initializeLiff.rejected, (state, action) => {
				state.loading = true;
				state.error.status = true;
				state.error.message = action.error;
			});
	},
});

export default userSlice.reducer;
