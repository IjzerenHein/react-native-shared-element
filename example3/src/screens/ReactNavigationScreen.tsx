import { createAppContainer } from "@react-navigation/native";
import * as React from "react";
import { View, Platform } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import { Icon } from "../components";
import { fadeIn, fromRight } from "../transitions";
import { CardScreen } from "./CardScreen";
import { DetailScreen } from "./DetailScreen";
import { MainScreen } from "./MainScreen";
// import { DummyScreen } from "./DummyScreen";
import { PagerScreen } from "./PagerScreen";
import { TestScreen } from "./TestScreen";
import { TestsScreen } from "./TestsScreen";
import { TilesScreen } from "./TilesScreen";

const screens = {
  Tiles: TilesScreen,
  Detail: DetailScreen,
  Pager: PagerScreen,
  Card: CardScreen,
  Tests: TestsScreen,
  Test: TestScreen
};

function isTabBarVisible(navigation: any): boolean {
  const currentRoute =
    navigation.state.routes[navigation.state.routes.length - 1];
  switch (currentRoute.routeName) {
    case "Card":
    case "Detail":
    case "Pager":
      return false;
    default:
      return true;
  }
}

const stackNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    Stack: MainScreen,
    ...screens
  },
  {
    initialRouteName: "Stack",
    //transitionConfig: () => fadeIn(5000),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Stack",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="login" size={18} color={tintColor} />
      ),
      tabBarVisible: isTabBarVisible(navigation)
    }),
    transitionConfig: Platform.OS === "android" ? () => fromRight() : undefined
  }
);

const modalNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    Modal: MainScreen,
    ...screens
  },
  {
    initialRouteName: "Modal",
    mode: "modal",
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Modal",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="popup" size={18} color={tintColor} />
      ),
      tabBarVisible: isTabBarVisible(navigation)
    })
  }
);

const fadeNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    Fade: MainScreen,
    ...screens
  },
  {
    initialRouteName: "Fade",
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Fade",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="moon" size={18} color={tintColor} />
      ),
      tabBarVisible: isTabBarVisible(navigation)
    }),
    transitionConfig: () => fadeIn(0, true)
  }
);

export const tabNavigator = createBottomTabNavigator({
  stack: stackNavigator,
  modal: modalNavigator,
  fade: fadeNavigator
});

const AppContainer = createAppContainer(tabNavigator);

export class ReactNavigationScreen extends React.Component {
  render() {
    return (
      <View
        style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <AppContainer />
      </View>
    );
  }
}
