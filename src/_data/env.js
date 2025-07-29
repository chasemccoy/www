export default function() {
  return {
    environment: process.env.ENVIRONMENT || 'development',
  }
}
