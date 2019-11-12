// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {TestCompoundView} from '../compound/TestCompoundView';

export const MultipleTests: TestGroup = {
  name: 'Multiple & Overlays',
  description:
    'Components with multiple children can be animated separately or as a whole',
  tests: [
    {
      name: 'Move multiple',
      start: <TestCompoundView position="top" />,
      end: <TestCompoundView position="bottom" />,
      multi: true,
    },
    {
      name: 'Move & scale multiple',
      start: <TestCompoundView position="top" />,
      end: <TestCompoundView position="bottom" size="large" />,
      multi: true,
    },
    {
      name: 'Gradient overlay',
      start: <TestCompoundView size="regular" position="center" />,
      end: <TestCompoundView size="max" />,
      multi: true,
    },
  ],
};
