module.exports = {
  plugins: [
    require('postcss-import')({
      from: "src/styles/global.css"
    }), 
    require('postcss-nested'),
    require('autoprefixer')
  ]
}