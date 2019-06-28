// @flow
import * as React from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
} from "react-native";
import type { SharedElementNode } from "./SharedElement";

export type SharedElementAnimation = "move" | "dissolve";

export type SharedElementNodeType =
  | "startNode"
  | "endNode"
  | "startAncestor"
  | "endAncestor";

export type SharedElementMeasureData = {
  node: SharedElementNodeType,
  layout: {
    x: number,
    y: number,
    width: number,
    height: number,
    visibleX: number,
    visibleY: number,
    visibleWidth: number,
    visibleHeight: number,
    contentX: number,
    contentY: number,
    contentWidth: number,
    contentHeight: number
  },
  contentType: "none" | "snapshotView" | "snapshotImage" | "image",
  style: {
    borderRadius: number
  }
};

export type SharedElementOnMeasureEvent = {
  nativeEvent: SharedElementMeasureData
};

export type SharedElementTransitionProps = {
  start: {
    node: ?SharedElementNode,
    ancestor?: ?SharedElementNode
  },
  end: {
    node: ?SharedElementNode,
    ancestor?: ?SharedElementNode
  },
  position: number | Animated.Node | void,
  animation?: SharedElementAnimation,
  autoHide?: boolean,
  debug?: boolean,
  style?: any,
  onMeasure?: (event: SharedElementOnMeasureEvent) => void,
  SharedElementComponent: any
};

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

const debugColors = {
  startNode: "#82B2E8",
  endNode: "#5EFF9B",
  pink: "#DC9CFF",
  startAncestor: "#E88F82",
  endAncestor: "#FFDC8F"
};

const debugStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.3
  },
  text: {
    marginLeft: 3,
    marginTop: 3,
    fontSize: 10
  },
  box: {
    borderWidth: 1,
    borderStyle: "dashed"
  }
});

type StateType = {
  startNode?: SharedElementMeasureData,
  endNode?: SharedElementMeasureData,
  startAncestor?: SharedElementMeasureData,
  endAncestor?: SharedElementMeasureData
};

export const RNSharedElementTransition = isAvailable
  ? requireNativeComponent("RNSharedElementTransition")
  : undefined;

export const RNAnimatedSharedElementTransition = RNSharedElementTransition
  ? Animated.createAnimatedComponent(RNSharedElementTransition)
  : undefined;

export class SharedElementTransition extends React.Component<
  SharedElementTransitionProps,
  StateType
> {
  static defaultProps = {
    autoHide: true,
    start: {},
    end: {},
    SharedElementComponent: RNAnimatedSharedElementTransition
  };

  state = {};

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
    if (!props.SharedElementComponent) {
      throw new Error(
        "RNSharedElementTransition is not available, did you forget to use `react-native link react-native-shared-element-transition`?"
      );
    }
  }

  renderDebugOverlay() {
    if (!this.props.debug) return;
    return <View style={debugStyles.overlay} />;
  }

  renderDebugLayer(name: SharedElementNodeType) {
    const event = this.state[name];
    if (!event || !this.props.debug) return undefined;
    const { layout, style } = event;
    const isContentDifferent =
      layout.x !== layout.contentX ||
      layout.y !== layout.contentY ||
      layout.width !== layout.contentWidth ||
      layout.height !== layout.contentHeight;
    const isFullScreen =
      layout.visibleX === 0 &&
      layout.visibleY === 0 &&
      layout.visibleWidth === Dimensions.get("window").width &&
      layout.visibleHeight === Dimensions.get("window").height;

    const color = debugColors[name];
    return (
      <View style={StyleSheet.absoluteFill}>
        {isContentDifferent ? (
          <View
            style={[
              debugStyles.box,
              {
                position: "absolute",
                left: layout.contentX,
                top: layout.contentY,
                width: layout.contentWidth,
                height: layout.contentHeight,
                borderColor: color,
                opacity: 0.5
              }
            ]}
          >
            <Text style={[debugStyles.text, { color }]}>Content</Text>
          </View>
        ) : (
          undefined
        )}
        <View
          style={[
            debugStyles.box,
            {
              position: "absolute",
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
              borderColor: color,
              borderRadius: style.borderRadius || 0
            }
          ]}
        >
          <Text
            style={[
              debugStyles.text,
              { color, marginTop: Math.max(style.borderRadius - 7, 3) }
            ]}
          >
            {name}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            left: layout.visibleX,
            top: layout.visibleY,
            width: layout.visibleWidth,
            height: layout.visibleHeight,
            overflow: "hidden"
          }}
        >
          <View
            style={[
              {
                position: "absolute",
                left: layout.x - layout.visibleX,
                top: layout.y - layout.visibleY,
                width: layout.width,
                height: layout.height,
                borderRadius: style.borderRadius || 0,
                backgroundColor: isFullScreen ? "transparent" : color + "80"
              }
            ]}
          />
        </View>
      </View>
    );
  }

  render() {
    const {
      SharedElementComponent,
      start,
      end,
      position,
      onMeasure,
      debug,
      // style,
      ...otherProps
    } = this.props;
    if (!SharedElementComponent) return null;
    return (
      <View style={StyleSheet.absoluteFill}>
        <SharedElementComponent
          startNode={{
            node: SharedElementTransition.prepareNode(start.node),
            ancestor: SharedElementTransition.prepareNode(start.ancestor)
          }}
          endNode={{
            node: SharedElementTransition.prepareNode(end.node),
            ancestor: SharedElementTransition.prepareNode(end.ancestor)
          }}
          nodePosition={position}
          onMeasureNode={debug ? this.onMeasureNode : onMeasure}
          // style={debug && style ? [debugStyles.content, style] : style}
          {...otherProps}
        />
        {/*this.renderDebugOverlay()*/}
        {this.renderDebugLayer("startNode")}
        {this.renderDebugLayer("endNode")}
      </View>
    );
  }

  onMeasureNode = (event: SharedElementOnMeasureEvent) => {
    const { nativeEvent } = event;
    const { onMeasure } = this.props;
    this.setState({
      [`${nativeEvent.node}`]: nativeEvent
    });
    // console.log("onMeasure: ", nativeEvent);
    if (onMeasure) onMeasure(event);
  };
}
