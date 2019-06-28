// @flow
import * as React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { NavBar, ScreenTransition, Colors } from "../components";
import type { Hero } from "../types";
import ImageZoom from "react-native-image-pan-zoom";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height - NavBar.HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    flex: 1
  },
  image: {
    width: WIDTH,
    height: HEIGHT
  }
});

interface RNImagePanZoomScreenProps {
  hero: Hero;
}

export class RNImagePanZoomScreen extends React.Component<RNImagePanZoomScreenProps> {
  render() {
    const { photo, id } = this.props.hero;
    return (
      <View style={styles.container}>
        <NavBar title="RNImagePanZoom" back="close" />
        <View style={styles.content}>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height - NavBar.HEIGHT}
            imageWidth={WIDTH}
            imageHeight={HEIGHT}
          >
            <ScreenTransition sharedId={`heroPhoto.${id}`}>
              <Image style={styles.image} source={photo} resizeMode="cover" />
            </ScreenTransition>
          </ImageZoom>
        </View>
      </View>
    );
  }
}
