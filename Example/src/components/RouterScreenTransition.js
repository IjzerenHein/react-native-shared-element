// @flow
import * as React from 'react';
import {SharedElement} from 'react-native-shared-element';
import type {SharedElementNode} from 'react-native-shared-element';
import {
  ScreenTransitionContext,
  withScreenTransitionContext,
} from './RouterScreenTransitionContext';

export interface ScreenTransitionProps {
  sharedId?: string;
  children?: React.Node;
  screenTransitionContext: ScreenTransitionContext;
}

export const RouterScreenTransition = withScreenTransitionContext(
  class RouterScreenTransition extends React.Component<ScreenTransitionProps> {
    _node: ?SharedElementNode;
    _sharedId = '';

    constructor(props: ScreenTransitionProps) {
      super(props);
      this._sharedId = props.sharedId;
    }

    componentDidUpdate() {
      const {sharedId, screenTransitionContext} = this.props;
      if (this._sharedId !== sharedId) {
        if (this._sharedId && this._node) {
          screenTransitionContext.removeSharedElement(
            this._sharedId,
            this._node,
          );
        }
        this._sharedId = sharedId;
        if (this._sharedId && this._node) {
          screenTransitionContext.addSharedElement(this._sharedId, this._node);
        }
      }
    }

    onSetNode = (node: ?SharedElementNode) => {
      if (this._node === node) {
        return;
      }
      if (this._node && this._sharedId) {
        this.props.screenTransitionContext.removeSharedElement(
          this._sharedId,
          this._node,
        );
      }
      this._node = node;
      if (this._node && this._sharedId) {
        this.props.screenTransitionContext.addSharedElement(
          this._sharedId,
          this._node,
        );
      }
      this._node = node;
    };

    render() {
      const {sharedId, screenTransitionContext, ...otherProps} = this.props;
      return <SharedElement {...otherProps} onNode={this.onSetNode} />;
    }
  },
);

export const ScreenTransition = RouterScreenTransition;
