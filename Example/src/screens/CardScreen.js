// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import { NavBar, ScreenTransition, Colors, Router, Heading1, Body } from "../components";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";

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
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
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
  render() {
    const { hero } = this.props;
    const { id, name, photo, description } = hero;
    return (
      <View style={styles.flex}>
        <ScreenTransition sharedId={`heroBackground.${id}`} style={StyleSheet.absoluteFill}>
          <View style={styles.background} />
        </ScreenTransition>
        <ScreenTransition sharedId={`heroPhoto.${id}`}>
          <Image style={styles.image} source={photo} />
        </ScreenTransition>
        <NavBar style={styles.navBar} light back='close' onBack={this.onBack} />
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroName.${id}`} style={styles.name}>
            <Heading1>{name}</Heading1>
          </ScreenTransition>
          {description ? <ScreenTransition sharedId={`heroDescription.${id}`} style={styles.description}>
            <Body>{description}</Body>
          </ScreenTransition> : undefined}
        </View>
      </View>
    );
  }

  onBack = () => {
    const { hero } = this.props;
    const sharedElements = {
      [`heroBackground.${hero.id}`]: 'move',
      [`heroPhoto.${hero.id}`]: 'move',
      [`heroName.${hero.id}`]: 'move',
      [`heroDescription.${hero.id}`]: 'fade-top',
    };
    Router.pop({
      sharedElements,
      transitionConfig: fadeIn()
    })
  }
}
