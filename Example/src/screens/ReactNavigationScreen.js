// @flow
import * as React from "react";
import { Icon } from "../components";
import {
  createSharedElementRenderer,
  createSharedElementScene
} from "react-navigation-sharedelement";
import { createAppContainer } from "@react-navigation/native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { MainScreen } from "./MainScreen";
// import { DummyScreen } from "./DummyScreen";
import { TilesScreen } from "./TilesScreen";
import { DetailScreen } from "./DetailScreen";
import { PagerScreen } from "./PagerScreen";
import { CardScreen } from "./CardScreen";
import { TestsScreen } from "./TestsScreen";
import { TestScreen } from "./TestScreen";
import { fadeIn } from "../transitions";

const screens = {
  Tiles: createSharedElementScene(TilesScreen),
  Detail: createSharedElementScene(DetailScreen),
  Pager: createSharedElementScene(PagerScreen),
  Card: createSharedElementScene(CardScreen),
  Tests: TestsScreen,
  Test: createSharedElementScene(TestScreen)
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

const stackNavigator = createStackNavigator(
  {
    Stack: createSharedElementScene(MainScreen),
    ...screens
  },
  {
    initialRouteName: "Stack",
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Stack",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="login" size={18} color={tintColor} />
      ),
      tabBarVisible: isTabBarVisible(navigation)
    })
  }
);

const modalNavigator = createStackNavigator(
  {
    Modal: createSharedElementScene(MainScreen),
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

const fadeNavigator = createStackNavigator(
  {
    Fade: createSharedElementScene(MainScreen),
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

const AppContainer = createAppContainer(
  createSharedElementRenderer(tabNavigator)
);

type PropsType = {};

export class ReactNavigationScreen extends React.Component<PropsType> {
  render() {
    return <AppContainer />;
  }
}
