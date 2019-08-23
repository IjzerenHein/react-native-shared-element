
# react-native-shared-element

Native shared element transition primitives for react-native 💫

# WORK IN PROGRESS

## Index

- [react-native-shared-element](#react-native-shared-element)
- [WORK IN PROGRESS](#work-in-progress)
  - [Index](#index)
  - [Installation](#installation)
  - [Basic usage](#basic-usage)
  - [How it works](#how-it-works)
  - [API Documentation](#api-documentation)
    - [SharedElement](#sharedelement)
      - [Props](#props)
    - [SharedElementTransition](#sharedelementtransition)
      - [Props](#props-1)
    - [Animations](#animations)
      - [SharedElementTransitionAnimation](#sharedelementtransitionanimation)
      - [SharedElementTransitionResize](#sharedelementtransitionresize)
      - [SharedElementTransitionAlign](#sharedelementtransitionalign)
  - [Example app](#example-app)
  - [Todo](#todo)
  - [License](#license)
  - [Credits](#credits)


## Installation

`yarn add react-native-shared-element`

Link the native code (TODO: Update for auto-linking)

`react-native link react-native-shared-element`

## Basic usage

```js
import { SharedElement, SharedElementTransition } from 'react-native-shared-element';


// Scene 1
let startNode;
<View>
  ...
  <SharedElement onNode={node => startNode = node}>
    <Image style={styles.image} source={...} />
  </SharedElement>
  ...
</View>


// Scene2
let endNode;
<View>
  ...
  <SharedElement onNode={node => endNode = node}>
    <Image style={styles.image} source={...} />
  </SharedElement>
  ...
</View>

// Render overlay in front of screen
const position = new Animated.Value(0);
<View style={StyleSheet.absoluteFill}>
  <SharedElementTransition
    start={{node: startNode}}
    end={{node: endNode}}
    position={position} />
</View>
```

## How it works

react-native-shared-element is a *"primitive"* that runs shared element transitions
entirely native without requiring any passes over the JavaScript bridge. It works by taking in a start- and end node, which are obtained using the `<SharedElement>` component.

Whenever a transition between screens occurs (e.g. performed by a router/navigator), a view in
front of the app should be rendered to host the shared element transition. The `position` prop is used to interpolate between the start- and end nodes, `0` meaning "Show the start node" and `1` meaning "Show the end node".

Whenever the `<SharedElementTransition>` component is rendered, it performs the following tasks:
- Measure the size and position of the provided element
- Obtain the styles of the elements
- Obtain the visual content of the elements (e.g. an image or a view snapshot)
- Render a visual copy of the start element at its current position
- Hide the original elements whenever the visual copy are on the screen
- Monitor the `position` prop and render the shared element transition accordingly
- Upon unmount, unhide the original elements

You typically do not use this component directly, but instead use a Router or Transition-engine which provides a higher-level API.
See [`./Example/src/components/Router.js`](./Example/src/components/Router.js) for an example implementation of a simple stack router using 
shared element transitions.

## API Documentation

### SharedElement

The `<SharedElement>` component accepts a single child and returns a `node` to it through the `onNode` event handler. The child must be a "real" `View` which exists in the native view hierarchy.

#### Props

| Property        | Type       | Description                                                                          |
| --------------- | ---------- | ------------------------------------------------------------------------------------ |
| `children`      | `element`  | A single child component, which must map to a real view in the native view hierarchy |
| `onNode`        | `function` | Event handler that sets or unsets the node-handle                                    |
| `View props...` |            | Other props supported by View                                                        |

### SharedElementTransition

The `<SharedElementTransition>` component executes a shared element transition natively. It natively performs the following tasks: measure, clone, hide, animate and unhide, to achieve the best results.

#### Props

| Property     | Type                                                                  | Description                                                                                                |
| ------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `start`      | `{ node: SharedElementNode, ancestor: SharedElementNode }`            | Start node- and ancestor                                                                                   |
| `end`        | `{ node: SharedElementNode, ancestor: SharedElementNode }`            | End node- and ancestor                                                                                     |
| `position`   | `number | Animated.Value`                                             | Interpolated position (0..1), between the start- and end nodes                                             |
| `animation`  | [SharedElementTransitionAnimation](#SharedElementTransitionAnimation) | Type of animation, e.g move start element or cross-fade between start- and end elements (default = `move`) |
| `resizeMode` | [SharedElementTransitionResize](#SharedElementTransitionResize)       | Resize-mode transition (default = `stretch`)                                                               |
| `alignment`  | [SharedElementTransitionAlign](#SharedElementTransitionAlign)         | Alignment (default = `center-center`)                                                                      |
| `debug`      | `boolean`                                                             | Renders debug overlays for diagnosing measuring and animations                                             |
| `onMeasure`  | `function`                                                            | Event handler that is called when nodes have been measured and snapshotted                                 |

### Animations

The following animation-types are available.


#### SharedElementTransitionAnimation

| Animation | Description                                     |
| --------- | ----------------------------------------------- |
| `move`    | Moves the start- element to the end position    |
| `fade`    | Cross-fades between the start- and end elements |

#### SharedElementTransitionResize

| Resize-mode | Description |
| ----------- | ----------- |
| `stretch`   |             |
| `cover`     |             |
| `contain`   |             |
| `none`      |             |

#### SharedElementTransitionAlign

| Alignment       | Description |
| --------------- | ----------- |
| `left-center`   |             |
| `left-top`      |             |
| `left-right`    |             |
| `right-center`  |             |
| `right-top`     |             |
| `right-right`   |             |
| `center-top`    |             |
| `center-center` |             |
| `center-bottom` |             |





## Example app

The example app is located in [`./Example`](./Example) and serves as an exploration and testing tool. It features a simple stack router which implements the shared element primitives.

## Todo


## License

Shared element transition library is licensed under [The MIT License](./LICENSE.txt).

## Credits

This project is supported by amazing people from [Expo.io](https://expo.io)

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 "Expo.io")](https://expo.io)
