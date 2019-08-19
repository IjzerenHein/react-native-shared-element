// @flow
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ImageBackground
} from "react-native";
import {
  Router,
  NavBar,
  ScreenTransition,
  Colors,
  Shadows,
  Heading1,
  Heading2,
  Body
} from "../components";
import type { SharedElementAnimation } from "react-native-shared-element";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";
import { fadeIn } from "../transitions";
import type { TransitionConfig } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import TouchableScale from "react-native-touchable-scale";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContent: Platform.select({
    ios: {
      flex: 1,
      backgroundColor: Colors.empty
    },
    android: {
      flex: 1
    }
  }),
  tileContent: {
    flex: 1,
    backgroundColor: Colors.empty
  },
  content: {
    flex: 1
  },
  item: {
    height: 160,
    width: Dimensions.get("window").width / 2,
    borderColor: Colors.back,
    borderRightWidth: 2,
    borderBottomWidth: 2
  },
  itemOdd: {
    borderRightWidth: 0
  },
  image: {
    height: "100%",
    width: "100%"
  },
  cardContentContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "column"
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.back,
    borderRadius: 20,
    ...Shadows.elevation1
  },
  cardImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 200,
    width: "100%",
    resizeMode: "cover",
    overflow: "hidden"
  },
  cardImage2: {
    borderRadius: 20,
    height: 360,
    width: "100%",
    resizeMode: "cover",
    overflow: "hidden"
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "flex-end"
  },
  cardFooter: {
    flexDirection: "column",
    padding: 16
  },
  cardName: {
    alignSelf: "flex-start"
  },
  cardDescription: {
    marginTop: 4
  },
  cardQuote: {}
});

type PropsType = {
  type: "tile" | "card" | "card2",
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig,
  resizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat"
};

export class TilesScreen extends React.Component<PropsType> {
  static defaultProps = {
    type: "tile",
    title: "Tiles",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
    resizeMode: "cover"
  };

  render() {
    const { type, title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <FlatList
          style={type === "tile" ? styles.tileContent : styles.cardContent}
          numColumns={type === "tile" ? 2 : 1}
          contentContainerStyle={
            type === "card" ? styles.cardContentContainer : undefined
          }
          horizontal={false}
          data={Heroes}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          endFillColor={Colors.empty} // android
        />
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  renderItem = (data: any) => {
    switch (this.props.type) {
      case "tile":
        return this.renderTile(data);
      case "card":
        return this.renderCard(data);
      case "card2":
        return this.renderCard2(data);
    }
  };

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
  };

  renderCard = ({ item }: any) => {
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={styles.cardContainer}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition
          sharedId={`heroBackground.${hero.id}`}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.cardBackground} />
        </ScreenTransition>
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <ImageBackground style={styles.cardImage} source={hero.photo} />
        </ScreenTransition>
        <View style={styles.cardFooter}>
          <ScreenTransition
            sharedId={`heroName.${hero.id}`}
            style={styles.cardName}
          >
            <Heading2>{hero.name}</Heading2>
          </ScreenTransition>
          {hero.description ? (
            <ScreenTransition
              sharedId={`heroDescription.${hero.id}`}
              style={styles.cardDescription}
            >
              <Body numberOfLines={3}>{hero.description}</Body>
            </ScreenTransition>
          ) : (
            undefined
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderCard2 = ({ item }: any) => {
    const hero = item;
    return (
      <TouchableScale
        key={`Hero${hero.id}`}
        style={styles.cardContainer}
        activeScale={0.95}
        tension={50}
        friction={7}
        useNativeDriver={true}
        onPress={() => this.onPressItem(hero)}
      >
        <ScreenTransition
          sharedId={`heroBackground.${hero.id}`}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.cardBackground} />
        </ScreenTransition>
        <ScreenTransition sharedId={`heroPhoto.${hero.id}`}>
          <Image style={styles.cardImage2} source={hero.photo} />
        </ScreenTransition>
        <ScreenTransition
          sharedId={`heroGradientOverlay.${hero.id}`}
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            style={styles.cardGradientOverlay}
            colors={["#00000000", "#000000FF"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 1 }}
          />
        </ScreenTransition>
        <View style={styles.cardOverlay}>
          <ScreenTransition
            sharedId={`heroName.${hero.id}`}
            style={styles.cardName}
          >
            <Heading1 light>{hero.name}</Heading1>
          </ScreenTransition>
          <ScreenTransition
            sharedId={`heroDescription.${hero.id}`}
            style={styles.cardQuote}
          >
            {hero.quote ? (
              <Body numberOfLines={1} light>
                {hero.quote}
              </Body>
            ) : (
              <View />
            )}
          </ScreenTransition>
        </View>
      </TouchableScale>
    );
  };

  onPressItem = (hero: Hero) => {
    const { animation, DetailComponent, transitionConfig, type } = this.props;
    const alternateHero = animation === "fade" ? Heroes[0] : hero;
    const sharedElements = {};
    const props: any = {
      hero: {
        ...alternateHero,
        id: hero.id
      }
    };
    switch (type) {
      case "tile":
        sharedElements[`heroPhoto.${hero.id}`] = animation;
        break;
      case "card":
        sharedElements[`heroBackground.${hero.id}`] = "move";
        sharedElements[`heroPhoto.${hero.id}`] = "move";
        sharedElements[`heroCloseButton.${hero.id}`] = "fade";
        sharedElements[`heroName.${hero.id}`] = "move";
        sharedElements[`heroDescription.${hero.id}`] = "fade-top";
        break;
      case "card2":
        sharedElements[`heroBackground.${hero.id}`] = "move";
        sharedElements[`heroPhoto.${hero.id}`] = "move";
        sharedElements[`heroGradientOverlay.${hero.id}`] = "fade";
        sharedElements[`heroCloseButton.${hero.id}`] = "fade";
        sharedElements[`heroName.${hero.id}`] = "fade";
        sharedElements[`heroDescription.${hero.id}`] = "fade-top";
        props.gradientOverlay = true;
        break;
    }
    Router.push(<DetailComponent {...props} />, {
      sharedElements,
      transitionConfig
    });
  };
}
