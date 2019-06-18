// @flow
import * as React from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { SharedElementTransition } from 'react-native-shared-element-transition';
import type { SharedElementSourceRef } from 'react-native-shared-element-transition';
import { ScreenTransitionContext } from './ScreenTransitionContext';
import type { ScreenTransitionContextOnSharedElementsUpdatedEvent } from './ScreenTransitionContext';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  node: {
    ...StyleSheet.absoluteFillObject,
  },
});

interface RouterProps {
  initialNode: React.Node;
}

interface RouterState {
  stack: React.Node[];
  prevIndex: number;
  nextIndex: number;
  animValue: Animated.Value;
  sharedElementSources: Array<{
    [string]: SharedElementSourceRef,
  }>;
}

let router;

export class Router extends React.Component<{}, RouterState> {
  constructor(props: RouterProps) {
    super(props);
    router = this;
    this.state = {
      stack: [props.initialNode],
      prevIndex: 0,
      nextIndex: 0,
      animValue: new Animated.Value(0),
      sharedElementSources: [],
    };
  }

  renderSharedElementTransitions() {
    const { prevIndex, nextIndex, stack, sharedElementSources, animValue } = this.state;
    if (prevIndex === nextIndex && nextIndex === stack.length - 1) {
      // console.log('renderSharedElementTransitions: null');
      return null;
    }
    const startIndex = Math.min(prevIndex, nextIndex);
    const endIndex = stack.length;
    const sources = {};
    for (let index = startIndex; index < endIndex; index++) {
      const sceneSources = sharedElementSources[index];
      for (let sharedId in sceneSources) {
        sources[sharedId] = sources[sharedId] || new Array(endIndex - startIndex);
        sources[sharedId][index - startIndex] = sceneSources[sharedId];
      }
    }
    // console.log('renderSharedElementTransitions: ', sources);
    const value = Animated.subtract(animValue, startIndex);
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Object.keys(sources).map(sharedId => (
          <SharedElementTransition
            key={`sharedElementTransition.${sharedId}`}
            sources={sources[sharedId]}
            value={value}
          />
        ))}
      </View>
    );
  }

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
                opacity: animValue.interpolate({
                  inputRange: [index - 1, index, index + 1, index + 2],
                  outputRange: [1, 1, 0.5, 0.5],
                }),
                transform: [
                  {
                    translateX: animValue.interpolate({
                      inputRange: [index - 2, index - 1, index, index + 1],
                      outputRange: [WIDTH, WIDTH, 0, 0],
                    }),
                  },
                  {
                    scale: animValue.interpolate({
                      inputRange: [index - 1, index, index + 1, index + 2],
                      outputRange: [1, 1, 0.7, 0.7],
                    }),
                  },
                ],
              },
            ]}>
            <ScreenTransitionContext onSharedElementsUpdated={this.onSharedElementsUpdated}>
              {node}
            </ScreenTransitionContext>
          </Animated.View>
        ))}
        {this.renderSharedElementTransitions()}
      </View>
    );
  }

  onSharedElementsUpdated = (event: ScreenTransitionContextOnSharedElementsUpdatedEvent) => {
    const { stack, sharedElementSources } = this.state;
    const index = stack.indexOf(event.children);
    if (index < 0) return;
    const newSharedElementSources = [...sharedElementSources];
    newSharedElementSources[index] = event.sharedElementSources;
    this.setState({
      sharedElementSources: newSharedElementSources,
    });
  };

  push(node: React.Node) {
    const { stack, animValue, nextIndex, sharedElementSources } = this.state;
    this.setState({
      stack: [...stack, node],
      sharedElementSources: [...sharedElementSources, {}],
      nextIndex: nextIndex + 1,
    });
    Animated.timing(animValue, {
      toValue: stack.length,
      duration: 400,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.pruneStack(stack.length + 1);
      }
    });
  }

  pop() {
    const { stack, animValue, nextIndex } = this.state;
    if (stack.length <= 1) return;
    this.setState({
      nextIndex: nextIndex - 1,
    });
    Animated.timing(animValue, {
      toValue: stack.length - 2,
      duration: 400,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.pruneStack(stack.length - 1);
      }
    });
  }

  pruneStack(count: number) {
    const { stack, nextIndex, prevIndex, sharedElementSources } = this.state;
    if (stack.length > count) {
      this.setState({
        stack: stack.slice(0, count),
        sharedElementSources: sharedElementSources.slice(0, count),
        prevIndex: nextIndex,
      });
    } else if (nextIndex !== prevIndex) {
      this.setState({
        prevIndex: nextIndex,
      });
    }
  }

  static push(node: React.Node) {
    return router.push(node);
  }

  static pop() {
    return router.pop();
  }
}
