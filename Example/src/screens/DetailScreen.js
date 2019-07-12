// @flow
import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavBar, ScreenTransition, Colors } from '../components';
import type { Hero } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  navBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
});

interface DetailScreenProps {
  hero: Hero;
}

export class DetailScreen extends React.Component<DetailScreenProps> {
  render() {
    const { photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <Image style={styles.image} source={photo} />
          </ScreenTransition>
        </View>
        <NavBar back="close" light style={styles.navBar} />
      </View>
    );
  }
}
