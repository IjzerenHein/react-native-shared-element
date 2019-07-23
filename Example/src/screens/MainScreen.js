// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View, StatusBar } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TilesScreen } from "./TilesScreen";
import { TestsScreen } from "./TestsScreen";
import { PagerScreen } from "./PagerScreen";
import { CardScreen } from "./CardScreen";
import { Tests } from "../tests";
import { fadeIn } from "../transitions";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: Colors.empty
  }
});

export class MainScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" animated />
        <NavBar title="Shared Element Demo" back="none" />
        <ScrollView style={styles.content}>
          <ListItem
            label="Test Cases"
            description="Test cases for development and diagnosing problems"
            onPress={() => Router.push(<TestsScreen tests={Tests} />)}
          />
          <ListItem
            label="Tiles Demo"
            description="Image tiles that zoom-in and then allow gestures to paginate and dismiss"
            onPress={() =>
              Router.push(
                <TilesScreen
                  type="tile"
                  title="Tiles Demo"
                  DetailComponent={PagerScreen}
                />
              )
            }
          />
          <ListItem
            label="Card Demo"
            description="Card reveal with shared element transitions"
            onPress={() =>
              Router.push(
                <TilesScreen
                  type="card"
                  title="Cards Demo"
                  DetailComponent={CardScreen}
                />
              )
            }
          />
          <ListItem
            label="Card Demo 2"
            description="Heavier card demo with fading gradient overlay and cross-fading texts"
            onPress={() =>
              Router.push(
                <TilesScreen
                  type="card2"
                  title="Card Demo 2"
                  transitionConfig={fadeIn(0, true)}
                  DetailComponent={CardScreen}
                />
              )
            }
          />
          {/*<ListItem
            label="Image & Text"
            onPress={() => Router.push(<ListScreen title="Image & Text" />)}
          />*/}
          {/*<ListItem
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
          />*/}
        </ScrollView>
      </View>
    );
  }
}
