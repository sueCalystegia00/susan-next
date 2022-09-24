import { ReactNode, createContext, useState, useEffect } from "react";
import type { User } from "@/types/models";
import LiffMockPlugin from "@line/liff-mock";
import type { Liff } from "@line/liff";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

class AuthContextProps {
	isLoggedIn = false;
	isError = false;
	user: User | null | undefined = null;
	lineLogout: () => void = () => {};
}

export const AuthContext = createContext<AuthContextProps>(
	new AuthContextProps()
);

type Props = {
	children: ReactNode;
};

/**
 * ユーザの認証状態を管理
 * @param children 子要素(ユーザ情報の利用が可能なコンポーネントとなる)
 * @returns JSX.Element
 */
const AuthProvider = ({ children }: Props) => {
	const router = useRouter();
	let liff: Liff | null = null;
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const isLoggedIn = !!user && !!user.type;
	const isError = user === null;

	useEffect(() => {
		const secondRedirect = router.query;
		console.debug("secondRedirect", secondRedirect);
		(async () => {
			liff = (await import("@line/liff")).default;
			await initializeLiff();
			await lineLogin();
		})();
	}, []);

	const initializeLiff = async () => {
		refreshExpiredIdToken();
		try {
			if (!liff) throw new Error("failed to import liff");

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
		} catch (error) {
			setUser(null);
			throw error;
		}
	};

	const lineLogin = async () => {
		if (!liff) throw new Error("liff have not been initialized");
		try {
			if (!liff.isLoggedIn()) {
				await liff.login();
			}
			const userId = (await liff.getProfile())?.userId;
			const idToken = await liff.getIDToken();
			const { type, canAnswer } = await getUserInfo(idToken!);
			setUser({
				userUid: userId!,
				token: idToken!,
				type,
				canAnswer,
			});
			if (type === "unregistered") router.replace("/");
		} catch (error: any) {
			setUser(null);
			if (error.message === "IdToken expired.") {
				// トークンが期限切れの場合は再取得
				alert("トークンが期限切れです．再度ログインしてください．");
			}
		}
	};

	const lineLogout = async () => {
		liff && (await liff.ready.then(() => liff?.logout()));
		liff = null;
		setUser(undefined);
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
					// 未登録ユーザの場合はthrowせずに，unregisteredを返す
					return { type: "unregistered" as User["type"], canAnswer: false };
				} else {
					console.error({ status, data });
					throw error;
				}
			} else {
				console.error(error);
				throw new Error(`get user info: unknown error`);
			}
		}
	};

	/**
	 * トークンが期限切れの場合はLocalStorageに保存しているLIFF関連のデータを削除する
	 * @see https://zenn.dev/arahabica/articles/274bb147a91d8a
	 */
	const refreshExpiredIdToken = () => {
		const keyPrefix = `LIFF_STORE:${process.env.NEXT_PUBLIC_LIFF_ID}:`;
		const key = keyPrefix + "decodedIDToken";
		const decodedIDTokenString = localStorage.getItem(key);
		if (!decodedIDTokenString) return;
		const decodedIDToken = JSON.parse(decodedIDTokenString);

		// 有効期限をチェック
		if (new Date().getTime() < decodedIDToken.exp * 1000) return;

		const keys = getLiffLocalStorageKeys(keyPrefix);
		keys.map((key) => localStorage.removeItem(key));
	};

	/**
	 * liff関連のlocalStorageのキーのリストを取得
	 */
	const getLiffLocalStorageKeys = (prefix: string) => {
		const keys = [];
		for (var i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.indexOf(prefix) === 0) {
				keys.push(key);
			}
		}
		return keys;
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, isError, user, lineLogout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
