import { Easing } from "react-native";

import { TransitionConfig } from "./types";

// Standard Android-style reveal from the bottom for Android Q.
// inspired by: https://github.com/react-navigation/react-navigation/blob/main/packages/stack/src/TransitionConfigs/CardStyleInterpolators.tsx#L280
export function scaleCenter(duration: number = 400): TransitionConfig {
  return {
    transitionSpec: {
      animation: "timing",
      config: {
        duration,
        // This is super rough approximation of the path used for the curve by android
        // See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
        easing: Easing.bezier(0.35, 0.45, 0, 1),
        useNativeDriver: true,
      },
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;

      const scale = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0.85, 1, 1.1],
      });

      const opacity = position.interpolate({
        inputRange: [
          index - 1,
          index - 0.25,
          index - 0.125,
          index,
          index + 0.0825,
          index + 0.2075,
          index + 1,
        ],
        outputRange: [0, 0, 1, 1, 1, 1, 0],
      });
      return {
        transform: [{ scale }],
        opacity,
      };
    },
  };
}
