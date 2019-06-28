// @flow
import * as React from "react";
import { StyleSheet, View, FlatList, Image, Dimensions } from "react-native";
import { Colors, ScreenTransition } from "../components";
import type { Hero, Size } from "../types";
import { Heroes } from "../assets";

const SIZES = {
  max: Dimensions.get("window").width,
  small: 120,
  regular: 200,
  large: 280
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").width,
    backgroundColor: Colors.back,
    justifyContent: "center",
    alignItems: "center"
  }
});

type PropsType = {
  hero: Hero,
  hero2: Hero,
  horizontal: boolean,
  inverted: boolean,
  size: Size,
  round?: boolean,
  ImageComponent: any
};

export class TestScrollView extends React.Component<PropsType> {
  static defaultProps = {
    hero: Heroes[0],
    hero2: Heroes[1],
    horizontal: false,
    inverted: false,
    size: "default",
    ImageComponent: Image
  };

  render() {
    const { hero, hero2, size, horizontal, inverted } = this.props;
    const sizePx = SIZES[size === "default" ? "regular" : size];
    return (
      <View style={styles.container}>
        <View
          style={{
            width: sizePx,
            height: sizePx
          }}
        >
          <FlatList
            horizontal={horizontal}
            inverted={inverted}
            data={[hero2, hero]}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      </View>
    );
  }

  keyExtractor = (item: any, index: number) => item.id;

  renderItem = ({ item, index }: any) => {
    const hero = item;
    const { size, ImageComponent, round, horizontal } = this.props;
    const sizePx = SIZES[size === "default" ? "regular" : size];
    const sizeStyle = {
      width: horizontal ? sizePx / 1.5 : sizePx,
      height: horizontal ? sizePx : sizePx / 1.5
    };

    const content = (
      <ImageComponent
        style={[
          sizeStyle,
          round
            ? {
                borderRadius: sizePx / 2
              }
            : undefined
        ]}
        source={hero.photo}
        resizeMode="cover"
      />
    );

    if (index === 1) {
      return (
        <ScreenTransition sharedId="testContent" style={sizeStyle}>
          {content}
        </ScreenTransition>
      );
    } else {
      return content;
    }
  };
}
