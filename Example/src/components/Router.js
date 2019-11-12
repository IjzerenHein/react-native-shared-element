// @flow
import * as React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  BackHandler,
  Dimensions,
} from 'react-native';
import {SharedElementTransition} from 'react-native-shared-element';
import {ScreenTransitionContext} from './RouterScreenTransitionContext';
import type {ScreenTransitionContextOnSharedElementsUpdatedEvent} from './RouterScreenTransitionContext';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {NavBarHeight} from './navBar/constants';
import {fromRight} from '../transitions';
import * as Screens from 'react-native-screens';
import type {SharedElementsConfig, SharedElementsStrictConfig} from '../types';
import {normalizeSharedElementsConfig} from '../types/SharedElement';

Screens.useScreens();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  node: {
    ...StyleSheet.absoluteFillObject,
    //backfaceVisibility: "hidden"
  },
  swipeBackOverlay: {
    position: 'absolute',
    left: 0,
    top: NavBarHeight,
    bottom: 0,
    width: 30,
    // backgroundColor: "green",
    // opacity: 0.2
  },
  sharedElements: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});

type RouterTransitionConfig = {
  screenInterpolator: any,
  transitionSpec: any,
  debug?: boolean,
};

interface RouterProps {
  initialNode: React.Node;
  transitionConfig: any;
}

type RouterAction = {
  action: 'push' | 'pop',
  config?: RouterConfig,
  node?: React.Node,
};

interface RouterState {
  stack: React.Node[];
  prevIndex: number;
  nextIndex: number;
  animValue: Animated.Node;
  transitionConfig: ?RouterTransitionConfig;
  sharedElementsConfig: ?SharedElementsStrictConfig;
  sharedElementScreens: Array<?ScreenTransitionContextOnSharedElementsUpdatedEvent>;
  actionsQueue: RouterAction[];
  width: number;
  height: number;
}

type RouterConfig = {
  sharedElements?: SharedElementsConfig,
  transitionConfig?: RouterTransitionConfig,
};

let router;

let AnimatedScreen: any;

const MaybeScreenContainer = (props: any) => {
  if (Screens.screensEnabled()) {
    return <Screens.ScreenContainer {...props} />;
  }
  return <View {...props} />;
};

const AnimatedRouterScreen = (props: any) => {
  const {active, ...otherProps} = props;
  if (Screens.screensEnabled()) {
    AnimatedScreen =
      AnimatedScreen || Animated.createAnimatedComponent(Screens.NativeScreen);

    return <AnimatedScreen active={active} {...otherProps} />;
  }

  return <Animated.View {...otherProps} />;
};

export class Router extends React.Component<RouterProps, RouterState> {
  _animValue = new Animated.Value(0);
  _swipeBackAnimValue = new Animated.Value(0);
  _onSwipeBackGestureEvent = Animated.event(
    [{nativeEvent: {translationX: this._swipeBackAnimValue}}],
    {useNativeDriver: true}
  );
  _backHandler: any;

  static defaultProps = {
    transitionConfig: fromRight(),
  };

