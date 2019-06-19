// @flow
import * as React from "react";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  heading1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black"
  },
  heading2: {
    fontSize: 19,
    fontWeight: "bold",
    color: "black"
  },
  light: {
    color: "white"
  }
});

export const Heading1 = (props: any) => (
  <Text
    {...props}
    style={[
      styles.heading1,
      props.light ? styles.light : undefined,
      props.style
    ]}
  />
);
export const Heading2 = (props: any) => (
  <Text
    {...props}
    style={[
      styles.heading2,
      props.light ? styles.light : undefined,
      props.style
    ]}
  />
);
