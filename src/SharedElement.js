// @flow
import * as React from "react";
import { View, findNodeHandle } from "react-native";

export interface SharedElementNode {
  ref: any;
  nodeHandle: number;
  isParent: boolean;
}

export interface SharedElementProps extends View.propTypes.style {
  children: React.Node;
  onNode: (node: ?SharedElementNode) => void;
}

export function nodeFromRef(ref: any, isParent?: boolean): ?SharedElementNode {
  const nodeHandle = ref ? findNodeHandle(ref) : undefined;
  return nodeHandle
    ? {
        ref,
        nodeHandle,
        isParent: isParent || false
      }
    : undefined;
}

export class SharedElement extends React.Component<SharedElementProps> {
  _node = undefined;

  render() {
    const { onNode, ...otherProps } = this.props;
    return <View ref={this.onSetRef} collapsable={false} {...otherProps} />;
  }

  onSetRef = (ref: any) => {
    this._node = nodeFromRef(ref, true);
    if (this.props.onNode) {
      this.props.onNode(this._node);
    }
  };

  componentDidUpdate(prevProps: SharedElementProps) {
    if (!prevProps.onNode && this.props.onNode && this._node) {
      this.props.onNode(this._node);
    }
  }
}
