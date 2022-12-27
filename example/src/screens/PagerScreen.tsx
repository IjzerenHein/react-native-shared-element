import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

import { Heroes } from "../assets";
import {
  NavBar,
  SharedElement,
  Colors,
  Router,
  ViewPager,
  useNavBarHeight,
} from "../components";
import { fadeIn } from "../transitions";
import { Hero, SharedElementsConfig } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.dark,
  },
  flex: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
});

type Props = {
  hero: Hero;
  navigation: any;
};

export function PagerScreen(props: Props) {
  const { navigation } = props;
  const initialHero = navigation?.getParam("hero") ?? props.hero;
  const initialIndex = Heroes.findIndex(({ id }) => id === initialHero.id);
  const [hero, setHero] = useState(() => initialHero);

  const [dismissAnimValue] = useState(() => new Animated.Value(0));
  const [onDismissGestureEvent] = useState(() =>
    Animated.event([{ nativeEvent: { translationY: dismissAnimValue } }], {
      useNativeDriver: true,
    })
  );

  const [width, setWidth] = useState(() => Dimensions.get("window").width);
  const navBarHeight = useNavBarHeight();

  const onLayout = useCallback(
    (event: any) => setWidth(event.nativeEvent.layout.width),
    [setWidth]
  );

  const onBack = useCallback(() => {
    if (navigation) {
      navigation.goBack();
    } else {
      Router.pop({
        sharedElements: [`heroPhoto.${hero.id}`],
        transitionConfig: fadeIn(),
      });
    }
  }, [navigation, hero]);

  const onDismissGestureStateChange = useCallback(
    (event: any) => {
      const { nativeEvent } = event;
      if (nativeEvent.state !== State.END) {
        return;
      }
      if (Math.abs(nativeEvent.translationY) >= 300) {
        onBack();
      } else {
        Animated.spring(dismissAnimValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
    [dismissAnimValue, onBack]
  );

  const getItemLayout = useCallback(
    (item: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width]
  );

  const renderItem = useCallback(
    ({ item }: any) => {
      const hero = item;
      const { id, photo } = hero;
      return (
        <View style={{ width }} key={`item.${item.id}`}>
          <SharedElement
            id={`heroPhoto.${id}`}
            style={styles.flex}
            navigation={navigation}
          >
            <Image style={styles.image} source={photo} />
          </SharedElement>
        </View>
      );
    },
    [width, navigation]
  );

  const onItemSelected = useCallback(
    (index: number) => {
      const newHero = Heroes[index];
      if (newHero === hero) return;
      setHero(newHero);
      if (navigation) navigation.setParams({ hero: newHero });
    },
    [navigation, hero, setHero]
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar barStyle="light-content" animated />
      <Animated.View
        style={[
          styles.background,
          {
            opacity: dismissAnimValue.interpolate({
              inputRange: [-400, -300, -50, 50, 300, 400],
              outputRange: [0.6, 0.6, 1, 1, 0.6, 0.6],
            }),
          },
        ]}
      >
        <NavBar back="close" light title={hero.name} onBack={onBack} />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={onDismissGestureEvent}
        onHandlerStateChange={onDismissGestureStateChange}
      >
        <Animated.View
          style={[
            styles.flex,
            {
              marginVertical: navBarHeight,
              transform: [
                { translateY: Animated.multiply(dismissAnimValue, 0.5) },
              ],
            },
          ]}
        >
          <ViewPager
            style={styles.flex}
            data={Heroes}
            initialItemIndex={initialIndex}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            onItemSelected={onItemSelected}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

PagerScreen.sharedElements = (
  navigation: any,
  otherNavigation: any,
  showing: boolean
): SharedElementsConfig | void => {
  const hero = navigation.getParam("hero");
  return [`heroPhoto.${hero.id}`];
};
