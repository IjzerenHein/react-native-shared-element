// @flow
import type {
  SharedElementAnimation,
  SharedElementResize,
  SharedElementAlign
} from "react-native-shared-element";

export type SharedElementTransitionConfig = {|
  animation: SharedElementAnimation,
  resize?: SharedElementResize,
  align?: SharedElementAlign
|};

export type SharedElementsConfig = {
  [key: string]:
    | SharedElementTransitionConfig
    | SharedElementAnimation
    | boolean
};
