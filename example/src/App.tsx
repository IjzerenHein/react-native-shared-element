import * as React from "react";
import { StatusBar, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Router } from "./components";
import { SafeAreaProvider } from "./libs/react-native-safe-area-context";
import { MainScreen } from "./screens";

// Set this variable to true to test the statusbar offset on
// Android. This creates an additional translation and is a
// good scenario to test and support.
const TEST_ANDROID_STATUSBAR_OFFSET = false;

if (Platform.OS === "android") {
  StatusBar.setTranslucent(!TEST_ANDROID_STATUSBAR_OFFSET);
  StatusBar.setBackgroundColor("transparent");
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, marginTop: 0, transform: [{ translateY: 0 }] }}>
          <Router initialNode={<MainScreen />} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
