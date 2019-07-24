// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";
import { Router, NavBar, ListItem, Colors } from "../components";
import { TestScreen } from "./TestScreen";
import type { Test, TestGroup } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: Platform.select({
    ios: {
      flex: 1,
      backgroundColor: Colors.empty
    },
    android: {
      flex: 1
    }
  })
});

type PropsType = {
  tests: (Test | TestGroup)[],
  title?: string,
  description?: string
};

export class TestsScreen extends React.Component<PropsType> {
  render() {
    const { tests, title, description } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title || "Tests"} zIndex={100} />
        <ScrollView style={styles.content} endFillColor={Colors.empty}>
          {tests.map((test, index) => (
            <ListItem
              key={`item${index}`}
              label={test.name}
              onPress={() =>
                Router.push(
                  test.tests ? (
                    // $FlowFixMe
                    <TestsScreen
                      tests={test.tests}
                      title={test.name}
                      description={test.description}
                    />
                  ) : (
                    <TestScreen test={test} description={description || ""} />
                  )
                )
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
