// @flow
import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Heading2 } from "./Text";
import { Router } from "./Router";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 86,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 32,
    paddingBottom: 12
  },
  backContainer: {
    position: "absolute",
    left: 24,
    bottom: 16
  }
});

export interface NavBarProps {
  title: string;
  back: "default" | "none" | "close";
}

const HIT_SLOP = {
  left: 16,
  top: 16,
  right: 16,
  bottom: 16
};

export class NavBar extends React.Component<NavBarProps> {
  static defaultProps = {
    back: "default"
  };

  renderBack() {
    let label;
    switch (this.props.back) {
      case "none":
        return;
      case "default":
        label = "<";
        break;
      case "close":
        label = "X";
        break;
    }
    return (
      <TouchableOpacity
        style={styles.backContainer}
        onPress={this.onPressBack}
        hitSlop={HIT_SLOP}
      >
        <View>
          <Heading2>{label}</Heading2>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <Heading2>{title}</Heading2>
        {this.renderBack()}
      </View>
    );
  }

  onPressBack = () => {
    Router.pop();
  };
}
