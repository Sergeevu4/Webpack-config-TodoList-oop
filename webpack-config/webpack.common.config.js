// ! Этот файл (базовый для мерджа) будет использоваться и dev в build
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const LodashReplacementPlugin = require('lodash-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'), // .. потому что  конфиги находятся в папке webpack-build
  public: path.join(__dirname, '../public'),
  assets: './', // название папки ('assets/' -> можно написать имя папки)
};

module.exports = {
  externals: {
    // нужен жля того чтобы получить доступ к PATHS из остальных config
    paths: PATHS,
  },
  // Точки входа
  entry: {
    app: PATHS.src, // Первая точка - webpack сам понимает что нужен index.js
    // sort: './src/index' - возможна подключить несколько точек
  },

  output: {
    // Точка выхода
    path: PATHS.public, // Путь -> public - название папки выхода
    filename: `${PATHS.assets}js/[name].js`, // name из входной точки -> [app]
    // publicPath: '/', // публичный publicPath - в dev -> contentBase
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader', // Обрабатываем все js файлы через babel
          },
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
              configFile: './.eslintrc.json',
            },
          },
        ],
      },
      {
        test: /\.scss$/, // Через регуляр. обращаемся ко всем js
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, url: false }, // ../ - запрет на удаления в css
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: `${PATHS.src}/postcss.config.js` } },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i, // обработка картинок
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', // [ext] из test -> img
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new StyleLintPlugin({
      context: 'src',
      syntax: 'scss',
      files: 'scss/*.scss',
      quiet: false,
      emitErrors: false, // by default this is to true to check the CSS lint errors
    }),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/style.css`, // [name] ссылается на app
      // chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: `${PATHS.src}/index.html`, // где искать HTML
      filename: './index.html',
    }),
    new CopyWebpackPlugin([
      // копирования файлов
      { from: `${PATHS.src}/img`, to: `${PATHS.assets}img` }, // from - откуда, to - куда
      { from: `${PATHS.src}/static`, to: `` },
      { from: `${PATHS.src}/fonts`, to: `${PATHS.assets}fonts` },
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery/dist/jquery.min.js',
      jQuery: 'jquery/dist/jquery.min.js',
      'window.jQuery': 'jquery/dist/jquery.min.js',
    }),
    new LodashReplacementPlugin({
      // Плагин для сжатия функции Lodash
      collections: true,
      paths: true,
    }),
  ],
};
