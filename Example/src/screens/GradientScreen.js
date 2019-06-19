// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Heading1, NavBar, ScreenTransition, Colors } from "../components";
import type { Hero } from "../types";
import LinearGradient from "react-native-linear-gradient";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
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

interface PropsType {
  hero: Hero;
}

export class GradientScreen extends React.Component<PropsType> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <Image style={styles.image} source={photo} />
          </ScreenTransition>
          <ScreenTransition
            sharedId={`heroPhotoOverlay.${id}`}
            style={StyleSheet.absoluteFill}
          >
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={["#000000FF", "#00000000", "#000000FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </ScreenTransition>
        </View>
        <NavBar back="close" title={name} style={styles.navBar} />
      </View>
    );
  }
}
