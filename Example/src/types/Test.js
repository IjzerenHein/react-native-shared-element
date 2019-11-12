// @flow
import * as React from 'react';
import type {
  SharedElementAnimation,
  SharedElementResize,
  SharedElementAlign,
} from 'react-native-shared-element';

export type Position =
  | 'default'
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'center';
export type Size = 'default' | 'small' | 'regular' | 'large' | 'max';
export type ResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

export type Test = {|
  name: string,
  description?: string,
  start: React.Element<any>,
  end: React.Element<any>,
  animation?: SharedElementAnimation,
  resize?: SharedElementResize,
  align?: SharedElementAlign,
  multi?: boolean,
|};

export type TestGroup = {|
  name: string,
  tests: Array<Test | TestGroup>,
  description?: string,
|};
