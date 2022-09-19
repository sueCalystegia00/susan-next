import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import useScrollTop from "@/hooks/useScrollTop";
import Head from "next/head";
import AuthProvider from "@/contexts/AuthContext";
import Authenticated from "@/components/Authenticated";

const requireAuthRoute = [
	"/",
	"/admin/intentsController",
	"/questionsList",
	"/question/[questionId]",
];

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

			{requireAuthRoute.includes(router.route) ? (
				<AuthProvider>
					<Authenticated />
					<Component {...pageProps} key={router.asPath} />
				</AuthProvider>
			) : (
				<Component {...pageProps} key={router.asPath} />
			)}
		</>
	);
};

export default MyApp;
