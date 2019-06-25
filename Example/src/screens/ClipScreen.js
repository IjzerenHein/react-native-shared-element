// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { Heading1, NavBar, ScreenTransition, Colors } from "../components";
import type { Hero } from "../types";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const IMAGE_WIDTH = WIDTH - 200;
const IMAGE_HEIGHT = HEIGHT - 300;

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
  },
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.gray
  }
});

interface PropsType {
  title: string;
  hero: Hero;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  position: "left" | "top" | "bottom" | "right" | "center";
  onPress?: () => void;
}

export class ClipScreen extends React.Component<PropsType> {
  static defaultProps = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    position: "center"
  };

  render() {
    const {
      title,
      hero,
      left,
      top,
      right,
      bottom,
      position,
      onPress
    } = this.props;
    const { name, photo, id } = hero;
    let x = 0;
    let y = 0;
    switch (position) {
      case "left":
        x = 0;
        y = (HEIGHT - IMAGE_HEIGHT) / 2;
        break;
      case "top":
        y = 0;
        x = (WIDTH - IMAGE_WIDTH) / 2;
        break;
      case "bottom":
        y = HEIGHT - IMAGE_HEIGHT;
        x = (WIDTH - IMAGE_WIDTH) / 2;
        break;
      case "right":
        y = (HEIGHT - IMAGE_HEIGHT) / 2;
        x = WIDTH - IMAGE_WIDTH;
        break;
    }
    if (left) x -= left;
    if (top) y -= top;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
          <View style={styles.content}>
            <View
              style={{
                position: "absolute",
                left,
                top,
                right,
                bottom,
                overflow: "hidden"
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT
                }}
              >
                <ScreenTransition
                  sharedId={`heroPhoto.${id}`}
                  style={styles.content}
                >
                  <Image style={styles.image} source={photo} />
                </ScreenTransition>
              </View>
            </View>
            {top ? (
              <View
                style={[
                  styles.clip,
                  {
                    bottom: undefined,
                    height: top
                  }
                ]}
              />
            ) : (
              undefined
            )}
            {bottom ? (
              <View
                style={[
                  styles.clip,
                  {
                    top: undefined,
                    height: bottom
                  }
                ]}
              />
            ) : (
              undefined
            )}
            {left ? (
              <View
                style={[
                  styles.clip,
                  {
                    right: undefined,
                    width: left
                  }
                ]}
              />
            ) : (
              undefined
            )}
            {right ? (
              <View
                style={[
                  styles.clip,
                  {
                    left: undefined,
                    width: right
                  }
                ]}
              />
            ) : (
              undefined
            )}
          </View>
        </TouchableWithoutFeedback>
        <NavBar back="close" title={title} style={styles.navBar} />
      </View>
    );
  }
}
