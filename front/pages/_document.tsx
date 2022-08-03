import { Head, Html, Main, NextScript } from "next/document";

const MyDocument = () => {
	return (
		<Html lang='ja-JP'>
			<Head>
				<meta name='application-name' content='SUSAN ver.Next.js' />
				<link rel='stylesheet' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default MyDocument;
