import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow,
  },
});

export function DummyScreen() {
  return <View style={styles.container} />;
}
