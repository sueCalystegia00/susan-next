import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { userSlice } from "store/user";
import styles from "../styles/Home.module.css";

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
	liff,
	liffError,
}) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);

	const handleConfirm = () => {
		console.log(user);
	};

	return (
		<div>
			<Head>
				<title>LIFF App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1>create-liff-app</h1>
				{liff && <p>LIFF init succeeded.</p>}
				{liffError && (
					<>
						<p>LIFF init failed.</p>
						<p>
							<code>{liffError}</code>
						</p>
					</>
				)}
				<h2>redux test</h2>
				<button type='button' onClick={handleConfirm}>
					確認
				</button>
			</main>
		</div>
	);
};

export default Home;
