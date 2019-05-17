module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        debug: true, // команда необходимая для наглядности подключаемых плагинов
        corejs: { version: 3, proposals: true },
        targets: ['> 1%', 'ie 11', 'not op_mini all'],
      },
    ],
  ];

  const plugins = ['@babel/plugin-transform-runtime', 'lodash'];
  // lodash необходим для обработки путей при обращении к функция

  return {
    presets,
    plugins,
  };
};
