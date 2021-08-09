import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Shadows, Colors } from "./Colors";
import { Text } from "./Text";

const HEIGHT = 44;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.elevation1,
  },
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
          <Text large color="white">
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
