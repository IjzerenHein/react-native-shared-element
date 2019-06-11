
# react-native-shared-element-transition

Shared element transition component that runs entirely natively for fast and perfect transitions without any flickering 💫

## WIP, go away

## TEMP API

```js
import { SharedElementTransition } from 'react-native-shared-element-transition';


// Scene 1
let source1;
<View>
    <Image
        style={styles.image}
        source={...}
        ref={(ref) => {
            source1 = sourceFromRef(ref);
        }}
    />
</View>


// Scene2
let source2;
<View>
    <Image
        style={styles.image}
        source={...}
        ref={(ref) => {
            source2 = sourceFromRef(ref);
        }}
    />
</View>

// Render overlay in front of screen
<View style={StyleSheet.absoluteFill}>
    <SharedElementTransition
        sources={[source1, source2]}
        value={Animated.Value} />
</View>
```

### How it works

react-native-shared-element-transition is a component that runs shared element transitions
entirely native without requiring any passes over the JavaScript bridge. It works by taking in two
"sources" which can be obtained from a ref of a `<SharedElementSource>` wrapper.
Whenever a transition between screens occurs (e.g. performed by a router/navigator), a view in
front of the app should be rendered to host the shared-element-transitions.
The `value` prop is used to interpolate between the start- and end source, `0` meaning "Show the start
source" and `1` meaning "Show the end source".

Whenever the `<SharedElementTransition>` component is rendered, it performs the following tasks:
- Measure the size of all sources
- Obtain the visual content of the sources (e.g. an image)
- Obtain the styles of sources
- Render a visual copy of first source at its current position
- Hide the original sources whenever the visual copies are on the screen
- Monitor the `value` prop and render the shared element transition accordingly
- Upon unmount, re-show the original copies

You typically do not use this component directly, but instead use a Router or Transition engine instead
to handle the administration and mounting instead.