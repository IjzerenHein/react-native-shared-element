// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Heading1, NavBar, ScreenTransition } from "../components";
import type { Hero } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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

interface DetailScreenProps {
  hero: Hero;
}

export class DetailScreen extends React.Component<DetailScreenProps> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <NavBar title={name} back="close" />
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <Image style={styles.image} source={photo} />
          </ScreenTransition>
        </View>
      </View>
    );
  }
}
