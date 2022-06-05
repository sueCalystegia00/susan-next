import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { userSlice } from "store/user";

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

export type AppDispatch = typeof store.dispatch;
