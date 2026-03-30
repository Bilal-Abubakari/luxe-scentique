//@ts-check
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} **/
const nextConfig = {
  nx: { svgr: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

const plugins = [withNx];
module.exports = composePlugins(...plugins)(nextConfig);
