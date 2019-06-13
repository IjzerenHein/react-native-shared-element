// @flow
import React, { Component } from "react";
import {
  View,
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";
import type { ISharedElementSource } from "./SharedElementSource";

export type SharedElementAnimation = "move" | "dissolve";

export interface SharedElementTransitionProps {
  style?: View.propTypes.style;
  sources: ISharedElementSource[];
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

export class SharedElementTransitionBase extends Component<SharedElementTransitionProps> {
  static propTypes = {
    style: PropTypes.any,
    sources: PropTypes.any.isRequired,
    value: PropTypes.any,
    animation: PropTypes.oneOf(["move", "dissolve"]),
    autoHide: PropTypes.bool
  };

  static defaultProps = {
    autoHide: true
  };

  static prepareSources(sources: ISharedElementSource[]): any {
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

export class SharedElementTransition extends Component<SharedElementTransitionProps> {
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
