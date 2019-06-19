// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Heading1, NavBar, ScreenTransition } from "../components";
import type { Hero } from "../types";
import FastImage from "react-native-fast-image";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  navBar: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0
  },
  content: {
    flex: 1
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover"
  }
});

type PropsType = {
  hero: Hero
};

export class RNFastImageScreen extends React.Component<PropsType> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <FastImage style={styles.image} source={photo} />
          </ScreenTransition>
        </View>
        <NavBar back="close" light style={styles.navBar} />
      </View>
    );
  }
}
