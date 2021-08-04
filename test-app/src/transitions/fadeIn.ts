import { Easing, Animated } from "react-native";

export function fadeIn(duration: number = 400, spring: boolean = false) {
  const transitionSpec = spring
    ? {
        timing: Animated.spring,
        tension: 10,
        useNativeDriver: true,
      }
    : {
        duration,
        easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
        timing: Animated.timing,
        useNativeDriver: true,
      };

  return {
    transitionSpec,
    screenInterpolator: ({ position, scene }: any) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });

      return { opacity };
    },
  };
}
