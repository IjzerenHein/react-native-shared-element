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
    flex: 1,
    backgroundColor: Colors.empty
  },
  content: {
    flex: 1
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
            description="Card reveal shared element transitions"
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
            label='Gradient "scrim" Demo'
            description='Image with gradient overlay "scrim" for better readability'
            onPress={() =>
              Router.push(
                <TilesScreen
                  type="card2"
                  title='Gradient "scrim" Demo'
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
