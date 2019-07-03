// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TilesScreen } from "./TilesScreen";
import { BlurScreen } from "./BlurScreen";
import { blurFadeIn } from "../transitions";
import { TestsScreen } from "./TestsScreen";
import { PagerScreen } from "./PagerScreen";
import { Tests } from "../tests";

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
        <NavBar title="Shared Element Demo" back="none" />
        <ScrollView style={styles.content}>
          <ListItem
            label="Test Cases"
            description='Test cases for development and diagnosing problems'
            onPress={() => Router.push(<TestsScreen tests={Tests} />)}
          />
          <ListItem
            label="Image Tiles"
            description='Image tiles that zoom-in on then allow gestures to paginate and dismiss'
            onPress={() => Router.push(<TilesScreen title='Image Tiles' DetailComponent={PagerScreen} />)}
          />
          {/*<ListItem
            label="Image & Text"
            onPress={() => Router.push(<ListScreen title="Image & Text" />)}
          />*/}
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
        </ScrollView>
      </View>
    );
  }
}
