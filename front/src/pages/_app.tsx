import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Authenticated from "@/components/Authenticated";
import AuthProvider from "@/contexts/AuthContext";
import useScrollTop from "@/hooks/useScrollTop";
import DefaultLayout from "@/layouts/Default";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
	useScrollTop();

	return (
		<AuthProvider>
			<Authenticated />
			<DefaultLayout>
				<Component {...pageProps} key={router.asPath} />
			</DefaultLayout>
		</AuthProvider>
	);
};

export default MyApp;