  constructor(props: RouterProps) {
    super(props);
    router = this; //eslint-disable-line consistent-this
    this.state = {
      stack: [props.initialNode],
      actionsQueue: [],
      prevIndex: 0,
      nextIndex: 0,
      animValue: Animated.subtract(
        this._animValue,
        this._swipeBackAnimValue.interpolate({
          inputRange: [0, Dimensions.get('window').width],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      ),
      sharedElementScreens: [],
      sharedElementsConfig: undefined,
      transitionConfig: undefined,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  componentDidMount() {
    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onHardwareBackPress
    );
  }

  componentWillUnmount() {
    this._backHandler.remove();
  }

  renderSharedElementTransitions() {
    const {
      prevIndex,
      nextIndex,
      stack,
      sharedElementScreens,
      sharedElementsConfig,
      transitionConfig,
      animValue,
    } = this.state;
    //if (!sharedElementConfig) return;
    if (prevIndex === nextIndex && nextIndex === stack.length - 1) {
      // console.log('renderSharedElementTransitions: null');
      return null;
    }
    const startIndex = Math.min(prevIndex, nextIndex);
    const endIndex = startIndex + 1;
    if (!sharedElementsConfig || !transitionConfig) {
      return;
    }
    const {debug} = transitionConfig;
    const startScreen = sharedElementScreens[startIndex];
    const endScreen = sharedElementScreens[endIndex];
    const nodes = sharedElementsConfig.map(sharedElementConfig => {
      const {id, otherId, ...other} = sharedElementConfig;
      const node: any = {
        id,
        start: {
          node: startScreen ? startScreen.nodes[id] : undefined,
          ancestor: startScreen ? startScreen.ancestor : undefined,
        },
        end: {
          node: endScreen ? endScreen.nodes[id] : undefined,
          ancestor: endScreen ? endScreen.ancestor : undefined,
        },
        ...other,
        debug: sharedElementConfig.debug || debug,
      };
      return node;
    });
    // console.log('renderSharedElementTransitions: ', nodes);
    const position = Animated.subtract(animValue, startIndex);
    return (
      <View style={styles.sharedElements} pointerEvents="none">
        {nodes.map(({id, ...other}) => (
          <SharedElementTransition
            key={`SharedElementTransition.${id}`}
            {...other}
            position={position}
          />
        ))}
      </View>
    );
  }

  renderBackSwiper() {
    const {nextIndex, prevIndex, stack} = this.state;
    if (!nextIndex && !prevIndex && stack.length <= 1) {
      return;
    }
    return (
      <PanGestureHandler
        minDist={5}
        onGestureEvent={this._onSwipeBackGestureEvent}
        onHandlerStateChange={this._onSwipeBackStateChange}>
        <Animated.View style={styles.swipeBackOverlay} collapsable={false} />
      </PanGestureHandler>
    );
  }

  _onSwipeBackStateChange = (event: any) => {
    const {width} = this.state;
    const {nativeEvent} = event;
    switch (nativeEvent.state) {
      case State.ACTIVE:
        // console.log("SWIPE ACTIVE: ", nativeEvent);
        this.setState({
          nextIndex: Math.max(this.state.nextIndex - 1, 0),
        });
        break;
      case State.CANCELLED:
        // console.log("SWIPE CANCEL: ", nativeEvent);
        this.setState({
          nextIndex: this.state.prevIndex,
        });
        break;
      case State.END:
        // console.log("SWIPE END: ", nativeEvent);
        if (
          nativeEvent.velocityX >= 1000 ||
          (nativeEvent.velocityX > -1000 &&
            nativeEvent.translationX >= width / 2)
        ) {
          Animated.timing(this._swipeBackAnimValue, {
            toValue: width,
            duration: 100,
            useNativeDriver: true,
          }).start(({finished}) => {
            if (finished) {
              this.pruneStack(this.state.nextIndex + 1);
              this._swipeBackAnimValue.setValue(0);
              this._animValue.setValue(this.state.nextIndex);
            }
          });
        } else {
          Animated.timing(this._swipeBackAnimValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start(({finished}) => {
            if (finished) {
              this.setState({
                nextIndex: this.state.prevIndex,
              });
            }
          });
        }
        break;
      case State.BEGAN:
        // console.log("SWIPE BEGAN: ", nativeEvent);
        break;
      default:
        // console.log("SWIPE UNKNOWN STATE: ", nativeEvent);
        break;
    }
  };

  render() {
    const {stack, animValue, nextIndex, prevIndex, width, height} = this.state;
    const transitionConfig =
      this.state.transitionConfig || this.props.transitionConfig;
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <MaybeScreenContainer style={StyleSheet.absoluteFill}>
          {stack.map((node: React.Node, index: number) => {
            const isScreenActive =
              index === nextIndex || index === prevIndex ? 1 : 0;
            return (
              <AnimatedRouterScreen
                key={`screen${index}`}
                active={isScreenActive}
                pointerEvents={index === nextIndex ? 'auto' : 'none'}
                style={[
                  styles.node,
                  transitionConfig.screenInterpolator({
                    layout: {
                      initHeight: height,
                      initWidth: width,
                      //width:
                      //height:
                      //isMeasured
                    },
                    position: animValue,
                    // progress,
                    index,
                    scene: {
                      index,
                      //isActive
                      //isStale
                      //key,
                      //route
                      //descriptor
                    },
                  }),
                ]}>
                <ScreenTransitionContext
                  style={StyleSheet.absoluteFill}
                  onSharedElementsUpdated={this.onSharedElementsUpdated}>
                  {node}
                </ScreenTransitionContext>
              </AnimatedRouterScreen>
            );
          })}
        </MaybeScreenContainer>
        {this.renderSharedElementTransitions()}
        {this.renderBackSwiper()}
      </View>
    );
  }

  onLayout = (event: any) => {
    const {width, height} = event.nativeEvent.layout;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height,
        animValue: Animated.subtract(
          this._animValue,
          this._swipeBackAnimValue.interpolate({
            inputRange: [0, width],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        ),
      });
    }
  };

  onSharedElementsUpdated = (
    event: ScreenTransitionContextOnSharedElementsUpdatedEvent
  ) => {
    const {stack, sharedElementScreens} = this.state;
    const index = stack.indexOf(event.children);
    if (index < 0) {
      return;
    }
    const newSharedElementScreens = [...sharedElementScreens];
    newSharedElementScreens[index] = event;
    this.setState({
      sharedElementScreens: newSharedElementScreens,
    });
  };

  onHardwareBackPress = () => {
    if (this.state.stack.length > 1) {
      this.pop();
      return true;
    }
    return false;
  };

  push(node: React.Node, config?: RouterConfig) {
    const {nextIndex, prevIndex} = this.state;
    const action = {
      action: 'push',
      node,
      config,
    };
    if (nextIndex !== prevIndex) {
      this.setState({
        actionsQueue: [...this.state.actionsQueue, action],
      });
    } else {
      this.handleAction(action);
    }
  }

  pop(config?: RouterConfig) {
    const {nextIndex, prevIndex} = this.state;
    const action: RouterAction = {
      action: 'pop',
      config,
    };
    if (nextIndex !== prevIndex) {
      this.setState({
        actionsQueue: [...this.state.actionsQueue, action],
      });
    } else {
      this.handleAction(action);
    }
  }

  handleAction({action, config, node}: RouterAction) {
    const {stack, nextIndex, sharedElementScreens} = this.state;
    const transitionConfig =
      config && config.transitionConfig
        ? config.transitionConfig
        : this.props.transitionConfig;

    const sharedElementsConfig = normalizeSharedElementsConfig(
      config ? config.sharedElements : undefined
    );
    if (action === 'push') {
      this.setState({
        // $FlowFixMe
        stack: [...stack, node],
        nextIndex: nextIndex + 1,
        sharedElementScreens: [...sharedElementScreens, undefined],
        sharedElementsConfig,
        transitionConfig,
      });
      const {transitionSpec} = transitionConfig;
      const {timing, ...spec} = transitionSpec;
      const anim = timing.call(Animated, this._animValue, {
        ...spec,
        toValue: stack.length,
      });
      anim.start(({finished}) => {
        if (finished) {
          this.pruneStack(stack.length + 1);
        }
      });
    } else {
      if (stack.length <= 1) {
        return;
      }
      this.setState({
        nextIndex: nextIndex - 1,
        transitionConfig,
        sharedElementsConfig,
      });
      const {transitionSpec} = transitionConfig;
      const {timing, ...spec} = transitionSpec;
      const anim = timing.call(Animated, this._animValue, {
        ...spec,
        toValue: stack.length - 2,
      });
      anim.start(({finished}) => {
        if (finished) {
          this.pruneStack(stack.length - 1);
        }
      });
    }
  }

  pruneStack(count: number) {
    const {stack, nextIndex, prevIndex, sharedElementScreens} = this.state;
    let {actionsQueue} = this.state;
    let onComplete;
    if (actionsQueue.length) {
      const action = actionsQueue[0];
      actionsQueue = actionsQueue.slice(0);
      actionsQueue.splice(0, 1);
      onComplete = () => this.handleAction(action);
    }
    if (stack.length > count) {
      this.setState(
        {
          stack: stack.slice(0, count),
          sharedElementScreens: sharedElementScreens.slice(0, count),
          prevIndex: nextIndex,
          actionsQueue,
        },
        onComplete
      );
    } else if (nextIndex !== prevIndex) {
      this.setState(
        {
          prevIndex: nextIndex,
          actionsQueue,
        },
        onComplete
      );
    }
  }

  static push(node: React.Node, config?: RouterConfig) {
    return router.push(node, config);
  }

  static pop(config?: RouterConfig) {
    return router.pop(config);
  }
}
