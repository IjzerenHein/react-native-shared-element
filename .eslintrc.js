module.exports = {
  extends: ["@react-native-community", "prettier"],
  plugins: ["prettier", "react", "react-native"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "react-native/no-inline-styles": 0
  },
  env: {
    node: true,
    "react-native/react-native": true
  },
  settings: {
    react: {
      version: "latest"
    }
  }
};
