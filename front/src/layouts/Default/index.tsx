import type { FC } from "react";
import { useContext } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import { AuthContext } from "@/contexts/AuthContext";
import type { LayoutProps } from "../types";
import LogoLight from "@/assets/Logo-light.svg";
import LogoDark from "@/assets/Logo-dark.svg";
import loginButtonImage from "@/assets/line-login-button@1.5x.png";
import Head from "next/head";
import Header from "@/components/Header";

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
	const { isError, isLogIn } = useContext(AuthContext);

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

			{isError ? (
				<div className='relative w-screen min-w-80 h-screen flex flex-col items-center gap-4 p-4'>
					<div className='w-screen max-w-80 flex flex-col items-center'>
						{!window.matchMedia("(prefers-color-scheme: dark)").matches ? (
							<LogoLight />
						) : (
							<LogoDark />
						)}
					</div>
					セッションが切れました．
					<a
						href={`https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`}
						className='relative w-48'
					>
						<Image
							src={loginButtonImage}
							layout='responsive'
							objectFit='contain'
							alt='login'
						/>
					</a>
				</div>
			) : (
				<div className='relative w-screen min-w-80 h-full flex flex-col items-center'>
					<Header />
					{isLogIn ? children : <Loader />}
				</div>
			)}
		</>
	);
};

export default DefaultLayout;
