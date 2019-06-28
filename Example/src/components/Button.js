// @flow
import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Heading2 } from "./Text";
import { Shadows, Colors } from "./Colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.elevation1
  },
  label: {
    color: "white"
  }
});

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  style: any;
}

export class Button extends React.Component<ButtonProps> {
  render() {
    const { label, onPress, style } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!onPress}
        onPress={onPress}
        style={style}
      >
        <View style={[styles.container]}>
          <Heading2 style={styles.label}>{label}</Heading2>
        </View>
      </TouchableOpacity>
    );
  }
}
