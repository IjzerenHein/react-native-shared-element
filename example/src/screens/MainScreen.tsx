import { useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Platform,
} from "react-native";

import { Router, NavBar, ListItem, Colors } from "../components";
import { Tests } from "../tests";
import { TestImage } from "../tests/image";
import { fadeIn, fromRight } from "../transitions";
import { Test } from "../types";
import { CardScreen } from "./CardScreen";
import { PagerScreen } from "./PagerScreen";
import { TestScreen } from "./TestScreen";
import { TestsScreen } from "./TestsScreen";
import { TilesScreen } from "./TilesScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: Platform.select({
    ios: {
      flex: 1,
      backgroundColor: Colors.empty,
    },
    default: {
      flex: 1,
    },
  }),
  back: {
    color: Colors.blue,
    marginLeft: 20,
  },
});

type Props = {
  navigation?: any;
  footer?: any;
};

export function MainScreen(props: Props) {
  const { footer, navigation } = props;

  const navigate = useCallback(
    (routeName: string, routeProps: any, element: any) => {
      if (navigation) {
        navigation.push(routeName, routeProps);
      } else {
        Router.push(element);
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" animated />
      {!navigation ? (
        <NavBar title="Shared Element Demo" back="none" />
      ) : undefined}
      <ScrollView style={styles.content} endFillColor={Colors.empty}>
        {Platform.OS === "web" ? (
          <ListItem
            label="Quick Test"
            description="Immediately start the current development test"
            onPress={() => {
              const test: Test = {
                name: "Simple move",
                description:
                  "The most basic form of a shared-element transition. The image should move smoothly without flickering from the start- to the end state, and back",
                start: <TestImage />,
                end: <TestImage end />,
              };

              if (navigation) {
                navigation.push("Test", {
                  test,
                });
              } else {
                Router.push(<TestScreen test={test} />, {
                  transitionConfig: fromRight(100),
                });
              }
            }}
          />
        ) : undefined}
        <ListItem
          label="Test Cases"
          description="Test cases for development and diagnosing problems"
          onPress={() =>
            navigate("Tests", { tests: Tests }, <TestsScreen tests={Tests} />)
          }
        />
        <ListItem
          label="Tiles Demo"
          description="Image tiles that zoom-in and then allow gestures to paginate and dismiss"
          onPress={() =>
            navigate(
              "Tiles",
              { type: "tile" },
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
            navigate(
              "Tiles",
              { type: "card" },
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
            navigate(
              "Tiles",
              { type: "card2" },
              <TilesScreen
                type="card2"
                title="Cards Demo 2"
                transitionConfig={fadeIn(0, true)}
                DetailComponent={CardScreen}
              />
            )
          }
        />
        {/*<ListItem
            label="Avatar Demo"
            description="Reveal multiple elements from a single source"
           onPress={() => navigate("Tiles", { type: 'avatar'},  <TilesScreen
            type="avatar"
            title="Avatar Demo"
            transitionConfig={fadeIn(0, true)}
            DetailComponent={CardScreen}
          />)}
          />*/}
        {footer}
      </ScrollView>
    </View>
  );
}
