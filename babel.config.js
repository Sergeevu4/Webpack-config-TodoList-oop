module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        debug: true,

        corejs: '3',
        targets: ['> 1%', 'ie 11', 'not op_mini all'],
      },
    ],
  ];

  // const plugin = [];

  return {
    presets,
    // plugin,
  };
};
