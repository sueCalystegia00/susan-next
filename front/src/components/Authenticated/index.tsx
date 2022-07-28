import { LiffMockPlugin } from "@line/liff-mock";
import Script from "next/script";
import { useContext } from "react";
import { AuthContext } from "~/contexts/AuthContext";
import axios from "axios";

export const Authenticated = () => {
	const { setUser: setUserContext } = useContext(AuthContext);

	const setUser = async (userUid: string, token: string): Promise<void> => {
		// TODO: APIを叩いてpositionを取得する
		const position = await getUserPosition(token);

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
			if (process.env.NODE_ENV === "development") {
				liff.use(new LiffMockPlugin());
				await liff.init({
					liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
					mock: true,
				});
				liff.login();
			} else {
				await liff.init({
					liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
					withLoginOnExternalBrowser: true, //外部ブラウザでも自動ログイン(LIFFブラウザは最初から自動でログインが走る)
				});
			}
			const profile = await liff.getProfile();
			setUser(
				profile.userId, // FEで扱うID
				(await liff.getAccessToken()) as string // BEでIDを扱うためにtokenを取得しておく
				//profile.displayName,
				//profile.pictureUrl,
			);

			console.info(profile);
		} catch (err) {
			handleError(err);
		}
	};

	const getUserPosition = async (token: string): Promise<string> => {
		const userPosition = await axios
			.post<string>(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/position`,
				{
					userToken: token,
				}
			)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				alert("サーバーでエラーが発生しました．");
				console.error(error);
				return "unknown";
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
