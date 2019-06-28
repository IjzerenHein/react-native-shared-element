// @flow
import { Easing, Animated } from "react-native";

export function fromRightEx(duration: number = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    // $FlowFixMe
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0],
      });

      /*const scale = position.interpolate({
        inputRange: [index - 1, index - 0.2, index, index + 0.2, index + 1],
        outputRange: [scaleFactor, scaleFactor, 1, scaleFactor, scaleFactor],
      });*/

      const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [1, 1, 0.5],
      });

      /*const zIndex = position.interpolate({
        inputRange: [index -1, index, index + 1],
        outputRange: [0, 10, 0]
      });*/

      return { opacity, transform: [{ translateX }/*, {scale }*/] };
    },
  };
}
