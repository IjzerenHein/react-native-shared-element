import * as React from "react";
import { StatusBar, View, Platform } from "react-native";

import { Router, ListItem } from "./components";
import { MainScreen } from "./screens";
//import { ReactNavigationScreen } from "./screens/ReactNavigationScreen";

if (Platform.OS === "android") {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");
}

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 0, transform: [{ translateY: 0 }] }}>
        <Router
          initialNode={
            <MainScreen
            /*footer={
              <ListItem
                label="React Navigation"
                description="React Navigation Demo"
                onPress={() => Router.push(<ReactNavigationScreen />)}
              />
            }*/
            />
          }
        />
      </View>
    );
  }
}
