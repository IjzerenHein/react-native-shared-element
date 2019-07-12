// @flow
import * as React from "react";
import type { SharedElementAnimation } from "react-native-shared-element-transition";

export type Position =
  | "default"
  | "left"
  | "top"
  | "right"
  | "bottom"
  | "center";
export type Size = "default" | "small" | "regular" | "large" | "max";
export type ResizeMode = "cover" | "contain" | "stretch" | "center";

export type Test = {
  name: string,
  description?: string,
  start: React.Node,
  end: React.Node,
  animation?: SharedElementAnimation,
  multi?: boolean
};

export type TestGroup = {
  name: string,
  tests: (Test | TestGroup)[],
  description?: string
};
