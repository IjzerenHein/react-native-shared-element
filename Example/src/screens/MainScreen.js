// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TilesScreen } from "./TilesScreen";
import { RNImagePanZoomScreen } from "./RNImagePanZoomScreen";
import { BlurScreen } from "./BlurScreen";
import { GradientScreen } from "./GradientScreen";
import { blurFadeIn } from "../transitions";
import { FlatListScreen } from "./FlatListScreen";
import { ListScreen } from "./ListScreen";
import { TestsScreen } from "./TestsScreen";
import { Tests } from "../tests";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
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
            label="Tests"
            onPress={() => Router.push(<TestsScreen tests={Tests} />)}
          />
          <ListItem
            label="Image Move"
            onPress={() =>
              Router.push(<TilesScreen title="Image Move" animation="move" />)
            }
          />
          <ListItem
            label="Image & Text"
            onPress={() => Router.push(<ListScreen title="Image & Text" />)}
          />
          <ListItem
            label="Image & Blur background"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Image & Blur"
                  animation="move"
                  DetailComponent={BlurScreen}
                  transitionConfig={blurFadeIn()}
                />
              )
            }
          />
          <ListItem
            label="Gradient overlay"
            onPress={() =>
              Router.push(
                <TilesScreen
                  title="Gradient overlay"
                  DetailComponent={GradientScreen}
                  overlay
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
          <ListItem
            label="FlatList"
            onPress={() => Router.push(<FlatListScreen title="FlatList" />)}
          />
          <ListItem
            label="Inverted FlatList"
            onPress={() =>
              Router.push(<FlatListScreen title="Inverted FlatList" inverted />)
            }
          />
        </ScrollView>
      </View>
    );
  }
}
