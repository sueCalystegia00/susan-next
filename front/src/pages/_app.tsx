import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Authenticated from "@/components/Authenticated";
import AuthProvider from "@/contexts/AuthContext";
import useScrollTop from "@/hooks/useScrollTop";
import DefaultLayout from "@/layouts/Default";
import Head from "next/head";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
	useScrollTop();

	return (
		<>
			<Head>
				<title>SUSAN Next</title>
				<meta
					name='description'
					content='質問対応チャットボットSUSANと連携するLIFFアプリケーションです'
				/>
				<meta charSet='utf-8' />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta name='robots' content='noindex,nofollow' />
			</Head>

			<AuthProvider>
				<Authenticated />
				<DefaultLayout>
					<Component {...pageProps} key={router.asPath} />
				</DefaultLayout>
			</AuthProvider>
		</>
	);
};

export default MyApp;
