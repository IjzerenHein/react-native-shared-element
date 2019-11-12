// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {TestCompoundView} from '../compound/TestCompoundView';

export const ResizeAlignTests: TestGroup = {
  name: 'Resize & Align',
  tests: [
    {
      name: 'Stretch',
      description: 'TODO',
      start: <TestCompoundView />,
      end: <TestCompoundView end vertical />,
      animation: 'fade',
      resize: 'stretch',
    },
    {
      name: 'No resize',
      description: 'TODO',
      start: <TestCompoundView />,
      end: <TestCompoundView end vertical />,
      animation: 'fade',
      resize: 'none',
    },
  ],
};
