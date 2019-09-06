import * as React from "react";
// import { View } from 'react-native';
import { RNSharedElementTransitionItem } from "./RNSharedElementTransitionItem";
// import { RNSharedElementNode } from "./RNSharedElementNode";
import { RNSharedElementNodeManager } from "./RNSharedElementNodeManager";
import {
  RNSharedElementNodeConfig,
  RNSharedElementAnimation,
  RNSharedElementResize,
  RNSharedElementAlign
} from "./types";

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
  resize?: RNSharedElementResize;
  align?: RNSharedElementAlign;
  //onMeasure?: (event: SharedElementOnMeasureEvent) => void;
};
type StateType = {
  items: RNSharedElementTransitionItem[];
};

export class RNSharedElementTransition extends React.Component<
  PropsType,
  StateType
> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      items: [
        new RNSharedElementTransitionItem(
          RNSharedElementNodeManager.getInstance(),
          "start"
        ),
        new RNSharedElementTransitionItem(
          RNSharedElementNodeManager.getInstance(),
          "end"
        )
      ]
    };
  }

  static getDerivedStateFromProps(props: PropsType, state: StateType) {
    const { startNode, endNode } = props;
    state.items[0].node = startNode.node
      ? RNSharedElementNodeManager.getInstance().acquire(
          startNode.node.nodeHandle,
          startNode.node.isParent,
          startNode.ancestor ? startNode.ancestor.nodeHandle : null
        )
      : null;
    state.items[1].node = endNode.node
      ? RNSharedElementNodeManager.getInstance().acquire(
          endNode.node.nodeHandle,
          endNode.node.isParent,
          endNode.ancestor ? endNode.ancestor.nodeHandle : null
        )
      : null;
    return null;
  }

  componentDidMount() {
    this.requestStylesAndContent();
  }

  componentWillUnmount() {
    this.state.items.forEach(item => (item.node = null));
  }

  render() {
    const { nodePosition } = this.props;
    console.log('RNSharedElementTransition.render: ', nodePosition);
    return null;
  }

  private requestStylesAndContent() {
    const { items } = this.state;
    items.forEach(item => {
      if (item.needsStyle) {
        item.needsStyle = false;
        item.node!.requestStyle().then(style => {
          item.style = style;
          this.forceUpdate();
          this.updateNodeVisibility();
        });
      }
      if (item.needsContent) {
        item.needsContent = false;
        item.node!.requestContent().then(content => {
          item.content = content;
          this.forceUpdate();
          this.updateNodeVisibility();
        });
      }
    });
  }

  private updateNodeVisibility() {
    // TODO
  }
}
