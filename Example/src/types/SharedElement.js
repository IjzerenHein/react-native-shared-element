// @flow
import type {
  SharedElementTransitionAnimation,
  SharedElementTransitionResize,
  SharedElementTransitionAlign
} from "react-native-shared-element";

export type SharedElementTransitionConfig = {|
  animation: SharedElementTransitionAnimation,
  resize?: SharedElementTransitionResize,
  align?: SharedElementTransitionAlign
|};

export type SharedElementsConfig = {
  [key: string]:
    | SharedElementTransitionConfig
    | SharedElementTransitionAnimation
    | boolean
};
