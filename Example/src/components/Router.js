// @flow
import * as React from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { SharedElementTransition } from "react-native-shared-element-transition";
import type { SharedElementNode } from "react-native-shared-element-transition";
import { ScreenTransitionContext } from "./ScreenTransitionContext";
import type { ScreenTransitionContextOnSharedElementsUpdatedEvent } from "./ScreenTransitionContext";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { NavBar } from "./NavBar";

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  node: {
    ...StyleSheet.absoluteFillObject
  },
  swipeBackOverlay: {
    position: "absolute",
    left: 0,
    top: NavBar.HEIGHT,
    bottom: 0,
    width: 30
    // backgroundColor: "green",
    // opacity: 0.2
  }
});

interface RouterProps {
  initialNode: React.Node;
}

type RouterSharedElementConfig =
  //| "auto"
  {
    [key: string]: boolean
  };

interface RouterState {
  stack: React.Node[];
  prevIndex: number;
  nextIndex: number;
  animValue: Animated.Node;
  sharedElementScreens: Array<?ScreenTransitionContextOnSharedElementsUpdatedEvent>;
  sharedElementConfig: Array<?RouterSharedElementConfig>;
}

type RouterConfig = {
  sharedElements?: {
    [sharedId: string]: boolean
  }
};

let router;

export class Router extends React.Component<{}, RouterState> {
  _animValue = new Animated.Value(0);
  _swipeBackAnimValue = new Animated.Value(0);
  _onSwipeBackGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this._swipeBackAnimValue } }],
    { useNativeDriver: true }
  );

  constructor(props: RouterProps) {
    super(props);
    router = this;
    this.state = {
      stack: [props.initialNode],
      prevIndex: 0,
      nextIndex: 0,
      animValue: Animated.subtract(
        this._animValue,
        this._swipeBackAnimValue.interpolate({
          inputRange: [0, WIDTH],
          outputRange: [0, 1],
          extrapolate: "clamp"
        })
      ),
      sharedElementScreens: [],
      sharedElementConfig: [undefined]
    };
  }

  renderSharedElementTransitions() {
    const {
      prevIndex,
      nextIndex,
      stack,
      sharedElementScreens,
      sharedElementConfig,
      animValue
    } = this.state;
    //if (!sharedElementConfig) return;
    if (prevIndex === nextIndex && nextIndex === stack.length - 1) {
      // console.log('renderSharedElementTransitions: null');
      return null;
    }
    const startIndex = Math.min(prevIndex, nextIndex);
    const endIndex = startIndex + 1;
    const isPush = nextIndex > prevIndex;
    const config = sharedElementConfig[endIndex];
    if (!config) return;
    const nodes = {};
    const startScreen = sharedElementScreens[startIndex];
    const endScreen = sharedElementScreens[endIndex];
    for (let sharedId in config) {
      nodes[sharedId] = {
        start: {
          node: startScreen ? startScreen.nodes[sharedId] : undefined,
          ancestor: startScreen ? startScreen.ancestor : undefined
        },
        end: {
          node: endScreen ? endScreen.nodes[sharedId] : undefined,
          ancestor: endScreen ? endScreen.ancestor : undefined
        }
      };
    }
    // console.log('renderSharedElementTransitions: ', nodes);
    const value = Animated.subtract(animValue, startIndex);
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Object.keys(nodes).map(sharedId => (
          // $FlowFixMe
          <SharedElementTransition
            key={`SharedElementTransition.${sharedId}`}
            start={nodes[sharedId].start}
            end={nodes[sharedId].end}
            value={value}
          />
        ))}
      </View>
    );
  }

  renderBackSwiper() {
    const { nextIndex, prevIndex, stack } = this.state;
    if (!nextIndex && !prevIndex && stack.length <= 1) return;
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
          nextIndex: Math.max(this.state.nextIndex - 1, 0)
        });
        break;
      case State.CANCELLED:
        // console.log("SWIPE CANCEL: ", nativeEvent);
        this.setState({
          nextIndex: this.state.prevIndex
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
            useNativeDriver: true
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
            useNativeDriver: true
          }).start(({ finished }) => {
            if (finished) {
              this.setState({
                nextIndex: this.state.prevIndex
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
    return (
      <View style={styles.container}>
        {stack.map((node: React.Node, index: number) => (
          <Animated.View
            key={`screen${index}`}
            style={[
              styles.node,
              {
                // $FlowFixMe
                opacity: animValue.interpolate({
                  inputRange: [index - 1, index, index + 1, index + 2],
                  outputRange: [1, 1, 0.5, 0.5]
                }),
                transform: [
                  {
                    // $FlowFixMe
                    translateX: animValue.interpolate({
                      inputRange: [index - 2, index - 1, index, index + 1],
                      outputRange: [WIDTH, WIDTH, 0, 0]
                    })
                  },
                  {
                    // $FlowFixMe
                    scale: animValue.interpolate({
                      inputRange: [index - 1, index, index + 1, index + 2],
                      outputRange: [1, 1, 0.7, 0.7]
                    })
                  }
                ]
              }
            ]}
          >
            <ScreenTransitionContext
              style={styles.node}
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
    if (index < 0) return;
    const newSharedElementScreens = [...sharedElementScreens];
    newSharedElementScreens[index] = event;
    this.setState({
      sharedElementScreens: newSharedElementScreens
    });
  };

  push(node: React.Node, config?: RouterConfig) {
    const {
      stack,
      nextIndex,
      sharedElementScreens,
      sharedElementConfig
    } = this.state;
    this.setState({
      stack: [...stack, node],
      nextIndex: nextIndex + 1,
      sharedElementScreens: [...sharedElementScreens, undefined],
      sharedElementConfig: [
        ...sharedElementConfig,
        config && config.sharedElements
      ]
    });
    /*Animated.timing(this._animValue, {
      toValue: stack.length,
      duration: 400,
      useNativeDriver: true*/
    Animated.spring(this._animValue, {
      toValue: stack.length,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) {
        this.pruneStack(stack.length + 1);
      }
    });
  }

  pop(config?: RouterConfig) {
    const { stack, nextIndex } = this.state;
    if (stack.length <= 1) return;
    this.setState({
      nextIndex: nextIndex - 1
      // TODO UPDATE SHAREDELEMENTCONFIG
    });
    Animated.timing(this._animValue, {
      toValue: stack.length - 2,
      duration: 300,
      useNativeDriver: true
      /*Animated.spring(this._animValue, {
      toValue: stack.length - 2,
      useNativeDriver: true*/
    }).start(({ finished }) => {
      if (finished) {
        this.pruneStack(stack.length - 1);
      }
    });
  }

  pruneStack(count: number) {
    const {
      stack,
      nextIndex,
      prevIndex,
      sharedElementScreens,
      sharedElementConfig
    } = this.state;
    if (stack.length > count) {
      this.setState({
        stack: stack.slice(0, count),
        sharedElementScreens: sharedElementScreens.slice(0, count),
        sharedElementConfig: sharedElementConfig.slice(0, count),
        prevIndex: nextIndex
      });
    } else if (nextIndex !== prevIndex) {
      this.setState({
        prevIndex: nextIndex
      });
    }
  }

  static push(node: React.Node, config?: RouterConfig) {
    return router.push(node, config);
  }

  static pop(config?: RouterConfig) {
    return router.pop(config);
  }
}
