module.exports = {
  extends: '@react-native-community',
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': [2, 'fb'],
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
};
