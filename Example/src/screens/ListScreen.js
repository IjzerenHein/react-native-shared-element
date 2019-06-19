// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Router, NavBar, ListItem } from "../components";
import { Heroes } from "../assets";
import { DetailScreen } from "./DetailScreen";
import type { Hero } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1
  }
});

export class ListScreen extends React.Component<{}> {
  renderItem(hero: Hero) {
    const { id, name, photo } = hero;
    return (
      <ListItem
        key={`hero${id}`}
        label={name}
        image={photo}
        imageSharedId={`heroPhoto.${id}`}
        data={hero}
        onPress={this.onPressItem}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title="List" back="none" />
        <ScrollView style={styles.content}>
          {Heroes.map(hero => this.renderItem(hero))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (hero: Hero) => {
    Router.push(<DetailScreen hero={hero} />, {
      sharedElements: {
        [`heroPhoto.${hero.id}`]: true
      }
    });
  };
}
