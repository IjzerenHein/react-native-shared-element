import type { ViewStyle, Animated } from "react-native";

export declare type TransitionSpec =
  | {
      animation: "spring";
      config: Omit<Animated.SpringAnimationConfig, "toValue">;
    }
  | {
      animation: "timing";
      config: Omit<Animated.TimingAnimationConfig, "toValue">;
    };

export type ScreenInterpolatorProps = any; // TODO

export type ScreenInterpolator = (
  props: ScreenInterpolatorProps
) => Partial<ViewStyle>;

export type TransitionConfig = {
  transitionSpec: TransitionSpec;
  screenInterpolator: ScreenInterpolator;
  debug?: boolean;
};
