
# react-native-shared-element-transition

Essential native shared element transition primitives for react-native 💫

# WORK IN PROGRESS

## Index

- [Basic usage](#basic-usage)
- [How it works](#howitworks)
- [Documentation](#documentation)


## Basic usage

```js
import { SharedElement, SharedElementTransition } from 'react-native-shared-element-transition';


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

react-native-shared-element-transition is a *"primitive"* that runs shared element transitions
entirely native without requiring any passes over the JavaScript bridge. It works by taking in a start- and end node, which are obtained using the `<SharedElement>` component.

Whenever a transition between screens occurs (e.g. performed by a router/navigator), a view in
front of the app should be rendered to host the shared element transitions.
The `position` prop is used to interpolate between the start- and end nodes, `0` meaning "Show the start node" and `1` meaning "Show the end node".

Whenever the `<SharedElementTransition>` component is rendered, it performs the following tasks:
- Measure the size of the provided nodes
- Obtain the visual content of the sources (e.g. an image or a snapshot)
- Obtain the styles of nodes
- Render a visual copy of first source at its current position
- Hide the nodes whenever the visual copies are on the screen
- Monitor the `position` prop and render the shared element transition accordingly
- Upon unmount, re-show the original elements

You typically do not use this component directly, but instead use a Router or Transition-engine which provides a higher-level API.

## Documentation

### SharedElement

The `<SharedElement>` component accepts a single child and returns a `node` to it through the `onNode` event handler. The child must be a "real" view which exists in the native view hierarchy.

#### Props

| Property        | Type       | Description                                                                          |
| --------------- | ---------- | ------------------------------------------------------------------------------------ |
| `children`      | `element`  | A single child component, which must map to a real view in the native view hierarchy |
| `onNode`        | `function` | Event handler that sets or unsets the node-handle                                    |
| `View props...` |            | Other props supported byt View                                                       |

### SharedElementTransition

The `<SharedElementTransition>` component executes a shared element transition natively. It natively performs the following tasks: measure, clone, hide, animate and unhide, to achieve the best results.

#### Props

| Property    | Type                                                       | Description                                                                |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| `start`     | `{ node: SharedElementNode, ancestor: SharedElementNode }` | Start node- and ancestor                                                   |
| `end`       | `{ node: SharedElementNode, ancestor: SharedElementNode }` | End node- and ancestor                                                     |
| `animation` | SharedElementAnimation                                     | See Animations                                                             |
| `position`  | `number | Animated.Value`                                  | Interpolated position (0..1), between the start- and end nodes             |
| `debug`     | `boolean`                                                  | Renders debug overlays for diagnosing measuring and animations             |
| `onMeasure` | `function`                                                 | Event handler that is called when nodes have been measured and snapshotted |

### Animations

The following animation-types are available.

| Animation           | Description                                     |
| ------------------- | ----------------------------------------------- |
| `move`              |                                                 |
| `fade`              | Cross-fades between the start- and end elements |
| `fade-left`         |                                                 |
| `fade-top`          |                                                 |
| `fade-right`        |                                                 |
| `fade-bottom`       |                                                 |
| `fade-top-left`     |                                                 |
| `fade-top-right`    |                                                 |
| `fade-bottom-right` |                                                 |
| `fade-bottom-left`  |                                                 |

## Todo

