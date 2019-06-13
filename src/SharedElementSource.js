// @flow
import React, { Component } from "react";
import { View, findNodeHandle } from "react-native";
import PropTypes from "prop-types";

export interface ISharedElementSource {
  ref: any;
  nodeHandle: number;
  isParent: boolean;
}

export interface SharedElementSourceProps extends View.propTypes.style {
  onSource: (source: ?ISharedElementSource) => void;
}

export function sourceFromRef(
  ref: any,
  isParent?: boolean
): ?ISharedElementSource {
  const nodeHandle = ref ? findNodeHandle(ref) : undefined;
  return nodeHandle
    ? {
        ref,
        nodeHandle,
        isParent: isParent || false
      }
    : undefined;
}

export class SharedElementSource extends Component<SharedElementSourceProps> {
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
