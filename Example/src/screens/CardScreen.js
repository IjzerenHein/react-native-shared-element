// @flow
import * as React from "react";
import { StyleSheet, View, Image, Animated } from "react-native";
import { NavBar, ScreenTransition, Colors, Router, Heading1, Body } from "../components";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.back
  },
  content: {
    padding: 20
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover"
  },
  name: {
    alignSelf: 'flex-start'
  },
  description: {
    marginTop: 4
  }
});

type PropsType = {
  hero: Hero;
}
type StateType = {
}

export class CardScreen extends React.Component<PropsType, StateType> {
  _dismissAnimValue = new Animated.Value(0);
  _onDismissGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this._dismissAnimValue } }],
    { useNativeDriver: true }
  );

  render() {
    const { hero } = this.props;
    const { id, name, photo, description } = hero;
    const dismissAnimValue = this._dismissAnimValue;
    return (
      <View style={styles.flex}>
        <PanGestureHandler
          onGestureEvent={this._onDismissGestureEvent}
          onHandlerStateChange={this._onDismissGestureStateChange}>
          <Animated.View style={[styles.flex, {
            transform: [{scale: dismissAnimValue.interpolate({
              inputRange: [-100, 0, 160, 170],
              outputRange: [1, 1, 0.91, 0.91]
            })}]
          }]}>
            <ScreenTransition sharedId={`heroBackground.${id}`} style={StyleSheet.absoluteFill}>
              <View style={styles.background} />
            </ScreenTransition>
            <ScreenTransition sharedId={`heroPhoto.${id}`}>
              <Image style={styles.image} source={photo} />
            </ScreenTransition>
            <View style={styles.content}>
              <ScreenTransition sharedId={`heroName.${id}`} style={styles.name}>
                <Heading1>{name}</Heading1>
              </ScreenTransition>
              {description ? <ScreenTransition sharedId={`heroDescription.${id}`} style={styles.description}>
                <Body>{description}</Body>
              </ScreenTransition> : undefined}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  onBack = () => {
    const { hero } = this.props;
    const sharedElements = {
      [`heroBackground.${hero.id}`]: 'move',
      [`heroPhoto.${hero.id}`]: 'move',
      [`heroName.${hero.id}`]: 'move',
      //[`heroDescription.${hero.id}`]: 'dissolve',
    };
    Router.pop({
      sharedElements,
      transitionConfig: fadeIn()
    })
  }

  _onDismissGestureStateChange = (event: any) => {
    const { nativeEvent } = event;
    if (nativeEvent.state !== State.END) return;
    if (Math.abs(nativeEvent.translationY) >= 300) {
      this.onBack();
    }
    else {
      Animated.spring(this._dismissAnimValue, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    }
  };
}
