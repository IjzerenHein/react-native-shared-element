import * as React from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";

import { Router, NavBar, ListItem, Colors } from "../components";
import { getTestGroup, Test, TestGroup } from "../types";
import { TestScreen } from "./TestScreen";

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
});

type PropsType = {
  tests: (Test | TestGroup)[];
  title?: string;
  description?: string;
  navigation?: any;
};

export class TestsScreen extends React.Component<PropsType> {
  render() {
    const { title, navigation } = this.props;
    const tests: (Test | TestGroup)[] = navigation
      ? navigation.getParam("tests")
      : this.props.tests;
    return (
      <View style={styles.container}>
        {!navigation ? <NavBar title={title || "Tests"} /> : undefined}
        <ScrollView style={styles.content} endFillColor={Colors.empty}>
          {tests.map((test, index) => (
            <ListItem
              key={`item${index}`}
              label={test.name}
              onPress={() => this.onPressItem(test)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (test: Test | TestGroup) => {
    const { navigation } = this.props;
    const description = navigation
      ? navigation.getParam("description")
      : this.props.description;
    const testGroup = getTestGroup(test);
    if (navigation) {
      if (testGroup) {
        navigation.push("Tests", {
          title: test.name,
          description: test.description,
          tests: testGroup.tests,
        });
      } else {
        navigation.push("Test", {
          test,
          description: description || "",
        });
      }
    } else {
      Router.push(
        testGroup ? (
          <TestsScreen
            tests={testGroup.tests}
            title={test.name}
            description={test.description}
          />
        ) : (
          <TestScreen test={test as Test} description={description || ""} />
        )
      );
    }
  };
}
