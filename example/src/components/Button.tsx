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

type Props = {
  label: string;
  onPress?: () => void;
  style: any;
};

export function Button(props: Props) {
  const { label, onPress, style } = props;
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
