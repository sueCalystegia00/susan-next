import type { FC } from "react";
import { useContext } from "react";
import Loader from "@/components/Loader";
import AuthProvider, { AuthContext } from "@/contexts/AuthContext";
import type { LayoutProps } from "../types";
import LogoLight from "@/assets/Logo-light.svg";
import LogoDark from "@/assets/Logo-dark.svg";
import Header from "@/components/Header";
import Authenticated from "@/components/Authenticated";
import LoginButton from "@/components/LoginButton";

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
	const { isError, isLogIn } = useContext(AuthContext);
	return (
		<>
			<AuthProvider>
				<Authenticated />
				{isError ? (
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
					<div className='relative w-screen min-w-80 h-full flex flex-col items-center'>
						<Header />
						{isLogIn ? children : <Loader />}
					</div>
				)}
			</AuthProvider>
		</>
	);
};

export default DefaultLayout;
