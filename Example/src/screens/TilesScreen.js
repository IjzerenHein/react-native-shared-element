// @flow
import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { Router, NavBar, ScreenTransition } from "../components";
import type { SharedElementAnimation } from "react-native-shared-element-transition";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";
import type { TransitionConfig } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1
  },
  item: {
    height: 100
  },
  image: {
    // flex: 1,
    height: 100,
    width: "100%",
    resizeMode: "cover"
  }
});

type TilesScreenProps = {
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  overlay?: boolean
};

export class TilesScreen extends React.Component<TilesScreenProps> {
  static defaultProps = {
    title: "Tiles",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
    overlay: false
  };

  renderItem(hero: Hero) {
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <Image style={styles.image} source={hero.photo} />
        </ScreenTransition>
        <ScreenTransition
          sharedId={`heroPhotoOverlay.${hero.id}`}
          style={StyleSheet.absoluteFill}
        >
          <View style={StyleSheet.absoluteFill} collapsable={false} />
        </ScreenTransition>
      </TouchableOpacity>
    );
  }

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <ScrollView style={styles.content}>
          {Heroes.map(item => this.renderItem(item))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (hero: Hero) => {
    const {
      animation,
      DetailComponent,
      transitionConfig,
      overlay
    } = this.props;
    const alternateHero = animation === "dissolve" ? Heroes[0] : hero;
    const sharedElements = {
      [`heroPhoto.${hero.id}`]: animation
    };
    if (overlay) sharedElements[`heroPhotoOverlay.${hero.id}`] = "dissolve";
    Router.push(
      <DetailComponent
        hero={{
          ...alternateHero,
          id: hero.id
        }}
      />,
      {
        sharedElements,
        transitionConfig
      }
    );
  };
}
