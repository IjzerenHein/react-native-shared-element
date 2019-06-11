import React, { Component } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";

export class VisualClone extends Component {
  static propTypes = {
    style: PropTypes.any,
    sources: PropTypes.any.isRequired,
    animation: PropTypes.oneOf(["move", "dissolve", "flipX", "flipY"]),
    autoHide: PropTypes.bool,
    value: PropTypes.any
  };

  static defaultProps = {
    autoHide: true
  };

  static isAvailable = NativeModules.RNVisualClone ? true : false;

  constructor(props) {
    super(props);
    if (!VisualClone.isAvailable) {
      throw new Error(
        "RNVisualClone is not available, did you forget to use `react-native link react-native-visual-clone`?"
      );
    }
  }

  render() {
    //console.log("VisualClone.render, source:", nodeHandle);
    return <RNVisualClone {...this.props} />;
  }
}

const RNVisualClone = (function() {
  try {
    const RNVisualClone = VisualClone.isAvailable
      ? requireNativeComponent("RNVisualClone", VisualClone)
      : undefined;
    return RNVisualClone;
  } catch (err) {
    VisualClone.isAvailable = false;
    // eslint-disable-next-line
    console.error(
      `${
        err.message
      } (are you importing two different versions of react-native-visual-clone?)`
    );
  }
})();

export const AnimatedVisualClone = Animated.createAnimatedComponent(
  VisualClone
);

export function sourceFromRef(ref) {
  return ref ? findNodeHandle(ref) : undefined;
}
