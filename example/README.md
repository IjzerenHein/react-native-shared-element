# Shared Element Transition Example and Test App

The example app features two implementations:

- [A full test app demonstrating the capabilities and a variety of tests and receipes (./src)](./src)
- [A basic bare bone implementation of a router supporting shared element transitions (./basic)](./basic)

To use the basic implementation, uncomment the following line in `index.js`

```ts
// import App from "./src/App";
import App from "./basic/App";
```

## Usage

**Open a terminal in the root folder and build the code**

```bash
# Install dependencies
yarn

# Build the js code
yarn build
```

**Open the /example app in another terminal**

```bash
# Install dependencies
cd example
yarn

# Start packager
yarn start

# Run for ios
cd ios && npx pod install && cd ..
yarn ios

# Run for android
yarn android
```

## Todo

[ ] Fix web-build