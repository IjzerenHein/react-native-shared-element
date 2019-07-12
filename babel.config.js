module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-shared-element-transition': './src',
        },
        cwd: 'babelrc',
      },
    ],
  ],
};
