import { LiffMockPlugin } from "@line/liff-mock";
import Script from "next/script";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";

import type { User, IErrorResponse } from "@/types/models";

const Authenticated = () => {
	const { setUser: setUserContext } = useContext(AuthContext);

	const setUser = async (userUid: string, token: string): Promise<void> => {
		const position = (await getUserPosition(token)) || "";

		setUserContext({
			userUid,
			token,
			position,
		});
	};

	const handleError = (err: any) => {
		console.error(err);
		setUserContext(null);
	};

	const liffInit = async () => {
		try {
			if (process.env.NODE_ENV !== "production") {
				liff.use(new LiffMockPlugin());
				await liff.init({
					liffId: process.env.LIFF_ID!,
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
			} else {
				await liff.init({
					liffId: process.env.LIFF_ID!,
					withLoginOnExternalBrowser: true, //外部ブラウザでも自動ログイン(LIFFブラウザは最初から自動でログインが走る)
				});
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

	const getUserPosition = async (token: string): Promise<string | void> => {
		const userPosition = await axios
			.get<User>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/position`,
				{ params: { userIdToken: token } }
			)
			.then((response) => {
				return response.data.position;
			})
			.catch((error: AxiosError<IErrorResponse>) => {
				alert("サーバーでエラーが発生しました．");
				handleError(error);
				liff.logout();
			});
		return userPosition;
	};

	return (
		<Script
			src='https://static.line-scdn.net/liff/edge/2/sdk.js'
			onLoad={() => liffInit()}
		/>
	);
};

export default Authenticated;
