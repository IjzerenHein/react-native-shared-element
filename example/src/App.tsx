import * as React from "react";
import { StatusBar, View, Platform } from "react-native";

import { Router } from "./components";
import { MainScreen } from "./screens";

if (Platform.OS === "android") {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");
}

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 0, transform: [{ translateY: 0 }] }}>
        <Router initialNode={<MainScreen />} />
      </View>
    );
  }
}
