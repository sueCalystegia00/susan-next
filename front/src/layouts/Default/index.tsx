import { FC, useContext } from "react";
import type { LayoutProps } from "../types";
import Header from "@/components/Header";
import LogoLight from "@/assets/Logo-light.svg";
import LogoDark from "@/assets/Logo-dark.svg";
import LoginButton from "@/components/LoginButton";
import { AuthContext } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
	const { isError, isLogIn } = useContext(AuthContext);
	return isError ? (
		<div className='relative w-screen min-w-80 h-screen flex flex-col items-center gap-4 p-4'>
			<div className='w-screen max-w-80 flex flex-col items-center'>
				{!window.matchMedia("(prefers-color-scheme: dark)").matches ? (
					<LogoLight />
				) : (
					<LogoDark />
				)}
			</div>
			<p>ログインに失敗しました．</p>
			<LoginButton />
		</div>
	) : (
		<div className='relative w-screen min-w-80 min-h-full flex flex-col items-center'>
			<Header />
			{isLogIn ? children : <Loader />}
		</div>
	);
};

export default DefaultLayout;
