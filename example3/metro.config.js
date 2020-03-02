/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },

  // Add custom resolver and watch-folders because
  // Metro doesn't work well with the link to the library.
  resolver: {
    extraNodeModules: new Proxy(
      {},
      { get: (_, name) => path.resolve("./node_modules", name) }
    )
  },
  watchFolders: [path.resolve("./node_modules"), path.resolve("..")]
};
