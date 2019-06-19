// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem } from "../components";
import { TilesScreen } from "./TilesScreen";
import { RNPhotoViewScreen } from "./RNPhotoViewScreen";
import { RNImagePanZoomScreen } from "./RNImagePanZoomScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1
  }
});

export class MainScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <NavBar title="Shared Element Demo" back="none" />
        <ScrollView style={styles.content}>
          <ListItem
            label="Image Move"
            onPress={() =>
              Router.push(<TilesScreen title="Image Move" animation="move" />)
            }
          />
          <ListItem
            label="Image Dissolve"
            onPress={() =>
              Router.push(
                <TilesScreen title="Image Dissolve" animation="dissolve" />
              )
            }
          />
          <ListItem label="react-native-fast-image (TODO)" />
          <ListItem
            label="react-native-photo-view"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="react-native-photo-view"
                  DetailComponent={RNPhotoViewScreen}
                />
              )
            }
          />
          <ListItem
            label="react-native-image-pan-zoom"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="react-native-image-pan-zoom"
                  DetailComponent={RNImagePanZoomScreen}
                />
              )
            }
          />
        </ScrollView>
      </View>
    );
  }
}
