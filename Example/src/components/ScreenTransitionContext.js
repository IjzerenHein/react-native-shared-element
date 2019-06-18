// @flow
import React, { createContext } from 'react';
import type { SharedElementSourceRef } from 'react-native-shared-element-transition';

export interface ScreenTransitionContextOnSharedElementsUpdatedEvent {
  children: any;
  sharedElementSources: {
    [string]: SharedElementSourceRef,
  };
}

const Context = createContext<ScreenTransitionContext>(undefined);

export interface ScreenTransitionContextProps {
  children?: any;
  onSharedElementsUpdated: (event: ScreenTransitionContextOnSharedElementsUpdatedEvent) => void;
}

interface ScreenTransitionContextState {
  sharedElementSources: {
    [string]: SharedElementSourceRef,
  };
}

export class ScreenTransitionContext extends React.Component<
  ScreenTransitionContextProps,
  ScreenTransitionContextState
> {
  _sharedElementSources = {};

  constructor(props: ScreenTransitionContextProps) {
    super(props);
    this.state = this._sharedElementSources;
  }

  render() {
    return <Context.Provider value={this} {...this.props} />;
  }

  componentDidUpdate(
    prevProps: ScreenTransitionContextProps,
    prevState: ScreenTransitionContextState
  ) {
    if (prevState === this.state) return;
    const { children, onSharedElementsUpdated } = this.props;
    const { sharedElementSources } = this.state;
    if (onSharedElementsUpdated) {
      onSharedElementsUpdated({
        children,
        sharedElementSources,
      });
    }
  }

  addSharedElement(sharedId: string, source: SharedElementSourceRef) {
    // console.log('ScreenTransitionContext.add: ', sharedId);
    const sharedElementSources = { ...this._sharedElementSources };
    sharedElementSources[sharedId] = source;
    this._sharedElementSources = sharedElementSources;
    this.setState({
      sharedElementSources,
    });
  }

  removeSharedElement(sharedId: string, source: SharedElementSourceRef) {
    // console.log('ScreenTransitionContext.remove: ', sharedId);
    const sharedElementSources = { ...this._sharedElementSources };
    delete sharedElementSources[sharedId];
    this._sharedElementSources = sharedElementSources;
    this.setState({
      sharedElementSources,
    });
  }
}

export function withScreenTransitionContext(WrappedComponent: any) {
  const comp = (props: any) => {
    return (
      <Context.Consumer>
        {value => <WrappedComponent {...props} screenTransitionContext={value} />}
      </Context.Consumer>
    );
  };
  comp.propTypes = {
    ...(WrappedComponent.propTypes || {}),
  };
  delete comp.propTypes.screenTransitionContext;
  comp.defaultProps = WrappedComponent.defaultProps;
  return comp;
}
