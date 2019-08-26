// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  Platform
} from "react-native";
import {
  NavBar,
  SharedElement,
  Colors,
  Router,
  Heading1,
  Body
} from "../components";
import type { Hero, SharedElementsConfig } from "../types";
import { fadeIn } from "../transitions";
// import LinearGradient from "react-native-linear-gradient";

const HEIGHT = Dimensions.get("window").height;
const IMAGE_HEIGHT = Dimensions.get("window").width * 0.75;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollViewContent: {
    minHeight: HEIGHT
  },
  background: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    padding: 20,
    paddingTop: 10
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0
  },
  image: {
    height: IMAGE_HEIGHT,
    width: "100%",
    resizeMode: "cover"
  },
  name: {
    alignSelf: "flex-start"
  },
  description: {
    marginTop: 4
  },
  bottom: {
    height: 1,
    backgroundColor: Colors.back
  }
});

type PropsType = {
  hero: Hero,
  gradientOverlay: boolean,
  navigation?: any
};
type StateType = {
  contentHeight: number,
  scrollOffset: Animated.Value,
  scrollEvent: any
};

export class CardScreen extends React.Component<PropsType, StateType> {
  static navigationOptions = {
    header: null
  };

  /*static sharedElements = (navigation: any) => {
    const type = navigation.getParam("type") || "card2";
    const hero = navigation.getParam("hero");
    console.log("CardScreen.sharedElements: ", type, hero);
    const sharedElements: SharedElementsConfig = {};

    switch (type) {
      case "tile":
        sharedElements[`heroPhoto.${hero.id}`] = "move";
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
        break;
      case "card2":
        sharedElements[`heroBackground.${hero.id}`] = "move";
        sharedElements[`heroPhoto.${hero.id}`] = "move";
        sharedElements[`heroGradientOverlay.${hero.id}`] = "fade";
        sharedElements[`heroCloseButton.${hero.id}`] = "fade";
        sharedElements[`heroName.${hero.id}`] = "fade";
        sharedElements[`heroDescription.${hero.id}`] = {
          animation: "fade",
          resize: "none",
          align: "left-top"
        };
        break;
    }
    return sharedElements;
  };*/

  constructor(props: PropsType) {
    super(props);
    const scrollOffset = new Animated.Value(0);
    this.state = {
      scrollOffset,
      scrollEvent: Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
        {
          useNativeDriver: true
        }
      ),
      contentHeight: 0
    };
  }

  render() {
    const { scrollOffset, scrollEvent, contentHeight } = this.state;
    const { navigation } = this.props;
    const hero = navigation ? navigation.getParam("hero") : this.props.hero;
    const gradientOverlay = navigation
      ? navigation.getParam("gradientOverlay")
      : this.props.gradientOverlay;
    const { id, name, photo, description } = hero;
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="light-content" animated />
        <Animated.ScrollView
          style={styles.flex}
          scrollEventThrottle={16}
          onScroll={scrollEvent}
        >
          <View style={styles.scrollViewContent}>
            <SharedElement
              id={`heroBackground.${id}`}
              style={StyleSheet.absoluteFill}
              navigation={navigation}
            >
              <View style={styles.background} />
            </SharedElement>
            <Animated.View
              style={
                Platform.OS === "ios"
                  ? {
                      transform: [
                        {
                          translateY: scrollOffset.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [-1, 0, 0]
                          })
                        },
                        {
                          scale: scrollOffset.interpolate({
                            inputRange: [IMAGE_HEIGHT / -2, 0, 1],
                            outputRange: [2, 1, 1]
                          })
                        }
                      ]
                    }
                  : undefined
              }
            >
              <SharedElement id={`heroPhoto.${id}`} navigation={navigation}>
                <Image style={styles.image} source={photo} />
              </SharedElement>
              {gradientOverlay ? (
                <SharedElement
                  id={`heroGradientOverlay.${hero.id}`}
                  style={StyleSheet.absoluteFill}
                  navigation={navigation}
                >
                  <View style={StyleSheet.absoluteFill} />
                  {/*<LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={["#00000000", "#00000000", "#000000FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />*/}
                </SharedElement>
              ) : (
                undefined
              )}
            </Animated.View>
            <View style={styles.content} onLayout={this.onLayoutContent}>
              <SharedElement
                id={`heroName.${id}`}
                style={styles.name}
                navigation={navigation}
              >
                <Heading1>{name}</Heading1>
              </SharedElement>
              {description ? (
                <SharedElement
                  id={`heroDescription.${id}`}
                  style={styles.description}
                  navigation={navigation}
                >
                  <Body>{description}</Body>
                </SharedElement>
              ) : (
                undefined
              )}
            </View>
          </View>
          {Platform.OS === "ios" ? (
            <Animated.View
              style={[
                styles.bottom,
                {
                  transform: [
                    {
                      translateY: scrollOffset.interpolate({
                        inputRange: [
                          0,
                          Math.max(IMAGE_HEIGHT + contentHeight - HEIGHT, 0),
                          Math.max(IMAGE_HEIGHT + contentHeight - HEIGHT, 0) + 1
                        ],
                        outputRange: [0, 0, 0.5]
                      })
                    },
                    {
                      scaleY: scrollOffset.interpolate({
                        inputRange: [
                          0,
                          Math.max(IMAGE_HEIGHT + contentHeight - HEIGHT, 0),
                          Math.max(IMAGE_HEIGHT + contentHeight - HEIGHT, 0) + 1
                        ],
                        outputRange: [0, 1, 2]
                      })
                    }
                  ]
                }
              ]}
            />
          ) : (
            undefined
          )}
        </Animated.ScrollView>
        <SharedElement
          id={`heroCloseButton.${id}`}
          style={styles.navBar}
          navigation={navigation}
        >
          <NavBar light back="close" onBack={this.onBack} />
        </SharedElement>
      </View>
    );
  }

  onLayoutContent = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (this.state.contentHeight !== height) {
      this.setState({ contentHeight: height });
    }
  };

  onBack = () => {
    const { gradientOverlay, navigation } = this.props;
    const hero = navigation ? navigation.getParam("hero") : this.props.hero;
    const sharedElements: SharedElementsConfig = {
      [`heroBackground.${hero.id}`]: "move",
      [`heroPhoto.${hero.id}`]: "move"
    };
    if (gradientOverlay) {
      sharedElements[`heroGradientOverlay.${hero.id}`] = "fade";
    }
    sharedElements[`heroCloseButton.${hero.id}`] = "fade";
    sharedElements[`heroName.${hero.id}`] = "move";
    sharedElements[`heroDescription.${hero.id}`] = {
      animation: "fade",
      resize: "none",
      align: "left-top"
    };
    if (navigation) {
      navigation.goBack();
    } else {
      Router.pop({
        sharedElements,
        transitionConfig: fadeIn()
      });
    }
  };
}
