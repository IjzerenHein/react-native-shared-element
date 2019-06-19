// @flow
import * as React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Heading1, NavBar, ScreenTransition } from "../components";
import type { Hero } from "../types";
import ImageZoom from "react-native-image-pan-zoom";

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

interface RNImagePanZoomScreenProps {
  hero: Hero;
}

export class RNImagePanZoomScreen extends React.Component<RNImagePanZoomScreenProps> {
  render() {
    const { name, photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <NavBar title="RNImagePanZoom" back="close" />
        <View style={styles.content}>
          <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.content}>
            <ImageZoom
              cropWidth={Dimensions.get("window").width}
              cropHeight={Dimensions.get("window").height}
              imageWidth={200}
              imageHeight={200}
            >
              <Image style={{ width: 200, height: 200 }} source={photo} />
            </ImageZoom>
          </ScreenTransition>
        </View>
      </View>
    );
  }
}
