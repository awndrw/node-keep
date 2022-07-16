module.exports = {
	devtool: 'inline-source-map',
	resolve: {
		fallback: {
			fs: false,
			crypto: false,
			path: false,
		},
	},
};
