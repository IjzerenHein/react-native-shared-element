// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// eslint-disable-next-line no-undef
const defaultConfig = getDefaultConfig(__dirname);

const resolvers = {
  "react-native-shared-element": "..",
};

// Add custom resolver and watch-folders because
// Metro doesn't work well with the link to the library.
defaultConfig.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_, name) => path.resolve(resolvers[name] || "./node_modules", name),
  }
);
defaultConfig.watchFolders.push(path.resolve("./node_modules"));
defaultConfig.watchFolders.push(path.resolve(".."));

module.exports = defaultConfig;
