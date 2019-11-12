// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {TestScrollView} from './TestScrollView';
import {TestImage} from '../image/TestImage';

export const ScrollViewTests: TestGroup = {
  name: 'ScrollViews & Clipping',
  description:
    'When a part of the content is initially clipped, the transition should reveal that content gradually to make for a smooth transition',
  tests: [
    {
      name: 'ScrollView',
      start: <TestScrollView size="max" />,
      end: <TestImage end position="center" />,
    },
    {
      name: 'Inverted Flatlist',
      start: <TestScrollView size="max" inverted />,
      end: <TestImage end size="max" />,
    },
    {
      name: 'Clip top  ➔  Slide down',
      start: <TestScrollView inverted />,
      end: <TestImage end position="bottom" />,
    },
    {
      name: 'Clip bottom  ➔  Slide up',
      start: <TestScrollView />,
      end: <TestImage end position="top" />,
    },
    {
      name: 'Clip left  ➔  Slide right',
      start: <TestScrollView horizontal inverted />,
      end: <TestImage end position="right" />,
    },
    {
      name: 'Clip right  ➔  Slide left',
      start: <TestScrollView horizontal />,
      end: <TestImage end position="left" />,
    },
    {
      name: 'Clip top  ➔  Full reveal',
      start: <TestScrollView inverted />,
      end: <TestImage end size="max" />,
    },
    {
      name: 'Clip bottom  ➔  Full reveal',
      start: <TestScrollView />,
      end: <TestImage end size="max" />,
    },
    {
      name: 'Clip left  ➔  Full reveal',
      start: <TestScrollView horizontal inverted />,
      end: <TestImage end size="max" />,
    },
    {
      name: 'Clip right  ➔  Full reveal',
      start: <TestScrollView horizontal />,
      end: <TestImage end size="max" />,
    },
    {
      name: 'Clip & border-radius',
      description:
        'The clipping-mask should be correctly applied, also when a border-radius is used with the content',
      start: <TestScrollView round />,
      end: <TestImage end size="max" />,
    },
  ],
};
