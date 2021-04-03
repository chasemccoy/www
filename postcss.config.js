module.exports = {
	plugins: {
		'postcss-import': {
			from: 'src/styles/shared.css'
		},
		'postcss-each': {},
		'postcss-simple-vars': {},
		'postcss-preset-env': {
			stage: false,
			features: {
				'custom-media-queries': true
			},
			importFrom: 'src/styles/theme.css'
		},
		'postcss-nested': {},
		'autoprefixer': {}
	}
};
