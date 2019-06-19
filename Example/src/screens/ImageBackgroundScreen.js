// @flow
import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { NavBar, ScreenTransition, Colors } from "../components";
import type { Hero } from "../types";

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
  }
});

type PropsType = {
  hero: Hero
};

export class ImageBackgroundScreen extends React.Component<PropsType> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <ImageBackground
              style={styles.content}
              source={photo}
              resizeMode="cover"
            />
          </ScreenTransition>
        </View>
        <NavBar back="close" light style={styles.navBar} />
      </View>
    );
  }
}
