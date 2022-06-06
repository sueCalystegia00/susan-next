import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>LIFF App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1>create-liff-app</h1>
			</main>
		</div>
	);
};

export default Home;
