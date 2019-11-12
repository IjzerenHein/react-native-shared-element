// @flow
import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import {
  NavBar,
  SharedElement,
  Colors,
  Router,
  Heading1,
  Body,
} from '../components';
import type {Hero, SharedElementsConfig} from '../types';
import {fadeIn} from '../transitions';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  name: {
    alignSelf: 'flex-start',
  },
  description: {
    marginTop: 4,
  },
  bottom: {
    height: 1,
    backgroundColor: Colors.back,
  },
});

type Type = 'tile' | 'card' | 'card2' | 'avatar';

type PropsType = {
  hero: Hero,
  type: Type,
  navigation?: any,
};
type StateType = {
  contentHeight: number,
  scrollOffset: Animated.Value,
  scrollEvent: any,
  width: number,
  height: number,
};

export class CardScreen extends React.Component<PropsType, StateType> {
  static navigationOptions = {
    header: null,
  };

  static getSharedElements(
    hero: Hero,
    type: Type,
    showing: boolean
  ): ?SharedElementsConfig {
    switch (type) {
      case 'tile':
        return [`heroPhoto.${hero.id}`];
      case 'avatar':
        return [
          {
            id: `heroBackground.${hero.id}`,
            otherId: `heroPhoto.${hero.id}`,
            animation: showing ? 'fade-in' : 'fade-out',
          },
          `heroPhoto.${hero.id}`,
          {
            id: `heroName.${hero.id}`,
            otherId: `heroPhoto.${hero.id}`,
            animation: showing ? 'fade-in' : 'fade-out',
          },
          {
            id: `heroDescription.${hero.id}`,
            otherId: `heroPhoto.${hero.id}`,
            animation: showing ? 'fade-in' : 'fade-out',
          },
          {id: `heroCloseButton.${hero.id}`, animation: 'fade'},
        ];
      case 'card':
        return [
          `heroBackground.${hero.id}`,
          `heroPhoto.${hero.id}`,
          {id: `heroCloseButton.${hero.id}`, animation: 'fade'},
          `heroName.${hero.id}`,
          {
            id: `heroDescription.${hero.id}`,
            animation: 'fade',
            resize: 'clip',
            align: 'left-top',
          },
        ];
      case 'card2':
        return [
          `heroBackground.${hero.id}`,
          `heroPhoto.${hero.id}`,
          {id: `heroGradientOverlay.${hero.id}`, animation: 'fade'},
          {id: `heroCloseButton.${hero.id}`, animation: 'fade'},
          {id: `heroName.${hero.id}`, animation: 'fade'},
          {
            id: `heroDescription.${hero.id}`,
            animation: 'fade',
            resize: 'clip',
            align: 'left-top',
          },
        ];
    }
  }

  static sharedElements = (
    navigation: any,
    otherNavigation: any,
    showing: boolean
  ): ?SharedElementsConfig => {
    const type = navigation.getParam('type') || 'card2';
    const hero = navigation.getParam('hero');
    return CardScreen.getSharedElements(hero, type, showing);
  };

  constructor(props: PropsType) {
    super(props);
    const scrollOffset = new Animated.Value(0);
    this.state = {
      scrollOffset,
      scrollEvent: Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollOffset}}}],
        {
          useNativeDriver: true,
        }
      ),
      contentHeight: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  render() {
    const {
      scrollOffset,
      scrollEvent,
      contentHeight,
      height,
      width,
    } = this.state;
    const {navigation} = this.props;
    const hero = navigation ? navigation.getParam('hero') : this.props.hero;
    const type = navigation ? navigation.getParam('type') : this.props.type;
    const gradientOverlay = type === 'card2';
    const {id, name, photo, description} = hero;
    const imageHeight = width * 0.75;
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="light-content" animated />
        <Animated.ScrollView
          style={styles.flex}
          scrollEventThrottle={16}
          onScroll={scrollEvent}>
          <View style={{minHeight: height}}>
            <SharedElement
              id={`heroBackground.${id}`}
              style={StyleSheet.absoluteFill}
              navigation={navigation}>
              <View style={styles.background} />
            </SharedElement>
            <Animated.View
              style={
                Platform.OS === 'ios'
                  ? {
                      transform: [
                        {
                          translateY: scrollOffset.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [-1, 0, 0],
                          }),
                        },
                        {
                          scale: scrollOffset.interpolate({
                            inputRange: [imageHeight / -2, 0, 1],
                            outputRange: [2, 1, 1],
                          }),
                        },
                      ],
                    }
                  : undefined
              }>
              <SharedElement id={`heroPhoto.${id}`} navigation={navigation}>
                <Image
                  style={[styles.image, {height: imageHeight}]}
                  source={photo}
                />
              </SharedElement>
              {gradientOverlay ? (
                <SharedElement
                  id={`heroGradientOverlay.${hero.id}`}
                  style={StyleSheet.absoluteFill}
                  navigation={navigation}>
                  <View style={StyleSheet.absoluteFill} collapsable={false} />
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
                navigation={navigation}>
                <Heading1>{name}</Heading1>
              </SharedElement>
              {description ? (
                <SharedElement
                  id={`heroDescription.${id}`}
                  style={styles.description}
                  navigation={navigation}>
                  <Body>{description}</Body>
                </SharedElement>
              ) : (
                undefined
              )}
            </View>
          </View>
          {Platform.OS === 'ios' ? (
            <Animated.View
              style={[
                styles.bottom,
                {
                  transform: [
                    {
                      translateY: scrollOffset.interpolate({
                        inputRange: [
                          0,
                          Math.max(imageHeight + contentHeight - height, 0),
                          Math.max(imageHeight + contentHeight - height, 0) + 1,
                        ],
                        outputRange: [0, 0, 0.5],
                      }),
                    },
                    {
                      scaleY: scrollOffset.interpolate({
                        inputRange: [
                          0,
                          Math.max(imageHeight + contentHeight - height, 0),
                          Math.max(imageHeight + contentHeight - height, 0) + 1,
                        ],
                        outputRange: [0, 1, 2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ) : (
            undefined
          )}
        </Animated.ScrollView>
        <SharedElement
          id={`heroCloseButton.${id}`}
          style={styles.navBar}
          navigation={navigation}>
          <NavBar light back="close" onBack={this.onBack} />
        </SharedElement>
      </View>
    );
  }

  onLayout = (event: any) => {
    const {width, height} = event.nativeEvent.layout;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height,
      });
    }
  };

  onLayoutContent = (event: any) => {
    const {height} = event.nativeEvent.layout;
    if (this.state.contentHeight !== height) {
      this.setState({contentHeight: height});
    }
  };

  onBack = () => {
    const {navigation} = this.props;
    const hero = navigation ? navigation.getParam('hero') : this.props.hero;
    const type = navigation ? navigation.getParam('type') : this.props.type;
    if (navigation) {
      navigation.goBack();
    } else {
      Router.pop({
        sharedElements: CardScreen.getSharedElements(hero, type, false) || [],
        transitionConfig: fadeIn(),
      });
    }
  };
}
