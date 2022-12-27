import * as React from "react";
import { StyleSheet, View, Image } from "react-native";

import { NavBar, SharedElement, Colors } from "../components";
import { Hero } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  navBar: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
});

type Props = {
  hero: Hero;
  navigation?: any;
};

export function DetailScreen(props: Props) {
  const { navigation } = props;
  const hero = navigation?.getParam("hero") ?? props.hero;
  const { photo, id } = hero;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SharedElement
          navigation={navigation}
          id={`heroPhoto.${id}`}
          style={styles.content}
        >
          <Image style={styles.image} source={photo} />
        </SharedElement>
      </View>
      {!navigation ? (
        <NavBar back="close" light style={styles.navBar} />
      ) : undefined}
    </View>
  );
}
