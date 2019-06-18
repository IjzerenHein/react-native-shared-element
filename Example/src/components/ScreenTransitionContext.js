// @flow
import React, { createContext } from "react";
import type { SharedElementNode } from "react-native-shared-element-transition";

export interface ScreenTransitionContextOnSharedElementsUpdatedEvent {
  children: any;
  sharedElementNodes: {
    [string]: SharedElementNode
  };
}

// $FlowFixMe
const Context = createContext<ScreenTransitionContext>(undefined);

export interface ScreenTransitionContextProps {
  children?: any;
  onSharedElementsUpdated: (
    event: ScreenTransitionContextOnSharedElementsUpdatedEvent
  ) => void;
}

type ScreenTransitionContextState = {
  sharedElementNodes: {
    [string]: SharedElementNode
  }
};

export class ScreenTransitionContext extends React.Component<
  ScreenTransitionContextProps,
  ScreenTransitionContextState
> {
  _sharedElementNodes = {};
  state = {
    sharedElementNodes: this._sharedElementNodes
  };

  render() {
    return <Context.Provider value={this} {...this.props} />;
  }

  componentDidUpdate(
    prevProps: ScreenTransitionContextProps,
    prevState: ScreenTransitionContextState
  ) {
    if (prevState === this.state) return;
    const { children, onSharedElementsUpdated } = this.props;
    const { sharedElementNodes } = this.state;
    if (onSharedElementsUpdated) {
      onSharedElementsUpdated({
        children,
        sharedElementNodes
      });
    }
  }

  addSharedElement(sharedId: string, node: SharedElementNode) {
    // console.log('ScreenTransitionContext.add: ', sharedId);
    const sharedElementNodes = { ...this._sharedElementNodes };
    sharedElementNodes[sharedId] = node;
    this._sharedElementNodes = sharedElementNodes;
    this.setState({
      sharedElementNodes
    });
  }

  removeSharedElement(sharedId: string, node: SharedElementNode) {
    // console.log('ScreenTransitionContext.remove: ', sharedId);
    const sharedElementNodes = { ...this._sharedElementNodes };
    delete sharedElementNodes[sharedId];
    this._sharedElementNodes = sharedElementNodes;
    this.setState({
      sharedElementNodes
    });
  }
}

export function withScreenTransitionContext(WrappedComponent: any) {
  const comp = (props: any) => {
    return (
      <Context.Consumer>
        {value => (
          <WrappedComponent {...props} screenTransitionContext={value} />
        )}
      </Context.Consumer>
    );
  };
  comp.propTypes = {
    ...(WrappedComponent.propTypes || {})
  };
  delete comp.propTypes.screenTransitionContext;
  comp.defaultProps = WrappedComponent.defaultProps;
  return comp;
}
