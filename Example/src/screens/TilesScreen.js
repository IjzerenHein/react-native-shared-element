// @flow
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground
} from "react-native";
import { Router, NavBar, ScreenTransition, Colors, Shadows, Heading1, Body } from "../components";
import type { SharedElementAnimation } from "react-native-shared-element-transition";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";
import { fadeIn } from "react-navigation-transitions";
import type{ TransitionConfig } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.empty
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
  },
  cardContentContainer: {
    marginTop: 20
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'column',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.back,
    borderRadius: 20,
    ...Shadows.elevation1,
  },
  cardImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 200,
    width: "100%",
    resizeMode: 'cover',
    overflow: 'hidden'
  },
  cardFooter: {
    flexDirection: 'column',
    padding: 16
  },
  cardName: {
    alignSelf: 'flex-start'
  },
  cardDescription: {
    marginTop: 4
  }
});

type PropsType = {
  type: 'tile' | 'card',
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  overlay?: boolean,
  resizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat"
};

export class TilesScreen extends React.Component<PropsType> {
  static defaultProps = {
    type: 'tile',
    title: "Tiles",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(4000),
    overlay: false,
    resizeMode: "cover"
  };

  render() {
    const { type, title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <FlatList
          style={styles.content}
          numColumns={type === 'tile' ? 2 : 1}
          contentContainerStyle={type === 'card' ? styles.cardContentContainer : undefined}
          horizontal={false}
          data={Heroes}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor} />
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  renderItem = (data: any) => {
    switch (this.props.type) {
    case 'tile': return this.renderTile(data);
    case 'card': return this.renderCard(data);
    }
  }

  renderCard = ({ item }: any) => {
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={styles.cardContainer}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition sharedId={`heroBackground.${hero.id}`} style={StyleSheet.absoluteFill}>
          <View style={styles.cardBackground} />
        </ScreenTransition>
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <ImageBackground
            style={styles.cardImage}
            source={hero.photo}
          />
        </ScreenTransition>
        <View style={styles.cardFooter}>
          <ScreenTransition sharedId={`heroName.${hero.id}`} style={styles.cardName}>
            <Heading1>{hero.name}</Heading1>
          </ScreenTransition>
          {hero.description ? <ScreenTransition sharedId={`heroDescription.${hero.id}`} style={styles.cardDescription}>
            <Body numberOfLines={3}>{hero.description}</Body>
          </ScreenTransition> : undefined}
        </View>
      </TouchableOpacity>
    );
  }

  renderTile = ({ item, index }: any) => {
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
      overlay,
      type
    } = this.props;
    const alternateHero = animation === "dissolve" ? Heroes[0] : hero;
    const sharedElements = {};
    if (type === 'card') {
      sharedElements[`heroBackground.${hero.id}`] = 'move';
      sharedElements[`heroPhoto.${hero.id}`] = 'move';
      sharedElements[`heroName.${hero.id}`] = 'move';
      //sharedElements[`heroDescription.${hero.id}`] = 'dissolve';
    }
    else {
      sharedElements[`heroPhoto.${hero.id}`] = animation;
    }
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
