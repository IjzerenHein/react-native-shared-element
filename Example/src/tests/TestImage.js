// @flow
import * as React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Colors, ScreenTransition } from "../components";
import type { Hero, Size, Position, ResizeMode } from "../types";
import { Heroes } from "../assets";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
    // padding: 20
  },
  left: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20
  },
  top: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 20
  },
  bottom: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20
  },
  center: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    // TODO
  },
  small: {
    width: 80,
    height: 80
  },
  regular: {
    width: 160,
    height: 160
  },
  large: {
    width: 240,
    height: 240
  },
  max: {
    flex: 1,
    width: "100%"
  },
  smallRound: {
    borderRadius: 40
  },
  regularRound: {
    borderRadius: 80
  },
  largeRound: {
    borderRadius: 120
  },
  maxRound: {}
});

type PropsType = {
  hero: Hero,
  end?: boolean,
  size: Size,
  position: Position,
  resizeMode: ResizeMode,
  round?: boolean,
  ImageComponent: any
};

export class TestImage extends React.Component<PropsType> {
  static defaultProps = {
    hero: Heroes[0],
    size: "default",
    position: "default",
    resizeMode: "cover",
    round: false,
    ImageComponent: Image
  };

  render() {
    const {
      hero,
      end,
      size,
      position,
      resizeMode,
      round,
      ImageComponent
    } = this.props;
    const resolvedSize = size === "default" ? "regular" : size;
    const resolvedPosition =
      position === "default" ? (end ? "right" : "left") : position;
    return (
      <View style={[styles.container, styles[resolvedPosition]]}>
        <ScreenTransition
          sharedId="testContent"
          style={resolvedSize === "max" ? { flex: 1 } : undefined}
        >
          <ImageComponent
            style={[
              styles.image,
              styles[resolvedSize],
              round ? styles[`${resolvedSize}Round`] : undefined
            ]}
            resizeMode={resizeMode}
            source={hero.photo}
          />
        </ScreenTransition>
      </View>
    );
  }
}
