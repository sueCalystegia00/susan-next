import { LiffMockPlugin } from "@line/liff-mock";
import Script from "next/script";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import type { User, IErrorResponse } from "@/types/models";
import router from "next/router";

/**
 * @description ユーザ認証を行う
 */
const Authenticated = () => {
	const { setUser: setUserContext } = useContext(AuthContext);

	const setUser = async (
		userUid: User["userUid"],
		token: User["token"]
	): Promise<void> => {
		try {
			const { type, canAnswer } = await getUserInfo(token);
			setUserContext({
				userUid,
				token,
				type,
				canAnswer,
			});
			if (type === "unregistered") router.replace("/");
		} catch (error: any) {
			if (error.message === "IdToken expired.") {
				// トークンが期限切れの場合は再取得
				alert("トークンが期限切れです．再度ログインしてください．");
				setUserContext(null);
				liff.logout();
				router.reload();
			} else {
				handleError(error);
			}
		}
	};

	const handleError = (err: any) => {
		setUserContext(null);
		liff.logout();
		router.replace("/");
		console.error(err);
	};

	const liffInit = async () => {
		try {
			if (process.env.NODE_ENV === "production") {
				await liff.init({
					liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
					withLoginOnExternalBrowser: true, //外部ブラウザでも自動ログイン(LIFFブラウザは最初から自動でログインが走る)
				});
			} else {
				liff.use(new LiffMockPlugin());
				await liff.init({
					liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
					mock: true,
				});
				liff.$mock.set((p) => ({
					...p,
					getProfile: {
						displayName: "Developer",
						userId: process.env.NEXT_PUBLIC_DEVELOPER_LINE_ID!,
					},
					getIDToken: process.env.NEXT_PUBLIC_DEVELOPING_ID_TOKEN!,
				}));
				liff.login();
			}
			const profile = await liff.getProfile();
			const idToken = await liff.getIDToken();
			setUser(
				profile.userId, // FEで扱うID
				idToken as string // BEでIDを扱うためにtokenを取得しておく
				//profile.displayName,
				//profile.pictureUrl,
			);

			console.info(`uid: ${profile.userId}`);
			console.info(`idToken: ${idToken}`);
		} catch (err) {
			handleError(err);
		}
	};

	const getUserInfo = async (token: User["token"]) => {
		try {
			const { status, data } = await axios.get<User>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users`,
				{
					params: {
						userIdToken: token,
					},
				}
			);
			if (status == 200) {
				return { type: data.type, canAnswer: !!data.canAnswer };
			} else {
				throw new Error("failed to get user info");
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				const { status, data } = error.response!;
				if (status == 400 && data.message == "IdToken expired.") {
					throw new Error("IdToken expired.");
				} else if (status == 404 && data.message == "User not found.") {
					return { type: "unregistered" as User["type"], canAnswer: false };
				} else {
					throw error;
				}
			} else {
				throw new Error(`get user info: unknown error`);
			}
		}
	};

	return (
		<Script
			src='https://static.line-scdn.net/liff/edge/2/sdk.js'
			onLoad={() => liffInit()}
		/>
	);
};

export default Authenticated;
