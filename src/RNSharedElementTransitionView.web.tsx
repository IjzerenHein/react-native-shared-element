import * as React from "react";
import { View, findNodeHandle } from "react-native";

import {
  RNSharedElementTransition,
  RNSharedElementNodeConfig,
  RNSharedElementAnimation,
  RNSharedElementResize,
  RNSharedElementAlign,
} from "./web/index.web";

type PropsType = {
  startNode: {
    node: RNSharedElementNodeConfig | null;
    ancestor: RNSharedElementNodeConfig | null;
  };
  endNode: {
    node: RNSharedElementNodeConfig | null;
    ancestor: RNSharedElementNodeConfig | null;
  };
  nodePosition: number | any;
  animation: RNSharedElementAnimation;
  resize: RNSharedElementResize;
  align: RNSharedElementAlign;
  //onMeasure?: (event: SharedElementOnMeasureEvent) => void;
};
type StateType = {
  transition: RNSharedElementTransition;
};

export class RNSharedElementTransitionView extends React.Component<
  PropsType,
  StateType
> {
  state = {
    transition: new RNSharedElementTransition(),
  };

  static getDerivedStateFromProps(props: PropsType, state: StateType) {
    const { startNode, endNode, animation, resize, align, nodePosition } =
      props;
    const { transition } = state;
    transition.setNode(false, startNode.node, startNode.ancestor);
    transition.setNode(true, endNode.node, endNode.ancestor);
    transition.nodePosition = nodePosition;
    transition.animation = animation;
    transition.resize = resize;
    transition.align = align;
    transition.didSetProps();
    return null;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.state.transition.destroy();
  }

  private onSetRef = (ref: any) => {
    if (!ref) return;
    const element: any = ref ? findNodeHandle(ref) : null;
    const { transition } = this.state;
    transition.element = element;
  };

  render() {
    // console.log("RNSharedElementTransitionView.render");
    return <View ref={this.onSetRef} />;
  }
}
