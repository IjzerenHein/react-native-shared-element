// @flow
import * as React from "react";
import {
  View,
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";
import type { SharedElementSourceRef } from "./SharedElementSource";

export type SharedElementAnimation = "move" | "dissolve";

export interface SharedElementTransitionProps {
  sources: SharedElementSourceRef[];
  value: number | Animated.Value | void;
  animation?: SharedElementAnimation;
  autoHide?: boolean;
}

export const isAvailable = NativeModules.RNSharedElementTransition
  ? true
  : false;

const RNSharedElementTransition = isAvailable
  ? requireNativeComponent("RNSharedElementTransition")
  : undefined;

const RNAnimatedSharedElementTransition = RNSharedElementTransition
  ? Animated.createAnimatedComponent(RNSharedElementTransition)
  : undefined;

export class SharedElementTransitionBase extends React.Component<SharedElementTransitionProps> {
  static propTypes = {
    sources: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    animation: PropTypes.oneOf(["move", "dissolve"]),
    autoHide: PropTypes.bool
  };

  static defaultProps = {
    autoHide: true
  };

  static prepareSources(sources: SharedElementSourceRef[]): any {
    return sources.map(source =>
      source
        ? {
            nodeHandle: source.nodeHandle,
            isParent: source.isParent
          }
        : undefined
    );
  }

  constructor(props: SharedElementTransitionProps) {
    super(props);
    if (!RNSharedElementTransition) {
      throw new Error(
        "RNSharedElementTransition is not available, did you forget to use `react-native link react-native-shared-element-transition`?"
      );
    }
  }

  render() {
    const { sources, ...otherProps } = this.props;
    return RNSharedElementTransition ? (
      <RNSharedElementTransition
        sources={SharedElementTransitionBase.prepareSources(sources)}
        {...otherProps}
      />
    ) : null;
  }
}

export class SharedElementTransition extends React.Component<SharedElementTransitionProps> {
  static propTypes = SharedElementTransitionBase.propTypes;
  static defaultProps = SharedElementTransitionBase.defaultProps;

  constructor(props: SharedElementTransitionProps) {
    super(props);
    if (!RNAnimatedSharedElementTransition) {
      throw new Error(
        "RNSharedElementTransition is not available, did you forget to use `react-native link react-native-shared-element-transition`?"
      );
    }
  }

  render() {
    const { sources, ...otherProps } = this.props;
    return RNAnimatedSharedElementTransition ? (
      <RNAnimatedSharedElementTransition
        sources={SharedElementTransitionBase.prepareSources(sources)}
        {...otherProps}
      />
    ) : null;
  }
}
