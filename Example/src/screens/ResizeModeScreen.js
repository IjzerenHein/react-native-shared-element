// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TilesScreen } from "./TilesScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    flex: 1
  }
});

export class ResizeModeScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <NavBar title="Images Resize-modes" />
        <ScrollView style={styles.content}>
          <ListItem
            label="Image ResizeMode Cover"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image ResizeMode Cover"
                  animation="move"
                  resizeMode="cover"
                />
              )
            }
          />
          <ListItem
            label="Image ResizeMode Contain"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image ResizeMode Contain"
                  animation="move"
                  resizeMode="contain"
                />
              )
            }
          />
          <ListItem
            label="Image ResizeMode Stretch"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image esizeMode Stretch"
                  animation="move"
                  resizeMode="stretch"
                />
              )
            }
          />
          <ListItem
            label="Image ResizeMode Center"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image ResizeMode Center"
                  animation="move"
                  resizeMode="center"
                />
              )
            }
          />
          <ListItem
            label="Image ResizeMode Repeat"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image ResizeMode Repeat"
                  animation="move"
                  resizeMode="center"
                />
              )
            }
          />
        </ScrollView>
      </View>
    );
  }
}
