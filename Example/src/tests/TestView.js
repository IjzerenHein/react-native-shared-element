// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text
} from "react-native";
import { Colors, Shadows, ScreenTransition } from "../components";
import type { Hero, Size, Position } from "../types";
import { Heroes } from "../assets";

const SIZES = {
  max: Dimensions.get("window").width,
  small: 30,
  regular: 60,
  large: 80
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").width,
    backgroundColor: Colors.back,
    ...Shadows.elevation1
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
  logo: {
    resizeMode: 'cover'
  },
  image: {
    resizeMode: 'cover'
  },
  text: {
    fontWeight: "bold",
    color: Colors.text
  },
  content: {
    ...Shadows.elevation1,
    backgroundColor: Colors.back
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  max: {
    flex: 1,
    width: "100%"
  },
});

type PropsType = {
  hero: Hero,
  end?: boolean,
  size: Size,
  position: Position,
  vertical: boolean
};

export class TestView extends React.Component<PropsType> {
  static defaultProps = {
    hero: Heroes[0],
    style: {},
    size: "default",
    position: "default",
    vertical: false
  };

  render() {
    const {
      hero,
      end,
      size,
      position,
      vertical
    } = this.props;
    const resolvedPosition =
      position === "default" ? (end ? "right" : "left") : position;
    const sizePx = SIZES[size === "default" ? "regular" : size];
    return (
      <View
        style={[
          styles.container,
          size !== "max" ? styles[resolvedPosition] : undefined
        ]}
      >
        <ScreenTransition sharedId="testContent">
          <View style={[
            styles.content,
            vertical ? styles.vertical : styles.horizontal,
            { borderRadius: (sizePx + (sizePx / 2.5)) / 2 }
          ]}>
            <Image
              style={[
                styles.logo,
                {
                  width: sizePx / 2,
                  height: sizePx / 2,
                  borderRadius: sizePx / 4,
                  margin: sizePx / 5
                },
              ]}
              source={require('../assets/fist.png')}
            />
            <Text style={[styles.text, {
              fontSize: sizePx / 2.3,
              margin: sizePx / 8
              }]}>
              {hero.name}
            </Text>
            <Image
              style={[
                styles.image,
                {
                  width: sizePx,
                  height: sizePx,
                  borderRadius: sizePx / 2,
                  margin: sizePx / 8
                },
              ]}
              source={hero.photo}
            />
            </View>
          </ScreenTransition>
      </View>
    );
  }
}
