// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  NavBar,
  Colors,
  Button,
  Body,
  Router
} from "../components";
import { fromRight } from "../transitions";
import type { Test } from "../types";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back
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
    this.transition(Router.defaultProps.transitionConfig);
  };

  onPressSlowButton = () => {
    this.transition(
      fromRight(4000),
    );
  };

  onPressDebugButton = () => {
    this.transition({
      ...fromRight(8000),
      debug: true
    });
  };

  transition(transitionConfig: any) {
    const { test, end, description } = this.props;
    const config = test.multi ? {
      transitionConfig,
      sharedElements: {
        testImage: test.animation || "move",
        testOverlay: test.animation || "dissolve",
        testLogo: test.animation || "move",
        testTitle: test.animation || "dissolve"
      }
    } : {
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
