import { Easing } from "react-native";

import { TransitionConfig } from "./types";

export function blurFadeIn(duration: number = 300): TransitionConfig {
  return {
    transitionSpec: {
      animation: "timing",
      config: {
        duration,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      },
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.8, index],
        outputRange: [0, 0.95, 1],
      });

      return { opacity };
    },
  };
}
