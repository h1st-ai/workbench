const genConfig = require('./webpack.config');
const path = require('path');
const { merge } = require('webpack-merge');

module.exports = merge(
  {
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          include: [
            // projectstorm is written for recent versions of the
            // node engine, so it will not work on older browsers
            // without transpilation
            path.resolve(__dirname, '..', 'node_modules', '@projectstorm'),
          ],
          loader: require.resolve('babel-loader'),
          options: {
            sourceType: 'unambiguous',
            babelrc: false,
            presets: ['@babel/preset-env'],
          },
        },
      ],
    },
  },
  genConfig,
);
