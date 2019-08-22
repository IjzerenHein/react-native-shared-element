// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavBar, Colors, Button, Body, Router } from "../components";
import { fromRight } from "../transitions";
import type { Test } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.empty,
    padding: 20
  },
  buttonContainer: {
    flexDirection: "row"
  },
  button: {
    flex: 1,
    marginRight: 10
  },
  debugButton: {
    flex: 1
  },
  body: {
    marginTop: 20
  }
});

interface PropsType {
  test: Test;
  end?: boolean;
  description?: string;
  navigation?: any;
}

export class TestScreen extends React.Component<PropsType> {
  render() {
    const { navigation } = this.props;
    const test = navigation ? navigation.getParam("test") : this.props.test;
    const description = navigation
      ? navigation.getParam("description")
      : this.props.description;
    const end = navigation ? navigation.getParam("end") : this.props.end;
    return (
      <View style={styles.container}>
        {!navigation ? <NavBar title={test.name} /> : undefined}
        {React.cloneElement(end ? test.end : test.start, {
          navigation
        })}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              label={navigation ? "Animate" : "Fast"}
              onPress={this.onPressButton}
            />
            {!navigation ? (
              <Button
                style={styles.button}
                label={"Slow"}
                onPress={this.onPressSlowButton}
              />
            ) : (
              undefined
            )}
            {!navigation ? (
              <Button
                style={styles.debugButton}
                label={"Debug"}
                onPress={this.onPressDebugButton}
              />
            ) : (
              undefined
            )}
          </View>
          <Body style={styles.body}>{test.description || description}</Body>
        </View>
      </View>
    );
  }

  onPressButton = () => {
    this.transition(Router.defaultProps.transitionConfig);
  };

  onPressSlowButton = () => {
    this.transition(fromRight(4000));
  };

  onPressDebugButton = () => {
    this.transition({
      ...fromRight(8000),
      debug: true
    });
  };

  transition(transitionConfig: any) {
    const { navigation } = this.props;
    const test = navigation ? navigation.getParam("test") : this.props.test;
    const description = navigation
      ? navigation.getParam("description")
      : this.props.description;
    const end = navigation ? navigation.getParam("end") : this.props.end;
    const config = test.multi
      ? {
          transitionConfig,
          sharedElements: {
            testImage: test.animation || "move",
            testOverlay: test.animation || "fade",
            testLogo: test.animation || "move",
            testTitle: test.animation || "fade"
          }
        }
      : {
          transitionConfig,
          sharedElements: {
            testContent: test.animation || "move"
          }
        };

    if (end) {
      if (navigation) {
        // TODO elements?
        navigation.goBack();
      } else {
        // $FlowFixMe
        Router.pop(config);
      }
    } else {
      if (navigation) {
        navigation.push("Test", {
          test,
          description: description || "",
          end: true,
          sharedElements: config.sharedElements
        });
      } else {
        Router.push(
          <TestScreen test={test} end description={description || ""} />,
          config
        );
      }
    }
  }
}
