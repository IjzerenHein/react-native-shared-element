// @flow
import * as React from "react";
import { View, findNodeHandle } from "react-native";
import PropTypes from "prop-types";

export interface SharedElementSourceRef {
  ref: any;
  nodeHandle: number;
  isParent: boolean;
}

export interface SharedElementSourceProps extends View.propTypes.style {
  children: React.Node;
  onSource: (source: ?SharedElementSourceRef) => void;
}

export function sourceFromRef(
  ref: any,
  isParent?: boolean
): ?SharedElementSourceRef {
  const nodeHandle = ref ? findNodeHandle(ref) : undefined;
  return nodeHandle
    ? {
        ref,
        nodeHandle,
        isParent: isParent || false
      }
    : undefined;
}

export class SharedElementSource extends React.Component<SharedElementSourceProps> {
  static propTypes = {
    onSource: PropTypes.func
  };

  _source = undefined;

  render() {
    const { onSource, ...otherProps } = this.props;
    return <View ref={this.onSetRef} collapsable={false} {...otherProps} />;
  }

  onSetRef = (ref: any) => {
    this._source = sourceFromRef(ref, true);
    if (this.props.onSource) {
      this.props.onSource(this._source);
    }
  };

  componentDidUpdate(prevProps: SharedElementSourceProps) {
    if (!prevProps.onSource && this.props.onSource && this._source) {
      this.props.onSource(this._source);
    }
  }
}
