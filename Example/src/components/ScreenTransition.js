// @flow
import * as React from 'react';
import { SharedElementSource } from 'react-native-shared-element-transition';
import type { SharedElementSourceRef } from 'react-native-shared-element-transition';
import { ScreenTransitionContext, withScreenTransitionContext } from './ScreenTransitionContext';

export interface ScreenTransitionProps {
  sharedId?: string;
  children?: React.Node;
  screenTransitionContext: ScreenTransitionContext;
}

export const ScreenTransition = withScreenTransitionContext(
  class ScreenTransition extends React.Component<ScreenTransitionProps> {
    _source: ?SharedElementSourceRef;
    _sharedId = '';

    constructor(props: ScreenTransitionProps) {
      super(props);
      this._sharedId = props.sharedId;
    }

    render() {
      const {
        sharedId, //eslint-disable-line
        screenTransitionContext, // eslint-disable-line
        ...otherProps
      } = this.props;
      return <SharedElementSource {...otherProps} onSource={this.onSetSource} />;
    }

    componentDidUpdate() {
      const { sharedId, screenTransitionContext } = this.props;
      if (this._sharedId !== sharedId) {
        if (this._sharedId && this._source) {
          screenTransitionContext.removeSharedElement(this._sharedId, this._source);
        }
        this._sharedId = sharedId;
        if (this._sharedId && this._source) {
          screenTransitionContext.addSharedElement(this._sharedId, this._source);
        }
      }
    }

    onSetSource = (source: ?SharedElementSourceRef) => {
      if (this._source === source) return;
      if (this._source && this._sharedId) {
        this.props.screenTransitionContext.removeSharedElement(this._sharedId, this._source);
      }
      this._source = source;
      if (this._source && this._sharedId) {
        this.props.screenTransitionContext.addSharedElement(this._sharedId, this._source);
      }
      this._source = source;
    };
  }
);
