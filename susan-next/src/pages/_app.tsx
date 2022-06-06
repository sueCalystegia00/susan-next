import "../styles/globals.css";
import type { AppProps } from "next/app";
//import type { Liff } from "@line/liff";
import { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, AppDispatch, RootState } from "store";
import { setLiffData } from "store/user";

const MyApp = ({ Component, pageProps }: AppProps) => {
	const dispatch: AppDispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);

	/* useEffect(() => {
		if (typeof window == "undefined") return;
		// to avoid `window is not defined` error
		import("@line/liff")
			.then((liff) => liff.default)
			.then((liff) => {
				liff
					.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
					.then(() => {
						if (!liff.isInClient() && !liff.isLoggedIn()) {
							liff.login();
						}
						const userData = liff.getDecodedIDToken();
						dispatch(
							setLiffData({
								uid: userData?.sub,
								//name: userData?.name,
								//picture: userData?.picture,
								isInClient: liff.isInClient(),
								isLoggedIn: liff.isLoggedIn(),
								token: liff.getAccessToken(),
							})
						);
					})
					.catch((error: Error) => {
						console.error(error);
					});
			});
	}, []); */

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
};

export default MyApp;
