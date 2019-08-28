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
import {
  Router,
  NavBar,
  SharedElement,
  Colors,
  Shadows,
  Heading1,
  Heading2,
  Body
} from "../components";
import type { SharedElementTransitionAnimation } from "react-native-shared-element";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type {
  Hero,
  SharedElementTransitionConfig,
  SharedElementsConfig
} from "../types";
import { fadeIn } from "../transitions";
import LinearGradient from "react-native-linear-gradient";
import TouchableScale from "react-native-touchable-scale";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: Colors.empty
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
  cardListContentContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 20
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
  animation: SharedElementTransitionAnimation | SharedElementTransitionConfig,
  DetailComponent: any,
  transitionConfig: any,
  navigation?: any
};

export class TilesScreen extends React.Component<PropsType> {
  static defaultProps = {
    type: "tile",
    title: "Tiles",
    animation: "move",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn()
  };

  render() {
    const { title, navigation } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    return (
      <View style={styles.container}>
        {!navigation ? <NavBar title={title} /> : undefined}
        <FlatList
          style={styles.list}
          numColumns={type === "tile" ? 2 : 1}
          contentContainerStyle={
            type === "card" ? styles.cardListContentContainer : undefined
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
    const { navigation } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    switch (type) {
      case "tile":
        return this.renderTile(data);
      case "card":
        return this.renderCard(data);
      case "card2":
        return this.renderCard2(data);
    }
  };

  renderTile = ({ item, index }: any) => {
    const { navigation } = this.props;
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={[styles.item, index % 2 ? styles.itemOdd : undefined]}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <SharedElement id={`heroPhoto.${hero.id}`} navigation={navigation}>
          <Image
            style={styles.image}
            source={hero.photo}
            resizeMode={"cover"}
          />
        </SharedElement>
        <SharedElement
          id={`heroPhotoOverlay.${hero.id}`}
          style={StyleSheet.absoluteFill}
          navigation={navigation}
        >
          <View style={StyleSheet.absoluteFill} collapsable={false} />
        </SharedElement>
      </TouchableOpacity>
    );
  };

  renderCard = ({ item }: any) => {
    const { navigation } = this.props;
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={styles.cardContainer}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <SharedElement
          id={`heroBackground.${hero.id}`}
          style={StyleSheet.absoluteFill}
          navigation={navigation}
        >
          <View style={styles.cardBackground} />
        </SharedElement>
        <SharedElement id={`heroPhoto.${hero.id}`} navigation={navigation}>
          <ImageBackground style={styles.cardImage} source={hero.photo} />
        </SharedElement>
        <View style={styles.cardFooter}>
          <SharedElement
            id={`heroName.${hero.id}`}
            style={styles.cardName}
            navigation={navigation}
          >
            <Heading2>{hero.name}</Heading2>
          </SharedElement>
          {hero.description ? (
            <SharedElement
              id={`heroDescription.${hero.id}`}
              style={styles.cardDescription}
              navigation={navigation}
            >
              <Body numberOfLines={3}>{hero.description}</Body>
            </SharedElement>
          ) : (
            undefined
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderCard2 = ({ item }: any) => {
    const { navigation } = this.props;
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
        <SharedElement
          id={`heroBackground.${hero.id}`}
          style={StyleSheet.absoluteFill}
          navigation={navigation}
        >
          <View style={styles.cardBackground} />
        </SharedElement>
        <SharedElement id={`heroPhoto.${hero.id}`} navigation={navigation}>
          <Image style={styles.cardImage2} source={hero.photo} />
        </SharedElement>
        <SharedElement
          id={`heroGradientOverlay.${hero.id}`}
          style={StyleSheet.absoluteFill}
          navigation={navigation}
        >
          <LinearGradient
            style={styles.cardGradientOverlay}
            colors={["#00000000", "#000000FF"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 1 }}
          />
        </SharedElement>
        <View style={styles.cardOverlay}>
          <SharedElement
            id={`heroName.${hero.id}`}
            style={styles.cardName}
            navigation={navigation}
          >
            <Heading1 light>{hero.name}</Heading1>
          </SharedElement>
          <SharedElement
            id={`heroDescription.${hero.id}`}
            style={styles.cardQuote}
            navigation={navigation}
          >
            {hero.quote ? (
              <Body numberOfLines={1} light>
                {hero.quote}
              </Body>
            ) : (
              <View />
            )}
          </SharedElement>
        </View>
      </TouchableScale>
    );
  };

  onPressItem = (hero: Hero) => {
    const { navigation, animation, DetailComponent } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    const transitionConfig =
      (navigation ? navigation.getParam("transitionConfig") : undefined) ||
      this.props.transitionConfig;
    const alternateHero = animation === "fade" ? Heroes[0] : hero;
    const sharedElements: SharedElementsConfig = {};
    const props: any = {
      hero: {
        ...alternateHero,
        id: hero.id
      }
    };
    let routeName = "Detail";
    switch (type) {
      case "tile":
        sharedElements[`heroPhoto.${hero.id}`] = animation;
        routeName = "Pager";
        break;
      case "card":
        sharedElements[`heroBackground.${hero.id}`] = "move";
        sharedElements[`heroPhoto.${hero.id}`] = "move";
        sharedElements[`heroCloseButton.${hero.id}`] = "fade";
        sharedElements[`heroName.${hero.id}`] = "move";
        sharedElements[`heroDescription.${hero.id}`] = {
          animation: "fade",
          resize: "none",
          align: "left-top"
        };
        routeName = "Card";
        break;
      case "card2":
        sharedElements[`heroBackground.${hero.id}`] = "move";
        sharedElements[`heroPhoto.${hero.id}`] = "move";
        sharedElements[`heroGradientOverlay.${hero.id}`] = "fade";
        sharedElements[`heroCloseButton.${hero.id}`] = "fade";
        sharedElements[`heroName.${hero.id}`] = "fade";
        sharedElements[`heroDescription.${hero.id}`] = {
          animation: "fade",
          resize: "clip",
          align: "left-top"
        };
        routeName = "Card";
        props.gradientOverlay = true;
        break;
    }
    if (navigation) {
      navigation.push(routeName, {
        ...props,
        sharedElements
      });
    } else {
      Router.push(<DetailComponent {...props} />, {
        sharedElements,
        transitionConfig
      });
    }
  };
}
