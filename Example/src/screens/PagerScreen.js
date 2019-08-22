// @flow
import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Platform
} from "react-native";
import { NavBar, SharedElement, Colors, Router } from "../components";
import type { Hero } from "../types";
import { Heroes } from "../assets";
import { fadeIn } from "../transitions";
import {
  PanGestureHandler,
  State,
  FlatList,
  createNativeWrapper
} from "react-native-gesture-handler";
import ViewPager from "@react-native-community/viewpager";

const RNGHViewPager = createNativeWrapper(ViewPager, {
  disallowInterruption: true
});

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.dark
  },
  flex: {
    flex: 1
  },
  content: {
    flex: 1,
    marginVertical: NavBar.HEIGHT
  },
  itemContainer: {
    width: WIDTH
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain"
  }
});

type PropsType = {
  hero: Hero,
  navigation: any
};
type StateType = {
  selectedHero: Hero
};

const VIEWABILITY_CONFIG = {
  minimumViewTime: 0,
  viewAreaCoveragePercentThreshold: 51
};

export class PagerScreen extends React.Component<PropsType, StateType> {
  static navigationOptions = {
    header: null
  };

  _dismissAnimValue = new Animated.Value(0);
  _onDismissGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this._dismissAnimValue } }],
    { useNativeDriver: true }
  );

  constructor(props: PropsType) {
    super(props);
    const hero = props.navigation
      ? props.navigation.getParam("hero")
      : props.hero;
    this.state = {
      selectedHero: hero
    };
  }

  renderPager(items: Hero[], initialIndex: number) {
    if (Platform.OS === "android") {
      return (
        <RNGHViewPager
          style={styles.flex}
          initialPage={initialIndex}
          onPageSelected={this.onPageSelected}
        >
          {items.map((item, index) =>
            this.renderItem({
              item,
              index
            })
          )}
        </RNGHViewPager>
      );
    } else {
      return (
        <FlatList
          style={styles.flex}
          horizontal
          pagingEnabled
          data={Heroes}
          initialScrollIndex={initialIndex}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          keyExtractor={this.keyExtractor}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
        />
      );
    }
  }

  render() {
    const { navigation } = this.props;
    const hero = navigation ? navigation.getParam("hero") : this.props.hero;
    const { selectedHero } = this.state;
    const dismissAnimValue = this._dismissAnimValue;
    const initialIndex = Heroes.findIndex(({ id }) => id === hero.id);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" animated />
        <Animated.View
          style={[
            styles.background,
            {
              opacity: dismissAnimValue.interpolate({
                inputRange: [-400, -300, -50, 50, 300, 400],
                outputRange: [0.6, 0.6, 1, 1, 0.6, 0.6]
              })
            }
          ]}
        >
          <NavBar
            back="close"
            light
            title={selectedHero.name}
            onBack={this.onBack}
          />
        </Animated.View>
        <PanGestureHandler
          onGestureEvent={this._onDismissGestureEvent}
          onHandlerStateChange={this._onDismissGestureStateChange}
        >
          <Animated.View
            style={[
              styles.content,
              {
                transform: [
                  { translateY: Animated.multiply(dismissAnimValue, 0.5) }
                ]
              }
            ]}
          >
            {this.renderPager(Heroes, initialIndex)}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  getItemLayout = (item: any, index: number) => ({
    length: WIDTH,
    offset: WIDTH * index,
    index
  });

  renderItem = ({ item }: any) => {
    const hero = item;
    const { id, photo } = hero;
    return (
      <View style={styles.itemContainer} key={`item.${item.id}`}>
        <SharedElement
          id={`heroPhoto.${id}`}
          style={styles.flex}
          navigation={this.props.navigation}
        >
          <Image style={styles.image} source={photo} />
        </SharedElement>
      </View>
    );
  };

  onViewableItemsChanged = (event: any) => {
    const { viewableItems } = event;
    if (!viewableItems.length) return;
    const selectedHero = viewableItems[0].item;
    if (this.state.selectedHero !== selectedHero) {
      this.setState({
        selectedHero
      });
    }
  };

  onPageSelected = ({ nativeEvent }: any) => {
    const selectedHero = Heroes[nativeEvent.position];
    if (this.state.selectedHero !== selectedHero) {
      this.setState({
        selectedHero
      });
    }
  };

  onBack = () => {
    const { navigation } = this.props;
    const hero = this.state.selectedHero;
    const sharedElements = {
      [`heroPhoto.${hero.id}`]: "move"
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

  _onDismissGestureStateChange = (event: any) => {
    const { nativeEvent } = event;
    if (nativeEvent.state !== State.END) {
      return;
    }
    if (Math.abs(nativeEvent.translationY) >= 300) {
      this.onBack();
    } else {
      Animated.spring(this._dismissAnimValue, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    }
  };
}
