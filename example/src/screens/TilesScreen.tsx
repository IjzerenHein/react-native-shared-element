import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";

import { Heroes } from "../assets";
import {
  Router,
  NavBar,
  SharedElement,
  Colors,
  Shadows,
  Text,
  LinearGradient,
} from "../components";
import { fadeIn } from "../transitions";
import { Hero, SharedElementsConfig } from "../types";
import { DetailScreen } from "./DetailScreen";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.empty,
  },
  avatarList: {
    flex: 1,
    backgroundColor: Colors.empty,
  },
  item: {
    height: 160,
    borderColor: Colors.back,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  itemOdd: {
    borderRightWidth: 0,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  avatar: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardListContentContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
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
    overflow: "hidden",
  },
  cardImage2: {
    borderRadius: 20,
    height: 360,
    width: "100%",
    resizeMode: "cover",
    overflow: "hidden",
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "flex-end",
  },
  cardFooter: {
    flexDirection: "column",
    padding: 16,
  },
  cardName: {
    alignSelf: "flex-start",
  },
  cardDescription: {
    marginTop: 4,
  },
  cardQuote: {},
});

type PropsType = {
  type: "tile" | "card" | "card2" | "avatar";
  title: string;
  DetailComponent: any;
  transitionConfig: any;
  navigation?: any;
};

type StateType = {
  width: number;
  height: number;
};

export class TilesScreen extends React.Component<PropsType, StateType> {
  static defaultProps = {
    type: "tile",
    title: "Tiles",
    DetailComponent: DetailScreen,
    transitionConfig: fadeIn(),
  };

  state = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  };

  render() {
    const { title, navigation } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    return (
      <View style={styles.flex} onLayout={this.onLayout}>
        {!navigation ? <NavBar title={title} /> : undefined}
        <FlatList
          style={type === "avatar" ? styles.avatarList : styles.list}
          numColumns={type === "tile" ? 2 : type === "avatar" ? 3 : 1}
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

  onLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height,
      });
    }
  };

  keyExtractor = (item: any) => item.id;

  renderItem = (data: any) => {
    const { navigation } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    switch (type) {
      case "tile":
        return this.renderTile(data);
      case "avatar":
        return this.renderAvatar(data);
      case "card":
        return this.renderCard(data);
      case "card2":
        return this.renderCard2(data);
      default:
        return null;
    }
  };

  renderTile = ({ item, index }: any) => {
    const { navigation } = this.props;
    const { width } = this.state;
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={[
          styles.item,
          index % 2 ? styles.itemOdd : undefined,
          { width: width / 2 },
        ]}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <SharedElement
          id={`heroPhoto.${hero.id}`}
          style={styles.flex}
          navigation={navigation}
        >
          <Image style={styles.image} source={hero.photo} resizeMode="cover" />
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

  renderAvatar = ({ item, index }: any) => {
    const { navigation } = this.props;
    const { width } = this.state;
    const hero = item;
    return (
      <TouchableOpacity
        key={`Hero${hero.id}`}
        style={[styles.avatar, { width: width / 3 }]}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <SharedElement id={`heroPhoto.${hero.id}`} navigation={navigation}>
          <Image
            style={styles.avatarImage}
            source={hero.photo}
            resizeMode="cover"
          />
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
          <ImageBackground
            style={styles.cardImage}
            source={hero.photo}
            resizeMode="cover"
          />
        </SharedElement>
        <View style={styles.cardFooter}>
          <SharedElement
            id={`heroName.${hero.id}`}
            style={styles.cardName}
            navigation={navigation}
          >
            <Text xlarge>{hero.name}</Text>
          </SharedElement>
          {hero.description ? (
            <SharedElement
              id={`heroDescription.${hero.id}`}
              style={styles.cardDescription}
              navigation={navigation}
            >
              <Text numberOfLines={3}>{hero.description}</Text>
            </SharedElement>
          ) : undefined}
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
        useNativeDriver
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
            <Text xxlarge light>
              {hero.name}
            </Text>
          </SharedElement>
          <SharedElement
            id={`heroDescription.${hero.id}`}
            style={styles.cardQuote}
            navigation={navigation}
          >
            {hero.quote ? (
              <Text numberOfLines={1} light>
                {hero.quote}
              </Text>
            ) : (
              <View />
            )}
          </SharedElement>
        </View>
      </TouchableScale>
    );
  };

  onPressItem = (hero: Hero) => {
    const { navigation, DetailComponent } = this.props;
    const type = navigation ? navigation.getParam("type") : this.props.type;
    const transitionConfig =
      (navigation ? navigation.getParam("transitionConfig") : undefined) ||
      this.props.transitionConfig;
    let sharedElements: SharedElementsConfig = [];
    const props: any = {
      hero,
      type,
    };
    let routeName = "Detail";
    switch (type) {
      case "tile":
        sharedElements = [`heroPhoto.${hero.id}`];
        routeName = "Pager";
        break;
      case "avatar":
        sharedElements = [
          {
            otherId: `heroBackground.${hero.id}`,
            id: `heroPhoto.${hero.id}`,
            animation: "fade-in",
          },
          `heroPhoto.${hero.id}`,
          {
            otherId: `heroName.${hero.id}`,
            id: `heroPhoto.${hero.id}`,
            animation: "fade-in",
          },
          {
            otherId: `heroDescription.${hero.id}`,
            id: `heroPhoto.${hero.id}`,
            animation: "fade-in",
          },
          { id: `heroCloseButton.${hero.id}`, animation: "fade" },
        ];
        routeName = "Card";
        break;
      case "card":
        sharedElements = [
          `heroBackground.${hero.id}`,
          `heroPhoto.${hero.id}`,
          { id: `heroCloseButton.${hero.id}`, animation: "fade" },
          `heroName.${hero.id}`,
          {
            id: `heroDescription.${hero.id}`,
            animation: "fade",
            resize: "none",
            align: "left-top",
          },
        ];
        routeName = "Card";
        break;
      case "card2":
        sharedElements = [
          `heroBackground.${hero.id}`,
          `heroPhoto.${hero.id}`,
          { id: `heroGradientOverlay.${hero.id}`, animation: "fade" },
          { id: `heroCloseButton.${hero.id}`, animation: "fade" },
          { id: `heroName.${hero.id}`, animation: "fade" },
          {
            id: `heroDescription.${hero.id}`,
            animation: "fade",
            resize: "clip",
            align: "left-top",
          },
        ];
        routeName = "Card";
        break;
    }

    if (navigation) {
      navigation.push(routeName, {
        ...props,
      });
    } else {
      Router.push(<DetailComponent {...props} />, {
        sharedElements,
        transitionConfig,
      });
    }
  };
}
