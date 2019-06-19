// @flow
import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "./Colors";

const styles = StyleSheet.create({
  heading1: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.text
  },
  heading2: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray
  }
});

export const Heading1 = (props: any) => (
  <Text {...props} style={[styles.heading1, props.style]} />
);
export const Heading2 = (props: any) => (
  <Text {...props} style={[styles.heading2, props.style]} />
);
export const Caption = (props: any) => (
  <Text {...props} style={[styles.caption, props.style]} />
);
