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
		} catch (error: any) {
			handleError(error);
		}
	};

	const handleError = (err: any) => {
		setUserContext(null);
		liff.logout();
		if (err.message === "IdToken expired.") {
			router.reload();
		} else if (err.message === "user not found") {
			router.replace("/");
		} else {
			alert("エラーが発生しました");
			console.error(err);
		}
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
				if (error.response?.data.message == "user not found") {
					throw new Error("user not found");
				} else if (
					error.response?.data.error_description == "IdToken expired."
				) {
					throw new Error("IdToken expired.");
				} else {
					console.log(error.response?.data);
					throw new AxiosError(
						`get user info: ${error.response?.data.error.message}`
					);
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
