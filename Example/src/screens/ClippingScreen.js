// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { ClipScreen } from "./ClipScreen";
import { Heroes } from "../assets";
import { fadeIn } from "react-navigation-transitions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  content: {
    flex: 1
  }
});

const Clip = {
  top: {
    position: "top",
    top: 100
  },
  bottom: {
    position: "bottom",
    bottom: 100
  },
  left: {
    position: "left",
    left: 100
  },
  right: {
    position: "right",
    right: 100
  }
};

const Position = {
  top: {
    position: "top"
  },
  bottom: {
    position: "bottom"
  },
  left: {
    position: "left"
  },
  right: {
    position: "right"
  }
};

const ClipScreens = [
  { title: "Clipped Top -> Bottom", start: Clip.top, end: Position.bottom },
  { title: "Clipped Bottom -> Top", start: Clip.bottom, end: Position.top },
  { title: "Clipped Left -> Right", start: Clip.left, end: Position.right },
  { title: "Clipped Right -> Left", start: Clip.right, end: Position.left }
];

export class ClippingScreen extends React.Component<{}> {
  render() {
    const hero = Heroes[0];
    return (
      <View style={styles.container}>
        <NavBar title="Clipping" />
        <ScrollView style={styles.content}>
          {ClipScreens.map((item, index) => (
            <ListItem
              key={`item${index}`}
              label={item.title}
              onPress={() =>
                Router.push(
                  <ClipScreen
                    hero={hero}
                    title={item.title}
                    {...item.start}
                    onPress={() => {
                      Router.push(
                        <ClipScreen
                          hero={hero}
                          title={item.title}
                          {...item.end}
                        />,
                        {
                          transitionConfig: fadeIn(),
                          sharedElements: {
                            [`heroPhoto.${hero.id}`]: "move"
                          }
                        }
                      );
                    }}
                  />
                )
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
