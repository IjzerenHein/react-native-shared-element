import * as React from "react";
import { View } from "react-native";
import { nodeFromRef, SharedElementNode } from "react-native-shared-element";

export type ScreenTransitionContextOnSharedElementsUpdatedEvent = {
  children: any;
  nodes: {
    [key: string]: SharedElementNode;
  };
  ancestor?: SharedElementNode;
};

// @ts-ignore Argument of type 'undefined' is not assignable to parameter of type 'ScreenTransitionContext'.
const Context = React.createContext<ScreenTransitionContext>(undefined);

export type ScreenTransitionContextProps = {
  style: any;
  children?: any;
  onSharedElementsUpdated: (
    event: ScreenTransitionContextOnSharedElementsUpdatedEvent
  ) => void;
};

type ScreenTransitionContextState = {
  sharedElementNodes: {
    [key: string]: SharedElementNode;
  };
};

export class ScreenTransitionContext extends React.Component<
  ScreenTransitionContextProps,
  ScreenTransitionContextState
> {
  _sharedElementNodes: {
    [key: string]: SharedElementNode;
  } = {};
  _sharedElementAncestor?: SharedElementNode = undefined;
  state = {
    sharedElementNodes: this._sharedElementNodes,
  };

  render() {
    const { onSharedElementsUpdated, style, ...otherProps } = this.props;
    return (
      <View style={style} collapsable={false} ref={this.onSetRef}>
        <Context.Provider value={this} {...otherProps} />
      </View>
    );
  }

  onSetRef = (ref: any) => {
    this._sharedElementAncestor = nodeFromRef(ref) || undefined;
  };

  componentDidUpdate(
    prevProps: ScreenTransitionContextProps,
    prevState: ScreenTransitionContextState
  ) {
    if (prevState === this.state) {
      return;
    }
    const { children, onSharedElementsUpdated } = this.props;
    const { sharedElementNodes } = this.state;
    if (onSharedElementsUpdated) {
      onSharedElementsUpdated({
        children,
        ancestor: this._sharedElementAncestor,
        nodes: sharedElementNodes,
      });
    }
  }

  addSharedElement(sharedId: string, node: SharedElementNode) {
    // console.log('ScreenTransitionContext.add: ', sharedId);
    const sharedElementNodes = { ...this._sharedElementNodes };
    sharedElementNodes[sharedId] = node;
    this._sharedElementNodes = sharedElementNodes;
    this.setState({
      sharedElementNodes,
    });
  }

  removeSharedElement(sharedId: string, node: SharedElementNode) {
    // console.log('ScreenTransitionContext.remove: ', sharedId);
    const sharedElementNodes = { ...this._sharedElementNodes };
    delete sharedElementNodes[sharedId];
    this._sharedElementNodes = sharedElementNodes;
    this.setState({
      sharedElementNodes,
    });
  }
}

export function withScreenTransitionContext(WrappedComponent: any) {
  const comp = (props: any) => {
    return (
      <Context.Consumer>
        {(value) => (
          <WrappedComponent {...props} screenTransitionContext={value} />
        )}
      </Context.Consumer>
    );
  };
  if (WrappedComponent.propTypes) {
    const propTypes = {
      ...WrappedComponent.propTypes,
    };
    delete propTypes.screenTransitionContext;
    comp.propTypes = propTypes;
  }
  comp.defaultProps = WrappedComponent.defaultProps;
  return comp;
}
