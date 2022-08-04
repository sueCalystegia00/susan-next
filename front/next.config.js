/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		LIFF_ID: process.env.LIFF_ID,
	},
	distDir: "build",
	optimizeFonts: true,
};

module.exports = nextConfig;
