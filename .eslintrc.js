module.exports = {
  extends: ['@react-native-community', 'prettier'],
  plugins: ['prettier', 'react', 'react-native'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
};
