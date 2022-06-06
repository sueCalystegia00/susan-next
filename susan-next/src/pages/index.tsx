import type { NextPage } from "next";
import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "store";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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
				{user.liff.isLoggedIn ? (
					<p>{user.liff.uid}</p>
				) : (
					<p> you're not logged in. </p>
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
