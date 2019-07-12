// @flow
import * as React from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { SharedElementTransition } from 'react-native-shared-element-transition';
import { ScreenTransitionContext } from './ScreenTransitionContext';
import type { ScreenTransitionContextOnSharedElementsUpdatedEvent } from './ScreenTransitionContext';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { NavBar } from './NavBar';
import { fromRight } from '../transitions';
import type { TransitionConfig } from 'react-navigation';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  node: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  swipeBackOverlay: {
    position: 'absolute',
    left: 0,
    top: NavBar.HEIGHT,
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
  ...TransitionConfig,
  debug?: boolean
};

interface RouterProps {
  initialNode: React.Node;
  transitionConfig: TransitionConfig
}

type RouterSharedElementConfig =
  //| "auto"
  {
    [key: string]: boolean
  };

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
  sharedElementConfig: ?RouterSharedElementConfig;
  sharedElementScreens: Array<?ScreenTransitionContextOnSharedElementsUpdatedEvent>;
  actionsQueue: Array<RouterAction>
}

type RouterConfig = {
  sharedElements?: RouterSharedElementConfig,
  transitionConfig?: RouterTransitionConfig
};

let router;

export class Router extends React.Component<RouterProps, RouterState> {
  _animValue = new Animated.Value(0);
  _swipeBackAnimValue = new Animated.Value(0);
  _onSwipeBackGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this._swipeBackAnimValue } }],
    { useNativeDriver: true }
  );

  static defaultProps = {
    transitionConfig: fromRight(),
  }

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
          inputRange: [0, WIDTH],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      ),
      sharedElementScreens: [],
      sharedElementConfig: undefined,
      transitionConfig: undefined,
    };
  }

  renderSharedElementTransitions() {
    const {
      prevIndex,
      nextIndex,
      stack,
      sharedElementScreens,
      sharedElementConfig,
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
    if (!sharedElementConfig || !transitionConfig) {return;}
    const { debug } = transitionConfig;
    const nodes = {};
    const startScreen = sharedElementScreens[startIndex];
    const endScreen = sharedElementScreens[endIndex];
    for (let sharedId in sharedElementConfig) {
      nodes[sharedId] = {
        start: {
          node: startScreen ? startScreen.nodes[sharedId] : undefined,
          ancestor: startScreen ? startScreen.ancestor : undefined,
        },
        end: {
          node: endScreen ? endScreen.nodes[sharedId] : undefined,
          ancestor: endScreen ? endScreen.ancestor : undefined,
        },
        animation:
          (sharedElementConfig[sharedId] === true ? 'move' : sharedElementConfig[sharedId]) || 'move',
      };
    }
    // console.log('renderSharedElementTransitions: ', nodes);
    const position = Animated.subtract(animValue, startIndex);
    return (
      <View style={styles.sharedElements} pointerEvents="none">
        {Object.keys(nodes).map(sharedId => (
          // $FlowFixMe
          <SharedElementTransition
            key={`SharedElementTransition.${sharedId}`}
            start={nodes[sharedId].start}
            end={nodes[sharedId].end}
            animation={nodes[sharedId].animation}
            position={position}
            debug={debug}
          />
        ))}
      </View>
    );
  }

  renderBackSwiper() {
    const { nextIndex, prevIndex, stack } = this.state;
    if (!nextIndex && !prevIndex && stack.length <= 1) {return;}
    return (
      <PanGestureHandler
        minDist={5}
        onGestureEvent={this._onSwipeBackGestureEvent}
        onHandlerStateChange={this._onSwipeBackStateChange}
      >
        <Animated.View style={styles.swipeBackOverlay} collapsable={false} />
      </PanGestureHandler>
    );
  }

  _onSwipeBackStateChange = (event: any) => {
    const { nativeEvent } = event;
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
            nativeEvent.translationX >= WIDTH / 2)
        ) {
          Animated.timing(this._swipeBackAnimValue, {
            toValue: WIDTH,
            duration: 100,
            useNativeDriver: true,
          }).start(({ finished }) => {
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
          }).start(({ finished }) => {
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
    const { stack, animValue } = this.state;
    const transitionConfig = this.state.transitionConfig || this.props.transitionConfig;
    return (
      <View style={styles.container}>
        {stack.map((node: React.Node, index: number) => (
          <Animated.View
            key={`screen${index}`}
            style={[
              styles.node,
              transitionConfig.screenInterpolator({
                layout: {
                  initHeight: HEIGHT,
                  initWidth: WIDTH,
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
            ]}
          >
            <ScreenTransitionContext
              style={StyleSheet.absoluteFill}
              onSharedElementsUpdated={this.onSharedElementsUpdated}
            >
              {node}
            </ScreenTransitionContext>
          </Animated.View>
        ))}
        {this.renderSharedElementTransitions()}
        {this.renderBackSwiper()}
      </View>
    );
  }

  onSharedElementsUpdated = (
    event: ScreenTransitionContextOnSharedElementsUpdatedEvent
  ) => {
    const { stack, sharedElementScreens } = this.state;
    const index = stack.indexOf(event.children);
    if (index < 0) {return;}
    const newSharedElementScreens = [...sharedElementScreens];
    newSharedElementScreens[index] = event;
    this.setState({
      sharedElementScreens: newSharedElementScreens,
    });
  };

  push(node: React.Node, config?: RouterConfig) {
    const { nextIndex, prevIndex } = this.state;
    const action = {
      action: 'push',
      node,
      config,
    };
    if (nextIndex !== prevIndex) {
      this.setState({
        actionsQueue: [...this.state.actionsQueue, action],
      });
    }
    else {
      this.handleAction(action);
    }
  }

  pop(config?: RouterConfig) {
    const { nextIndex, prevIndex } = this.state;
    const action: RouterAction = {
      action: 'pop',
      config,
    };
    if (nextIndex !== prevIndex) {
      this.setState({
        actionsQueue: [...this.state.actionsQueue, action],
      });
    }
    else {
      this.handleAction(action);
    }
  }

  handleAction({action, config, node}: RouterAction) {
    const {
      stack,
      nextIndex,
      sharedElementScreens,
    } = this.state;
    const transitionConfig = (config && config.transitionConfig) ? config.transitionConfig : this.props.transitionConfig;
    const sharedElementConfig = (config && config.sharedElements) ? config.sharedElements : undefined;
    if (action === 'push') {
      this.setState({
        // $FlowFixMe
        stack: [...stack, node],
        nextIndex: nextIndex + 1,
        sharedElementScreens: [...sharedElementScreens, undefined],
        sharedElementConfig,
        transitionConfig,
      });
      const { transitionSpec } = transitionConfig;
      const { timing, ...spec } = transitionSpec;
      const anim = timing.call(Animated, this._animValue, {
        ...spec,
        toValue: stack.length,
      });
      anim.start(({ finished }) => {
        if (finished) {
          this.pruneStack(stack.length + 1);
        }
      });
    }
    else {
      if (stack.length <= 1) {return;}
      this.setState({
        nextIndex: nextIndex - 1,
        transitionConfig,
        sharedElementConfig,
      });
      const { transitionSpec } = transitionConfig;
      const { timing, ...spec } = transitionSpec;
      const anim = timing.call(Animated, this._animValue, {
        ...spec,
        toValue: stack.length - 2,
      });
      anim.start(({ finished }) => {
        if (finished) {
          this.pruneStack(stack.length - 1);
        }
      });
    }
  }

  pruneStack(count: number) {
    const {
      stack,
      nextIndex,
      prevIndex,
      sharedElementScreens,
    } = this.state;
    let { actionsQueue } = this.state;
    let onComplete;
    if (actionsQueue.length) {
      const action = actionsQueue[0];
      actionsQueue = actionsQueue.slice(0);
      actionsQueue.splice(0, 1);
      onComplete = () => this.handleAction(action);
    }
    if (stack.length > count) {
      this.setState({
        stack: stack.slice(0, count),
        sharedElementScreens: sharedElementScreens.slice(0, count),
        prevIndex: nextIndex,
        actionsQueue,
      }, onComplete);
    } else if (nextIndex !== prevIndex) {
      this.setState({
        prevIndex: nextIndex,
        actionsQueue,
      }, onComplete);
    }
  }

  static push(node: React.Node, config?: RouterConfig) {
    return router.push(node, config);
  }

  static pop(config?: RouterConfig) {
    return router.pop(config);
  }
}



