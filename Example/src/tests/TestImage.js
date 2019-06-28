// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions
} from "react-native";
import { Colors, ScreenTransition } from "../components";
import type { Hero, Size, Position, ResizeMode } from "../types";
import { Heroes } from "../assets";

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").width,
    backgroundColor: Colors.back
  },
  left: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20
  },
  top: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20
  },
  bottom: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20
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
    width: 120,
    height: 120
  },
  regular: {
    width: 200,
    height: 200
  },
  large: {
    width: 280,
    height: 280
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
      <View
        style={[
          styles.container,
          resolvedSize !== "max" ? styles[resolvedPosition] : undefined
        ]}
      >
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
