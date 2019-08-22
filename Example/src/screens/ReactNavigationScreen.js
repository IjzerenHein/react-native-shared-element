// @flow
import * as React from "react";
import {
  createSharedElementRenderer,
  createSharedElementScene
} from "react-navigation-sharedelement";
import { createAppContainer } from "@react-navigation/native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { MainScreen } from "./MainScreen";
import { DummyScreen } from "./DummyScreen";
import { TilesScreen } from "./TilesScreen";
import { DetailScreen } from "./DetailScreen";
import { PagerScreen } from "./PagerScreen";
import { CardScreen } from "./CardScreen";
import { TestsScreen } from "./TestsScreen";
import { TestScreen } from "./TestScreen";

const screens = {
  Tiles: createSharedElementScene(TilesScreen),
  Detail: createSharedElementScene(DetailScreen),
  Pager: createSharedElementScene(PagerScreen),
  Card: createSharedElementScene(CardScreen),
  Tests: TestsScreen,
  Test: createSharedElementScene(TestScreen)
};

const stackNavigator = createStackNavigator(
  {
    Stack: createSharedElementScene(MainScreen),
    ...screens
  },
  {
    initialRouteName: "Stack"
  }
);

const modalNavigator = createStackNavigator(
  {
    Modal: createSharedElementScene(MainScreen),
    ...screens
  },
  {
    initialRouteName: "Modal",
    mode: "modal"
  }
);

export const tabNavigator = createBottomTabNavigator({
  stack: stackNavigator,
  modal: modalNavigator
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
