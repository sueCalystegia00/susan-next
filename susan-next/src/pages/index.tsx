import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store";
import styles from "../styles/Home.module.css";

import { initializeLiff } from "store/user";

const Home: NextPage = () => {
	const dispatch: AppDispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (!user.liff.isLoggedIn) dispatch(initializeLiff());
	}, [user]);

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
