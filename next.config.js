module.exports = {
	// future: {
  //   webpack5: true,
  // },
  // This doesn't work with webpack5 :\
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = { ...(await originalEntry()) };
        entries['./bin/generate-feed'] = './bin/generate-feed';
        return entries;
      };
    }

    return config;
  },
	noteCategories: ['code', 'design-systems', 'misc'],
}