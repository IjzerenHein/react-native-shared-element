import React, { Component } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";

export class VisualSource extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.any,
    autoHide: PropTypes.bool
  };

  static isAvailable = NativeModules.RNVisualSource ? true : false;

  constructor(props) {
    super(props);
    if (!VisualSource.isAvailable) {
      throw new Error(
        "RNVisualSource is not available, did you forget to use `react-native link react-native-visual-clone`?"
      );
    }
  }

  render() {
    const { children, ...otherProps } = this.props;
    const child = React.Children.only(children);
    console.log("VisualSource.render");
    return (
      <RNVisualSource ref={this.onSetRef} {...otherProps}>
        {child}
      </RNVisualSource>
    );
  }

  onSetRef = ref => {
    this._ref = ref;
    this._nodeHandle = ref ? findNodeHandle(ref) : undefined;
    console.log("VisualSource.onSetRef: ", ref, this._nodeHandle);
  };

  get nodeHandle() {
    return this._nodeHandle;
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

const RNVisualSource = (function() {
  try {
    const RNVisualSource = VisualSource.isAvailable
      ? requireNativeComponent("RNVisualSource", VisualSource)
      : undefined;
    const AnimatedRNVisualSource = RNVisualSource
      ? Animated.createAnimatedComponent(RNVisualSource)
      : undefined;
    return AnimatedRNVisualSource;
  } catch (err) {
    VisualSource.isAvailable = false;
    // eslint-disable-next-line
    console.error(
      `${
        err.message
      } (are you importing two different versions of react-native-visual-clone?)`
    );
  }
})();
