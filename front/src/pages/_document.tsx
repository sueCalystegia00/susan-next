import { Head, Html, Main, NextScript } from "next/document";

const MyDocument = () => {
	return (
		<Html lang='ja-JP'>
			<Head>
				<meta name='application-name' content='SUSAN ver.Next.js' />
				<link rel='stylesheet' />
			</Head>
			<body className='dark:text-slate-100 dark:bg-gray-800'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default MyDocument;
