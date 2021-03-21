module.exports = {
  apps: [
    {
      name: 'Netlify',
      script: 'netlify dev',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Remix',
      // ignoring the error output because of circular deps with the compile-mdx stuff
      script: 'remix run 2> /dev/null',
      // script: 'remix run',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}