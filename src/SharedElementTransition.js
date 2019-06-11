import React, { Component } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";

export class SharedElementTransitionBase extends Component {
  static propTypes = {
    style: PropTypes.any,
    sources: PropTypes.any.isRequired,
    animation: PropTypes.oneOf(["move", "dissolve"]),
    autoHide: PropTypes.bool,
    value: PropTypes.any
  };

  static defaultProps = {
    autoHide: true
  };

  static isAvailable = NativeModules.RNSharedElementTransition ? true : false;

  constructor(props) {
    super(props);
    if (!SharedElementTransitionBase.isAvailable) {
      throw new Error(
        "RNSharedElementTransition is not available, did you forget to use `react-native link react-native-shared-element-transition`?"
      );
    }
  }

  render() {
    return <RNSharedElementTransition {...this.props} />;
  }
}

const RNSharedElementTransition = (function() {
  try {
    const RNSharedElementTransition = SharedElementTransitionBase.isAvailable
      ? requireNativeComponent(
          "RNSharedElementTransition",
          SharedElementTransitionBase
        )
      : undefined;
    return RNSharedElementTransition;
  } catch (err) {
    SharedElementTransitionBase.isAvailable = false;
    // eslint-disable-next-line
    console.error(
      `${
        err.message
      } (are you importing two different versions of react-native-shared-element-transition?)`
    );
  }
})();

export const SharedElementTransition = Animated.createAnimatedComponent(
  SharedElementTransitionBase
);
SharedElementTransition.isAvailable = SharedElementTransitionBase.isAvailable;

export function sourceFromRef(ref) {
  return ref ? findNodeHandle(ref) : undefined;
}
