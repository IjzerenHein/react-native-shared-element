import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow
  }
});

export class DummyScreen extends React.Component {
  render() {
    return <View style={styles.container} />;
  }
}
