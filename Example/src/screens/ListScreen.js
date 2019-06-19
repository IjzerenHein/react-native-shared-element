// @flow
import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import {
  Router,
  NavBar,
  ScreenTransition,
  Colors,
  Heading2
} from "../components";
import type { SharedElementAnimation } from "react-native-shared-element-transition";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";
import type { TransitionConfig } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    flex: 1
  },
  item: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    resizeMode: "cover"
  }
});

type PropsType = {
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  overlay?: boolean
};

export class ListScreen extends React.Component<PropsType> {
  static defaultProps = {
    title: "Bullets",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
    overlay: false
  };

  renderItem(hero: Hero) {
    const { id, name, photo } = hero;
    return (
      <TouchableOpacity
        key={`Hero${id}`}
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition sharedId={`heroPhoto.${id}`}>
          <Image style={styles.image} source={photo} />
        </ScreenTransition>
        <ScreenTransition sharedId={`heroName.${id}`}>
          <Heading2>{name}</Heading2>
        </ScreenTransition>
        <ScreenTransition
          sharedId={`heroPhotoOverlay.${id}`}
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
