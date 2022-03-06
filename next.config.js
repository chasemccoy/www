module.exports = {
  eslint: {
    // ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'utils'],
  },
  // Add the generate-feed script as a webpack entry so that it gets compiled and can use all the code from within the src directory
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      const originalEntry = config.entry

      config.entry = async () => {
        const entries = { ...(await originalEntry()) }
        entries['generate-feed'] = './bin/generate-feed'
        return entries
      }
    }

    return config
  },
  repo: 'chasemccoy/www',
  noteCategories: ['code', 'design-systems', 'misc'],
}
