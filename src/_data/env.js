module.exports = function () {
  console.log(process.env.ENVIRONMENT)
  return {
    environment: process.env.ENVIRONMENT || 'development',
  }
}
