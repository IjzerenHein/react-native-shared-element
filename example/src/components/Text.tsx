import * as React from "react";
import { StyleSheet, Text as RawText } from "react-native";

import { Colors } from "./Colors";

export type Size = "regular" | "small" | "large" | "xlarge" | "xxlarge";

export type SizeProps = {
  size?: Size;
  small?: boolean;
  large?: boolean;
  xlarge?: boolean;
  xxlarge?: boolean;
};

export function resolveSize(props: SizeProps): Size {
  return (
    props.size ??
    (props.small
      ? "small"
      : props.large
      ? "large"
      : props.xlarge
      ? "xlarge"
      : props.xxlarge
      ? "xxlarge"
      : "regular")
  );
}

export function Text(
  props: React.ComponentProps<typeof RawText> & {
    children: string;
    small?: boolean;
    large?: boolean;
    xlarge?: boolean;
    xxlarge?: boolean;
    color?: string;
    center?: boolean;
    flex?: boolean;
    uppercase?: boolean;
    light?: boolean;
  }
) {
  const {
    color,
    children,
    small,
    large,
    xlarge,
    style,
    center,
    flex,
    uppercase,
    light,
    ...otherProps
  } = props;
  const resolvedSize = resolveSize(props);
  return (
    <RawText
      style={[
        styles[resolvedSize],
        color ? { color } : undefined,
        center ? styles.center : undefined,
        flex ? styles.flex : undefined,
        light ? styles.light : undefined,
        style,
      ]}
      {...otherProps}
    >
      {typeof children === "string" && uppercase
        ? children.toUpperCase()
        : children}
    </RawText>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  flex: {
    flex: 1,
  },
  xxlarge: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.text,
  },
  xlarge: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.text,
  },
  large: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  small: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.gray,
  },
  regular: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.gray,
  },
  light: {
    color: Colors.back,
  },
});
