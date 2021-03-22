module.exports = {
  plugins: [
    require('postcss-import')({
      from: "src/styles/global.css"
    }), 
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: false,
      features: {
        'custom-media-queries': true
      }
    }),
    require('autoprefixer')
  ]
}