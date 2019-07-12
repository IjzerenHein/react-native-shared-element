// @flow
import * as React from 'react';
import { StyleSheet, View, Image, StatusBar, ScrollView, Dimensions } from 'react-native';
import { NavBar, ScreenTransition, Colors, Router, Heading1, Body, Shadows } from '../components';
import type { Hero } from '../types';
import { fadeIn } from '../transitions';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.back,
    ...Shadows.elevation1,
  },
  content: {
    padding: 20,
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  image: {
    height: Dimensions.get('window').width * 0.75,
    width: '100%',
    resizeMode: 'cover',
  },
  name: {
    alignSelf: 'flex-start',
  },
  description: {
    marginTop: 4,
  },
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
        <StatusBar barStyle="light-content" animated />
        <ScreenTransition sharedId={`heroBackground.${id}`} style={StyleSheet.absoluteFill}>
          <View style={styles.background} />
        </ScreenTransition>
        <ScrollView style={styles.flex}>
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
        </ScrollView>
        <ScreenTransition sharedId={`heroCloseButton.${id}`} style={styles.navBar}>
          <NavBar light back="close" onBack={this.onBack} />
        </ScreenTransition>
      </View>
    );
  }

  onBack = () => {
    const { hero } = this.props;
    const sharedElements = {
      [`heroBackground.${hero.id}`]: 'move',
      [`heroPhoto.${hero.id}`]: 'move',
      [`heroCloseButton.${hero.id}`]: 'dissolve',
      [`heroName.${hero.id}`]: 'move',
      [`heroDescription.${hero.id}`]: 'fade-top',
    };
    Router.pop({
      sharedElements,
      transitionConfig: fadeIn(),
    });
  }
}
