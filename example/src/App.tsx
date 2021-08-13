import * as React from "react";
import { StatusBar, View, Platform } from "react-native";

import { Router } from "./components";
import { MainScreen } from "./screens";

// Use non-translucent status-bar on Android on purpose.
// This creates an additional translation and is a good
// scenario to test and support.
if (Platform.OS === "android") {
  StatusBar.setTranslucent(false);
  // StatusBar.setBackgroundColor("transparent");
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
