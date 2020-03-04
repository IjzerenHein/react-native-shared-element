import * as React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "react-native";

import { ReactNavigationScreen } from "./screens/ReactNavigationScreen";
import { Router, ListItem } from "./components";
import { MainScreen } from "./screens";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("transparent");

export default class App extends React.Component {
  render() {
    return <Router initialNode={<MainScreen />} />;
  }
}

/*
import { ReactNavigationScreen } from "./screens/ReactNavigationScreen";
<MainScreen
            footer={
              <ListItem
                label="React Navigation"
                description="React Navigation Demo"
                onPress={() => Router.push(<ReactNavigationScreen />)}
              />
            }
          />
          */
