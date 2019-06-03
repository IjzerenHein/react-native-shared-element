import React, { Component } from "react";
import { Animated, requireNativeComponent, NativeModules } from "react-native";
import PropTypes from "prop-types";

export class VisualClone extends Component {
  static propTypes = {
    style: PropTypes.any,
    source: PropTypes.any,
    contentType: PropTypes.oneOf(["snapshot", "image", "rawImage"]),
    blurRadius: PropTypes.number
  };

  static defaultProps = {
    contentType: "snapshot"
  };

  static isAvailable = NativeModules.RNVisualSource ? true : false;

  static parseContentType(contentType) {
    switch (contentType) {
      case "snapshot":
        return 0;
      case "image":
        return 1;
      case "rawImage":
        return 2;
      default:
        throw new Error(
          `Invalid VisualClone content-type specified: ${contentType}`
        );
    }
  }

  constructor(props) {
    super(props);
    if (!VisualClone.isAvailable) {
      throw new Error(
        "RNVisualClone is not available, did you forget to use `react-native link react-native-visual-clone`?"
      );
    }
  }

  render() {
    const { source, contentType, ...otherProps } = this.props;
    // console.log("VisualClone.render, source:", nodeHandle);
    return (
      <RNVisualClone
        source={source ? source.nodeHandle : undefined}
        contentType={VisualClone.parseContentType(contentType)}
        {...otherProps}
      />
    );
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
    const AnimatedRNVisualClone = RNVisualClone
      ? Animated.createAnimatedComponent(RNVisualClone)
      : undefined;
    return AnimatedRNVisualClone;
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
