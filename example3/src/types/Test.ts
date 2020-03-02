import {
  SharedElementAnimation,
  SharedElementResize,
  SharedElementAlign
} from "expo-shared-element";
import * as React from "react";

export type Position =
  | "default"
  | "left"
  | "top"
  | "right"
  | "bottom"
  | "center";
export type Size = "default" | "small" | "regular" | "large" | "max";
export type ResizeMode = "cover" | "contain" | "stretch" | "center";

export interface Test {
  name: string;
  description?: string;
  start: React.ReactNode;
  end: React.ReactNode;
  animation?: SharedElementAnimation;
  resize?: SharedElementResize;
  align?: SharedElementAlign;
  multi?: boolean;
}

export interface TestGroup {
  name: string;
  tests: (Test | TestGroup)[];
  description?: string;
}
