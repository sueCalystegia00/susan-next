module.exports = {
	content: [
		// class属性を含む全てのファイルを指定する必要がある(jsx,htmlなど)
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
