const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('node:path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  watchOptions: {
    // Poll every 1 s — required on Windows where inotify is unavailable
    poll: 1000,
    ignored: /node_modules/,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
