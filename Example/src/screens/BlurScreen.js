// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import { NavBar, ScreenTransition } from "../components";
import type { Hero } from "../types";
import { BlurView } from "@react-native-community/blur";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  navBar: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover"
  }
});

interface BlurScreenProps {
  hero: Hero;
}

export class BlurScreen extends React.Component<BlurScreenProps> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={30}
        />
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <Image style={styles.image} source={photo} />
          </ScreenTransition>
        </View>
        <NavBar title={name} back="close" light style={styles.navBar} />
      </View>
    );
  }
}
