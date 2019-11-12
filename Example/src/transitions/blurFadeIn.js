// @flow
import {Easing, Animated} from 'react-native';

export function blurFadeIn(duration: number = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    // $FlowFixMe
    screenInterpolator: ({position, scene}) => {
      const {index} = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.8, index],
        outputRange: [0, 0.95, 1],
      });

      return {opacity};
    },
  };
}
