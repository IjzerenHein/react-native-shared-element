// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TilesScreen } from "./TilesScreen";
import { BlurScreen } from "./BlurScreen";
import { blurFadeIn } from "../transitions";
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
