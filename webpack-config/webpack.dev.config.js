// ! --mode development

const webpack = require('webpack');
// Для склеивания config
const merge = require('webpack-merge');
// Общий конфиг для dev и prod - разработки
const baseWebpackConfig = require('./webpack.common.config');

const devWebpackConfig = merge(baseWebpackConfig, {
  // BUILD settings gonna be here
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.public, // где будет открываться webpack
    port: 8081,
    clientLogLevel: 'error',
    stats: {
      children: false,
      maxModules: 0,
    },
    overlay: {
      hot: true,
      // warnings: false,
      // errors: true,
    },
  },
  plugins: [
    // карта сайта
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});

// ! export buildWebpackConfig
// eslint-disable-next-line no-unused-vars
module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
