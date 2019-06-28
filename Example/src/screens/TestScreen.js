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
    flex: 1,
    marginRight: 20
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
}

export class TestScreen extends React.Component<PropsType> {
  render() {
    const { test, end, description } = this.props;
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
              style={styles.button}
              label={"Slow"}
              onPress={this.onPressSlowButton}
            />
            <Button
              style={styles.debugButton}
              label={"Debug"}
              onPress={this.onPressDebugButton}
            />
          </View>
          <Body style={styles.body}>{test.description || description}</Body>
        </View>
      </View>
    );
  }

  onPressButton = () => {
    this.transition();
  };

  onPressSlowButton = () => {
    this.transition({
      duration: 4000
    });
  };

  onPressDebugButton = () => {
    this.transition({
      duration: 8000,
      debug: true
    });
  };

  transition(cfg: any) {
    const { test, end, description } = this.props;
    const transitionConfig = fadeIn();
    if (cfg) {
      transitionConfig.debug = cfg.debug || false;
      transitionConfig.transitionSpec.duration = cfg.duration;
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
      Router.push(
        <TestScreen test={test} end description={description || ""} />,
        config
      );
    }
  }
}
