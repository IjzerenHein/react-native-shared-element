
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