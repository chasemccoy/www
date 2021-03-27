module.exports = {
	plugins: [
		require('postcss-import')({
			from: 'src/styles/shared.css'
		}),
		require('postcss-each'),
		require('postcss-simple-vars'),
		require('postcss-preset-env')({
			stage: false,
			features: {
				'custom-media-queries': true
			},
			importFrom: 'src/styles/theme.css'
		}),
		require('postcss-nested'),
		require('autoprefixer')
	]
};
