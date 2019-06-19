// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Heading1, NavBar, ScreenTransition, Colors } from "../components";
import type { Hero } from "../types";
import PhotoView from "react-native-photo-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
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

interface RNPhotoViewScreenProps {
  hero: Hero;
}

export class RNPhotoViewScreen extends React.Component<RNPhotoViewScreenProps> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <NavBar title="RNPhotoView" back="close" />
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <PhotoView
              source={photo}
              minimumZoomScale={0.5}
              maximumZoomScale={3}
              androidScaleType="center"
              style={styles.image}
            />
          </ScreenTransition>
        </View>
      </View>
    );
  }
}
