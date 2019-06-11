import React, { Component } from "react";
import {
  StyleSheet,
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
    contentType: PropTypes.oneOf(["snapshot", "image", "rawImage"]),
    autoHide: PropTypes.bool,
    value: PropTypes.any
    /*blurFilter: PropTypes.oneOf(["gaussian", "motion", "zoom"]),
    blurRadius: PropTypes.number,
    blurAngle: PropTypes.number*/
  };

  static defaultProps = {
    contentType: "snapshot",
    blurFilter: "gaussian",
    autoHide: true
  };

  static isAvailable = NativeModules.RNVisualClone ? true : false;

  _ref = undefined;

  constructor(props) {
    super(props);
    if (!VisualClone.isAvailable) {
      throw new Error(
        "RNVisualClone is not available, did you forget to use `react-native link react-native-visual-clone`?"
      );
    }
  }

  render() {
    /*const { style, resizeMode, ...otherProps } = this.props;
    // console.log("VisualClone.render, source:", nodeHandle);
    const flattenedStyle = style ? StyleSheet.flatten([style]) : {};
    const resolvedResizeMode =
      resizeMode || flattenedStyle.resizeMode || "cover";*/
    return (
      <RNVisualClone
        ref={this._setRef}
        // style={flattenedStyle}
        // resizeMode={resolvedResizeMode}
        {...this.props}
      />
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };

  refresh() {
    return NativeModules.RNVisualClone.refresh({}, findNodeHandle(this._ref));
  }

  /*async _init() {
    if (!this._ref) return;
    const { options, component, contentType, onLayout, onShow } = this.props;
    const { mmContext, imageSizeHint, source } = component.props;
    const { isImage } = component;

    // Initialize native clone
    const { scene, parent } = mmContext;
    const sourceHandle = findNodeHandle(component.ref);
    const parentHandle = findNodeHandle(scene ? scene.ref : parent.ref);
    const layoutPromise = NativeModules.VisualCloneManager.init(
      {
        id: options & CloneOption.SCENE ? component.id : component.props.id,
        source: sourceHandle,
        parent: parentHandle,
        options,
        contentType
      },
      findNodeHandle(this._ref)
    );

    // On Android the image-size cannot be obtained
    // in the native code, so we therefore do it
    // ourselves here after the `init` has been fired
    // of the native side.
    let imageSizePromise = Promise.resolve(undefined);
    if (isImage && source && Platform.OS === "android") {
      if (typeof source === "number") {
        imageSizePromise = Promise.resolve(Image.resolveAssetSource(source));
      } else if (imageSizeHint) {
        imageSizePromise = Promise.resolve(imageSizeHint);
      } else if (source.uri && !onShow) {
        imageSizePromise = new Promise((resolve, reject) => {
          Image.getSize(
            source.uri,
            (width, height) => resolve({ width, height }),
            reject
          );
        });
      }
    }

    // Wait for the results
    const layout = await layoutPromise;
    const imageSize = await imageSizePromise;

    // Update layout with retrieved image size
    if (imageSize) {
      layout.imageWidth = imageSize.width;
      layout.imageHeight = imageSize.height;
    }

    // Set default scale
    layout.scaleX = 1;
    layout.scaleY = 1;

    // Call callbacks
    if (onLayout) onLayout(layout);
    if (onShow) onShow(layout);
  }*/
}

const RNVisualClone = (function() {
  try {
    const RNVisualClone = VisualClone.isAvailable
      ? requireNativeComponent("RNVisualClone", VisualClone)
      : undefined;
    /*const AnimatedRNVisualClone = RNVisualClone
      ? Animated.createAnimatedComponent(RNVisualClone)
      : undefined;
    return AnimatedRNVisualClone;*/
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
