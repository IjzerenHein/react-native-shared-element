import * as React from "react";
import "react-native-gesture-handler";
import { StatusBar, View } from "react-native";

import { Router, ListItem } from "./components";
import { MainScreen } from "./screens";
//import { ReactNavigationScreen } from "./screens/ReactNavigationScreen";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("transparent");

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 0, transform: [{ translateY: 50 }] }}>
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
