// @flow
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { Router, NavBar, ScreenTransition, Colors } from "../components";
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
    height: 100
  },
  image: {
    // flex: 1,
    height: 100,
    width: "100%",
    resizeMode: "cover"
  }
});

type PropsType = {
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  overlay?: boolean,
  inverted?: boolean
};

export class FlatListScreen extends React.Component<PropsType> {
  static defaultProps = {
    title: "FlatList",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
    overlay: false
  };

  _data = [];

  constructor(props: PropsType) {
    super(props);
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < Heroes.length; j++) {
        this._data.push({
          ...Heroes[j],
          id: Heroes[j].id + "." + i
        });
      }
    }
  }

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <FlatList
          style={styles.content}
          data={this._data}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          inverted
        />
      </View>
    );
  }

  keyExtractor = (item: any, index: number) => item.id;

  renderItem = ({ item }: any) => {
    const hero = item;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <Image style={styles.image} source={hero.photo} />
        </ScreenTransition>
      </TouchableOpacity>
    );
  };

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
