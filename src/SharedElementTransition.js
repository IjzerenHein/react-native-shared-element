// @flow
import * as React from "react";
import {
  View,
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import type { SharedElementNode } from "./SharedElement";

export type SharedElementAnimation = "move" | "dissolve";

export interface SharedElementTransitionProps {
  start: {
    node: ?SharedElementNode,
    ancestor?: ?SharedElementNode
  };
  end: {
    node: ?SharedElementNode,
    ancestor?: ?SharedElementNode
  };
  position: number | Animated.Node | void;
  animation?: SharedElementAnimation;
  autoHide?: boolean;
}

export const isAvailable = NativeModules.RNSharedElementTransition
  ? true
  : false;

if (isAvailable) {
  NativeModules.RNSharedElementTransition.configure({
    imageResolvers: [
      "RNPhotoView.MWTapDetectingImageView", // react-native-photo-view
      "RCTView.FFFastImageView" // react-native-fast-image
    ].map(path => path.split("."))
  });
}

const RNSharedElementTransition = isAvailable
  ? requireNativeComponent("RNSharedElementTransition")
  : undefined;

const RNAnimatedSharedElementTransition = RNSharedElementTransition
  ? Animated.createAnimatedComponent(RNSharedElementTransition)
  : undefined;

export class SharedElementTransitionBase extends React.Component<SharedElementTransitionProps> {
  static defaultProps = {
    autoHide: true,
    start: {},
    end: {}
  };

  static prepareNode(node: ?SharedElementNode): any {
    return node
      ? {
          nodeHandle: node.nodeHandle,
          isParent: node.isParent
        }
      : undefined;
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
    const { start, end, position, ...otherProps } = this.props;
    return RNSharedElementTransition ? (
      <RNSharedElementTransition
        startNode={{
          node: SharedElementTransitionBase.prepareNode(start.node),
          ancestor: SharedElementTransitionBase.prepareNode(start.ancestor)
        }}
        endNode={{
          node: SharedElementTransitionBase.prepareNode(end.node),
          ancestor: SharedElementTransitionBase.prepareNode(end.ancestor)
        }}
        nodePosition={position}
        {...otherProps}
      />
    ) : null;
  }
}

export class SharedElementTransition extends React.Component<SharedElementTransitionProps> {
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
    const { start, end, position, ...otherProps } = this.props;
    return RNAnimatedSharedElementTransition ? (
      <RNAnimatedSharedElementTransition
        startNode={{
          node: SharedElementTransitionBase.prepareNode(start.node),
          ancestor: SharedElementTransitionBase.prepareNode(start.ancestor)
        }}
        endNode={{
          node: SharedElementTransitionBase.prepareNode(end.node),
          ancestor: SharedElementTransitionBase.prepareNode(end.ancestor)
        }}
        nodePosition={position}
        {...otherProps}
      />
    ) : null;
  }
}
