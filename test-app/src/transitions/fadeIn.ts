import { Easing } from "react-native";

import { TransitionSpec, TransitionConfig } from "./types";

export function fadeIn(
  duration: number = 400,
  spring: boolean = false
): TransitionConfig {
  const transitionSpec: TransitionSpec = spring
    ? {
        animation: "spring",
        config: {
          tension: 10,
          useNativeDriver: true,
        },
      }
    : {
        animation: "timing",
        config: {
          duration,
          easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
          useNativeDriver: true,
        },
      };

  return {
    transitionSpec,
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });

      return { opacity };
    },
  };
}
