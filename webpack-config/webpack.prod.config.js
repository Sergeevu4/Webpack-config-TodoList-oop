// ! --mode production

// Для склеивания config
const merge = require('webpack-merge');

// Общий конфиг для dev и prod - разработки
const baseWebpackConfig = require('./webpack.common.config');

// Пересоздание папки public
const CleanWebpackPlugin = require('clean-webpack-plugin');

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD settings gonna be here
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
});

// ! export buildWebpackConfig
// eslint-disable-next-line no-unused-vars
module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig);
});

/*

  ! Плагины для сжатия изображения:
  Основной плагин для работы с изображениями и сжатие их
  const ImageminPlugin = require('imagemin-webpack-plugin').default;
  Плагин для сжатия jpeg по технологии Mozjpeg
  const imageminMozjpeg = require('imagemin-mozjpeg');
  Плагин для сжатия svg
  const imageminSvgo = require('imagemin-svgo');

  ! Плагин для преобразования изображений в формат webp:
  ImageminWebpWebpackPlugin

  ! Необходимые настройки для работы плагинов
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: { quality: '95-100' }, // PNG
      plugins: [
        imageminMozjpeg({
          quality: 75, // JPG
        }),
        imageminSvgo({
          // SVG
          plugins: [
            { removeViewBox: false },
            { removeTitle: true },
            { removeDimensions: true },
          ],
        }),
        imageminWebp({ quality: 80 })
      ],
    }),

  ! Удалять папки public можно удалять без плагина CleanWebpackPlugin
  "build": "rimraf public && webpack --progress --config путь к конфигу"
*/
