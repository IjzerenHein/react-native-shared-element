// @flow
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { Router, NavBar, ScreenTransition, Colors } from "../components";
import type { SharedElementAnimation } from "react-native-shared-element-transition";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";
import type{ TransitionConfig } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    flex: 1
  },
  item: {
    height: 160,
    width: Dimensions.get('window').width / 2,
    borderColor: Colors.back,
    borderRightWidth: 2,
    borderBottomWidth: 2
  },
  itemOdd: {
    borderRightWidth: 0,
  },
  image: {
    height: '100%',
    width: "100%"
  }
});

type TilesScreenProps = {
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  overlay?: boolean,
  resizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat"
};

export class TilesScreen extends React.Component<TilesScreenProps> {
  static defaultProps = {
    title: "Tiles",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
    overlay: false,
    resizeMode: "cover"
  };

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <FlatList
          style={styles.content}
          numColumns={2}
          horizontal={false}
          data={Heroes}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor} />
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  renderItem = ({ item, index }: any) => {
    const hero = item;
    const { resizeMode } = this.props;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={[styles.item, index % 2 ? styles.itemOdd : undefined]}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <Image
            style={styles.image}
            source={hero.photo}
            resizeMode={resizeMode}
          />
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
