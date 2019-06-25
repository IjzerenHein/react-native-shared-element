// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import {
  Heading1,
  NavBar,
  ScreenTransition,
  Colors,
  Button,
  Body,
  Router
} from "../components";
import type { Test } from "../types";
import { fadeIn } from "react-navigation-transitions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
  },
  bottomContainer: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.navBar,
    padding: 20
  },
  buttonContainer: {
    flexDirection: "row"
  },
  button: {
    flex: 2,
    marginRight: 10
  },
  debugButton: {
    flex: 1,
    marginLeft: 10
  },
  body: {
    marginTop: 20
  }
});

interface PropsType {
  test: Test;
  end?: boolean;
}

export class TestScreen extends React.Component<PropsType> {
  render() {
    const { test, end } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={test.name} />
        {end ? test.end : test.start}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              label={"Fast"}
              onPress={this.onPressButton}
            />
            <Button
              style={styles.debugButton}
              label={"Slow"}
              onPress={this.onPressDebugButton}
            />
          </View>
          <Body style={styles.body}>{test.description}</Body>
        </View>
      </View>
    );
  }

  onPressButton = () => {
    this.transition(false);
  };

  onPressDebugButton = () => {
    this.transition(true);
  };

  transition(debug: boolean) {
    const { test, end } = this.props;
    const transitionConfig = fadeIn();
    if (debug) {
      transitionConfig.debug = true;
      transitionConfig.transitionSpec.duration = 8000;
    }
    const config = {
      transitionConfig,
      sharedElements: {
        testContent: test.animation || "move"
      }
    };
    if (end) {
      // $FlowFixMe
      Router.pop(config);
    } else {
      Router.push(<TestScreen test={test} end />, config);
    }
  }
}
