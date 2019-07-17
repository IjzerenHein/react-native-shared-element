// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  ScrollView,
  Dimensions
} from "react-native";
import {
  NavBar,
  ScreenTransition,
  Colors,
  Router,
  Heading1,
  Body,
  Shadows
} from "../components";
import type { Hero } from "../types";
import { fadeIn } from "../transitions";
// import LinearGradient from "react-native-linear-gradient";

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollViewContent: {
    minHeight: Dimensions.get("window").height
  },
  background: {
    flex: 1,
    backgroundColor: Colors.back,
    ...Shadows.elevation1
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
    height: Dimensions.get("window").width * 0.75,
    width: "100%",
    resizeMode: "cover"
  },
  name: {
    alignSelf: "flex-start"
  },
  description: {
    marginTop: 4
  }
});

type PropsType = {
  hero: Hero,
  gradientOverlay: boolean
};
type StateType = {};

export class CardScreen extends React.Component<PropsType, StateType> {
  render() {
    const { hero, gradientOverlay } = this.props;
    const { id, name, photo, description } = hero;
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="light-content" animated />
        <ScrollView style={styles.flex}>
          <View style={styles.scrollViewContent}>
            <ScreenTransition
              sharedId={`heroBackground.${id}`}
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.background} />
            </ScreenTransition>
            <View>
              <ScreenTransition sharedId={`heroPhoto.${id}`}>
                <Image style={styles.image} source={photo} />
              </ScreenTransition>
              {gradientOverlay ? (
                <ScreenTransition
                  sharedId={`heroGradientOverlay.${hero.id}`}
                  style={StyleSheet.absoluteFill}
                >
                  <View />
                  {/*<LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={["#00000000", "#00000000", "#000000FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />*/}
                </ScreenTransition>
              ) : (
                undefined
              )}
            </View>
            <View style={styles.content}>
              <ScreenTransition sharedId={`heroName.${id}`} style={styles.name}>
                <Heading1>{name}</Heading1>
              </ScreenTransition>
              {description ? (
                <ScreenTransition
                  sharedId={`heroDescription.${id}`}
                  style={styles.description}
                >
                  <Body>{description}</Body>
                </ScreenTransition>
              ) : (
                undefined
              )}
            </View>
          </View>
        </ScrollView>
        <ScreenTransition
          sharedId={`heroCloseButton.${id}`}
          style={styles.navBar}
        >
          <NavBar light back="close" onBack={this.onBack} />
        </ScreenTransition>
      </View>
    );
  }

  onBack = () => {
    const { hero, gradientOverlay } = this.props;
    const sharedElements = {
      [`heroBackground.${hero.id}`]: "move",
      [`heroPhoto.${hero.id}`]: "move"
    };
    if (gradientOverlay) {
      sharedElements[`heroGradientOverlay.${hero.id}`] = "fade";
    }
    sharedElements[`heroCloseButton.${hero.id}`] = "fade";
    sharedElements[`heroName.${hero.id}`] = "move";
    sharedElements[`heroDescription.${hero.id}`] = "fade-top";
    Router.pop({
      sharedElements,
      transitionConfig: fadeIn()
    });
  };
}
